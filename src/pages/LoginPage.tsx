import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { AlertCircle, Lock, LogIn, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { login } = useAuthStore();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		general?: string;
	}>({});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateForm = (): boolean => {
		const newErrors: typeof errors = {};

		if (!formData.email) {
			newErrors.email = 'Email обязателен';
		} else if (!validateEmail(formData.email)) {
			newErrors.email = 'Неверный формат email';
		}

		if (!formData.password) {
			newErrors.password = 'Пароль обязателен';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));

		if (errors[name as keyof typeof errors]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		setErrors({});

		try {
			const response = await authService.login(formData);

			// Сохраняем токен и данные пользователя из ответа
			const userData = {
				userId: response.userId,
				email: response.email,
				balance: response.balance,
				createdAt: response.createdAt,
				status: response.status,
			};

			login(response.token, userData);
			navigate('/');
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message || error?.message || 'Ошибка входа. Проверьте данные и попробуйте снова.';

			setErrors({ general: errorMessage });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-dark-900 px-4 py-12'>
			<div className='card max-w-md w-full'>
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4'>
						<LogIn className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold text-white mb-2'>Добро пожаловать</h1>
					<p className='text-gray-400'>Войдите в свой аккаунт</p>
				</div>

				{errors.general && (
					<div className='mb-6 p-4 bg-danger-900/20 border border-danger-500 rounded-lg flex items-start gap-3'>
						<AlertCircle className='w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5' />
						<p className='text-danger-500 text-sm'>{errors.general}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-2'>
							Email
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<Mail className='w-5 h-5 text-gray-500' />
							</div>
							<input
								type='email'
								id='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								className={`input-field pl-10 ${errors.email ? 'border-danger-500 focus:border-danger-500' : ''}`}
								placeholder='your@email.com'
								disabled={isSubmitting}
							/>
						</div>
						{errors.email && <p className='mt-1 text-sm text-danger-500'>{errors.email}</p>}
					</div>

					<div>
						<label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-2'>
							Пароль
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<Lock className='w-5 h-5 text-gray-500' />
							</div>
							<input
								type='password'
								id='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
								className={`input-field pl-10 ${errors.password ? 'border-danger-500 focus:border-danger-500' : ''}`}
								placeholder='••••••••'
								disabled={isSubmitting}
							/>
						</div>
						{errors.password && <p className='mt-1 text-sm text-danger-500'>{errors.password}</p>}
					</div>

					<button
						type='submit'
						className='btn-primary w-full flex items-center justify-center gap-2'
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
								<span>Вход...</span>
							</>
						) : (
							<>
								<LogIn className='w-5 h-5' />
								<span>Войти</span>
							</>
						)}
					</button>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-gray-400 text-sm'>
						Нет аккаунта?{' '}
						<Link to='/register' className='text-primary-500 hover:text-primary-400 font-medium transition-colors'>
							Зарегистрироваться
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
