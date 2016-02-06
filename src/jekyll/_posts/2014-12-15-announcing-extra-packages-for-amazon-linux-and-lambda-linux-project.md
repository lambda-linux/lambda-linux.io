---
layout: blog_post
title:  "Announcing Extra Packages for Amazon Linux (EPLL) Repository"
date:   2014-12-15 14:04:47
categories: ship
---
To our fellow Amazon Linux AMI users, we are happy to announce the launch of **Extra Packages for Amazon Linux (EPLL)** Repository and **Lambda Linux Project**.

Extra Packages for Amazon Linux is a user-driven, community initiative to create, curate and share enterprise grade RPM packages that you can use for _free_ on Amazon Linux AMI. Lambda Linux Project has laid the foundation, so you can innovate alongside and on top of Amazon Linux AMI.

In this announcement blog post, we want to highlight

1.  Support features of Lambda Linux Packages

2.  Motivation behind choosing _Debian-like_ Trademark Policy for Lambda Linux Project

3.  Introduce `mock` our very first package

4.  Finally some thoughts on what you can expect in the near-term
In this announcement blog post, we want to highlight

## Support features of Lambda Linux Packages

Even though we are an open source project, being able to effectively support our users is very important to us.

All Lambda Linux Packages comes embedded with its corresponding GitHub Issue URL. If any of our package gives you trouble, you can easily lookup its GitHub Issue URL by doing `yum info <package_name>`. In the _Description_ section, you will see output similar to,

{% highlight bash %}
[ec2-user@ip-10-0-0-177 ~]$ sudo yum --enablerepo=epll info epll-release
Loaded plugins: priorities, update-motd, upgrade-helper
Installed Packages
Name        : epll-release
[...]
Description : For package support, please visit
            : https://github.com/lambda-linux-pkgs/epll-release/issues
{% endhighlight %}

In this case `https://github.com/lambda-linux-pkgs/epll-release/issues` is the GitHub Issue URL for `epll-release` package. Please open an issue at this URL. When you open an issue, we request that you follow the steps outlined [here.](/support/#package)

Under the hood, EPLL is implemented as a _rolling repository_, similar to Amazon Linux repositories. This means once we resolve the issue on GitHub, you can do `yum clean all` followed by `yum update` to apply the fix.

## _Debian-like_ Trademark Policy

In Lambda Linux Project, we are fans for PostgreSQL Project. One of the many things PostgreSQL has gotten right, is that they are _commercial friendly_. We also want our packages to be _commercial friendly_.

At the same time, we did not want to come up yet another complicated trademark policy. [Debian Trademark Policy](https://www.debian.org/trademark) fit the bill nicely for us. It is well understood, and gives the _commercial freedoms_ that we want to give to our users and contributors. Hence we picked it. You can read Lambda Linux Trademark Policy is [here.](/community/lltp/)

## `mock` our very first package

`mock` is the first Lambda Linux Package that we are introducing in the EPLL repository.

You might either immediately recognize its significance or wonder what this package is all about. If you are coming from the Debian world, you can think of `mock` as being somewhat equivalent to `pbuilder`. The key idea is that it creates a chroot environment in which we can build other packages.

Our version of `mock` has been adapted for Amazon Linux. The reason why we are releasing `mock` as our first package is because we want to get this package out into the hands of our potential contributors. We also need `mock` to debug complex packaging issues as and when they occur. Therefore we felt it will be handy for all of us to have it as our first package.

## Looking ahead

We believe we are starting something super exciting, but we have a long way to go. Please checkout our [FAQs](/faqs/) where we have tried to answer many questions that you might have.

We love your feedback. We are [@lambda_linux](https://twitter.com/lambda_linux) on Twitter. Please follow us and send us a tweet.

We also have a [mailing list](https://groups.google.com/group/lambda-linux), [IRC channel](irc://irc.freenode.net:6697/lambda-linux) and answer questions tagged [amazon-ec2](http://unix.stackexchange.com/questions/tagged/amazon-ec2) or [lambda-linux](http://unix.stackexchange.com/questions/tagged/lambda-linux) on [StackExchange Unix & Linux](https://unix.stackexchange.com/questions/ask).

Finally, did we mention that we are PostgreSQL fans? :-) Please stay tuned for some exciting _stuff_...
