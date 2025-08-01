"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validateRequest_1 = require("../middlewares/validateRequest");
const router = (0, express_1.Router)();
router.post('/signup', validateRequest_1.validateRequest, authController_1.signup);
router.post('/login', validateRequest_1.validateRequest, authController_1.login);
router.post('/request-reset', validateRequest_1.validateRequest, authController_1.requestPasswordReset);
router.post('/reset-password/:token', validateRequest_1.validateRequest, authController_1.resetPassword);
exports.default = router;
