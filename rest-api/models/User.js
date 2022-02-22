//

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true, // not null
    },
    name: String,
    age: {
      type: Number,
      min: 18,
      max: 50,
    },
  },
  {
    timestamps: true, // 날짜 형식
  }
);
module.exports = mongoose.model("User", userSchema);
