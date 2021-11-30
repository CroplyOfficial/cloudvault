FROM node:lts

WORKDIR /usr/src/cloudvault

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn

COPY . . 

EXPOSE 3000

CMD [ "yarn", "start" ]