var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const TalkTrack = require('../models/TalkTrack');
const Element = require('../models/Element');
const Block = require('../models/Block');
const BattleCard = require('../models/BattleCard');

/**
 * POST create a talk track
 */
router.post(
  '/talk-track',
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  body('value').notEmpty(), // TODO: add custom validation
  body('type').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body, headers } = req;

      const exists = await TalkTrack.findOne({
        account_id: headers['user-account-id'],
        label: body.label,
      });

      if (exists) {
        res.status(400).json({ error: 'A talk track with that name already exists.'});
        return;
      }

      body.account_id = headers['user-account-id']; 
      const talkTrack = await TalkTrack.create(body);

      res.status(200).json(talkTrack);
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
 * POST add a library talk track to block.elements list and to the elements collection.
 * Talk tracks can be added to battle cards or to blocks.
 * The talk track's id gets added to the elements list of the battle card or block its getting added to.
 * The talk track gets added to the Element collection and its container_id is the if of the battle card
 * or block its being added to.
 */
 router.post(
  '/add-talk-track',
  body('talkTrack').notEmpty(), // TODO: add custom validation
  body('activeContainer').notEmpty(), // TODO: add custom validation
  // body('type').notEmpty(),
  // body('talk-tracks').isArray({ min: 0, max: 50 }),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { headers } = req;
      const { body: { talkTrack, activeContainer }, } = req;

      // add the talk track id to the beginning of the containing battle card talk tracks list
      if (activeContainer.type === 'battle-card') {
        // battle card library
        const battleCard = await BattleCard.findOne({ library_id: activeContainer.library_id, account_id: headers['user-account-id'] });
        battleCard['talk-tracks'].push(talkTrack.id);
        await battleCard.save();

        // battle card elements
        const battleCards = await Element.find({ library_id: activeContainer.library_id, account_id: headers['user-account-id'] });
        for (let i = 0; i < battleCards.length; i++) {
          battleCards[i]['talk-tracks'].unshift(talkTrack.id);
          await battleCards[i].save();
        }
      }

      // add the battle card id to the beginning of the containing blocks element list
      // add the talk track to the elements collection
      if (activeContainer.type !== 'battle-card') {
        const block = await Block.findOne({ library_id: activeContainer.library_id, account_id: headers['user-account-id'] });
        block.elements.unshift(talkTrack.id);
        block.save();
      }

      // sanitize, update add an instance of the battle card to the Elements collection
      // delete talkTrack._id;
      // talkTrack.container_id = activeContainer.id;
      // talkTrack.account_id = headers['user-account-id'];
      // const element = await Element.create(talkTrack);

      res.status(200).json(talkTrack);
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }

      return res.status(400).json({ errors: error.array() });
    }
  }
);

