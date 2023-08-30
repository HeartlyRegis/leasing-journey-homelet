const express = require('express');
const { check, param } = require('express-validator');
const validate = require('../middlewares/validate');
const { is_auth } = require('../middlewares/authenticate')

const controller = require('../controllers');

const router = express.Router();

router.get('/:applicant_id/:user_id',
    is_auth,
    [
        check('applicant_id').notEmpty().withMessage('Invalid Applicant Id'),
        check('user_id').optional().notEmpty().withMessage('Invalid User Id')
    ],
    validate,
    controller.getAccessToken
)


module.exports = router;