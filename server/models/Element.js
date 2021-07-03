const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const elementSchema = new Schema({
  id: {
    type: String,
    default: '',
    unique: true,
    required: true
  },
  container_id: {
    type: String,
    default: '',
    required: true
  },
  library_id: {
    type: String,
    default: '',
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