/* GET talkTracks list */
router.get('/talk-tracks', async (req, res, next) => {
  try {
    const talkTracks = await TalkTrack.find({ account_id: req.headers['user-account-id'] });
    // TODO: sanitize remove mongo _id

    res.status(200).json({ talkTracks });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST insert multiple talk tracks
 * used for provisioning the user account
 */
 router.post(
  '/talk-tracks',
  body('talkTracks').isArray({ min: 1 }),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { talkTracks } = req.body;
      const newTalkTracks = await TalkTrack.insertMany(talkTracks);

      res.status(200).json(newTalkTracks);
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
 * PUT - Update a talk track from a battle cards or block
 * This will update every instance of the talk track.
 */
 router.put(
  '/talk-track',
  body('talkTrack').notEmpty(),
  // body('activeContainer').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body: { talkTrack } } = req;
      const { headers } = req;

      // update talk track in talk track library
      const libraryTalkTrack = await TalkTrack.findOne({ library_id: talkTrack.library_id, account_id: headers['user-account-id'] });
      libraryTalkTrack.label = talkTrack.label;
      libraryTalkTrack.value = talkTrack.value;
      await libraryTalkTrack.save();

      // Update talk track in elements collection that is not a battle card.
      // Talk tracks in battle cards do not get updated as they are tracked via their library ids
      // const talkTracks = await Element.find({ id: talkTrack.container_id, account_id: headers['user-account-id'] });
      const talkTracks = await Element.find({ library_id: talkTrack.library_id, account_id: headers['user-account-id'] });
      for (let i = 0; i < talkTracks.length; i++) {
        if (talkTracks[i].type === 'talk-track') {
          talkTracks[i].label = talkTrack.label;
          talkTracks[i].value = talkTrack.value;
          await talkTracks[i].save();
        }
      }
      
      res.status(200).json({ libraryTalkTrack, talkTracks });
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
 * DELETE a talk track from a battle cards or block
 * This will not remove the talk track from the talk track library. 
 * It will remove the talk track from every battle card, and or,
 * every block its being deleted from.
 */
 router.delete(
  '/talk-track',
  body('talkTrack').notEmpty(),
  body('activeContainer').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body: { talkTrack, activeContainer }, headers } = req;

      // if the talk track is being deleted from a battle card in the battle card library
      const battleCard = await BattleCard.findOne({ 'talk-tracks': talkTrack.id, account_id: headers['user-account-id'] });

      // if the talk track is being deleted from a battle card element
      const BattleCardElements = await Element.find({ type: 'battle-card', 'talk-tracks': talkTrack.id, account_id: headers['user-account-id'] });

      // if the talk track is being deleted from a block
      const block = await Block.findOne({ id: talkTrack.container_id, account_id: headers['user-account-id'] });

      if (battleCard) {
        battleCard['talk-tracks'] = battleCard['talk-tracks'].filter(id => id !== talkTrack.id);
        const updatedBattleCard = await battleCard.save();
      }

      if (BattleCardElements.length > 0) {
        // remove the talk track from the battle card elements 
        for (let i = 0; i < BattleCardElements.length; i++) {
          BattleCardElements[i]['talk-tracks'] = BattleCardElements[i]['talk-tracks'].filter(id => id !== talkTrack.id);
          await BattleCardElements[i].save();
        }

        // // TODO: get ids from battleCards and remove duplicates
        // // remove the talk track from battle cards in the battle card library
        // let battleCardIds = battleCards.map(b => b.id);
        // const setBattleCardIds = new Set(battleCardIds);
        // battleCardIds = Array.from(setBattleCardIds);
        // for (let i = 0; i < battleCardIds.length; i++) {
        //   const libraryBattleCard = await BattleCard.findOne({ id: battleCardIds[i] });
        //   const index = libraryBattleCard['talk-tracks'].findIndex(id => id === talkTrack.id);
        //   if (index >= 0) {
        //     libraryBattleCard['talk-tracks'].splice(index, 1);
        //     await libraryBattleCard.save();
        //   }
        // }
      }

      if (block) {
        // delete the element from the elements collection
        const element = await Element.findOne({ id: talkTrack.id });
        const deletedElement = await deleted.remove();
        // delete the element id from its block container
        block.elements = block.elements.filter(id => id !== talkTrack.id);
        const updatedBlock = await block.save();
      }
      
      res.status(200).json('The talk track was successfully deleted.');
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
 * DELETE remove a talk track from the talk track library
 * Removing a talk track from the talk track library will also remove
 * all instances of the talk track throughout all templates.
 */
 router.delete(
  '/library-talk-track',
  body('id').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body, headers } = req;

      // find all instances of the talk track across all templates and delete them
      // TODO: consider using a reference_id which points back to library instance
      // remove all talk tracks from the Elements collection
      // const deletedElements = await Element.deleteMany({ id: body.id, account_id: headers['user-account-id'] });
      const deletedElements = await Element.deleteMany({ library_id: body.library_id, account_id: headers['user-account-id'] });

      // remove all talk track ids from battle cards in the Elements collection
      const battleCards = await Element.find({ 'talk-tracks': body.id, type: 'battle-card', account_id: headers['user-account-id'] });
      if (battleCards.length > 0) {
        for (let i = 0; i < battleCards.length; i++) {
          const index = battleCards[i]['talk-tracks'].findIndex(id => id === body.id);
          battleCards[i]['talk-tracks'].splice(index, 1);
          await battleCards[i].save();
        }
      }

      // remove the talk track id from battle cards in the battle card library
      const libraryBattleCards = await BattleCard.find({ 'talk-tracks': body.id, account_id: headers['user-account-id'] });
      for (let i = 0; i < libraryBattleCards.length; i++) {
        const index = libraryBattleCards[i]['talk-tracks'].findIndex(id => id === body.id);
        if (index >= 0) {
          libraryBattleCards[i]['talk-tracks'].splice(index, 1);
          await libraryBattleCards[i].save();
        }
      }

      // remove the talk track from the library
      const talkTrack = await TalkTrack.findOne({ id: body.id });
      const deleted = await talkTrack.remove();

      res.status(200).json({ deleted });
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }
      return res.status(400).json({ errors: error.array() });
    }
  }
 )

module.exports = router;
