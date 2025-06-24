"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.login = exports.signup = void 0;
const data_source_1 = require("../database/data-source");
const User_1 = require("../models/User");
const ResetToken_1 = require("../models/ResetToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken_1 = require("../utils/generateToken");
const sendEmail_1 = require("../utils/sendEmail");
const auth_service_1 = require("../service/auth-service");
const { getOne, create, invalidatePreviousTokens, createResetToken, findResetToken } = (0, auth_service_1.authService)();
const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
const tokenRepo = data_source_1.AppDataSource.getRepository(ResetToken_1.ResetToken);
// 1. Signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // const existingUser = await userRepo.findOne({ where: { email } });
        const existingUser = await getOne(email);
        if (existingUser) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await create({ name, email, password: hashedPassword });
        // const user = userRepo.create({ name, email, password: hashedPassword });
        // await userRepo.save(user);
        res.status(201).json({ message: 'User registered successfully', user });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.signup = signup;
// 2. Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // const user = await userRepo.findOne({ where: { email } });
        const user = await getOne(email);
        if (!user) {
            res.status(401).json({ message: 'User not registered' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.json({ message: 'Login successful', user, token });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
// 3. Request Password Reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        // const user = await userRepo.findOne({ where: { email } });
        const user = await getOne(email);
        if (!user) {
            // Respond generically for security
            // res.json({ message: 'If an account exists, a reset link was sent' });
            res.status(401).json({ message: 'User not registered' });
            return;
        }
        // Invalidate previous tokens
        // await tokenRepo.update({ user: { id: user.id }, used: false }, { used: true });
        await invalidatePreviousTokens(user.id);
        // Generate secure token
        const rawToken = (0, generateToken_1.generateResetToken)();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        // const resetToken = tokenRepo.create({
        // 	token: rawToken,
        // 	user,
        // 	expires_at: expires,
        // });
        // await tokenRepo.save(resetToken);
        await createResetToken(user, rawToken, expires);
        await (0, sendEmail_1.sendResetEmail)(user.email, user.name, rawToken);
        res.json({ message: 'If an account exists, a reset link was sent' });
    }
    catch (err) {
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded ✅' : '❌ MISSING');
        console.error('Request reset error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.requestPasswordReset = requestPasswordReset;
// 4. Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        // const resetToken = await tokenRepo.findOne({
        // 	where: { token },
        // 	relations: ['user'],
        // });
        const resetToken = await findResetToken(token);
        if (!resetToken || resetToken.used || resetToken.expires_at < new Date()) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }
        if (!password || password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        resetToken.user.password = hashedPassword;
        await userRepo.save(resetToken.user);
        resetToken.used = true;
        await tokenRepo.save(resetToken);
        res.json({ message: 'Password reset successful. You can now log in.' });
    }
    catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.resetPassword = resetPassword;
