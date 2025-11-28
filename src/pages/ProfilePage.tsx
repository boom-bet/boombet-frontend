import { userService } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types/api';
import React, { useEffect, useState } from 'react';

export const ProfilePage: React.FC = () => {
	const { user: storeUser, updateUser } = useAuthStore();
	const [user, setUser] = useState<User | null>(storeUser);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadUser = async () => {
			try {
				setLoading(true);
				const userData = await userService.getCurrentUser();
				setUser(userData);
				updateUser(userData);
			} catch (err: any) {
				setError(err?.response?.data?.message || 'Не удалось загрузить профиль');
			} finally {
				setLoading(false);
			}
		};

		loadUser();
	}, []);

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='card bg-danger-900/20 border-danger-500'>
				<p className='text-danger-500'>{error}</p>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<h1 className='text-3xl font-bold text-white'>Профиль</h1>

			<div className='card'>
				<h2 className='text-xl font-semibold text-white mb-4'>Информация о пользователе</h2>
				<div className='space-y-3'>
					<div>
						<span className='text-gray-400'>Email:</span>
						<span className='text-white ml-2'>{user?.email || 'Не указан'}</span>
					</div>
					<div>
						<span className='text-gray-400'>Баланс:</span>
						<span className='text-white ml-2'>{user?.balance.toFixed(2) || 0} ₽</span>
					</div>
					<div>
						<span className='text-gray-400'>Статус:</span>
						<span className='text-success-500 ml-2'>{user?.status || 'ACTIVE'}</span>
					</div>
					<div>
						<span className='text-gray-400'>Дата регистрации:</span>
						<span className='text-white ml-2'>
							{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Н/Д'}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
