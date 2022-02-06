const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const battleCardSchema = new Schema({
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
  library_id: {
    type: String,
    default: '',
    unique: true,
    // required: true
  },
  container_id: {
    type: String,
    default: '',
    // required: true
  },
  label: {
    type: String,
    default: '',
    required: true
  },
  type: {
    type: String,
    default: '',
    required: true
  },
  'talk-tracks': { // TODO: convert this key to elements.. so different elements can be added to battle cards
    type: Array,
    default: [],
  },
  system: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('BattleCard', battleCardSchema);