var express = require('express');
var router = express.Router();
// const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const TemplateOrder = require('../models/TemplateOrder');
// const Block = require('../models/Block');
// const Element = require('../models/Element');
// const BattleCardElement = require('../models/BattleCardElement');
// const TalkTrack = require('../models/TalkTrack');
// const BattleCard = require('../models/BattleCard');

/* POST create a template */
router.post(
  '/template-order',
  body('templates').isArray({ min: 0 }),
  body('account_id').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      console.log(req.body);
      if (!errors.isEmpty()) throw errors;

      const { account_id } = req.body;
      const exists = await TemplateOrder.findOne({ account_id });

      if (exists) {
        res.status(400).json({ error: 'A template with that name already exists.'});
        return;
      }
      const body = { ...req.body };
      // const blocks = body.blocks;
      // body.account_id = req.headers['user-account-id'];

      const templateOrder = await TemplateOrder.create(body);
      // for (let i = 0; i < blocks.length; i++) {
      //   blocks[i].account_id = req.headers['user-account-id'];
      //   await Block.create(blocks[i]);
      // }

      res.status(200).json(templateOrder);
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
  '/template-order',
  body('account_id').notEmpty(), // TODO: add custom validation
  // body('label').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { id } = req.body;
      const templateOrder = await TemplateOrder.findOne({ id });

      if (!templateOrder) {
        res.status(400).json({ error: 'That templateOrder doesn\'t exists.'});
        return;
      }
      templateOrder.templates = req.body.templates;
      // template.active = req.body.active;
      template.account_id = req.headers['user-account-id'];
      const updatedTemplateOrder = await templateOrder.save();
    
      res.status(200).json({ templateOrder: updatedTemplateOrder });
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
// router.delete(
//   '/template',
//   body('id').notEmpty(), // TODO: add custom validation
//   async (req, res) => {
//     try {
//       const errors = await validationResult(req);
//       if (!errors.isEmpty()) throw errors;

//       const { id } = req.body;
//       const template = await Template.findOne({ id });
//       const deleted = await template.remove();
//       res.status(200).json({ deleted });
//     } catch (error) {
//       console.log(error);
//       if (typeof error === 'string') {
//         return res.status(400).json({ error });
//       }
//       return res.status(400).json({ errors: error.array() });
//     }
//   }
// );

/* GET templates list */
// TODO: get all templates by account id plus default templates
router.get('/template-order', async (req, res, next) => {
  try {
    const templateOrder = await TemplateOrder.findOne({ account_id: req.headers['user-account-id'] });
    res.status(200).json(templateOrder);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;