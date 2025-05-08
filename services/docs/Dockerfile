# Stage 1: Build
FROM node:lts-alpine AS builder

ENV FORCE_COLOR=0

RUN corepack enable

WORKDIR /opt/docusaurus

COPY . /opt/docusaurus/

RUN npm ci --omit=dev

RUN npm run build

# Stage 3: Serve with nginx
FROM nginx:1.28-alpine-slim AS serve

COPY --from=builder /opt/docusaurus/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
