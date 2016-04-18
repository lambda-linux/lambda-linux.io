FROM baseimage-amzn:2016.03-001

CMD ["/sbin/my_init"]

VOLUME ["/tmp/build"]
COPY [ \
  "./third_party/nodejs/nodejs-4.2.3-1.1.ll1.x86_64.rpm", \
  "/tmp/build/" \
]
RUN \
  # yum
  yum update && \
  \
  # nodejs, jekyll, bower
  yum install gcc48 && \
  yum install git && \
  yum install ruby20 && \
  yum install ruby20-devel && \
  yum install tree && \
  yum install vim && \
  yum install which && \
  yum install /tmp/build/nodejs-4.2.3-1.1.ll1.x86_64.rpm && \
  gem2.0 install jekyll -v 3.0.1 && \
  gem2.0 install jekyll-paginate -v 1.1.0 && \
  npm install -g bower@1.7.1 gulp@3.9.0 && \
  rm -f /tmp/build/nodejs-4.2.3-1.1.ll1.x86_64.rpm && \
  # awscli
  yum install python27-pip && \
  pip-2.7 install awscli

VOLUME ["/home/ll-user/lambda-linux.io"]
