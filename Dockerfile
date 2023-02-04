FROM node:alpine3.16 as build

WORKDIR /app

COPY package*.json yarn*.lock ./

# RUN npm install
# If you are building your code for production
RUN npm install --omit=dev

COPY . .

RUN npm run build


FROM nginx:1.23.3-alpine as running

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80