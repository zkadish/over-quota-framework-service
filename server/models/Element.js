const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const elementSchema = new Schema({
  container_id: {
    type: String,
    default: '',
    required: true
  },
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
  type: {
    type: String,
    default: '',
    required: true
  },
  value: {}
});

module.exports = mongoose.model('Element', elementSchema);