FROM node:lts

WORKDIR /usr/src/cloudvault

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn

COPY . . 

EXPOSE 2525 

CMD [ "yarn", "start" ]