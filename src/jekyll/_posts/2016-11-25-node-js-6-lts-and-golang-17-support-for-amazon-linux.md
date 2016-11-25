---
layout: blog_post
title:  "Announcing Node.js 6 LTS and Go 1.7 Support for Amazon Linux"
date: 2016-11-25 01:00:01
categories: ship
---
We are happy to announce the availability of latest Node.js 6 LTS and Go 1.7 RPM packages for Amazon Linux.

Just like our previous [Node.js](/blog/2016/06/01/nodejs-support-for-amazon-linux/) and [Go](/blog/2016/07/25/golang-support-for-amazon-linux/) announcement, we are releasing these packages in a repository called `epll-preview` instead of our regular `epll` repository.

We hope Node.js 6 LTS and Go 1.7 support will land in Amazon Linux main repositories soon. Until then we will continue to support Node.js and Go in `epll-preview`. We will track upstream project and push security updates as and when they occur.

## Getting started

Depending on how you deploy your workload you can use our packages inside [Amazon Linux AMI](https://aws.amazon.com/amazon-linux-ami/), [Amazon Linux Container Image](https://aws.amazon.com/blogs/aws/new-amazon-linux-container-image-for-cloud-and-on-premises-workloads/) or [baseimage-amzn Docker Image](https://github.com/lambda-linux/baseimage-amzn). In the following examples we will use Amazon Linux Container Image and baseimage-amzn.

Below is a `Dockerfile` that securely downloads and installs `nodejs6` RPM from `epll-preview` repository using [Amazon Linux Container Image](https://hub.docker.com/r/library/amazonlinux/).

{% highlight bash %}
FROM amazonlinux:2016.09

RUN \
  # Create temporary build directory
  mkdir /tmp/docker-build && \
  \
  # Update RPM packages
  yum update && \
  \
  # Setup epll-preview repository
  curl -X GET -o /tmp/docker-build/RPM-GPG-KEY-lambda-epll \
  https://lambda-linux.io/RPM-GPG-KEY-lambda-epll && \
  rpm --import /tmp/docker-build/RPM-GPG-KEY-lambda-epll && \
  curl -X GET -o /tmp/docker-build/epll-release-2016.09-1.2.ll1.noarch.rpm \
    https://lambda-linux.io/epll-release-2016.09-1.2.ll1.noarch.rpm && \
  yum install -y /tmp/docker-build/epll-release-2016.09-1.2.ll1.noarch.rpm && \
  \
  # Install nodejs6
  yum --enablerepo=epll-preview install -y nodejs6 && \
  \
  # Clean up
  yum clean all && \
  rm -rf /var/cache/yum/* && \
  rm -rf /tmp/* && \
  rm -rf /var/tmp/*
{% endhighlight %}

Using this `Dockerfile` we can build and run our `nodejs6` container.

{% highlight bash %}
[ec2-user@ip-10-0-0-238 ~]$ docker build -t nodejs6 -f Dockerfile .
Sending build context to Docker daemon 11.26 kB
Step 1 : FROM amazonlinux:2016.09
2016.09: Pulling from library/amazonlinux
8e3fa21c4cc4: Pulling fs layer

[...]

Cleaning repos: amzn-main amzn-updates
Cleaning up everything
 ---> f181bdf7260e
Removing intermediate container 8ae153053a59
Successfully built f181bdf7260e

[ec2-user@ip-10-0-0-238 ~]$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nodejs6             latest              f181bdf7260e        4 seconds ago       330.2 MB
amazonlinux         2016.09             5b52b314511a        39 hours ago        292.3 MB

[ec2-user@ip-10-0-0-238 ~]$ docker run --rm -ti nodejs6 /bin/bash -l
bash-4.2# node --version
v6.9.1
bash-4.2# npm --version
3.10.8
{% endhighlight %}

Next we would like to show you `Dockerfile` that downloads and installs `golang17` RPM from `epll-preview` repository using [baseimage-amzn Docker Image](https://hub.docker.com/r/lambdalinux/baseimage-amzn/)

{% highlight bash %}
FROM lambdalinux/baseimage-amzn:2016.09-000

CMD ["/sbin/my_init"]

RUN \
  # Create temporary build directory
  mkdir /tmp/docker-build && \
  \
  # Update RPM packages
  yum update && \
  \
  # Setup epll-preview repository
  curl -X GET -o /tmp/docker-build/RPM-GPG-KEY-lambda-epll \
  https://lambda-linux.io/RPM-GPG-KEY-lambda-epll && \
  rpm --import /tmp/docker-build/RPM-GPG-KEY-lambda-epll && \
  curl -X GET -o /tmp/docker-build/epll-release-2016.09-1.2.ll1.noarch.rpm \
    https://lambda-linux.io/epll-release-2016.09-1.2.ll1.noarch.rpm && \
  yum install /tmp/docker-build/epll-release-2016.09-1.2.ll1.noarch.rpm && \
  \
  # Install golang17
  yum --enablerepo=epll-preview install golang17 && \
  \
  # Clean up
  yum clean all && \
  rm -rf /var/cache/yum/* && \
  rm -rf /tmp/* && \
  rm -rf /var/tmp/*
{% endhighlight %}

Using this `Dockerfile` we can build and run our `golang17` container.

{% highlight bash %}
[ec2-user@ip-10-0-0-238 ~]$ docker build -t golang17 -f Dockerfile .
Sending build context to Docker daemon 13.31 kB
Step 1 : FROM lambdalinux/baseimage-amzn:2016.09-000
2016.09-000: Pulling from lambdalinux/baseimage-amzn
213af751fa6b: Pulling fs layer

[...]

Cleaning repos: amzn-main amzn-updates
Cleaning up everything
 ---> cf243bd002a1
Removing intermediate container cb7cff83253e
Successfully built cf243bd002a1

[ec2-user@ip-10-0-0-238 ~]$ docker images
REPOSITORY                   TAG                 IMAGE ID            CREATED             SIZE
golang17                     latest              336bac9a7b2c        6 seconds ago       611.2 MB
lambdalinux/baseimage-amzn   2016.09-000         c72db1093a2c        3 weeks ago         345.6 MB

[ec2-user@ip-10-0-0-238 ~]$ docker run --rm -ti golang17 \
  /sbin/my_init -- /sbin/setuser ll-user /bin/bash -l
*** Running /etc/rc.local...
*** Booting runit daemon...
*** Runit started as PID 7
*** Running /sbin/setuser ll-user /bin/bash -l...
[ll-user@f135939da670] / $

[ll-user@f135939da670] / $ go version
go version go1.7.3 linux/amd64
{% endhighlight %}

## Epilogue

We hope you will enjoy Node.js 6 LTS and Go 1.7 support for Amazon Linux. 

If you need additional help, please reach out to us on [Slack](http://slack.lambda-linux.io/) or at [@lambda_linux](https://twitter.com/lambda_linux) on Twitter and we will be happy to help.

Thank you for using our packages.
