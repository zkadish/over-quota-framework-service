const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StartDate = new Schema({
  dateTime: {
    type: Date,
  },
  time: {
    type: String, 
    default: ''
  }
})

const EventSchema = new Schema({
  id: {
    type: String,
    default: '',
    // unique: true,
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
  date: {
    type: Date,
  },
  // start: [StartDate],
  // start: {
  //   type: Object,
  //   default: {},
  //   required: true
  // },
  start: {
    dateTime: { type: Date },
    time: { type: String },
    timeZone: { type: String },
  },
  // end: {
  //   type: Object,
  //   default: {},
  // },
  end: {
    dateTime: { type: Date },
    time: { type: String },
    timeZone: { type: String },
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
