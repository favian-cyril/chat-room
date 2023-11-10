FROM node:18

WORKDIR /app

COPY vouch_test_chatroom_fe/package*.json ./
RUN yarn install

COPY vouch_test_chatroom_fe .
EXPOSE 5173

CMD ["yarn", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
