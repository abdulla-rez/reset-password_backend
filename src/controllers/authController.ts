import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { ResetToken } from '../models/ResetToken';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateResetToken } from '../utils/generateToken';
import { sendResetEmail } from '../utils/sendEmail';
import { authService } from '../service/auth-service';

const { getOne, create,invalidatePreviousTokens,createResetToken,findResetToken } = authService()
const userRepo = AppDataSource.getRepository(User);
const tokenRepo = AppDataSource.getRepository(ResetToken);

// 1. Signup
export const signup = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, email, password } = req.body;

		// const existingUser = await userRepo.findOne({ where: { email } });
		const existingUser = await getOne(email)

		if (existingUser) {
			res.status(409).json({ message: 'Email already registered' });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await create({ name, email, password: hashedPassword })
		// const user = userRepo.create({ name, email, password: hashedPassword });
		// await userRepo.save(user);

		res.status(201).json({ message: 'User registered successfully', user });
	} catch (err) {
		console.error('Signup error:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

// 2. Login
export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		// const user = await userRepo.findOne({ where: { email } });
		const user = await getOne(email)

		if (!user) {
			res.status(401).json({ message: 'User not registered' });
			return;
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(401).json({ message: 'Invalid email or password' });
			return;
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
			expiresIn: '1d',
		});

		res.json({ message: 'Login successful', user, token });
	} catch (err) {
		console.error('Login error:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

// 3. Request Password Reset
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email } = req.body;

		// const user = await userRepo.findOne({ where: { email } });
		const user= await getOne(email)
		if (!user) {
			// Respond generically for security
			// res.json({ message: 'If an account exists, a reset link was sent' });
			res.status(401).json({ message: 'User not registered' });

			return;
		}

		// Invalidate previous tokens
		// await tokenRepo.update({ user: { id: user.id }, used: false }, { used: true });
		await invalidatePreviousTokens(user.id)


		// Generate secure token
		const rawToken = generateResetToken();
		const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

		// const resetToken = tokenRepo.create({
		// 	token: rawToken,
		// 	user,
		// 	expires_at: expires,
		// });

		// await tokenRepo.save(resetToken);


		await createResetToken(user, rawToken, expires);
		await sendResetEmail(user.email, user.name, rawToken);

		res.json({ message: 'If an account exists, a reset link was sent' });
	} catch (err) {
		console.log('EMAIL_USER:', process.env.EMAIL_USER);
		console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded ✅' : '❌ MISSING');

		console.error('Request reset error:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

// 4. Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
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

		const hashedPassword = await bcrypt.hash(password, 10);
		resetToken.user.password = hashedPassword;
		await userRepo.save(resetToken.user);

		resetToken.used = true;
		await tokenRepo.save(resetToken);

		res.json({ message: 'Password reset successful. You can now log in.' });
	} catch (err) {
		console.error('Reset password error:', err);
		res.status(500).json({ message: 'Server error' });
	}
};
