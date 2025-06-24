"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const data_source_1 = require("../database/data-source");
const ResetToken_1 = require("../models/ResetToken");
const User_1 = require("../models/User");
const authService = () => {
    // Repository
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const tokenRepo = data_source_1.AppDataSource.getRepository(ResetToken_1.ResetToken);
    const create = async (data) => {
        const user = userRepo.create(data);
        await userRepo.save(user);
        return user;
    };
    const getOne = async (email) => {
        const existingUser = await userRepo.findOne({ where: { email } });
        return existingUser;
    };
    const invalidatePreviousTokens = async (userId) => {
        await tokenRepo.update({ user: { id: userId }, used: false }, { used: true });
    };
    const createResetToken = async (user, token, expires) => {
        const resetToken = tokenRepo.create({
            token,
            user,
            expires_at: expires,
        });
        return await tokenRepo.save(resetToken);
    };
    const findResetToken = async (token) => {
        return await tokenRepo.findOne({
            where: { token },
            relations: ['user'],
        });
    };
    return {
        create, getOne, invalidatePreviousTokens, createResetToken, findResetToken
    };
};
exports.authService = authService;
