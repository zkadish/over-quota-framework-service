var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const Block = require('../models/Block');
const Element = require('../models/Element');

/**
 * POST create an element
 */
router.post(
  '/element',
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

      const exists = await Element.findOne({
        account_id: headers['user-account-id'],
        label: body.label,
       });

      if (exists) {
        res.status(400).json({ error: 'An element with that name already exists.'});
        return;
      }

      // update containing block's element list
      const block = await Block.findOne({ id: body.container_id });
      block.elements = [body.id, ...block.elements];
      const updatedTemplate = await block.save();

      body.account_id = headers['user-account-id'];      
      const element = await Element.create(body);

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

/**
 * PUT update an element
 * Update the name and type of an element
 */
router.put(
  '/element',
  body('container_id').notEmpty(),
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  body('type').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body } = req;
      const element = await Element.findOne({ id: body.id });

      if (!element) {
        res.status(400).json({ error: 'Element doesn\'t exists.'});
        return;
      }
      
      if (body.type === 'talk-track') {
        element.value = body.value;
      }

      element.label = body.label;
      element.type = body.type;

      const updatedElement = await element.save();
      res.status(200).json(updatedElement);
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
 * PUT update element list order
 * This endpoint updates the element list on a block with a new element order
 */
 router.put(
  '/element-order',
  body('elementIds').notEmpty(),
  body('containerId').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body } = req;

      // get the block container
      const block = await Block.findOne({ id: body.containerId });

      if (!block) {
        res.status(400).json({ error: 'That block doesn\'t exists.'});
        return;
      }

      block.elements = body.elementIds;
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
 * DELETE remove a element
 * Removing a block will also remove its id from its template container's block list
 * This endpoint does not remove elements the library instance if the elements is a talk track or battle card
 */
router.delete(
  '/element',
  body('id').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { body } = req;

      const block = await Block.findOne({ id: body.container_id });
      // throw an error if template is not found
      if (!block) {
        res.status(400).json({ error: 'The block could not be retrieved, please contact support.'});
        return;
      }

      // remove the element's id from the container block.element list
      const index = block.elements.findIndex(id => id === body.id);
      block.elements.splice(index, 1);
      const updatedBlock = await block.save();

      const element = await Element.findOne({ id: body.id });
      const deleted = await element.remove();

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

/* GET elements list */
// router.get('/elements', async (req, res, next) => {
//   console.log('/elements')
//   try {
//     const elements = await Element.find();
//     // console.log(elements);
//     res.status(200).json({ elements });
//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * GET templates list by account_id
 */
 router.get('/elements', async (req, res, next) => {
  try {
    const elements = await Element.find({ account_id: req.headers['user-account-id'] });
    // TODO: sanitize remove mongo _id

    res.status(200).json({ elements });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST insert multiple elements
 * used for provisioning the user account
 */
 router.post(
  '/elements',
  body('elements').isArray({ min: 1 }),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { elements } = req.body;
      const newElements = await Element.insertMany(elements);

      res.status(200).json(newElements);
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