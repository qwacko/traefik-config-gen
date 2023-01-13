import docker
from os import environ 
import json
from urllib.request import urlopen
import jinja2

environment = jinja2.Environment()

keyPrefix = "traefikConfigGen."
defaultRouterTemplate = '{"entrypoints" :["{{host.ENTRYPOINT}}"],"service" : "{{traefik.SERVICE_NAME}}", "rule" : "Host(`{{container.address}}`)"}'
defaultServiceTemplate = '{"loadBalancer" : { "servers" : [{ "url" : "http://{{host.TARGET_HOST}}:{{container.port}}" }], "passHostHeader": "false" }}'


def generateOutput():
    output = {"http" : {"routers": {}, "services" : {}}}
    
    client = docker.from_env()


    print("Running Function")
    
    for current_container in client.containers.list():
        currentKeys = current_container.labels.keys()

        includedKeys = [a for a in currentKeys if a.find(keyPrefix) == 0]


        if len(includedKeys) > 0:

            # Build the name of teh service and router based on the host and container name
            trimmedName = f"{environ.get('HOST_NAME', 'Host')}-{current_container.name.lower().replace(' ','-')}"            
            SERVICE_NAME = f"service-{trimmedName}"
            ROUTER_NAME = f"router-{trimmedName}"


            includedDict = {el.replace(keyPrefix, ""): current_container.labels[el] for el in includedKeys}

            routerTemplateName = includedDict.get("routerTemplateName","ROUTER_DEFAULT")
            serviceTemplateName = includedDict.get("serviceTemplateName","SERVICE_DEFAULT")
        
            dataForRender = {"container" : includedDict, "host": environ, "traefik": {"ROUTER_NAME": ROUTER_NAME, "SERVICE_NAME": SERVICE_NAME}}

            # Use the Jinja engine to build the output strings
            router = environment.from_string(environ.get(routerTemplateName, defaultRouterTemplate)).render(**dataForRender)
            service = environment.from_string(environ.get(serviceTemplateName, defaultServiceTemplate)).render(**dataForRender)

            output["http"]["routers"][ROUTER_NAME]=  json.loads(router)
            output["http"]["services"][SERVICE_NAME] = json.loads(service)
    
    # realOutput = output.copy()
    output = getOtherOutput(output)
    
    return output

def getOtherOutput(inputData):
    otherHosts = json.loads(environ.get("CHILD_HOSTS"))

    for host in otherHosts:
        response = urlopen(host)
        
        data_json = json.loads(response.read())
        
        inputData["http"]["routers"] = inputData["http"]["routers"] | data_json["http"]["routers"]
        inputData["http"]["services"] = inputData["http"]["services"] | data_json["http"]["services"]

    
    return inputData
