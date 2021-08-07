const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const elementSchema = new Schema({
  id: {
    type: String,
    default: '',
    unique: true,
    required: true
  },
  corporate_id: {
    type: String,
    default: '',
  },
  account_id: {
    type: String,
    default: '',
    required: true
  },
  container_id: {
    type: String,
    default: '',
    required: true
  },
  label: {
    type: String,
    default: '',
    required: true
  },
  value: {}, // TODO: type cast value to a string, boolean or array of objects
  // TODO: switch battle card talk-tracks to either elements or value
  'talk-tracks': [], // talk-tracks are here for battle cards 
  type: {
    type: String,
    default: '',
    required: true
  },
  system: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Element', elementSchema);