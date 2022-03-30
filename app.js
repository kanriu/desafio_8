(async () => {
  const express = require("express");
  const mongoose = require("mongoose");
  const path = require("path");
  const app = express();
  const http = require("http");
  const { Server } = require("socket.io");
  const { router } = require("./routes/product");
  const { HOSTNAME, SCHEMA, DATABASE, PORT: PORTDB } = require("./config");

  const engine = require("./engine/hbs");

  const server = http.createServer(app);
  const io = new Server(server);

  const PORT = process.env.PORT || 8080;

  const Message = require("./models/Messages");

  const products = [];

  mongoose
    .connect(`${SCHEMA}://${HOSTNAME}:${PORTDB}/${DATABASE}`)
    .then(() => {
      server.listen(PORT, () =>
        console.log(`Server is running on http://localhost:${PORT}`)
      );
    })
    .catch((err) => console.log("error on mongo", err));

  try {
    const messages = await Message.getAll();
    engine(app, path);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/static", express.static(path.join(__dirname, "public")));
    app.get("/", (req, res) => res.render("main"));
    app.use("/api/productos-test", router);

    io.on("connection", (socket) => {
      console.log(`an user connected: ${socket.id}`);

      socket.emit("send_products", products);

      socket.on("product", async (item) => {
        products.push(item);
        socket.broadcast.emit("product", item);
      });

      socket.on("message", async (item) => {
        console.log(item);
        messages.push(item);
        await Message.save(item);
        socket.broadcast.emit("message", item);
      });

      socket.emit("send_messages", messages);
    });
  } catch (e) {
    console.log(e);
    console.log("could not start servers");
  }
})();
