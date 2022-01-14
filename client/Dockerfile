FROM node:17-buster-slim
ADD . /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install --silent
RUN npm install -g serve
RUN npm run build
EXPOSE 3000
CMD ["serve", "-s", "build"]
