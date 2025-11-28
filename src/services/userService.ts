import type { User } from '@/types/api';
import { apiService } from './apiService';

class UserService {
	async getCurrentUser(): Promise<User> {
		return await apiService.get<User>('/v1/users/me');
	}

	async getUserBalance(): Promise<number> {
		const user = await this.getCurrentUser();
		return user.balance;
	}

	async updateUser(userData: Partial<User>): Promise<User> {
		return await apiService.put<User>('/v1/users/me', userData);
	}
}

export const userService = new UserService();
