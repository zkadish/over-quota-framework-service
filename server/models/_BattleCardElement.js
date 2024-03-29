const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// NOTE: remove this is not need and not a good path to go down...
// all elements should have a corresponding library 
const battleCardElementSchema = new Schema({
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
  value: {},
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

module.exports = mongoose.model('BattleCardElement', battleCardElementSchema);