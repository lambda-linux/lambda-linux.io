# Building and running `lambda-linux.io` container

From outside container do,

```
$ docker build -t lambda-linux.io:latest .

$ cd ~/lambda-linux.io

$ docker run --rm -t -v `pwd`:/home/ll-user/lambda-linux.io -p 80:80 -i lambda-linux.io /sbin/my_init -- /sbin/setuser ll-user /bin/bash -l
```

Once you are inside the container,

```
$ cd ~ll-user/lambda-linux.io/

$ git submodule update --init

$ cd src/

$ npm install

$ gulp

$ watchmedo tricks-from tricks.yaml
```

# Running web server

Login to the running container as `root`

```
$ docker ps
$ docker exec -t -i <container_name> /bin/bash -l
```

Once you are inside the container,

```
# cd ~ll-user/lambda-linux.io/src/dist/
# ~ll-user/lambda-linux.io/third_party/gohttpserver/gohttpserver
```
