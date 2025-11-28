import { LoginRequest, RegisterRequest } from '@/types/api';
import { apiService } from './apiService';

interface LoginResponse {
	token: string;
	userId: number;
	email: string;
	balance: number;
	createdAt: string;
	status: string;
}

interface RegisterResponse {
	message: string;
}

class AuthService {
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await apiService.post<LoginResponse>('/auth/login', credentials);
		return response;
	}

	async register(userData: RegisterRequest): Promise<string> {
		const response = await apiService.post<string>('/auth/register', userData);
		return response;
	}

	logout(): void {
		localStorage.removeItem('token');
	}

	getToken(): string | null {
		return localStorage.getItem('token');
	}

	isAuthenticated(): boolean {
		return !!this.getToken();
	}
}

export const authService = new AuthService();
