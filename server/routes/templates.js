var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

const Template = require('../models/Template');
const TemplateOrder = require('../models/TemplateOrder');
const Block = require('../models/Block');
const Element = require('../models/Element');
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

      const { headers } = req;
      const { body } = req;
      // check if a template with the same name already exists within account
      const exists = await Template.findOne({
        account_id: headers['user-account-id'],
        label: body.label,
      });

      if (exists) {
        res.status(400).json({ error: 'A template with that name already exists.'});
        return;
      }

      // update template order
      const templateOrder = await TemplateOrder.findOne({ account_id: headers['user-account-id'] });
      // throw an error if template order is not found
      if (!templateOrder) {
        res.status(400).json({ error: 'Template order could not be retrieved, contact support.'});
        return;
      }
      // add template id to the top of the list
      templateOrder.templates = [body.id, ...templateOrder.templates];
      templateOrder.save();

      // prepare blocks for update, add account_id from user and template container_id
      const blocks = body.blocks.map(b => {
        const block = { ...b };
        block.account_id = headers['user-account-id'];
        return block;
      });
      // add default blocks created by template
      await Block.insertMany(blocks);

      // sanitize the blocks to their ids and add template to the db
      body.blocks = blocks.map(b => b.id);
      body.account_id = headers['user-account-id'];
      const template = await Template.create(body);

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

/**
 * PUT update a template
 * Update the name of a template
 */
router.put(
  '/template',
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body } = req;
      // const { headers } = req;

      const template = await Template.findOne({ id: body.id });

      if (!template) {
        res.status(400).json({ error: 'That template doesn\'t exists.'});
        return;
      }

      template.label = body.label;
      // template.account_id = headers['user-account-id'];
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

      const { headers } = req;
      const { body } = req;

      // update template order
      const templateOrder = await TemplateOrder.findOne({ account_id: headers['user-account-id'] });
      // throw an error if template order is not found
      if (!templateOrder) {
        res.status(400).json({ error: 'The template order could not be retrieved, please contact support.'});
        return;
      }

      // remove id from template order
      const i = templateOrder._doc.templates.findIndex(id => id === body.id);
      templateOrder._doc.templates.splice(i, 1);
      await templateOrder.save();

      if (body.blocks.length > 0) {
        const blocks = body.blocks.map(b => ({ ...b }));
        // delete the template's blocks elements
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].elements.length > 0) {
            await Element.deleteMany({ container_id: blocks[i].id })
              .then(data => {
                console.log('deleted elements', data)
              });
          }
        }
        // delete the template's blocks
        await Block.deleteMany({ container_id: body.id })
          .then(data => {
            console.log('deleted blocks', data)
          });
      }

      // delete the template // TODO: use deleteOne()?
      const template = await Template.findOne({ id: body.id });
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

    const Blocks = await Block.find({ account_id: req.headers['user-account-id'] });
    const blocks = Blocks.map(b => ({ ...b._doc }));

    const Elements = await Element.find({ account_id: req.headers['user-account-id'] });
    const elements = Elements.map(b => ({ ...b._doc }));

    const BattleCards = await BattleCard.find({ account_id: req.headers['user-account-id'] });
    const battleCards = BattleCards.map(b => ({ ...b._doc }));

    const TalkTracks = await TalkTrack.find({ account_id: req.headers['user-account-id'] });
    const talkTracks = TalkTracks.map(b => ({ ...b._doc }));


    for (const template of templates) {
      const orderedBlocks = template.blocks.map(b => {
        const block = blocks.find(bl => bl.id === b);
        return block;
      })
      template.blocks = orderedBlocks;
    
      for (const block of template.blocks) {
        // if (!block) return;
        const orderedElements = block.elements.map(e => {
          const element = elements.find(ele => ele.id === e);
          return element;
        })
        block.elements = orderedElements;

        // if (block.elements.length === 0) return;
        for (let element of block.elements) {
          if (element && element.type === 'battle-card') {
            const battleCard = battleCards.find(b => b.id === element.id);
            const orderedTalkTracks = battleCard['talk-tracks'].map(t => {
              const talkTrack = talkTracks.find(tt => tt.id === t);
              return talkTrack;
            });
            element['talk-tracks'] = orderedTalkTracks;
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
