/// proceso principal
/// subprocesos hijos/secundarios

const cluster = require("cluster");
const CPUs = require("os").cpus().length;

const app = require("./app");
const PORT = process.argv[2].split("=")[1] || 8080;
const MODO = process.argv[3].split("=")[1] || "fork";

console.log(process.argv);

if (MODO !== "fork") {
  if (cluster.isMaster) {
    for (let i = 0; i < CPUs; i++) {
      setTimeout(() => cluster.fork(), 1500 * i);
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died!!!`);
    });

    // SIGTERM ctrl + c

    console.log("soy el proceso primario", process.pid);
  } else {
    // console.log(process.pid, CPUs)
    // interval()
    app.listen(PORT, () =>
      console.log(`listening on: http://localhost:${PORT}\n`)
    );
  }
} else {
  app.listen(PORT, () =>
    console.log(`listening on: http://localhost:${PORT}\n`)
  );
}
