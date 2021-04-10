const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateSchema = new Schema({
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
});

module.exports = mongoose.model('Template', templateSchema);
