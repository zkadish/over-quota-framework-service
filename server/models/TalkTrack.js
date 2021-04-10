const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const talkTrackSchema = new Schema({
  id: {
    type: String,
    default: '',
    unique: true,
    required: true
  },
  label: {
    type: String,
    default: '',
    unique: true,
    required: true
  },
  value: {
    type: String,
    default: '',
    unique: true,
    required: true
  },
  type: {
    type: String,
    default: '',
    required: true
  },
  containers: {
    type: Array,
    default: [],
    required: true
  }
});

module.exports = mongoose.model('TalkTrack', talkTrackSchema);
