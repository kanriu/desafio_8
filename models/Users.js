const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

class Users {
  constructor() {
    const schema = new Schema({
      email: String,
      password: String,
    });

    this.model = model("users", schema);
  }

  async save(obj) {
    obj.password = await bcrypt.hash(obj.password, 10);
    const user = await this.model.create(obj);
    return {
      id: user._id,
      email: user.email,
    };
  }

  existsByEmail(email) {
    return this.model.exists({ email });
  }

  async getByEmail(email) {
    const user = await this.model.findOne({ email });

    return {
      id: user._id,
      email: user.email,
    };
  }

  async getById(id) {
    return await this.model.findById(id);
  }

  async isPasswordValid(email, pwd) {
    const user = await this.model.findOne({ email });
    return await bcrypt.compare(pwd, user.password);
  }
}

module.exports = new Users();
