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
    unique: true,
    required: true
  },
  type: {
    type: String,
    default: '',
    required: true
  },
  talkTracks: {
    type: Array,
    default: [],
    required: true
  }
});

module.exports = mongoose.model('BattleCard', battleCardSchema);