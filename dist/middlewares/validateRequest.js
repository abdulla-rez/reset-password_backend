"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (req, res, next) => {
    const { email, password } = req.body;
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
    }
    if (password && password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
        return;
    }
    next();
};
exports.validateRequest = validateRequest;
