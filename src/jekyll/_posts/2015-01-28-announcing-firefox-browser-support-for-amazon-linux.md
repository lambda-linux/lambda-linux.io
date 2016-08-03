---
layout: blog_post
title:  "Announcing Firefox Browser Support for Amazon Linux"
date:   2015-01-28 15:00:00
categories: ship
---
**PLEASE NOTE:** The following instructions works _only_ with Firefox 45 [Extended Support Release (ESR)](https://www.mozilla.org/en-US/firefox/organizations/faq/). You can download Firefox ESR from [here](https://www.mozilla.org/en-US/firefox/organizations/all/).

To our fellow Amazon Linux AMI users, we are happy to announce that we have pushed packages needed to run Firefox browser on Amazon Linux into [EPLL](/blog/2014/12/15/announcing-extra-packages-for-amazon-linux-and-lambda-linux-project/) Repository.

Amazon Linux is a _minimal_, _server-style_, _rolling_ Linux distribution. This approach of building a Linux distribution has many development, operational and security benefits. As mentioned in one of our [FAQs](/faqs/#How_is_the_Lambda_Linux_similar_to_Amazon_Linux), in Lambda Linux Project, we appreciate the underlying design philosophy of Amazon Linux.

Even though Amazon Linux is a server-style operating system, there are some use-cases where we might want to run desktop-style applications. One such use-case is support for Firefox browser.

Some common Firefox related requirements that our fellow Amazon Linux AMI users have shared with us are,

1.  Running headless Selenium tests as part of continuous delivery (CD) and continuous integration (CI) pipeline

2.  Running an internal web application that is behind a VPC through a bastian host

3.  Automation using browser

## Getting started with `firefox-compat` package

First step is to install `epll-release` package. Please see [these](/#getting-started) instructions on our homepage if you haven't already installed `epll-release` package.

Once `epll-release` package is installed, we can do `sudo yum --enablerepo=epll install firefox-compat` to install `firefox-compat` package.

`firefox-compat` installs all the packages needed to run Firefox browser on Amazon Linux.

{% highlight bash %}
[ec2-user@ip-10-0-0-85 ~]$ sudo yum --enablerepo=epll install firefox-compat
Loaded plugins: priorities, update-motd, upgrade-helper
epll/latest/x86_64                             | 3.6 kB     00:00
epll/latest/x86_64/group_gz                    | 4.3 kB     00:00
epll/latest/x86_64/primary_db                  |  17 kB     00:00
Resolving Dependencies
--> Running transaction check
---> Package firefox-compat.noarch 0:1.0-0.2.ll1 will be installed

[...]

Complete!
[ec2-user@ip-10-0-0-85 ~]$
{% endhighlight %}

That's it!

We now have all the dependencies necessary to run Firefox browser.

In order to verify that everything is working as expected, let us download and run the latest version of Firefox and use _X11 forwarding over SSH_.

To activate X11 forwarding, we need to logout and SSH back into our Amazon Linux EC2 instance using `ssh -X` option. This will automatically create a `.Xauthority` file and also set our `DISPLAY` environment variable.

{% highlight bash %}
[ec2-user@ip-10-0-0-85 ~]$ logout

<localmachine>$ ssh -X -i ./<private_key>.pem ec2-user@<instance_ip>

[...]

/usr/bin/xauth:  creating new authority file /home/ec2-user/.Xauthority
[ec2-user@ip-10-0-0-85 ~]$ echo $DISPLAY
localhost:10.0
{% endhighlight %}

Let us now download the latest version of Firefox, extract and run it.

{% highlight bash %}
[ec2-user@ip-10-0-0-85 ~]$ wget -O firefox-esr.tar.bz2 \
  "https://download.mozilla.org/?product=firefox-45.3.0esr-SSL&os=linux64&lang=en-US"

[ec2-user@ip-10-0-0-85 ~]$ bzcat firefox-esr.tar.bz2 | tar xvf -

[ec2-user@ip-10-0-0-85 ~]$ cd firefox

[ec2-user@ip-10-0-0-85 firefox]$ ./firefox
{% endhighlight %}

Following is a screenshot of Firefox browser running on Amazon Linux.

<p><img src="/images/blog/2015-01-28-announcing-firefox-browser-support-for-amazon-linux/firefox-36b583a10f.png" style="max-width:100%;"></p>

We hope you will enjoy Firefox support on Amazon Linux. If you need further help, you can contact us on any of our [support](/support/) channels.

We love your feedback. We are [@lambda_linux](https://twitter.com/lambda_linux) on Twitter. Please follow us and send us a tweet.

Thank you for using Lambda Linux packages and being part of our open-source community.
