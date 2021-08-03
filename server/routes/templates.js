var express = require('express');
var router = express.Router();
// const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const Template = require('../models/Template');
const Block = require('../models/Block');
const Element = require('../models/Element');
const BattleCardElement = require('../models/BattleCardElement');
const TalkTrack = require('../models/TalkTrack');
const BattleCard = require('../models/BattleCard');

/* POST create a template */
router.post(
  '/template',
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { label } = req.body;
      const exists = await Template.findOne({ label });

      if (exists) {
        res.status(400).json({ error: 'A template with that name already exists.'});
        return;
      }
      const body = { ...req.body };
      const blocks = body.blocks;
      body.account_id = req.headers['user-account-id'];

      const template = await Template.create(body);
      for (let i = 0; i < blocks.length; i++) {
        blocks[i].account_id = req.headers['user-account-id'];
        await Block.create(blocks[i]);
      }

      res.status(200).json(template);
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }

      return res.status(400).json({ errors: error.array() });
    }
  }
);

/* PUT update a template */
router.put(
  '/template',
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { id } = req.body;
      const template = await Template.findOne({ id });

      if (!template) {
        res.status(400).json({ error: 'That template doesn\'t exists.'});
        return;
      }
      template.label = req.body.label;
      // template.active = req.body.active;
      template.account_id = req.headers['user-account-id'];
      const updatedTemplate = await template.save();
    
      res.status(200).json({ template: updatedTemplate });
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }

      return res.status(400).json({ errors: error.array() });
    }
  }
);

/* DELETE remove a template */
router.delete(
  '/template',
  body('id').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { id } = req.body;
      const template = await Template.findOne({ id });
      const deleted = await template.remove();
      res.status(200).json({ deleted });
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
 * GET templates list by account_id
 */
router.get('/templates', async (req, res, next) => {
  console.log('/templates')
  try {
    const templates = await Template.find({ account_id: req.headers['user-account-id'] });
    // TODO: sanitize remove mongo _id

    res.status(200).json({ templates });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET build templates list by account_id
 * fetches and builds the client side template.
 */
router.get('/build-templates', async (req, res, next) => {
  console.log('/build-templates')
  try {
    const Templates = await Template.find({ account_id: req.headers['user-account-id'] });
    const templates = Templates.map(t => ({ ...t._doc }));

    for (const template of templates) {
      const Blocks = await Block.find({ container_id: template.id });
      const blocks = Blocks.map(b => ({ ...b._doc }));
      const orderedBlocks = template.blocks.map(b => {
        const block = blocks.find(bl => bl.id === b);
        return block;
      })
      template.blocks = orderedBlocks;
    
      for (const block of template.blocks) {
        const Elements = await Element.find({ container_id: block.id });
        const elements = Elements.map(b => ({ ...b._doc }));
        block.elements = elements;

        for (const element of block.elements) {
          if (element.type === 'battle-card') {
            const BattleCardElements = await BattleCardElement.find({ container_id: element.id });
            const battleCardElements = BattleCardElements.map(b => ({ ...b._doc }));
            element['talk-tracks'] = battleCardElements;
          }
        }
      }
    }
    res.status(200).json({ templates });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST insert multiple templates
 * used for provisioning the user account
 */
router.post(
  '/templates',
  body('templates').isArray({ min: 1 }),
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { templates } = req.body;
      const newTemplates = await Template.insertMany(templates);

      res.status(200).json(newTemplates);
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