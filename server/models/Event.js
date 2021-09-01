const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
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
  domain_id: {
    type: String,
    default: '',
    required: true
  },
  status: {
    type: String,
    default: '',
  },
  summary: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  dateObj: {
    type: Date,
  },
  start: {
    type: Object,
    default: {},
    required: true
  },
  end: {
    type: Object,
    default: {},
  },
  attendees: {
    type: Array,
    default: [],
    required: true
  },
  frameworkTemplate: {
    type: Object,
    default: {},
  }
});

module.exports = mongoose.model('Event', EventSchema);
