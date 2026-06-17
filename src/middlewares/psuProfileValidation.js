const Joi = require('joi');

const validatePsuProfile = (req, res, next) => {
    const schema = Joi.object({
        dmd_no: Joi.number().integer().required(),
        psu_id: Joi.number().integer().required(),
        Auth_Share_Capital: Joi.number().integer().required(),
        Sub_Share_Capital: Joi.number().integer().required(),
        Paid_Share_Capital: Joi.number().integer().required(),
        Govt_Contri_Amt: Joi.number().precision(2).required(),
        Govt_Contri_Percent: Joi.string().max(255).required(),
        NameOf_Share_Holder: Joi.string().max(255).required(),
        fin_year: Joi.string().max(100).allow(null, ''),
        status: Joi.number().integer().default(1)
    }).unknown(true);

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false, 
            errors: [{ msg: error.details[0].message }] 
        });
    }
    next();
};

module.exports = {
    validatePsuProfile
};
