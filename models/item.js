const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 500 },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
});

//  URL Virtual
ItemSchema.virtual("url").get(function () {
  return `/${this.category.name}/${this._id}`;
});

module.exports = mongoose("Item", ItemSchema);
