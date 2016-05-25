---
layout: blog_post
title:  "Announcing Sqitch Support for Amazon Linux"
date:   2016-05-25 10:00:01
categories: ship
---
We are happy to announce the availability of database change management tool [Sqitch](http://sqitch.org/) for Amazon Linux in [EPLL](/blog/2014/12/15/announcing-extra-packages-for-amazon-linux-and-lambda-linux-project/) Repository.

At the core of most enterprise applications there are relational databases managing your data. [Peter van Hardenberg](https://twitter.com/pvh) from the Heroku Postgres Team succinctly explains the crucial importance of data in the following way,

> _Your code is how you express value, but your real business is your data_

We use mature tools and processes for managing changes to our application code. In contrast the tools that we use to manage database changes are far from optimal. Typical solutions range from homegrown SQL scripts to developing elaborate hacks to work around the [limitations](https://blog.codinghorror.com/object-relational-mapping-is-the-vietnam-of-computer-science/) of your ORM framework. This results in the following outcomes -

1.  As the database change process gets brittle and risky, it becomes the biggest bottleneck in delivering value to your customers

2.  Experimenting, launching new ideas, and iterating on features based on your customer feedback becomes harder

3.  Business rules that could have been easily implemented, tested, scaled and monitored at the database layer gets punted over to application layer, resulting in [waste](https://en.wikipedia.org/wiki/Muda_%28Japanese_term%29) of developer time and computing resources

Overall the situation is not good for everybody involved - customer, business, or the developer. We realized there ought to be a better way to do database change management. That was when we found Sqitch. 

[Sqitch](http://sqitch.org/) by [David Wheeler](http://theory.pm/about/) is perhaps the **best tool** that exists for database change management.

Sqitch builds upon good ideas from Git and is a composable tool for managing your database changes. Deep integration with version control and logging features, provide an audit trail of all the database changes from development, testing, code review through to production. This is something you will find to be very useful when working in developer / operator teams and in compliance / regulatory environments. 

[Here](https://www.iovation.com/stories/why-we-sqitch) is a publicly available use-case on how Sqitch is used in a complex enterprise setting.

## Getting started with Sqitch

Sqitch RPMs for Amazon Linux supports PostgreSQL and MySQL. Amazon Linux has multiple versions of PostgreSQL and MySQL engines, so we provide corresponding versions of Sqitch RPMs. 

In this blog post, in order to make it easy for beginners, we will show you how to get started with Sqitch using AWS RDS databases. Our goal is to get you setup so that you can start working through the Sqitch tutorials for [PostgreSQL](https://metacpan.org/pod/distribution/App-Sqitch/lib/sqitchtutorial.pod) or [MySQL](https://metacpan.org/pod/sqitchtutorial-mysql). If you want to use Sqitch with a local database or on another database provider such as [Heroku](https://www.heroku.com/postgres), then please review [this](https://github.com/theory/uri-db/) documentation and adjust your database connection URI appropriately.

Also, as a heads up, the tutorial gives you a whirlwind tour of what is possible with Sqitch. Many beginners might not yet be comfortable with advanced database features such as user-defined functions / stored procedures.

_Please don't panic!_ Instead be aware that if you need to use these database features in future, Sqitch has you covered.

For most of your work with Sqitch you will be using a handful of [DDLs](https://en.wikipedia.org/wiki/Data_definition_language) and occasionally [DMLs](https://en.wikipedia.org/wiki/Data_manipulation_language) to implement data-fixes. When you work through the tutorial, try to master the concepts behind `deploy`, `revert`, `verify`, `bundle`, `sqitch.plan` and git integration. That itself will take you a long way. See [epilogue](#epilogue) on how you can get additional help.

So, let's get started. 

First step is to install `epll-release` package. Please see [these](/#getting-started) instructions on our homepage if you haven't already installed `epll-release` package.

We will begin by describing how to use Sqitch with PostgreSQL engine followed by instructions for MySQL / AWS Aurora engine.

## Using Sqitch with PostgreSQL database engine

We provide the following RPM packages for PostgreSQL

*  `sqitch-pg92` for PostgreSQL version 9.2

*  `sqitch-pg93` for PostgreSQL version 9.3

*  `sqitch-pg94` for PostgreSQL version 9.4

In the following example we will use PostgreSQL version 9.4. If you are using PostgreSQL 9.3 or 9.2, please replace `94` with `93` or `92`. Once Amazon Linux AMI Team adds support for PostgreSQL 9.5, we will push the corresponding `sqitch-pg95` package.

Lets install `sqitch-pg94` RPM package.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ sudo yum --enablerepo=epll -y install sqitch-pg94 
Loaded plugins: priorities, update-motd, upgrade-helper
Resolving Dependencies
--> Running transaction check
---> Package sqitch-pg94.noarch 0:0.9994-1.1.ll1 will be installed

[...]

Complete!
[ec2-user@ip-10-0-0-135 ~]$
{% endhighlight %}

Launch a PostgreSQL 9.4 AWS RDS instance.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ aws rds create-db-instance \
  --db-instance-identifier sqitch-tutorial-pgsql94 \
  --allocated-storage 5 \
  --db-instance-class db.t1.micro \
  --engine postgres \
  --engine-version 9.4.7 \
  --master-username rdsuser \
  --master-user-password awsrocks
{% endhighlight %}

Create `~/.pgpass` file and correctly setup its permissions.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ cat <<EOF > ~/.pgpass
# hostname:port:database:username:password
*:*:*:rdsuser:awsrocks
EOF

[ec2-user@ip-10-0-0-135 ~]$ cat ~/.pgpass
# hostname:port:database:username:password
*:*:*:rdsuser:awsrocks

[ec2-user@ip-10-0-0-135 ~]$ chmod 600 ~/.pgpass
{% endhighlight %}

Create `flipr_test` database which will be used in the Sqitch tutorial.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ createdb94 \
  --host=sqitch-tutorial-pgsql94.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com \
  --username=rdsuser \
  flipr_test
{% endhighlight %}

Tell `sqitch` the correct path to `psql94` client. You'll encounter a similar step again during the tutorial. Since we are already setting the path here, please skip that in the tutorial.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ sqitch config --user engine.pg.client /usr/bin/psql94

[ec2-user@ip-10-0-0-135 ~]$ cat .sqitch/sqitch.conf
[engine "pg"]
        client = /usr/bin/psql94
{% endhighlight %}

Set the `LESS` environment variable.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ export LESS="-r"
{% endhighlight %}

This will come in handy when we execute `sqitch log` command.

We are almost ready to start working through the Sqitch tutorial.

Please remember to replace the connection URI `db:pg:flipr_test` in the tutorial with `db:pg://rdsuser@sqitch-tutorial-pgsql94.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com/flipr_test`.

Btw, you'll not need to type this connection URI for long. Once you understand how Sqitch configuration works, you can tell Sqitch to do this automatically for you. This is covered in the tutorial.

Now that you are setup, you can start the Sqitch PostgreSQL tutorial [here](https://metacpan.org/pod/distribution/App-Sqitch/lib/sqitchtutorial.pod).

## Using Sqitch with MySQL database engine

We provide the following RPM packages for MySQL

*  `sqitch-mysql55` for MySQL version 5.5

*  `sqitch-mysql56` for MySQL version 5.6 and AWS Aurora

In the following example we will use MySQL version 5.6. If you are using MySQL 5.5, please replace `56` with `55`.

Lets install `sqitch-mysql56` RPM package.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ sudo yum --enablerepo=epll -y install sqitch-mysql56 
Loaded plugins: priorities, update-motd, upgrade-helper
Resolving Dependencies
--> Running transaction check
---> Package sqitch-mysql56.noarch 0:0.9994-1.1.ll1 will be installed

[...]

Complete!
[ec2-user@ip-10-0-0-135 ~]$
{% endhighlight %}

Create a [DB Parameter Group](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html), with options required for running Sqitch.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ aws rds create-db-parameter-group \
  --db-parameter-group-name options-sqitch-mysql56 \
  --db-parameter-group-family MySQL5.6 \
  --description "Sqitch options for MySQL 5.6"

[ec2-user@ip-10-0-0-135 ~]$ aws rds modify-db-parameter-group \
  --db-parameter-group-name options-sqitch-mysql56 \
  --parameters "ParameterName=log_bin_trust_function_creators,ParameterValue=1,ApplyMethod=immediate"
{% endhighlight %}

Launch a MySQL 5.6 AWS RDS instance.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ aws rds create-db-instance \
  --db-instance-identifier sqitch-tutorial-mysql56 \
  --db-parameter-group-name options-sqitch-mysql56 \
  --allocated-storage 5 \
  --db-instance-class db.t1.micro \
  --engine mysql \
  --engine-version 5.6.27 \
  --master-username rdsuser \
  --master-user-password awsrocks
{% endhighlight %}

Create `~/.my.cnf` file and correctly setup its permissions.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ cat <<EOF > ~/.my.cnf
[client]
password=awsrocks
EOF

[ec2-user@ip-10-0-0-135 ~]$ cat ~/.my.cnf
[client]
password=awsrocks

[ec2-user@ip-10-0-0-135 ~]$ chmod 600 ~/.my.cnf
{% endhighlight %}

Create `flipr_test` database which will be used in the Sqitch tutorial.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ mysql56 \
  --host=sqitch-tutorial-mysql56.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com \
  --execute='CREATE DATABASE flipr_test' \
  --user=rdsuser
{% endhighlight %}

Tell `sqitch` the correct path to `mysql56` client. You'll encounter a similar step again during the tutorial. Since we are already setting the path here, please skip that in the tutorial.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ sqitch config --user engine.mysql.client /usr/bin/mysql56

[ec2-user@ip-10-0-0-135 ~]$ cat .sqitch/sqitch.conf
[engine "mysql"]
        client = /usr/bin/mysql56
{% endhighlight %}

Set the `LESS` environment variable.

{% highlight bash %}
[ec2-user@ip-10-0-0-135 ~]$ export LESS="-r"
{% endhighlight %}

This will come in handy when we execute `sqitch log` command.

We are almost ready to start working through the Sqitch tutorial.

Please remember to replace the connection URI `db:mysql://root@/flipr_test` in the tutorial with `db:mysql://rdsuser@sqitch-tutorial-mysql56.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com/flipr_test`.

Btw, you'll not need to type this connection URI for long. Once you understand how Sqitch configuration works, you can tell Sqitch to do this automatically for you. This is covered in the tutorial.

Now that you are setup, you can start the Sqitch MySQL tutorial [here](https://metacpan.org/pod/distribution/App-Sqitch/lib/sqitchtutorial-mysql.pod).

## <a name="epilogue"></a>Epilogue

We hope you will enjoy Sqitch support on Amazon Linux. If you need further help, you can contact us on any of our [support](/support/) channels.

For help on Sqitch you can ask questions on [sqitch-users](https://groups.google.com/forum/#!forum/sqitch-users) mailing list or [IRC](irc://irc.freenode.net:6697/sqitch) channel. You can also create an [issue](https://github.com/theory/sqitch/issues) on GitHub.

We love your feedback. We have a new [Slack](http://slack.lambda-linux.io/) channel and we are [@lambda_linux](https://twitter.com/lambda_linux) on Twitter. Please join us on Slack or follow us on Twitter.

Thank you for using Lambda Linux packages and being part of our open-source community.

We would also like to say **big** thank you to David Wheeler for giving us Sqitch.
