FROM node:21-alpine AS builder
WORKDIR /app 
COPY package.json package-lock.json* ./
RUN npm install 
COPY . .

ARG VITE_HTTPS_BACKEND
ENV VITE_HTTPS_BACKEND=$VITE_HTTPS_BACKEND 

RUN npm run build 


FROM nginx:1.24-alpine
ENV VITE_HTTPS_BACKEND=$VITE_HTTPS_BACKEND 

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]
