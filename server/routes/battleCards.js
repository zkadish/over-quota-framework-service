var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const BattleCard = require('../models/BattleCard');

/* POST create a template */
router.post(
  '/battle-card',
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  body('type').notEmpty(),
  body('talkTracks').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { label } = req.body;
      const exists = await BattleCard.findOne({ label });

      if (exists) {
        res.status(400).json({ error: 'A battleCard with that name already exists.'});
        return;
      }
      
      const battleCard = await BattleCard.create(req.body);
      res.status(200).json(battleCard);
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }

      return res.status(400).json({ errors: error.array() });
    }
  }
);

/* GET battleCards list */
router.get('/battle-cards', async (req, res, next) => {
  console.log('/battle-cards')
  try {
    const battleCards = await BattleCard.find();
    console.log(battleCards);
    res.status(200).json({ battleCards });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;