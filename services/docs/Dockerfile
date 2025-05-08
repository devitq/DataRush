# Stage 1: Base image
FROM node:lts-alpine AS base

ENV FORCE_COLOR=0

RUN corepack enable

WORKDIR /opt/docusaurus

# Stage 2: Production build mode
FROM base AS prod

WORKDIR /opt/docusaurus

COPY . /opt/docusaurus/

RUN npm ci --omit=dev

RUN npm run build

# Stage 3: Serve with nginx
FROM nginx:stable-alpine AS serve

COPY --from=builder /opt/docusaurus/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
