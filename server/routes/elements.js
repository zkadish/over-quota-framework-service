var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const Element = require('../models/Element');

/* POST create a template */
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
      
      const element = await Element.create(req.body);
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

/* GET elements list */
router.get('/elements', async (req, res, next) => {
  console.log('/elements')
  try {
    const elements = await Element.find();
    // console.log(elements);
    res.status(200).json({ elements });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;