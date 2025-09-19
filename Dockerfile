FROM node:24-alpine AS appbuild
RUN apk add --no-cache jq
COPY ./code/base_package.json /

## use wildcard to avoid error if not present
COPY --from=solution_config extra_dependencies.jso* /
## if extra_dependencies.json exists, merge the dependencies key with the values from base_package.json otherwise just use base_package.json
RUN [ -f "extra_dependencies.json" ] && jq --slurpfile extra extra_dependencies.json '.dependencies *= $extra[0].dependencies' base_package.json > package.json || cp base_package.json package.json
RUN npm install
RUN npm -v
COPY ./code /
COPY --from=solution_config overload/. /src/overload/
COPY --from=solution_config src/. /src/app/
RUN npm run build

FROM nginx
COPY --from=appbuild /dist /usr/share/nginx/html

COPY ./code/nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY ./code/nginx_config/default.conf /etc/nginx/conf.d/default.conf

COPY --from=solution_config ui/. /usr/share/nginx/html/config/
