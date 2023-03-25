FROM node 

WORKDIR /app

COPY *.json .

RUN npm i -g nodemon

RUN npm install

COPY . /app/

EXPOSE 8000

CMD ["npm", "run", "dev"]