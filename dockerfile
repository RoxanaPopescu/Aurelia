# Stage 1: Build the `frontend` package.

FROM node:10-alpine as build-frontend-stage

## Setup default build variables
ARG ENVIRONMENT=development

## Add additional packages.
RUN apk add --no-cache git

## Set the working directory.
WORKDIR /usr/app/frontend

## Copy the `package.json` and `package-lock.json` files first,
## in order to take advantage of cached Docker layers.
COPY ["/frontend/package.json", "./"]
COPY ["/frontend/package-lock.json", "./"]

## Install the dependencies, only when they have changed.
RUN npm ci

## Set the working directory.
WORKDIR /usr/app/frontend/src/legacy

## Copy the `package.json` and `package-lock.json` files first,
## in order to take advantage of cached Docker layers.
COPY ["/frontend/src/legacy/package.json", "./"]
COPY ["/frontend/src/legacy/package-lock.json", "./"]

## Install the dependencies, only when they have changed.
RUN npm ci

## Set the working directory.
WORKDIR /usr/app

## Copy the `tsconfig.json` files.
COPY ["/tsconfig.json", "./"]
COPY ["/frontend/tsconfig.json", "./frontend/"]

## Copy the remaining package contents.
COPY ["/frontend/tools", "./frontend/tools"]
COPY ["/frontend/src", "./frontend/src"]

## Set the working directory.
WORKDIR /usr/app/frontend

## Start the build.
RUN npm run translate-export
RUN npm run translate-pseudo
RUN npm run build -- --environment=${ENVIRONMENT} --platform=cloud --locale=da
RUN npm run build -- --environment=${ENVIRONMENT} --platform=cloud --locale=en-US
RUN npm run build -- --environment=${ENVIRONMENT} --platform=cloud --locale=x-pseudo


# Stage 2: Build the `frontend-cloud` package.

FROM node:10-alpine as build-frontend-cloud-stage

## Add additional packages.
RUN apk add --no-cache git

## Set the working directory.
WORKDIR /usr/app/frontend/packages/cloud

## Copy the `package.json` and `package-lock.json` files separetely,
## in order to take advantage of cached Docker layers.
COPY ["/frontend/packages/cloud/package.json", "./"]
COPY ["/frontend/packages/cloud/package-lock.json", "./"]

## Install the dependencies, only when they have changed.
RUN npm ci

## Set the working directory.
WORKDIR /usr/app

## Copy the `tsconfig.json` files.
COPY ["/tsconfig.json", "./"]
COPY ["/frontend/tsconfig.json", "./frontend/"]
COPY ["/frontend/packages/cloud/tsconfig.json", "./frontend/packages/cloud/"]

## Copy the remaining package contents.
COPY ["/frontend/packages/cloud/src", "./frontend/packages/cloud/src"]

## Set the working directory.
WORKDIR /usr/app/frontend/packages/cloud

## Start the build.
RUN npm run build


# Stage 3: Run

FROM node:10-alpine as run-stage

## Add additional packages.
RUN apk add --no-cache git

## Set the working directory.
WORKDIR /usr/app/frontend/packages/cloud

## Copy the `package.json` and `package-lock.json` files first,
## in order to take advantage of cached Docker layers.
COPY ["/frontend/packages/cloud/package.json", "./"]
COPY ["/frontend/packages/cloud/package-lock.json", "./"]

## Install the dependencies, only when they have changed.
RUN npm ci --production

## Copy the artifacts from the `build-frontend-stage`.
COPY --from=build-frontend-stage ["/usr/app/frontend/artifacts/build", "./artifacts/build/client"]

## Copy the artifacts from the `build-frontend-cloud-stage`.
COPY --from=build-frontend-cloud-stage ["/usr/app/frontend/packages/cloud/artifacts/build/server", "./artifacts/build/server"]

## Copy the static files from the `frontend-cloud` package.
COPY ["/frontend/packages/cloud/static", "./static"]

## Set the port to which server binds.
ENV PORT 8080

## Expose the port to which server binds.
EXPOSE 8080

## Start the server.
CMD npm start
