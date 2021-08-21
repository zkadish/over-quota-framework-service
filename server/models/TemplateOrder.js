const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateOrderSchema = new Schema({
  id: {
    type: String,
    default: '',
    unique: true,
    required: true
  },
  corporate_id: {
    type: String,
    // must be unique, undefined or null
    index: {
      unique: true,
      partialFilterExpression: { corporate_id: { $type: "string" } },
    },
  },
  account_id: {
    type: String,
    default: '',
    required: true,
    unique: true,
  },
  templates: {
    type: Array,
    default: [],
  },
  system: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('TemplateOrder', templateOrderSchema);
