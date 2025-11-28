import { User } from '@/types/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

interface AuthActions {
	login: (token: string, user: User) => void;
	logout: () => void;
	updateUser: (user: Partial<User>) => void;
	setToken: (token: string) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
	persist(
		set => ({
			user: null,
			token: null,
			isAuthenticated: false,

			login: (token: string, user: User) => {
				localStorage.setItem('token', token);
				set({
					token,
					user,
					isAuthenticated: true,
				});
			},

			logout: () => {
				localStorage.removeItem('token');
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				});
			},

			updateUser: (userData: Partial<User>) => {
				set(state => ({
					user: state.user ? { ...state.user, ...userData } : null,
				}));
			},

			setToken: (token: string) => {
				localStorage.setItem('token', token);
				set({ token, isAuthenticated: true });
			},
		}),
		{
			name: 'auth-storage',
		}
	)
);
