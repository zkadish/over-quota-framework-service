var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const Element = require('../models/Element');

/* POST create an element */
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

      const { label } = req.body;
      const exists = await Element.findOne({ label });

      if (exists) {
        res.status(400).json({ error: 'An element with that name already exists.'});
        return;
      }
      
      const body = { ...req.body };
      body.user_account_id = req.headers['user-account-id'];

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

/* PUT update an element */
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

      const { id } = req.body;
      const element = await Element.findOne({ id });

      if (!element) {
        res.status(400).json({ error: 'Element doesn\'t exists.'});
        return;
      }
      
      if (req.body.type === 'talk-track') {
        element.value = req.body.value;
      }

      element.label = req.body.label;
      element.type = req.body.type;
      element.user_account_id = req.headers['user-account-id'];

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

/* DELETE remove a element */
router.delete(
  '/element',
  body('id').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { id } = req.body;
      const element = await Element.findOne({ id });
      const deleted = await Element.remove();
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
  console.log('/elements')
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
    console.log(req.body);
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