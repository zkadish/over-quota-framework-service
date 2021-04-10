var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

const Template = require('../models/Template');

/* POST create a template */
router.post(
  '/template',
  body('id').notEmpty(), // TODO: add custom validation
  body('label').notEmpty(), // TODO: add custom validation
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const { label } = req.body;
      const exists = await Template.findOne({ label });

      if (exists) {
        res.status(400).json({ error: 'A template with that name already exists.'});
        return;
      }
      
      const template = await Template.create(req.body);
      res.status(200).json(template);
    } catch (error) {
      console.log(error);
      if (typeof error === 'string') {
        return res.status(400).json({ error });
      }

      return res.status(400).json({ errors: error.array() });
    }
  }
);

/* GET templates list */
router.get('/templates', async (req, res, next) => {
  console.log('/templates')
  try {
    const templates = await Template.find();
    console.log(templates);
    res.status(200).json({ templates });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;