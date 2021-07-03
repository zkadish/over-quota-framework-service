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
    const talkTracks = await TalkTrack.find();
    // console.log(talkTracks);
    res.status(200).json({ talkTracks });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;