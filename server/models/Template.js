const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateSchema = new Schema({
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
  label: {
    type: String,
    default: '',
    required: true
  },
  blocks: {
    type: Array,
    default: [],
  },
  system: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Template', templateSchema);
