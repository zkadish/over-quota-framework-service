var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const Template = require('../models/Template');
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

      const { label } = req.body;
      const exists = await Template.findOne({ label });

      if (exists) {
        res.status(400).json({ error: 'A template with that name already exists.'});
        return;
      }
      
      const template = await Template.create(req.body);
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

/* GET templates list */
router.get('/templates', async (req, res, next) => {
  console.log('/templatesz')
  try {
    const Templates = await Template.find();
    const templates = Templates.map(t => ({ ...t._doc }));

    for (const template of templates) {
      const Blocks = await Block.find({ container_id: template.id });
      const blocks = Blocks.map(b => ({ ...b._doc }));
      template.blocks = blocks;
    
      for (const block of template.blocks) {
        const Elements = await Element.find({ container_id: block.id });
        const elements = Elements.map(b => ({ ...b._doc }));

        // const elementBattleCard = elements.find(e => e.type === 'battle-cards');
        // if (elementBattleCard) {
        //   const value = [];
        //   for (const battleCardId of elementBattleCard.value) {
        //     const Card = await BattleCard.findOne({ id: battleCardId });
        //     const battleCard = { ...Card._doc };
        //     console.log(battleCard)
        //     const talkTracks = [];
        //     for (const talkTrackId of battleCard['talk-tracks']) {
        //       const talkTrack = await TalkTrack.findOne({ id: talkTrackId })
        //       talkTracks.push(talkTrack);
        //     }

        //     battleCard['talk-tracks'] = talkTracks;
        //     value.push(battleCard);
        //   }

        //   elementBattleCard.value = value;
        // }

        block.elements = elements;
      }
    }
    res.status(200).json({ templates });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;