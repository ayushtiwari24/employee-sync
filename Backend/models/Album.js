const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  albumId: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
});

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
