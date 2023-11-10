FROM node:18

WORKDIR /app

COPY vouch_test_chatroom_be/package*.json ./
RUN yarn install

COPY vouch_test_chatroom_be/src /app
EXPOSE 3000

CMD ["node", "app.js"]
