import { AppDataSource } from "../database/data-source";
import { ResetToken } from "../models/ResetToken";
import { User } from "../models/User";

export const authService = () => {

	// Repository
	const userRepo = AppDataSource.getRepository(User);
	const tokenRepo = AppDataSource.getRepository(ResetToken);

	const create = async (data: { name: string, email: string, password: any }) => {

		const user = userRepo.create(data);
		await userRepo.save(user);
		return user

	}


	const getOne = async (email: string) => {
		const existingUser = await userRepo.findOne({ where: { email } });
		return existingUser
	}

	 const invalidatePreviousTokens = async (userId: number) => {
    await tokenRepo.update(
      { user: { id: userId }, used: false },
      { used: true }
    );
  };

  	  const createResetToken = async (user: User, token: string, expires: Date) => {
  		const resetToken = tokenRepo.create({
			token,
			user,
			expires_at: expires,
		});

  return await tokenRepo.save(resetToken);
};

const findResetToken = async (token: string) => {
  return await tokenRepo.findOne({
    where: { token },
    relations: ['user'],
  });
};


	return {
		create, getOne,invalidatePreviousTokens,createResetToken,findResetToken
	}
}