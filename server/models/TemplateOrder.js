const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateOrderSchema = new Schema({
  templates: {
    type: Array,
    default: [],
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
  }
});

module.exports = mongoose.model('TemplateOrder', templateOrderSchema);
