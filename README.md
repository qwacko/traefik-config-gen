# Traefik Config Generator (traefik-config-gen)

## Overview

A simple docker container / script to allow for the generation of traefik configuration for use by the HTTP provider. Built as an alternative to the direct docker integration as it has the following benefits

- Significantly reduces the number of labels required to configure Traefik (in my configuration it went from 8 to 2 per container).
- Can create configurations across multiple docker hosts without using swarm but running and instance of this container on each host (see below, "Linking Hosts"").

## Getting Started

The following steps will get a minimal version started. It will be much simpler if using docker-compose, and have some familiarity with how to configure labels / environment variables etc...

**1. Add master container**

```docker
name: 'proxy'

services:
 
  traefik_config:
    image: ghcr.io/qwacko/traefik-config-gen:master
    ports:
      - 5000:5000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro    
    environment:
      TARGET_HOST: 10.1.1.1
      HOST_NAME: server     
      ENTRYPOINT: websecure
```

**Do not make container auto-update (i.e. watchtower) as there is currently limited testing of each release, and an error in the release could mean total loss of access to your services, so it is best to do when you are in a position to recover any fault.**

Note: Customise the `TARGET_HOST`, `HOST_NAME`, and `ENTRYPOINT` to suit your traefik installation.

**2. Add Labels To Other Containers**
```docker
    labels:
      traefikConfigGen.port: 8080
      traefikConfigGen.address: web.example.com
```
Note : The port must be the port that the container is available on the address listed in `TARGET_HOST` on the master container.

**3. Test the configuration tool**
Access the chosen port (in the above configuation), and check that a value is returned that looks similar to the Traefik File Provider.

**4. Configure Traefik to use an HTTP provider**
```yaml
#Part of traefik.yml file
providers:    
  http:
    endpoint: "http://10.1.1.1:5000/"
    pollInterval: "5s"
```
Note: Configure the above to use the IP address and port of the master container.

**5. Customise**

The default configuration uses some defaults that may not be useful to your specific installation, so the following customisations as listed below shoudld be considered.

## Customisation

The following customisations are available to make the tool work for an individual system.

### New Default Templates

The user can override teh deafult service (`SERVICE_DEFAULT`) and router (`ROUTER_DEFAULT`) templates using environment variables on the `traefik-config-gen` master container. These are jinja templates which fill placeholders from the master container, target container, and generated service names

 ```docker
    #Master Container Environment variables 
    environment:
      TARGET_HOST: 10.1.1.10
      HOST_NAME: docker
      ROUTER_DEFAULT: '{"entrypoints" :["websecure"],"service" : "{{traefik.SERVICE_NAME}}", "rule" : "Host(`{{container.address}}`)", "tls" : {"certresolver" : "cert"}}'
      SERVICE_DEFAULT: '{"loadBalancer" : { "servers" : [{ "url" : "http://{{host.TARGET_HOST}}:{{container.port}}" }], "passHostHeader": "false" }}'


 ```

 The following variables are available for use:

| Variable        | Contents          
| ------------- |:-------------:| 
| `container`      | All labels from the container that are prefixed with `traefikConfigGen.` with the prefix replaced with `container.` (i.e. `traefikConfigGen.port` becomes `container.port`) 
| `host`      | All environment variables from the "master" container. Note that it is possible have the system work without using these, as values passed to an environment variable could instead also be written directly into a custom template.|
| `traefik.SERVICE_NAME` | Lower case, uniqe name for service (automatically generated). Should be used in the router tepmlate to refer to the correct service |
| `traefik.ROUTER_NAME` | Lower case, uniqe name for router (automatically generated). |

### Additional Named Templates

If different containers need different templates, then additional named templates can be setup. These can be any titled environment variable on the master container (i.e. `SERVICE_HTTPS` or `ROUTER_BASICAUTH`).

In the docker-compose file for the container, select the template as follows:

```docker
    labels:
      traefikConfigGen.port: 8080
      traefikConfigGen.address: web.example.com
      traefikConfigGen.routerTemplateName: ROUTER_BASICAUTH #Will use non-default router
      traefikConfigGen.serviceTemplateName: SERVICE_HTTPS # Will use non-default service
```

A container does not need to have both templates set, it would work successfully with only one if only one non-default was required.

### Linking Hosts

Currently Traefik only supports a single HTTP provider (as far as I know), and so the container is able to collect the configuration from other remote instances of the master container and compile them into a single response, allowing a single HTTP provider to reflect mulitple hosts. This allows for ease of update of traefik config across different servers without the need to do anything different on different hosts (and same on the master host that traefik communicates with).

Note that the service / router templates are unique to a host / master container, so if the same configuration was desired across multiple hosts, then the templates would need to be copied.

To collect data from remote hosts, add the `CHILD_HOSTS` environment variable to the master container. This will contain a string representation of an array of hosts. 

```docker

    #Master Container Environment variables 
    environment:
      TARGET_HOST: 10.1.1.10
      HOST_NAME: docker
      CHILD_HOSTS: '["http://10.1.1.2:5050","http://10.1.1.50:5051"]'  # Add this row to read data from remote hosts.
```

## Recommendations / FAQ

* **Testing** - When testing changes to the master container, it is recommended to run a second instance on another port to check any template settings are working correctly prior to applying to the master container
* **Updating** - As indicated earlier, don't allow automatic updates of the container, update manually when in a position to recover from a reverse proxy fault.
* **Comms Fault** - If there is a commmunication fault with a `CHILD_HOST` then the tool will not return an answer, and all services will remain active in traefik (this is a default traefik function).
* **Other Features** - If you are interested in other feature (Web Interface etc...) then feel free to create a pull request. However be aware that the intent of the tool is to perform a single function and perform it well, to keep as much flexibility available to the end-user, while keeping the approach as simple as possible. If you wanted to add lots more features then possibly a fork is the best way forward.
* **Code Quality** - I know that the code is uncommented, average quality, and doesn't follow PEP guidelines, but it is simple enough that it should be readable to most competent people. The tool is something I threw together quickly to service my need. If you have an issue then please feel free to create an issue or even better a pull request with the solution to the issue.
* **Exposing** - Don't expose the container to the web, as it is a flask server running in dev mode and so any errors served up will provide access to the flask console. This is done to allow for ease of troubled shooting any issues, probably I should fix this.