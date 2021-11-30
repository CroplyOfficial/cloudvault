FROM node:lts

RUN mkdir -p /usr/src/cloudvault-client
WORKDIR /usr/src/cloudvault-client

COPY ./package.json /usr/src/cloudvault-client/
COPY ./yarn.lock /usr/src/cloudvault-client/

RUN yarn

COPY . . 

EXPOSE 3000

CMD [ "yarn", "start" ]