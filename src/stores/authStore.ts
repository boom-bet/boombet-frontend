import { User } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

interface AuthActions {
	login: (token: string, user: User) => void;
	logout: () => void;
	updateUser: (user: Partial<User>) => void;
	updateBalance: (balance: number) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
	user: null,
	token: localStorage.getItem('token'),
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

export const useAuthStore = create<AuthStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			login: (token: string, user: User) => {
				localStorage.setItem('token', token);
				set({
					token,
					user,
					isAuthenticated: true,
					error: null,
				});
			},

			logout: () => {
				localStorage.removeItem('token');
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					error: null,
				});
			},

			updateUser: (userData: Partial<User>) => {
				const currentUser = get().user;
				if (currentUser) {
					set({
						user: { ...currentUser, ...userData },
					});
				}
			},

			updateBalance: (balance: number) => {
				const currentUser = get().user;
				if (currentUser) {
					set({
						user: { ...currentUser, balance },
					});
				}
			},

			setLoading: (loading: boolean) => {
				set({ isLoading: loading });
			},

			setError: (error: string | null) => {
				set({ error });
			},

			clearError: () => {
				set({ error: null });
			},
		}),
		{ name: 'auth-store' }
	)
);
