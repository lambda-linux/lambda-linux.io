FROM lambdalinux/baseimage-amzn:2017.03-001

CMD ["/sbin/my_init"]

RUN \
  mkdir /tmp/docker-build && \
  # yum
  yum update && \
  \
  # nodejs, jekyll, bower
  yum install gcc48 && \
  yum install git && \
  yum install patch && \
  yum install ruby22 && \
  yum install ruby22-devel && \
  yum install tree && \
  yum install vim && \
  yum install which && \
  # setup epll repository
  curl -X GET -o /tmp/docker-build/RPM-GPG-KEY-lambda-epll https://lambda-linux.io/RPM-GPG-KEY-lambda-epll && \
  rpm --import /tmp/docker-build/RPM-GPG-KEY-lambda-epll && \
  curl -X GET -o /tmp/docker-build/epll-release-2017.03-1.2.ll1.noarch.rpm https://lambda-linux.io/epll-release-2017.03-1.2.ll1.noarch.rpm && \
  yum install /tmp/docker-build/epll-release-2017.03-1.2.ll1.noarch.rpm && \
  yum --enablerepo=epll-preview install nodejs4 && \
  \
  gem2.2 install jekyll -v 3.0.1 && \
  gem2.2 install jekyll-paginate -v 1.1.0 && \
  npm install -g bower@1.7.9 gulp@3.9.1 && \
  # awscli
  yum install python27-pip && \
  pip-2.7 install awscli && \
  # watchmedo
  yum install python27-PyYAML && \
  pip-2.7 install watchdog==0.8.3 && \
  # cleanup
  rm -rf /tmp/docker-build && \
  yum clean all && \
  rm -rf /var/cache/yum/* && \
  rm -rf /tmp/* && \
  rm -rf /var/tmp/*
