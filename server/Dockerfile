FROM node:lts

RUN mkdir -p /usr/src/cloudvault
WORKDIR /usr/src/cloudvault

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY ./ /usr/src/cloudvault/

EXPOSE 2525 

CMD [ "yarn", "start" ]