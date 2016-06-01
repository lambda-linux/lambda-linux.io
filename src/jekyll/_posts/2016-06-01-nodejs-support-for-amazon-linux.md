---
layout: blog_post
title:  "Announcing Node.js RPM Packages for Amazon Linux"
date: 2016-06-01 01:00:01
categories: ship
---
[Node.js](https://nodejs.org/en/) is a JavaScript language runtime used by many developers. It is also supported by other AWS services such as [AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html) and [AWS Elastic Beanstalk](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.platforms.html#concepts.platforms.nodejs). Despite Node.js' popularity and its use in other AWS services, Node.js RPM packages are not yet available in Amazon Linux [repositories](https://aws.amazon.com/amazon-linux-ami/2016.03-packages/).

Sometime back, this lack of Node.js RPM packages became a [bottleneck](https://en.wikipedia.org/wiki/Continuous-flow_manufacturing) for us in our own development and deployment pipeline. So we created Node.js RPMs for Amazon Linux.

We are happy to share our Node.js RPMs with the rest of the Amazon Linux User Community. 

We are releasing Node.js packages in a repository called `epll-preview` instead of our regular `epll` repository. The main reason for this is that we think Node.js RPMs should belong to the Base OS repository rather than in an add-on repository like [EPLL](/blog/2014/12/15/announcing-extra-packages-for-amazon-linux-and-lambda-linux-project/). We **hope** Amazon Linux AMI team will land Node.js RPMs in their repositories soon. Till then, we will support Node.js RPMs in `epll-preview`. We will track upstream Node.js project and push security updates / bug fixes as and when they occur.

As a rolling distribution, Amazon Linux provides multiple versions of language runtimes in its repositories. We are also providing multiple versions of Node.js RPMs 

*  `nodejs4` for Node.js version 4

*  `nodejs6` for Node.js version 6

Node.js version 4 is the active [Long-term Support (LTS)](https://github.com/nodejs/LTS) version while version 6 is expected to enter LTS phase from October 2016.

## Getting started with Node.js package

First step is to install `epll-release` package. Please see [these](/#getting-started) instructions on our homepage if you haven't already installed `epll-release` package.

To install Node.js version 4, you can do `sudo yum --enablerepo=epll-preview -y install nodejs4`

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ sudo yum --enablerepo=epll-preview -y install nodejs4
Loaded plugins: priorities, update-motd, upgrade-helper
Resolving Dependencies
--> Running transaction check
---> Package nodejs4.x86_64 0:4.4.5-1.1.ll1 will be installed
--> Finished Dependency Resolution

[...]

Complete!

[ec2-user@ip-10-0-0-161 ~]$ node --version
v4.4.5

[ec2-user@ip-10-0-0-161 ~]$ npm --version
2.15.5
{% endhighlight %} 

To install Node.js version 6, you can do `sudo yum --enablerepo=epll-preview -y install nodejs6`

{% highlight bash %}
[ec2-user@ip-10-0-0-107 ~]$ sudo yum --enablerepo=epll-preview -y install nodejs6
Loaded plugins: priorities, update-motd, upgrade-helper
Resolving Dependencies--> Running transaction check
---> Package nodejs6.x86_64 0:6.2.0-1.1.ll1 will be installed
--> Finished Dependency Resolution

[...]

Complete!

[ec2-user@ip-10-0-0-161 ~]$ node --version
v6.2.0

[ec2-user@ip-10-0-0-161 ~]$ npm --version
3.8.9
{% endhighlight %} 

## Epilogue

We hope you will enjoy Node.js packages for Amazon Linux. If you need further help, you can contact us on any of our [support](/support/) channels. 

We love your feedback. We have a new [Slack](http://slack.lambda-linux.io/) channel and we are [@lambda_linux](https://twitter.com/lambda_linux) on Twitter. Please join us on Slack or follow us on Twitter.

Thank you for using Lambda Linux packages and being part of our open-source community.

We would also like to say thank you to [NodeSource Inc.,](https://nodesource.com/) for the RPM spec file.
