---
layout: blog_post
title:  "Announcing pgTAP Support for Amazon Linux"
date:   2015-06-18 10:00:01
categories: ship
---
To our fellow Amazon Linux AMI users, we are happy to announce that [pgTAP](http://pgtap.org/) package for Amazon Linux is now available in [EPLL](/blog/2014/12/15/announcing-extra-packages-for-amazon-linux-and-lambda-linux-project/) Repository.

[TAP (or Test Anything Protocol)](http://testanything.org/) is a simple communication protocol between _module under test_ and a _test harness_. TAP originally came from the Perl ecosystem in the [late eighties](https://en.wikipedia.org/wiki/Test_Anything_Protocol) and has since been ported to many languages and systems.

pgTAP is an implementation of TAP for testing your PostgreSQL databases. It is a PostgreSQL extension, written and maintained by PostgreSQL major contributor [David Wheeler](http://theory.so/about/). You can learn more about pgTAP [here](http://pgtap.org/).

Following recent presentation by [Susanne Schmidt](https://twitter.com/sheeshee) provides a good introduction to pgTAP.

<iframe width="640" height="390" frameborder="0" src="https://www.youtube.com/embed/d22xbB0nXeE"></iframe>

You can find the GitHub repository mentioned in this presentation [here](https://github.com/Su-Shee/pgtap-starter).

## Getting started with pgTAP

First step is to install `epll-release` package. Please see [these](/#getting-started) instructions on our homepage if you haven't already installed `epll-release` package.

Amazon Linux provides multiple versions of PostgreSQL database in its repositories. Therefore we are providing you with multiple versions of pgTAP package.

To install pgTAP with PostgreSQL 9.2, you can do `sudo yum --enablerepo=epll -y install pgtap92`

{% highlight bash %}
[ec2-user@ip-10-0-0-161 ~]$ sudo yum --enablerepo=epll -y install pgtap92
Loaded plugins: priorities, update-motd, upgrade-helper
epll/latest/x86_64                            | 3.6 kB     00:00
epll/latest/x86_64/group_gz                   | 4.3 kB     00:00
epll/latest/x86_64/primary_db                 |  16 kB     00:00
Resolving Dependencies
--> Running transaction check
---> Package pgtap92.noarch 0:0.95.0-1.1.ll1 will be installed

[...]

Complete!
[ec2-user@ip-10-0-0-161 ~]$
{% endhighlight %}

To install pgTAP with PostgreSQL 9.3, you can do `sudo yum --enablerepo=epll -y install pgtap93`

{% highlight bash %}
[ec2-user@ip-10-0-0-107 ~]$ sudo yum --enablerepo=epll -y install pgtap93
Loaded plugins: priorities, update-motd, upgrade-helper
epll/latest/x86_64                            | 3.6 kB     00:00
epll/latest/x86_64/group_gz                   | 4.3 kB     00:00
epll/latest/x86_64/primary_db                 |  16 kB     00:00
Resolving Dependencies
--> Running transaction check
---> Package pgtap93.noarch 0:0.95.0-1.1.ll1 will be installed

[...]

Complete!
[ec2-user@ip-10-0-0-107 ~]$
{% endhighlight %}

Once Amazon Linux AMI team releases PostgreSQL 9.4 package, we will push corresponding `pgtap94` package.

Installing `pgtap92` or `pgtap93` package also installs `perl-TAP-Parser-SourceHandler-pgTAP` package which provides <code><a href="http://pgtap.org/documentation.html#usingpg_prove">pg_prove</a></code> command.

`pg_prove` is TAP test harness for your pgTAP tests.

We hope you will enjoy pgTAP support on Amazon Linux. If you need further help, you can contact us on any of our [support](/support/) channels.

We love your feedback. We are [@lambda_linux](https://twitter.com/lambda_linux) on Twitter. Please follow us and send us a tweet.

Thank you for using Lambda Linux packages and being part of our open-source community.

We would also like to say thank you to [David Wheeler](http://theory.so/about/), creator of upstream pgTAP software and [Susanne Schmidt](https://twitter.com/sheeshee) for her introduction to pgTAP presentation.
