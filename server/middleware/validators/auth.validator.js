const Joi = require('joi');

exports.createAccountSchema = Joi.object({
  userId: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'Student', 'Faculty').required(),
  phoneNumber: Joi.string().pattern(/^\d{10}$/).required(),
  emailId: Joi.string().email().required()
});