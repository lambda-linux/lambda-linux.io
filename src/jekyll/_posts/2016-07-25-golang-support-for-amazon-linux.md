---
layout: blog_post
title:  "Announcing Go 1.6 Support for Amazon Linux"
date: 2016-07-25 01:00:01
categories: ship
---
[Go](https://golang.org/) is a popular programming language used by many developers.

In Lambda Linux Project, we use Go as one of our primary programming languages. Sometime back as Go 1.5 support was nearing its end, we had to migrate to Go 1.6. So, we created Go 1.6 RPMs for Amazon Linux.

We are happy to share our Go 1.6 RPMs with the rest of the Amazon Linux User Community.

Like our [Node.js](/blog/2016/06/01/nodejs-support-for-amazon-linux/) packages we are releasing Go 1.6 packages in a repository called `epll-preview` instead of our regular `epll` repository. The main reason for this is that we think Go 1.6 RPMs should belong to the Base OS repository rather than in an add-on repository like [EPLL](/blog/2014/12/15/announcing-extra-packages-for-amazon-linux-and-lambda-linux-project/). We **hope** Amazon Linux AMI team will land Go 1.6 or 1.7 RPMs in their repositories soon. Till then, we will support Go 1.6 RPMs in `epll-preview`. We will track upstream Go project and push security updates as and when they occur.

## Getting started with Go 1.6 package

Our Go 1.6 RPMs works both on an Amazon Linux EC2 instance and in a [baseimage-amzn](/blog/2016/07/06/baseimage-amzn-docker-base-image/) based container.

In this blog post we will show you how to use Go 1.6 packages with baseimage-amzn.

First step is to download baseimage-amzn docker image locally. Please see [instructions](/) on our homepage under _DOCKER BASE IMAGE_ tab to install docker and download baseimage-amzn.

We can use `docker images` to verify that we have our image available locally.

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
baseimage-amzn      2016.03-003         d0970e2a0e79        7 seconds ago       319.6 MB
{% endhighlight %}

Next we create a `Dockerfile` that securely downloads `golang16` RPM from `epll-preview` repository.

{% highlight bash %}
FROM baseimage-amzn:2016.03-003

# Use baseimage-amzn's init system
CMD ["/sbin/my_init"]

RUN \
  # Create temporary build directory
  mkdir /tmp/docker-build && \
  \
  # Update baseimage-amzn RPM packages
  yum update && \
  \
  # Setup epll-preview repository and download golang16 package
  curl -X GET -o /tmp/docker-build/RPM-GPG-KEY-lambda-epll \
    https://lambda-linux.io/RPM-GPG-KEY-lambda-epll && \
  rpm --import /tmp/docker-build/RPM-GPG-KEY-lambda-epll && \
  curl -X GET -o /tmp/docker-build/epll-release-2016.03-1.1.ll1.noarch.rpm \
    https://lambda-linux.io/epll-release-2016.03-1.1.ll1.noarch.rpm && \
  yum install /tmp/docker-build/epll-release-2016.03-1.1.ll1.noarch.rpm && \
  yum --enablerepo=epll-preview install golang16 && \
  \
  # Clean up
  yum clean all && \
  rm -rf /var/cache/yum/* && \
  rm -rf /tmp/* && \
  rm -rf /var/tmp/*
{% endhighlight %}

Using this `Dockerfile` we can build and run our container.

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ docker build -t golang16 -f Dockerfile .
Sending build context to Docker daemon 11.26 kB
Step 1 : FROM baseimage-amzn:2016.03-003
 ---> d0970e2a0e79Step 2 : CMD /sbin/my_init
 ---> Running in be0d404123b9

[...]

Cleaning repos: amzn-main amzn-updates
Cleaning up everything
 ---> 7b719eb76b68
Removing intermediate container 4359fd5a74f2
Successfully built 7b719eb76b68

[ec2-user@ip-10-0-0-161 ~]$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
golang16            latest              e49256c0aa7c        5 seconds ago       669.3 MB
baseimage-amzn      2016.03-003         d0970e2a0e79        About an hour ago   319.6 MB

[ec2-user@ip-10-0-0-161 ~]$ docker run --rm -t -i golang16 \
/sbin/my_init -- /sbin/setuser ll-user /bin/bash -l
*** Running /etc/rc.local...
*** Booting runit daemon...
*** Runit started as PID 7
*** Running /sbin/setuser ll-user /bin/bash -l...
[ll-user@16967ab2dbba] / $

[ll-user@16967ab2dbba] / $ go version
go version go1.6.3 linux/amd64
{% endhighlight %}

## Epilogue

We hope you will enjoy Go 1.6 packages for Amazon Linux. If you need further help, you can contact us on any of our [support](/support/) channels.

We love your feedback. We have a [Slack](http://slack.lambda-linux.io/) channel and we are [@lambda_linux](https://twitter.com/lambda_linux) on Twitter. Please join us on Slack or follow us on Twitter.

Thank you for using baseimage-amzn and Lambda Linux packages.

We would also like to say thank you to Fedora Project for initial source RPM.
