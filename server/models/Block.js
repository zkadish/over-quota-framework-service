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
    unique: true,
    required: true
  },
  type: {
    type: String,
    default: '',
    required: true
  }
});

module.exports = mongoose.model('Block', blockSchema);