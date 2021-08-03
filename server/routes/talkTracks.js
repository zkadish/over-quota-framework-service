var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const TalkTrack = require('../models/TalkTrack');

/* POST create a template */
router.post(
  '/talk-track',
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  body('value').notEmpty(), // TODO: add custom validation
  body('type').notEmpty(),
  body('containers').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { label } = req.body;
      const exists = await TalkTrack.findOne({ label });

      if (exists) {
        res.status(400).json({ error: 'A battleCard with that name already exists.'});
        return;
      }
      
      const talkTrack = await TalkTrack.create(req.body);
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
  console.log('/talk-tracks')
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
    console.log(req.body);
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

module.exports = router;