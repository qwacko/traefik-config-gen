# start by pulling the python image
FROM python:3.10-alpine

# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# copy every content from the local file to the image
COPY . /app

ENV TARGET_HOST=
ENV HOST_NAME=
ENV DEFAULT_ROUTER=
ENV DEFAULT_SERVICE=
ENV CHILD_HOSTS="[]"

EXPOSE 5000

VOLUME ["/var/run/docker.sock"]

# configure the container to run in an executed manner
ENTRYPOINT [ "python" ]

CMD ["server.py" ]