import { userService } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';
import React, { useEffect } from 'react';

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { token, updateUser, logout } = useAuthStore();

	useEffect(() => {
		const loadUser = async () => {
			if (token) {
				try {
					const userData = await userService.getCurrentUser();
					updateUser(userData);
				} catch (error) {
					console.error('Failed to load user:', error);
					logout();
				}
			}
		};

		loadUser();
	}, [token]);

	return <>{children}</>;
};
