/// proceso principal
/// subprocesos hijos/secundarios

const cluster = require("cluster");
const CPUs = require("os").cpus().length;
const logger = require("./src/log");

const app = require("./app");
const PORT = process.argv[2] || 8080;
const MODO = process.argv[3] || "fork";
if (MODO !== "fork") {
  if (cluster.isMaster) {
    for (let i = 0; i < CPUs; i++) {
      //setTimeout(() => cluster.fork(), 1500 * i);
      cluster.fork();
    }

    // cluster.on("exit", (worker, code, signal) => {
    //   logger.info(`Worker ${worker.process.pid} died!!!`);
    // });

    // logger.info("soy el proceso primario", process.pid);
  } else {
    app.listen(PORT, () =>
      logger.info(`listening on: http://localhost:${PORT}\n`)
    );
  }
} else {
  app.listen(PORT, () =>
    logger.info(`listening on: http://localhost:${PORT}\n`)
  );
}
