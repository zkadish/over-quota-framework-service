var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const TemplateOrder = require('../models/TemplateOrder');

/**
 * The template order endpoints are used to track and update the order of templates.
 * when a user drags and drops templates to change the order of appearance in the interface.
 * 
 * TODO: add more validation via express-validator to the endpoints.
 */

/**
 * POST create a template order
 * This endpoint is only used during provisioning a user
 * Each user only has one template order
 */
router.post(
  '/template-order',
  body('templates').isArray({ min: 0 }),
  body('account_id').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const exists = await TemplateOrder.findOne({ account_id: req.headers['user-account-id'] });

      if (exists) {
        res.status(400).json({ error: 'A template order already exists, please contact support.'});
        return;
      }

      const body = { ...req.body };
      body.corporate_id = null;
      const templateOrder = await TemplateOrder.create(body);

      res.status(200).json(templateOrder);
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
 * PUT update account template order
 */
router.put(
  '/template-order',
  body('templateIds').notEmpty(),
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) throw errors;

      const templateOrder = await TemplateOrder.findOne({ account_id: req.headers['user-account-id'] });

      if (!templateOrder) {
        res.status(400).json({ error: 'That templateOrder doesn\'t exists.'});
        return;
      }

      templateOrder.templates = req.body.templateIds;
      const updatedTemplateOrder = await templateOrder.save();
    
      res.status(200).json({ templateOrder: updatedTemplateOrder });
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
 * GET template order for an account
 * This endpoint is call when a user first logs in and is used when the client side templates get built
 */
router.get('/template-order', async (req, res, next) => {
  try {
    const templateOrder = await TemplateOrder.findOne({ account_id: req.headers['user-account-id'] });
    res.status(200).json(templateOrder);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
