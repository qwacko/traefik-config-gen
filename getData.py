import docker
from os import environ 
import json
from urllib.request import urlopen

TARGET_HOST  = environ.get('TARGET_HOST')
HOST_NAME  = environ.get('HOST_NAME')

def generateDefaultRouter(trimmedName,address):

    defaultRouter = json.loads(environ.get("DEFAULT_ROUTER"))
    defaultRouter["service"] = f"service-{trimmedName}"
    defaultRouter["rule"] = f"Host(`{address}`)"

    return defaultRouter


def generateDefaultService(address):

    defaultService = json.loads(environ.get("DEFAULT_SERVICE"))
    defaultService["loadBalancer"]["servers"][0]["url"] = f"http://{TARGET_HOST}:{address}"

    return defaultService


def generateOutput():
    output = {"http" : {"routers": {}, "services" : {}}}
    
    client = docker.from_env()


    print("Running Function")
    
    for current_container in client.containers.list():
        currentKeys = current_container.labels.keys()
        if 'traefikCompile.port' in currentKeys and 'traefikCompile.address' in currentKeys:
            trimmedName = f"{HOST_NAME}-{current_container.name.lower().replace(' ','-')}"

            output["http"]["routers"][f"router-{trimmedName}"]=  generateDefaultRouter(trimmedName,current_container.labels['traefikCompile.address'] )  
            output["http"]["services"][f"service-{trimmedName}"] = generateDefaultService(current_container.labels['traefikCompile.port'])
    
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
