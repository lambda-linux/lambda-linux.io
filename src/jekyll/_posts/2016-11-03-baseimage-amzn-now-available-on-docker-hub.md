---
layout: blog_post
title:  "baseimage-amzn is now available on Docker Hub"
date: 2016-11-03 01:00:01
categories: ship
---
We are happy to announce [baseimage-amzn](https://github.com/lambda-linux/baseimage-amzn/), a docker base image based on Amazon Linux is now available on [Docker Hub](https://hub.docker.com/r/lambdalinux/baseimage-amzn/).

Back in July, when we [announced](/blog/2016/07/06/baseimage-amzn-docker-base-image/) baseimage-amzn, many AWS users and customers asked us if there was a way to use baseimage-amzn from their local docker development environments. Unfortunately we did not have a good answer till yesterday.

Yesterday, Amazon announced [Amazon Linux Container Image](https://aws.amazon.com/blogs/aws/new-amazon-linux-container-image-for-cloud-and-on-premises-workloads/) and made Amazon Linux yum repositories accessible outside of AWS EC2. Public availability of Amazon Linux yum repositories was required to support local docker development workflow.

Under the hood, baseimage-amzn builds on top of Amazon Linux Container Image and provides additional features that we have found to be very helpful when containerizing complex applications. These include &mdash;

* Support for running multiple processes

* Ability to gracefully run complex daemons such as databases, app and web servers 

* Correct UID/GID mapping between Amazon Linux Docker Host and Container etc.,

You can find [detailed documentation](https://github.com/lambda-linux/baseimage-amzn) of these features on our GitHub repository.

Depending on the type of workload you are trying to containerize, you might not need all the features that we have in baseimage-amzn. 

However when you do need a specific feature, it is _very likely_ that baseimage-amzn will be able to provide you with an elegant solution. We adapt and make most Unix features and primitives available in the container environment. This allows for easy migration and adoption of containers.

## Getting started

To get started just `docker pull lambdalinux/baseimage-amzn:2016.09-000`. 

{% highlight bash %}
$ docker pull lambdalinux/baseimage-amzn:2016.09-000
2016.09-000: Pulling from lambdalinux/baseimage-amzn

213af751fa6b: Pull complete
Digest: sha256:b94a4ed1f7f08f0409246b9b6b3afb55d3c773329874041c0460423efd7a880c
Status: Downloaded newer image for lambdalinux/baseimage-amzn:2016.09-000

$ docker run --rm -t -i lambdalinux/baseimage-amzn:2016.09-000 /sbin/my_init -- /bin/bash -l
*** Running /etc/rc.local...
*** Booting runit daemon...
*** Runit started as PID 7
*** Running /bin/bash -l...
[root@116df3cfa097] / # id
uid=0(root) gid=0(root) groups=0(root)
[root@116df3cfa097] / #

$ docker run --rm -t -i lambdalinux/baseimage-amzn:2016.09-000 /sbin/my_init \
-- /sbin/setuser ll-user /bin/bash -l
*** Running /etc/rc.local...
*** Booting runit daemon...
*** Runit started as PID 7
*** Running /sbin/setuser ll-user /bin/bash -l...
[ll-user@4ced849ba113] / $ id
uid=500(ll-user) gid=500(ll-user) groups=500(ll-user)
[ll-user@4ced849ba113] / $

{% endhighlight %}

## Epilogue

We hope you will enjoy baseimage-amzn. If you need additional help, please reach out to us on [Slack](http://slack.lambda-linux.io/) or at [@lambda_linux](https://twitter.com/lambda_linux) on Twitter.

Thank you for using baseimage-amzn.
