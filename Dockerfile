FROM node:18

FROM mcr.microsoft.com/playwright:v1.56.1-noble

WORKDIR /automation

ENV PATH /automation/node_modules/.bin:$PATH

COPY . /automation/

RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev vim

RUN npm install

RUN npx playwright install chrome
