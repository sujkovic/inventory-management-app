const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  department: { type: String, required: true },
  code: { type: String, required: true, min: 100, max: 700 },
  description: { type: String, maxLength: 500 },
});

//  URL Virtual
CourseSchema.virtual("url").get(function () {
  return `/course/${this._id}`;
});

module.exports = mongoose.model("Course", CourseSchema);
