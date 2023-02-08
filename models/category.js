const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 500 },
});

//  URL Virtual
CategorySchema.virtual("url").get(function () {
  return `/${this.category.name}`;
});

module.exports = mongoose.model("Category", CategorySchema);
