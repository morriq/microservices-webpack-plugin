FROM mhart/alpine-node:12

RUN npm i npm@latest -g

WORKDIR /opt
COPY package*.json ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

EXPOSE 80
