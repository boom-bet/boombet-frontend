import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';
import { apiService } from './apiService';

class AuthService {
	// Вход в систему
	async login(credentials: LoginRequest): Promise<AuthResponse> {
		const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
		return response.data;
	}

	// Регистрация
	async register(userData: RegisterRequest): Promise<AuthResponse> {
		const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/register', userData);
		return response.data;
	}

	// Выход из системы
	async logout(): Promise<void> {
		await apiService.post('/auth/logout');
	}

	// Обновление токена
	async refreshToken(): Promise<AuthResponse> {
		const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/refresh');
		return response.data;
	}

	// Получение информации о пользователе
	async getProfile(): Promise<User> {
		const response = await apiService.get<ApiResponse<User>>('/auth/profile');
		return response.data;
	}

	// Обновление профиля
	async updateProfile(userData: Partial<User>): Promise<User> {
		const response = await apiService.put<ApiResponse<User>>('/auth/profile', userData);
		return response.data;
	}

	// Смена пароля
	async changePassword(oldPassword: string, newPassword: string): Promise<void> {
		await apiService.post('/auth/change-password', {
			oldPassword,
			newPassword,
		});
	}

	// Восстановление пароля
	async forgotPassword(email: string): Promise<void> {
		await apiService.post('/auth/forgot-password', { email });
	}

	// Сброс пароля
	async resetPassword(token: string, newPassword: string): Promise<void> {
		await apiService.post('/auth/reset-password', {
			token,
			newPassword,
		});
	}

	// Проверка валидности токена
	async validateToken(): Promise<boolean> {
		try {
			await apiService.get('/auth/validate');
			return true;
		} catch {
			return false;
		}
	}
}

export const authService = new AuthService();
