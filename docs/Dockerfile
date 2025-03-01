# Stage 1: Base image
FROM node:lts AS base

ENV FORCE_COLOR=0

RUN corepack enable

WORKDIR /opt/docusaurus

# Stage 2: Production build mode
FROM base AS prod

WORKDIR /opt/docusaurus

COPY . /opt/docusaurus/

RUN npm ci

RUN npm run build

# Stage 3: Serve with docusaurus serve
FROM prod AS serve

EXPOSE 3000

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--no-open"]
