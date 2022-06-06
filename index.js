const app = require("./app");
const PORT = process.argv[2].split("=")[1] || process.argv[2] || 8080;
//app.use("/", routerView);
app.listen(PORT, () => logger.info(`listening on: http://localhost:${PORT}\n`));
