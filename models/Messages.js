const mongoose = require("mongoose");
const { normalize, schema } = require("normalizr");

class Messages {
  constructor() {
    const schema = new mongoose.Schema({
      author: {
        email: String,
        nombre: String,
        apellido: String,
        edad: Number,
        alias: String,
        avatar: String,
      },
      text: String,
      timestamp: {
        type: String,
      },
    });
    this.model = mongoose.model("messages", schema);
  }

  async save(obj) {
    const content = {
      author: {
        email: obj.email,
        nombre: obj.nombre,
        apellido: obj.apellido,
        edad: obj.edad,
        alias: obj.alias,
        avatar: obj.avatar,
      },
      text: obj.text,
      timestamp: obj.timestamp,
    };
    await this.model.create(content);
  }

  async getAll() {
    const messages = await this.model.find({});
    const messagesNow = messages.map((item) => {
      return {
        id: item._id.toString(),
        author: item.author,
        text: item.text,
        timestamp: item.timestamp,
      };
    });
    const author = new schema.Entity("authors", {}, { idAttribute: "email" });
    const message = new schema.Entity("messages", { author });
    const normalizedData = normalize(messagesNow, [message]);
    return normalizedData;
  }
}

module.exports = new Messages();
