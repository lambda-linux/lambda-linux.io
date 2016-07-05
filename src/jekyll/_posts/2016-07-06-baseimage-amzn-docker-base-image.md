---
layout: blog_post
title:  "Announcing baseimage-amzn &mdash; A Minimal Docker Base Image based on Amazon Linux RPM Packages"
date: 2016-07-06 01:00:01
categories: ship
---
We are very happy to announce [baseimage-amzn](https://github.com/lambda-linux/baseimage-amzn/) &mdash; A Secure, Stable, Production-grade Docker Base Image based on Amazon Linux RPM Packages.

Sometime back, we wanted a Docker Base Image based on Amazon Linux RPM packages to make our container based development and deployment workflow on AWS more efficient and secure. We were already using Amazon Linux AMI and it did not make sense to add a different OS environment at the container layer.

Adopting container based workflow felt like taking one step forward on developer efficiency and two steps back on operational security. We discussed this with fellow AWS users. It seemed like there was a <a href="https://forums.aws.amazon.com/thread.jspa?messageID=725944">need</a> for a secure, stable Docker Base Image based on Amazon Linux packages.

So, we created baseimage-amzn.

We have been using baseimage-amzn for a while now to securely containerize complex applications. We sincerely hope you too will find baseimage-amzn just as useful when working with your container based applications. If you need assistance using baseimage-amzn, please [contact us](/support/) and we will help you.

baseimage-amzn is inspired by [baseimage-docker](https://github.com/phusion/baseimage-docker) project. We would like to say thank you to Phusion for providing some good ideas and code. We would also like to say thank you to [Amazon Linux AMI Team](https://aws.amazon.com/amazon-linux-ami/) for providing excellent Amazon Linux RPM packages.

## Getting started

Instructions to download baseimage-amzn is on our [homepage](/). Let us start by installing and running Docker Engine on our Amazon Linux EC2 Instance.

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ sudo yum install -y docker && sudo service docker start
Loaded plugins: priorities, update-motd, upgrade-helper
Resolving Dependencies
--> Running transaction check
---> Package docker.x86_64 0:1.11.1-1.2.amzn1 will be installed
--> Processing Dependency: xfsprogs for package: docker-1.11.1-1.2.amzn1.x86_64

[...]

Complete!
Starting cgconfig service:                                 [  OK  ]
Starting docker:        .                                  [  OK  ]

[ec2-user@ip-10-0-0-161 ~]$ sudo usermod -a -G docker ec2-user && sg docker newgrp ec2-user

[ec2-user@ip-10-0-0-161 ~]$ id
uid=500(ec2-user) gid=500(ec2-user) groups=500(ec2-user),10(wheel),497(docker)
{% endhighlight %}

We add `ec2-user` to `docker` unix group. Adding `ec2-user` to `docker` unix group saves us from typing `sudo` each time we want to run the `docker` command.

Next we will [`docker import`](https://docs.docker.com/v1.11/engine/reference/commandline/import/) baseimage-amzn. Note that this step is AWS region specific. We are using US West Oregon (us-west-2) region.

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ docker import https://s3-us-west-2.amazonaws.com/baseimage-\
amzn-us-west-2/baseimage-amzn-2016.03-003.tar.xz baseimage-amzn:2016.03-003
Downloading from https://s3-us-west-2.amazonaws.com/baseimage-amzn-us-west-2/\
baseimage-amzn-2016.03-003.tar.xz
Importing 44.11 MB/44.11 MB
sha256:9ab73ad998f7f58ebfdd0ce76f93b22e66f3f0f5550b33e3e4ce2b4190f94a89

[ec2-user@ip-10-0-0-161 ~]$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
baseimage-amzn      2016.03-003         10393dd0978f        3 seconds ago       319.6 MB
{% endhighlight %}

We have downloaded baseimage-amzn with the version tag `2016.03-003`. You can learn more about baseimage-amzn versioning [here](https://github.com/lambda-linux/baseimage-amzn#version_numbering).

Once we have baseimage-amzn locally available we can login to the image and explore.

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ docker run --rm -t -i baseimage-amzn:2016.03-003 \
/sbin/my_init -- /sbin/setuser ll-user /bin/bash -l
*** Running /etc/rc.local...
*** Booting runit daemon...
*** Runit started as PID 7
*** Running /sbin/setuser ll-user /bin/bash -l...
[ll-user@356157b83709] / $

[ll-user@356157b83709] / $ rpm -qa -last
gpg-pubkey-21c0f39f-56d0e29a                  Mon 20 Jun 2016 06:27:28 AM UTC
runit-2.1.2-1.3.ll1.x86_64                    Mon 20 Jun 2016 06:27:23 AM UTC

[...]

filesystem-2.4.30-3.8.amzn1.x86_64            Mon 20 Jun 2016 06:27:07 AM UTC
basesystem-10.0-4.9.amzn1.noarch              Mon 20 Jun 2016 06:27:07 AM UTC

[ll-user@356157b83709] / $ pstree -A
my_init-+-bash---pstree
        `-runsvdir-+-runsv---rsyslogd---2*[{rsyslogd}]
                           `-runsv---crond

[ll-user@356157b83709] / $ id ll-user
uid=500(ll-user) gid=500(ll-user) groups=500(ll-user)

[ll-user@356157b83709] / $ exit
logout
*** /sbin/setuser exited with status 0.
*** Shutting down runit daemon (PID 7)...
*** Killing all processes...

[ec2-user@ip-10-0-0-161 ~]$ id ec2-user
uid=500(ec2-user) gid=500(ec2-user) groups=500(ec2-user),10(wheel),497(docker)
{% endhighlight %}

You will notice that there is correct UID/GID mapping between `ll-user` in the container with `ec2-user` on the Amazon Linux EC2 host. This allows us to easily move files between your host and containers when using [`docker run`](https://docs.docker.com/v1.11/engine/reference/commandline/run/) with [`-v`](https://docs.docker.com/v1.11/engine/reference/commandline/run/#mount-volume-v-read-only) flag.

## Using baseimage-amzn with EC2 Container Registry

Production container based workflows usually use a private Docker registry. We would like to show you how to use [EC2 Container Registry (ECR)](https://aws.amazon.com/ecr/) with baseimage-amzn.

First we create a private ECR Repository named baseimage-amzn.

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ aws ecr create-repository --repository-name baseimage-amzn \
  --region us-west-2
{
    "repository": {
        "registryId": "111122223333",
        "repositoryName": "baseimage-amzn",
        "repositoryArn": "arn:aws:ecr:us-west-2:111122223333:repository/baseimage-amzn",
        "repositoryUri": "111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn"
     }
}
{% endhighlight %}

We then [`docker tag`](https://docs.docker.com/v1.11/engine/reference/commandline/tag/) the image with ECR's `repositoryUri` for baseimage-amzn.

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ docker tag baseimage-amzn:2016.03-003 \
  111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn:2016.03-003

[ec2-user@ip-10-0-0-161 ~]$ docker images
REPOSITORY                                                    TAG                 IMAGE ID
  CREATED             SIZE
111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn   2016.03-003         10393dd0978f
  3 minutes ago       319.6 MB
baseimage-amzn                                                2016.03-003         10393dd0978f
  3 minutes ago       319.6 MB
{% endhighlight %}

After tagging, we can [`docker push`](https://docs.docker.com/v1.11/engine/reference/commandline/push/) baseimage-amzn to our private ECR repository.

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ $(aws ecr get-login --region us-west-2)
Warning: '-e' is deprecated, it will be removed soon. See usage.
Login Succeeded

[ec2-user@ip-10-0-0-161 ~]$ docker push \
  111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn:2016.03-003
The push refers to a repository [111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn]
a62a0006948e: Pushed
2016.03-003: digest: sha256:9c0d5fc474aa4e07762478b6201ec14811f8bb5d93da46aa7f499f73211347eb size: 127
7
{% endhighlight %}

We can now [`docker pull`](https://docs.docker.com/v1.11/engine/reference/commandline/pull/) baseimage-amzn as required during development and in our deployment pipeline.

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ docker images | awk '{print $1":"$2}' | sed '/REPOSITORY/d' | \
  xargs -L 1 docker rmi
Untagged: 111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn:2016.03-003
Untagged: baseimage-amzn:2016.03-003
Deleted: sha256:10393dd0978fa0c6dd28363a45b5cde3e29ee363b49d276d3ad1fe1c25abeda3
Deleted: sha256:a62a0006948e18ecded8512720065d030e6167670de9c700127f10cc4fa5a11c

[ec2-user@ip-10-0-0-161 ~]$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE

[ec2-user@ip-10-0-0-161 ~]$ docker pull \
  111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn:2016.03-003
2016.03-003: Pulling from baseimage-amzn
620b79876058: Pull complete
Digest: sha256:9c0d5fc474aa4e07762478b6201ec14811f8bb5d93da46aa7f499f73211347eb
Status: Downloaded newer image for 111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn:2016.03
-003

[ec2-user@ip-10-0-0-161 ~]$ docker images
REPOSITORY                                                    TAG                 IMAGE ID
  CREATED             SIZE
111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn   2016.03-003         10393dd0978f
  About an hour ago   319.6 MB
{% endhighlight %}

When using baseimage-amzn with our private ECR repository we need to specify the repository URI in the [`FROM`](https://docs.docker.com/v1.11/engine/reference/builder/#from) instruction in our `Dockerfile`.

{% highlight shell %}
FROM 111122223333.dkr.ecr.us-west-2.amazonaws.com/baseimage-amzn:2016.03-003

# Use baseimage-amzn's init system
CMD ["/sbin/my_init"]

RUN \
  # Update baseimage-amzn RPM packages
  yum update && \

  # ...put your own build instructions here...

  # Clean up YUM when done
  yum clean all && \
  rm -rf /var/cache/yum/* && \
  rm -rf /tmp/* && \
  rm -rf /var/tmp/*
{% endhighlight %}

## A more complex example

In this blog post we have just scratched the surface of what is possible with baseimage-amzn. As an example of slightly more complex use-case, let us show you how we use baseimage-amzn in building [Lambda Linux Project](/) website itself.

Following is an outline of technologies that we use.

*  [Node.js](https://github.com/lambda-linux/lambda-linux.io/blob/2a17f7696dc36c4a7ef1023d17c408fab212ca16/Dockerfile#L20-L24) along with with [Bower](https://github.com/lambda-linux/lambda-linux.io/blob/2a17f7696dc36c4a7ef1023d17c408fab212ca16/Dockerfile#L28) and [Gulp](https://github.com/lambda-linux/lambda-linux.io/blob/2a17f7696dc36c4a7ef1023d17c408fab212ca16/Dockerfile#L28) for our front end development

*  [Ruby](https://github.com/lambda-linux/lambda-linux.io/blob/2a17f7696dc36c4a7ef1023d17c408fab212ca16/Dockerfile#L14-L15) and [Jekyll](https://github.com/lambda-linux/lambda-linux.io/blob/2a17f7696dc36c4a7ef1023d17c408fab212ca16/Dockerfile#L26-L27) for our blogging engine

*  [Python pip](https://github.com/lambda-linux/lambda-linux.io/blob/2a17f7696dc36c4a7ef1023d17c408fab212ca16/Dockerfile#L30) and [AWS cli](https://github.com/lambda-linux/lambda-linux.io/blob/2a17f7696dc36c4a7ef1023d17c408fab212ca16/Dockerfile#L31) is used to securely host our website on CloudFront

You can see the complete `Dockerfile` is [here](https://github.com/lambda-linux/lambda-linux.io/blob/2a17f7696dc36c4a7ef1023d17c408fab212ca16/Dockerfile). Our [`GETTING_STARTED.md`](https://github.com/lambda-linux/lambda-linux.io/blob/2a17f7696dc36c4a7ef1023d17c408fab212ca16/GETTING_STARTED.md) file describes how we build our container and run the development web server.

## Epilogue

We hope you will enjoy baseimage-amzn.

Additional [documentation](https://github.com/lambda-linux/baseimage-amzn) is available in our GitHub repository. If you need further help, please contact us on any of our [support](/support/) channels.

We love your feedback. We have a new [Slack](http://slack.lambda-linux.io/) channel and we are [@lambda_linux](https://twitter.com/lambda_linux) on Twitter. Please join us on Slack or follow us on Twitter.

Thank you for using baseimage-amzn.
