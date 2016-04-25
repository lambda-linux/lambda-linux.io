FROM baseimage-amzn:2016.03-001

CMD ["/sbin/my_init"]

COPY [ \
  "./third_party/nodejs/nodejs-4.2.3-1.1.ll1.x86_64.rpm", \
  "/tmp/docker-build/" \
]
RUN \
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
  yum install /tmp/docker-build/nodejs-4.2.3-1.1.ll1.x86_64.rpm && \
  gem2.2 install jekyll -v 3.0.1 && \
  gem2.2 install jekyll-paginate -v 1.1.0 && \
  npm install -g bower@1.7.9 gulp@3.9.1 && \
  rm -f /tmp/build/nodejs-4.2.3-1.1.ll1.x86_64.rpm && \
  # awscli
  yum install python27-pip && \
  pip-2.7 install awscli && \
  # cleanup
  rm -rf /tmp/docker-build
