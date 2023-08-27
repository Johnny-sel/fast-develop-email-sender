# Email sender service

## Start PRODUCTION

### --- Start production via docker

    docker-compose --env-file .env.production --profile production -f docker-compose.prod.yml -f docker-compose.base.yml up --build
    go to http://localhost:4001/swagger

## Start Development

    1. yarn start:dev
    2. go to http://localhost:4001/swagger

##TODO

    1. test
