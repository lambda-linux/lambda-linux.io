---
layout: blog_post
title:  "Announcing Lambda Machine Local &mdash; A stable and secure local Docker development environment for AWS Users"
date: 2017-05-23 01:00:01
categories: ship
---
We are happy to announce [Lambda Machine Local](https://github.com/lambda-linux/lambda-machine-local) &mdash; A stable and secure local Docker development environment for AWS Users. 

It is designed to complement a stable and and secure production environment on AWS. Lambda Machine Local uses [Lambda Linux VirtualBox flavor](https://github.com/lambda-linux/lambda-linux-vbox) as its container host OS and is based on [Amazon Linux](https://aws.amazon.com/amazon-linux-ami/), the Linux operating system that powers AWS.

You can find the components that we have chosen to integrate in Lambda Machine Local [here](https://github.com/lambda-linux/lambda-machine-local/#components). In our [FAQs](/faqs/#!/lambda-machine-local-questions) we describe our rationale for not integrating certain components at this time.

We are looking for your feedback on our [list](https://github.com/lambda-linux/lambda-machine-local/#components) of supported components in Lambda Machine Local. If you are aware of stable components in the container ecosystem that can help improve the local development experience for our fellow AWS Users, [kindly please let us know!](https://github.com/lambda-linux/lambda-machine-local/issues)

## Getting started

If you are a Docker Machine User, you'll find Lambda Machine Local CLI to be familiar. You can use Lambda Machine Local alongside Docker Machine. Please see this [link](https://github.com/lambda-linux/lambda-machine-local/blob/master/README.md#running_lambda_machine_local_alongside_docker_machine) for more information.

Getting started with Lambda Machine Local is easy. Please download `lambda-machine-local` binary for Mac OS X, Windows or Linux from our GitHub [releases](https://github.com/lambda-linux/lambda-machine-local/releases) page.

You can then use `lambda-machine-local create ...` command to create your container host virtual machine.

{% highlight bash %}
$ lambda-machine-local create ll-default 
Running pre-create checks...
(ll-default) No default Lambda Linux VirtualBox ISO found locally, downloading the latest release...
(ll-default) Latest release for github.com/lambda-linux/lambda-linux-vbox is v1703.0.1
(ll-default) We will now attempt to automatically download the latest release. This can take some
time depending on the speed of your internet connection
(ll-default) You can also download the latest lambda-linux-vbox.iso 
from https://github.com/lambda-linux/lambda-linux-vbox/releases and copy it to
/Users/username/.docker/lambda-machine-local/cache/lambda-linux-vbox.iso
(ll-default) Downloading /Users/username/.docker/lambda-machine-local/cache/lambda-linux-vbox.iso from
https://github.com/lambda-linux/lambda-linux-vbox/releases/download/v1703.0.1/lambda-linux-vbox.iso...
(ll-default) ....10%  (downloaded)

[...]

Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine,
run: lambda-machine-local env ll-default

{% endhighlight %}

When you create a container host virtual machine `lambda-machine-local` CLI checks for and downloads the latest version of `lambda-linux-vbox.iso`. The downloaded ISO image is cached locally for subsequent use.

Once the container host virtual machine is up, you can run your usual `docker` commands after configuring Docker client environment.

{% highlight bash %}
$ eval $(lambda-machine-local env ll-default)

$ docker run --rm busybox echo 'Hello World!'
Unable to find image 'busybox:latest' locally
latest: Pulling from library/busybox
7520415ce762: Pull complete
Digest: sha256:32f093055929dbc23dec4d03e09dfe971f5973a9ca5cf059cbfb644c206aa83f
Status: Downloaded newer image for busybox:latest
Hello World!
{% endhighlight %}

On GitHub, we have provided detailed [documentation](https://github.com/lambda-linux/lambda-machine-local#toc) for Lambda Machine Local. After you have gained familiarity with `lambda-machine-local` CLI, we request you to check out our documentation on &ndash;

* [Customizing Lambda Linux VirtualBox flavor](https://github.com/lambda-linux/lambda-machine-local#customizing_lambda_linux_virtualbox_flavor)

* [VirtualBox shared folder support](https://github.com/lambda-linux/lambda-machine-local#virtualbox_shared_folder_support)

We have features in Lambda Machine Local that lets you build complex local development work flows. We also workaround some well known issues with VirtualBox and Docker.

## Epilogue

We hope you will enjoy using Lambda Machine Local. 

If you need additional help, please reach out to us on [Slack](http://slack.lambda-linux.io/) or at [@lambda_linux](https://twitter.com/lambda_linux) on Twitter and we will be happy to help.

Thank you for using Lambda Machine Local.
