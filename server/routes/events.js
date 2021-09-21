var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const TemplateOrder = require('../models/TemplateOrder');
const Template = require('../models/Template');
const Block = require('../models/Block');
const Element = require('../models/Element');
const { uuid } = require('../utils/data');

/**
 * POST create an Event
 * combines a calendar event with template
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
 * POST creates a template from an assigned/edited call event
 */
 router.post(
  '/event-template',
  body('id').notEmpty(),
  // body('frameworkTemplate').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body, headers } = req;

      // Add the templates id to the accounts TemplateOrder
      const templateOrder = await TemplateOrder.findOne({ account_id: headers['user-account-id'] });
      templateOrder.templates.unshift(body.id);
      const newTemplateOrder = await templateOrder.save();

      // NOTE: block and element ids have already been changed they need to stay the same 
      // here so that the order lists and block and elements them selves have the same ids

      // create the template
      const template = {
        id: body.id,
        account_id: headers['user-account-id'],
        label: body.label,
        blocks: body.blocks.map(b => b.id),
        system: false,
      };

      const newTemplate = await Template.create(template);

      // create the blocks
      const blocks = body.blocks.map(b => {
        const block = { ...b };
        // block.id = uuid();
        block.account_id = headers['user-account-id'];
        block.container_id = body.id;
        block.elements = block.elements.map(e => e.id);
        block.system = false;
        return block;
      });

      const newBlocks = await Block.insertMany(blocks);

      // create the elements
      let elements = []
      for (let i = 0; i < body.blocks.length; i++) {
        if (body.blocks[i].elements.length > 0) {
          const updated = body.blocks[i].elements.map(e => {
            const element = { ...e };
            // element.id = uuid();
            element.account_id = headers['user-account-id'];
            element.container_id = body.blocks[i].id;
            if (element.type === 'talk-track') {
              return element;
            }
            if (element.type === 'battle-card') {
              element['talk-tracks'] = e['talk-tracks'].map(t => {
                const talkTrack = { ...t };
                talkTrack.account_id = headers['user-account-id'];
                talkTrack.container_id = element.id;
                return talkTrack;
              });
              return element;
            }
            element.system = false;
            return element;
          }).filter(e => !e.email);
          elements = [...elements, ...updated];
        }
      }

      const newElements = await Element.insertMany(elements);

      res.status(200);
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

      const { body, headers } = req;

      const event = await Event.findOne({ id: body.id, account_id: headers['user-account-id'] });

      if (!event) {
        res.status(400).json({ error: 'That templateOrder doesn\'t exists.'});
        return;
      }

      // event.attendees = body.attendees;
      event.frameworkTemplate = body.frameworkTemplate;
      
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
