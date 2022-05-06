const Joi = require("joi");

// #################################################
//   USER
// #################################################

const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(256).required().email(),
        password: Joi.string().min(6).max(1024).required(),
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(256).required().email(),
        password: Joi.string().min(6).max(1024).required(),
    });

    return schema.validate(data);
};

const changeEmailValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(256).required().email(),
        password: Joi.string().min(6).max(1024).required(),
    });

    return schema.validate(data);
};

const changePasswordValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string().min(6).max(1024).required(),
        newPassword: Joi.string().min(6).max(1024).required(),
    });

    return schema.validate(data);
};

const deleteAccountValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string().min(6).max(1024).required(),
    });

    return schema.validate(data);
};

// #################################################
//   BOOK
// #################################################

const changeStatusValidation = (data) => {
    const schema = Joi.object({
        bookId: Joi.string().min(6).max(1024).required(),
        status: Joi.string().valid("finished", "wantToRead", "reading", "remove"),
    });

    return schema.validate(data);
};

const changeScoreValidation = (data) => {
    const schema = Joi.object({
        bookId: Joi.string().min(6).max(1024).required(),
        score: Joi.number().min(0).max(5).required(),
    });

    return schema.validate(data);
};

const changeFinishDateValidation = (data) => {
    const schema = Joi.object({
        bookId: Joi.string().min(6).max(1024).required(),
        month: Joi.number().min(0).max(11).required(),
        year: Joi.number().min(1900).required(),
    });

    return schema.validate(data);
};

// USER
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.changeEmailValidation = changeEmailValidation;
module.exports.changePasswordValidation = changePasswordValidation;
module.exports.deleteAccountValidation = deleteAccountValidation;

// BOOK
module.exports.changeStatusValidation = changeStatusValidation;
module.exports.changeScoreValidation = changeScoreValidation;
module.exports.changeFinishDateValidation = changeFinishDateValidation;
