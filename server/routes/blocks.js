var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

const Template = require('../models/Template');
const Block = require('../models/Block');

/**
 * POST create a block
 * Creating a block will also insert the block is into the its template container's block list
 */
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

      const { headers } = req;
      const { body } = req;

      const exists = await Block.findOne({
        account_id: headers['user-account-id'],
        label: body.label,
      });

      if (exists) {
        res.status(400).json({ error: 'A block with that name already exists.'});
        return;
      }

      // update containing template's block list
      const template = await Template.findOne({ id: body.container_id });
      const block1 = await Block.findOne({ id: template.blocks[0] });
      const block2 = await Block.findOne({ id: template.blocks[1] });

      // If the user hasn't messed with the order of default blocks then insert mew blocks under the attendees block.
      // This follows the pattern set in the builder.js reducer line 164 in switch `case actionTypes.SET_BLOCK`.
      if (
        template.blocks.length >=2 &&
        block1.type === 'pre-call' &&
        block2.type === 'attendees'
      ) {
        template.blocks.splice(2, 0, body.id);
      } else {
        template.blocks = [body.id, ...template.blocks];
      }
      const updatedTemplate = await template.save();

      body.account_id = req.headers['user-account-id'];      
      const block = await Block.create(body);

      res.status(200).json({ block });
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
 * PUT update a block
 * Update the name and type of a block
 */
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

      const { body } = req;

      const block = await Block.findOne({ id: body.id });

      if (!block) {
        res.status(400).json({ error: 'That block doesn\'t exists.'});
        return;
      }

      block.label = body.label;
      block.type = body.type;
      
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
 * PUT update block list order
 * This endpoint updates the block list on a template with a new block order
 */
 router.put(
  '/block-order',
  body('blockIds').notEmpty(),
  body('containerId').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body } = req;

      // get the template container
      const template = await Template.findOne({ id: body.containerId });

      if (!template) {
        res.status(400).json({ error: 'That template doesn\'t exists.'});
        return;
      }

      template.blocks = body.blockIds;
      const updatedTemplate = await template.save();

      res.status(200).json(updatedTemplate);
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
 * DELETE remove a block
 * Removing a block will also remove its id from its template container's block list
 * This endpoint also removes the elements entries which where created inside of the block
 */
router.delete(
  '/block',
  body('id').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body } = req;

      const template = await Template.findOne({ id: body.container_id });
      // throw an error if template is not found
      if (!template) {
        res.status(400).json({ error: 'The template could not be retrieved, please contact support.'});
        return;
      }

      // remove the block's id from the container template.block list
      const index = template.blocks.findIndex(id => id === body.id);
      template.blocks.splice(index, 1);
      await template.save();

      // remove the blocks elements
      if (body.elements.length > 0) {
        for (let i = 0; i < body.elements.length; i++) {
          await Element.deleteMany({ container_id: body.id })
            .then(deleted => {
              console.log(deleted)
            });
        }
      }

      const block = await Block.findOne({ id: body.id });
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