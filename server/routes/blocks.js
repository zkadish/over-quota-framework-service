var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const Block = require('../models/Block');

/* POST create a template */
router.post(
  '/block',
  body('container_id').notEmpty(),
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  body('type').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { label } = req.body;
      const exists = await Block.findOne({ label });

      if (exists) {
        res.status(400).json({ error: 'A block with that name already exists.'});
        return;
      }
      
      const block = await Block.create(req.body);
      res.status(200).json(block);
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }

      return res.status(400).json({ errors: error.array() });
    }
  }
);

/* GET blocks list */
router.get('/blocks', async (req, res, next) => {
  console.log('/blocks')
  try {
    const blocks = await Block.find();
    console.log(blocks);
    res.status(200).json({ blocks });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;