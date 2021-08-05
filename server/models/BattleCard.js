const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const battleCardSchema = new Schema({
  id: {
    type: String,
    default: '',
    unique: true,
    required: true
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
  'talk-tracks': {
    type: Array,
    default: [],
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

module.exports = mongoose.model('BattleCard', battleCardSchema);