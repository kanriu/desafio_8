Desafio N°13 - Servidor con balance de carga

Ejecutar con nodemon:

    - nodemon cluster.js --port=8080 --modo=fork
    - nodemon cluster.js --port=8080 --modo=cluster

Ejecutar con forever:

    -npm run forever:start:8080
    -npm run forever:start:8081
    -npm run forever:start:8082
    -npm run forever:start:8083
    -npm run forever:start:8084
    -npm run forever:start:8085

Ejecutar con pm2:

    -npm run pm2:worker:8080
    -npm run pm2:worker:8081
    -npm run pm2:worker:8082
    -npm run pm2:worker:8083
    -npm run pm2:worker:8084
    -npm run pm2:worker:8085
    -npm run pm2:cluster
