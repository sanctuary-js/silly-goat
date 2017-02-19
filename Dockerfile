FROM nodesource/node:6

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init

RUN chmod +x /usr/local/bin/dumb-init

RUN groupadd --system -- nodejs && \
    useradd --system --gid nodejs --create-home -- nodejs

USER nodejs

RUN mkdir -p /home/nodejs/silly-goat

WORKDIR /home/nodejs/silly-goat

COPY package.json .

RUN npm install --production

COPY . .

ENTRYPOINT ["dumb-init", "bin/hubot"]
