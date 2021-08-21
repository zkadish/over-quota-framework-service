var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const BattleCard = require('../models/BattleCard');
const Element = require('../models/Element');
const Block = require('../models/Block');

/**
 * POST create a library battle card 
 * This only add a battle card to the battle card library
 */
router.post(
  '/battle-card',
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  body('type').notEmpty(),
  body('talk-tracks').isArray({ min: 0, max: 50 }),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { headers } = req;
      const { body } = req;

      const exists = await BattleCard.findOne({
        account_id: headers['user-account-id'],
        label: body.label,
      });

      if (exists) {
        res.status(400).json({ error: 'A battleCard with that name already exists.'});
        return;
      }

      body.account_id = headers['user-account-id']; 
      const battleCard = await BattleCard.create(body);

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

/**
 * POST add a library battle card to block.elements list and to the elements collection
 * The battle card's id get added to the elements list of the block its getting added to.
 * The battle card gets added to the Element collection and its container is the block its being added to.
 */
 router.post(
  '/add-battle-card',
  body('battleCard').notEmpty(), // TODO: add custom validation
  body('activeBlock').notEmpty(), // TODO: add custom validation
  // body('type').notEmpty(),
  // body('talk-tracks').isArray({ min: 0, max: 50 }),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { headers } = req;
      const { body: { battleCard, activeBlock }, } = req;

      // add the battle card id to the beginning of the containing blocks element list
      const block = await Block.findOne({ id: activeBlock.id, account_id: headers['user-account-id'] });
      block.elements.unshift(battleCard.id);
      block.save();

      // add an instance of the battle card to the Elements collection
      delete battleCard._id;
      battleCard.container_id = activeBlock.id;
      battleCard.account_id = headers['user-account-id'];
      const element = await Element.create(battleCard);

      res.status(200).json(element);
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
    const battleCards = await BattleCard.find({ account_id: req.headers['user-account-id'] });
    // console.log(battleCards);
    res.status(200).json({ battleCards });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST insert multiple battle cards
 * used for provisioning the user account
 */
 router.post(
  '/battle-cards',
  body('battleCards').isArray({ min: 1 }),
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { battleCards } = req.body;
      const newBattleCards = await BattleCard.insertMany(battleCards);

      res.status(200).json(newBattleCards);
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
 * DELETE a battle card from a battle cards block
 * This will not remove the battle card from the library. It will only remove it
 * from the block its being deleted from.
 */
 router.delete(
  '/battle-card',
  body('battleCard').notEmpty(),
  body('activeBlock').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body: { battleCard, activeBlock } } = req;
      const { headers } = req;

      const block = await Block.findOne({ account_id: headers['user-account-id'], id: activeBlock.id });
      const index = block.elements.findIndex(id => id === battleCard.id);
      block.elements.splice(index, 1);

      const updatedBlock = await block.save();

      res.status(200).json(updatedBlock);
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
 * PUT update every instance of a battle card's label
 */
 router.put(
  '/battle-card',
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { headers } = req;
      const { body } = req;

      // find all instances of the battle card across all templates
      // TODO: consider using a reference_id which points back to library instance
      await Element.updateMany(
        { id: body.id, account_id: headers['user-account-id'] },
        { $set: { label: body.label } },
      ).then(updated => {
        console.log(updated);
      });

      const battleCard = await BattleCard.findOne({ id: body.id });
      battleCard.label = body.label;
      const updatedBattleCard = await battleCard.save();

      res.status(200).json({ updatedBattleCard });
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
 * POST create a battle card talk track
 * Adds the id of the talk track to every instance of the containing battle card's talk tracks
 * Adds an instance of the talk track to the talk track library
 */
 router.post(
  '/battle-card',
  body('talkTrack').notEmpty(), // TODO: add custom validation
  body('activeBattleCard').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { headers } = req;
      const { body: { talkTrack, activeBattleCard } } = req;

      // update battle cards
      const battleCards = Element.find({ id: activeBattleCard.id, account_id: headers['user-account-id'] });
      for (let i = 0; i < battleCards.length; i++) {
        battleCards[i]['talk-tracks'].unshift(talkTrack.id);
        await battleCards[i].save();
      }

      res.status(200).json({ battleCards });
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
 * PUT update battle card talk track order
 */
 router.put(
  '/battle-card-talk-track-order',
  body('talkTracks').notEmpty(), // TODO: add custom validation
  body('activeBattleCard').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { headers } = req;
      const { body: { talkTracks, activeBattleCard } } = req;

      // update battle cards
      const battleCards = await Element.find({ id: activeBattleCard.id, account_id: headers['user-account-id'] });
      for (let i = 0; i < battleCards.length; i++) {
        battleCards[i]['talk-tracks'] = talkTracks.map(t => ({ ...t.id }));
        await battleCards[i].save();
      }

      // update the battle card in the battle card library
      const libraryBattleCard = await BattleCard.findOne({ id: activeBattleCard.id, account_id: headers['user-account-id'] });
      libraryBattleCard['talk-tracks'] = talkTracks.map(t => ({ ...t.id }));
      const updatedLibraryBattleCard = await libraryBattleCard.save();

      res.status(200).json({ battleCards, updatedLibraryBattleCard });
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
 * DELETE remove a battle card from the battle card library
 * Removing a block will also remove all instances of the battle card throughout all templates
 */
 router.delete(
  '/library-battle-card',
  body('id').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { headers } = req;
      const { body } = req;

      // find all instances of the battle across all templates
      // TODO: consider using a reference_id which points back to library instance
      await Element.deleteMany({ id: body.id, account_id: headers['user-account-id'] })
        .then(deleted => {
          console.log(deleted);
        });

      // remove the battle card's id in block battle cards element lists
      const battleCards = await Block.find({ account_id: headers['user-account-id'], type: 'battle-cards' });
      const filteredBattleCards = battleCards.filter(b => {
        return b.elements.some(id => id === body.id);
      });
      if (filteredBattleCards.length > 0) {
        const updatedBattleCards = filteredBattleCards.map(b => {
          const index = b.elements.findIndex(id => id === body.id);
          b.elements.splice(index, 1);
          return b;
        });

        for (let i = 0; i < updatedBattleCards.length; i++) {
          await updatedBattleCards[i].save();
        }
      }

      // remove the battle card from the library
      const battleCard = await BattleCard.findOne({ id: body.id });
      const deleted = await battleCard.remove();

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

module.exports = router;