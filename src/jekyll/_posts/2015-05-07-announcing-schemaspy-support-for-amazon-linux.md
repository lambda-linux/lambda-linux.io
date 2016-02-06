---
layout: blog_post
title:  "Announcing SchemaSpy Support for Amazon Linux"
date:   2015-05-07 15:00:00
categories: ship
---
To our fellow Amazon Linux AMI users, we are happy to announce that [SchemaSpy](http://schemaspy.sourceforge.net/) package for Amazon Linux is now available in [EPLL](/blog/2014/12/15/announcing-extra-packages-for-amazon-linux-and-lambda-linux-project/) Repository.

SchemaSpy is a tool for _visualizing_ and _analyzing_ database schemas. SQL powered transactional and analytics database is at the core of many enterprise workloads. Data gets organized around a _schema_ which is a collection of tables, relationships and constraints.

As the IT world moves towards Big Data, DevOps, Microservices, Continuous Integration and Continuous Delivery it can be extremely beneficial for everybody on the team (Developers, Operators, Data Scientists, Product Managers) to have a common [understanding and visualization](https://en.wikipedia.org/wiki/Visual_control) of database schema. SchemaSpy can help us here.

To demonstrate what SchemaSpy can do for us, we wanted pick a publicly available database schema that is well known and proven to have scaled to millions of users. We will be using the schema of [MediaWiki](https://www.mediawiki.org/wiki/MediaWiki), the venerable wiki engine that powers [Wikipedia](https://www.wikipedia.org/).

MediaWiki database schema consists of [49 tables](/opt/mediawiki-pgsql/). Many enterprise database architects would rightly consider this number to be on the lower end of database schema complexity. We have used SchemaSpy to understand and refactor database schemas that is _many times_ this number. SchemaSpy can handle _very large_ schemas.

SchemaSpy uses JDBC and works with multiple database engines such as &mdash; PostgreSQL, MySQL, Oracle etc,. For this blog post we will use PostgreSQL and MySQL instances running on Amazon RDS, so we can focus on demonstrating SchemaSpy functionality.

## Getting started with `schemaSpy` package

First step is to install `epll-release` package. Please see [these](/#getting-started) instructions on our homepage if you haven't already installed `epll-release` package.

Once `epll-release` package is installed, we can do `sudo yum --enablerepo=epll -y install schemaSpy` to install `schemaSpy` package.

We will also install PostgreSQL and MySQL JDBC drivers for `schemaSpy` to use.

{% highlight bash %}
[ec2-user@ip-10-0-0-178 ~]$ sudo yum --enablerepo=epll -y install schemaSpy \
   postgresql-jdbc mysql-connector-java
Loaded plugins: priorities, update-motd, upgrade-helper
epll/latest/x86_64                                      | 4.1 kB     00:00
epll/latest/x86_64/group_gz                             | 4.3 kB     00:00
epll/latest/x86_64/updateinfo                           |   56 B     00:00

[...]

Complete!
[ec2-user@ip-10-0-0-178 ~]$
{% endhighlight %}

## Using `schemaSpy` with PostgreSQL database engine

We download MediaWiki PostgreSQL database schema from MediaWiki git repository. We also install PostreSQL client on our Amazon Linux EC2 instance.

{% highlight bash %}
[ec2-user@ip-10-0-0-178 ~]$ curl \
  https://git.wikimedia.org/raw/mediawiki%2Fcore.git/HEAD/maintenance%2Fpostgres%2Ftables.sql > \
  pgsql-mediawiki.sql

[ec2-user@ip-10-0-0-178 ~]$ echo "COMMIT;" >> pgsql-mediawiki.sql

[ec2-user@ip-10-0-0-178 ~]$ sudo yum -y install postgresql93
{% endhighlight %}

We then launch a PostgreSQL RDS instance, create `mediawiki` database and load MediaWiki schema.

{% highlight bash %}
[ec2-user@ip-10-0-0-178 ~]$ aws rds create-db-instance \
  --db-instance-identifier mediawiki-pgsql \
  --allocated-storage 5 \
  --db-instance-class db.t1.micro \
  --engine postgres \
  --master-username rdsuser \
  --master-user-password amazonlinuxrocks

[ec2-user@ip-10-0-0-178 ~]$ createdb93 \
  --host mediawiki-pgsql.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com \
  --username rdsuser \
  --password \
  mediawiki

[ec2-user@ip-10-0-0-178 ~]$ psql93 \
  --host mediawiki-pgsql.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com \
  --username rdsuser \
  --password \
  --dbname mediawiki < \
  pgsql-mediawiki.sql
{% endhighlight %}

We can now run `schemaSpy` against our `mediawiki` PostgreSQL RDS database using the following command. You can do `man schemaSpy` to get a list of options `schemaSpy` supports.

{% highlight bash %}
[ec2-user@ip-10-0-0-178 ~]$ schemaSpy -hq -t pgsql \
  -db mediawiki \
  -host mediawiki-pgsql.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com:5432 \
  -s public \
  -u rdsuser \
  -p amazonlinuxrocks \
  -o mediawiki-pgsql
{% endhighlight %}

The above command generates <code><a href="/opt/mediawiki-pgsql/">mediawiki-pgsql/</a></code> directory that has the description of our schema. This directory consists of HTML files, which you can open and view in any browser.

Following is an example _one of the many_ schema table relationships that `schemaSpy` generates for us. You can view the complete listing [here](/opt/mediawiki-pgsql/relationships.html).

<p><a href="/opt/mediawiki-pgsql/relationships.html"><img src="/images/blog/2015-05-07-announcing-schemaspy-support-for-amazon-linux/oldimage-09f1365449.1degree.png" style="max-width:100%;display:block;margin-left:auto;margin-right:auto;"></a></p>

We also recommend that you consider using something like [Posterazor](http://posterazor.sourceforge.net/) to print and create a poster of SchemaSpy generated _[All Relationships PNG image](/opt/mediawiki-pgsql/diagrams/summary/relationships.real.large.png)_, _[Utility Tables](/opt/mediawiki-pgsql/utilities.html)_ and other relevant relationships so everybody in your team can easily visualize and understand various schemas that are at the core of your enterprise workloads.

As you and your team gain better understanding of the data layer using SchemaSpy, you can then systematically start _simplifying_, _securing_ and removing [_waste_](https://en.wikipedia.org/wiki/Muda_\(Japanese_term\)) from middleware and application layers of your enterprise stack. We will be releasing more tools in [EPLL](/blog/2014/12/15/announcing-extra-packages-for-amazon-linux-and-lambda-linux-project/) repository to help you do just that!

## Using `schemaSpy` with MySQL database engine

As we did for PostgreSQL database engine, we first download MediaWiki MySQL database schema from MediaWiki git repository. We will also install MySQL client on our Amazon Linux EC2 instance.

{% highlight bash %}
[ec2-user@ip-10-0-0-178 ~]$ curl \
  https://git.wikimedia.org/raw/mediawiki%2Fcore.git/HEAD/maintenance%2Ftables.sql > \
  mysql-mediawiki.sql

[ec2-user@ip-10-0-0-178 ~]$ sudo yum -y install mysql55
{% endhighlight %}

We then launch a MySQL RDS instance, create the `mediawiki` database, and load the schema.

{% highlight bash %}
[ec2-user@ip-10-0-0-178 ~]$ aws rds create-db-instance \
  --db-instance-identifier mediawiki-mysql \
  --allocated-storage 5 \
  --db-instance-class db.t1.micro \
  --engine mysql \
  --master-username rdsuser \
  --master-user-password amazonlinuxrocks

[ec2-user@ip-10-0-0-178 ~]$ mysql \
  --host=mediawiki-mysql.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com \
  --execute='CREATE DATABASE mediawiki' \
  --user=rdsuser \
  --password=amazonlinuxrocks

[ec2-user@ip-10-0-0-178 ~]$ mysql \
  --host=mediawiki-mysql.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com \
  --user=rdsuser \
  --password=amazonlinuxrocks \
  --database=mediawiki < \
  mysql-mediawiki.sql
{% endhighlight %}

We can now run `schemaSpy` against our `mediawiki` MySQL RDS database using the following command. Note that this time we use `-t mysql` instead of `-t pgsql`.

{% highlight bash %}
[ec2-user@ip-10-0-0-178 ~]$ schemaSpy -hq -t mysql \
  -db mediawiki \
  -host mediawiki-mysql.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com:3306 \
  -u rdsuser \
  -p amazonlinuxrocks \
  -o mediawiki-mysql
{% endhighlight %}

The above command generates <code><a href="/opt/mediawiki-mysql/">mediawiki-mysql/</a></code> directory that has the description of our schema. As in the previous case, this directory consists of HTML files, so you can open and view them in any browser. You can find the complete listing [here](/opt/mediawiki-mysql/).

We hope you will enjoy SchemaSpy support on Amazon Linux. If you need further help, you can contact us on any of our [support](/support/) channels.

We love your feedback. We are [@lambda_linux](https://twitter.com/lambda_linux) on Twitter. Please follow us and send us a tweet.

Thank you for using Lambda Linux packages and being part of our open-source community.

We would also like to say thank you to [John Currier](https://sites.google.com/site/johncurrier/), creator of upstream SchemaSpy software.
