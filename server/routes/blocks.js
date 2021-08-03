var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const Block = require('../models/Block');

/* POST create a block */
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

      const { id } = req.body;
      const exists = await Block.findOne({ id });

      if (exists) {
        res.status(400).json({ error: 'A block with that name already exists.'});
        return;
      }

      const body = { ...req.body };
      body.user_account_id = req.headers['user-account-id'];
      
      const block = await Block.create(body);
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

/* PUT update a block */
router.put(
  '/block',
  body('container_id').notEmpty(),
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  body('type').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { id } = req.body;
      const block = await Block.findOne({ id });

      if (!block) {
        res.status(400).json({ error: 'That block doesn\'t exists.'});
        return;
      }

      block.label = req.body.label;
      block.type = req.body.type;
      block.user_account_id = req.headers['user-account-id'];
      
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

/* DELETE remove a block */
router.delete(
  '/block',
  body('id').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { id } = req.body;
      const block = await Block.findOne({ id });
      const deleted = await block.remove();
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

/* GET blocks list */
// router.get('/blocks', async (req, res, next) => {
//   console.log('/blocks')
//   try {
//     const blocks = await Block.find();
//     // console.log(blocks);
//     res.status(200).json({ blocks });
//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * GET templates list by account_id
 */
 router.get('/blocks', async (req, res, next) => {
  console.log('/blocks')
  try {
    const blocks = await Block.find({ account_id: req.headers['user-account-id'] });
    // TODO: sanitize remove mongo _id

    res.status(200).json({ blocks });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST insert multiple blocks
 * used for provisioning the user account
 */
 router.post(
  '/blocks',
  body('blocks').isArray({ min: 1 }),
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { blocks } = req.body;
      const newBlocks = await Block.insertMany(blocks);

      res.status(200).json(newBlocks);
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