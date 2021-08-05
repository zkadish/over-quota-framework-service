const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
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
  label: {
    type: String,
    default: '',
    required: true
  },
  elements: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: '',
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
  }
});

module.exports = mongoose.model('Block', blockSchema);