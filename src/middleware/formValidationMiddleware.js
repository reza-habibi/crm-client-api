const Joi = require("joi");

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
});

const pin = Joi.number().min(1000000).max(9999999).required();
const phone = Joi.number().min(09354535833).max(989354535833).required();
const newPassword = Joi.string().min(3).max(30).required();
const shortStr = Joi.string().min(2).max(100);
const longStr = Joi.string().min(3).max(1000);
const dt = Joi.date();
const resetPassReqValidation = (req, res, next) => {
  const schema = Joi.object({ email });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};
const updatePassValidation = (req, res, next) => {
  const schema = Joi.object({ email, pin, newPassword });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: shortStr.required(),
    company: shortStr.required(),
    address: shortStr.required(),
    phone: phone,
    email: shortStr.required(),
    password: shortStr.required(),
  });

  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }

  next();
};

const createNewTicketValidation = (req, res, next) => {
  const schema = Joi.object({
    subject: shortStr.required(),
    sender: shortStr.required(),
    message: longStr.required(),
    issueDate:dt.required()
  });
  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }

  next();
};

const replyTicketMessageValidation = (req, res, next) => {
  const schema = Joi.object({
    subject: shortStr,
    sender: shortStr.required(),
    message: longStr.required(),
  });
  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }

  next();
};

module.exports = {
  resetPassReqValidation,
  updatePassValidation,
  newUserValidation,
  createNewTicketValidation,
  replyTicketMessageValidation,
};
