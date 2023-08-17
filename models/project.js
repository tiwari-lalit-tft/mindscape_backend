const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: true
  },
  project_members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  userId: {
    type: String,
    required: true
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

module.exports = mongoose.model("Project", projectSchema);
