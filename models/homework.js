const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const HomeworkSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 500 },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  due: { type: Date, required: true },
});

//  URL Virtual
HomeworkSchema.virtual("url").get(function () {
  return `/${this.Homework.name}/${this._id}`;
});

HomeworkSchema.virtual("due_formatted").get(function () {
  return this.due
    ? DateTime.fromJSDate(this.due).toLocaleString(DateTime.DATE_MED)
    : "";
});

module.exports = mongoose.model("Homework", HomeworkSchema);
