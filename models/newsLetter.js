const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  email:
  {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},
  {
    versionKey: false,
    timestamps: true,
  });

module.exports = mongoose.model("newsletter", newsletterSchema);


