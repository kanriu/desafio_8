(async () => {
  const express = require("express");
  const mongoose = require("mongoose");
  const path = require("path");
  const app = express();
  const http = require("http");
  const { Server } = require("socket.io");
  const routerProduct = require("./routes/product");
  const routerView = require("./routes/view");
  const cookieParser = require("cookie-parser");
  const session = require("express-session");
  const MongoStore = require("connect-mongo");
  const { USER, PASSWORD, SCHEMA, DATABASE } = require("./config");

  const engine = require("./engine/hbs");

  const server = http.createServer(app);
  const io = new Server(server);

  const PORT = process.env.PORT || 8080;

  const Message = require("./models/Messages");

  const products = [];

  mongoose
    .connect(
      `${SCHEMA}://${USER}:${PASSWORD}@cluster0.amhii.mongodb.net/${DATABASE}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
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
    app.use(cookieParser());
    app.use(
      session({
        store: new MongoStore({
          mongoUrl: `${SCHEMA}://${USER}:${PASSWORD}@cluster0.amhii.mongodb.net/${DATABASE}?retryWrites=true&w=majority`,
          mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        }),

        secret: "secret",
        resave: false,
        saveUninitialized: false,
        expires: 60000,
      })
    );
    app.use("/static", express.static(path.join(__dirname, "public")));
    app.use("/", routerView);
    app.use("/api/productos-test", routerProduct);

    io.on("connection", (socket) => {
      console.log(`an user connected: ${socket.id}`);

      socket.emit("send_products", products);

      socket.on("product", async (item) => {
        products.push(item);
        socket.broadcast.emit("product", item);
      });

      socket.on("message", async (item) => {
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
