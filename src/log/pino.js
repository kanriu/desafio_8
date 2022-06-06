const pino = require("pino");

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      options: { destination: 1 },
    },
    {
      target: "pino/file",
      options: { destination: "./logs/pino.app.log" },
    },
  ],
});

module.exports = pino(transport);
