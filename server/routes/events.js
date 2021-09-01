var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');

/**
 * 
 */

/**
 * POST create an Event
 */
router.post(
  '/event',
  body('id').notEmpty(),
  // body('frameworkTemplate').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { headers } = req;
      const body = { ...req.body };
      body.account_id = headers['user-account-id'];

      const event = await Event.create(body);

      res.status(200).json(event);
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }

      return res.status(400).json({ errors: error.array() });
    }
  }
);

/**
 * PUT update an event
 */
router.put(
  '/event',
  body('id').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const event = await Event.findOne({ id: req.body.id, account_id: req.headers['user-account-id'] });

      if (!event) {
        res.status(400).json({ error: 'That templateOrder doesn\'t exists.'});
        return;
      }

      event.attendees = req.body.attendees;
      event.frameworkTemplate = req.body.frameworkTemplate;
      
      const updatedEvent = await event.save();
    
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }

      return res.status(400).json({ errors: error.array() });
    }
  }
);

/**
 * GET the last 10 account events for an account
 */
router.get('/events', async (req, res, next) => {
  try {
    const { headers } = req;
  
    const events = await Event.find({ account_id: headers['user-account-id'] });

    res.status(200).json({ events });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST insert multiple events
 * used for dev testing provisioning the user account
 */
 router.post(
  '/events',
  body('events').isArray({ min: 1 }),
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { events } = req.body;
      const newEvents = await Event.insertMany(events);

      res.status(200).json(newEvents);
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }

      return res.status(400).json({ errors: error.array() });
    }
  }
);

module.exports = router;
