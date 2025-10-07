import { authService } from '@/services/authService';
import { webSocketService } from '@/services/webSocketService';
import { useAuthStore } from '@/stores/authStore';
import React, { useEffect } from 'react';

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { token, setLoading, login, logout } = useAuthStore();

	useEffect(() => {
		const initAuth = async () => {
			if (token) {
				setLoading(true);
				try {
					// Проверяем валидность токена и получаем данные пользователя
					const isValid = await authService.validateToken();
					if (isValid) {
						const user = await authService.getProfile();
						login(token, user);

						// Подключаемся к WebSocket
						webSocketService.connect();
					} else {
						logout();
					}
				} catch (error) {
					console.error('Auth initialization error:', error);
					logout();
				} finally {
					setLoading(false);
				}
			}
		};

		initAuth();
	}, [token, login, logout, setLoading]);

	// Отключаемся от WebSocket при выходе
	useEffect(() => {
		return () => {
			webSocketService.disconnect();
		};
	}, []);

	return <>{children}</>;
};
