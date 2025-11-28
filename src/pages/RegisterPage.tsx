import { authService } from '@/services/authService';
import { AlertCircle, CheckCircle, Lock, Mail, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		confirmPassword?: string;
		general?: string;
	}>({});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

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
		} else if (formData.password.length < 6) {
			newErrors.password = 'Пароль должен быть не менее 6 символов';
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = 'Подтвердите пароль';
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Пароли не совпадают';
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
			await authService.register({
				email: formData.email,
				password: formData.password,
			});

			setSuccess(true);
			setTimeout(() => {
				navigate('/login');
			}, 2000);
		} catch (error: any) {
			const errorMessage = error?.response?.data || error?.message || 'Ошибка регистрации. Попробуйте снова.';

			setErrors({ general: errorMessage });
		} finally {
			setIsSubmitting(false);
		}
	};

	if (success) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-dark-900 px-4'>
				<div className='card max-w-md w-full text-center'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-success-600 rounded-full mb-4'>
						<CheckCircle className='w-8 h-8 text-white' />
					</div>
					<h2 className='text-2xl font-bold text-white mb-2'>Регистрация успешна!</h2>
					<p className='text-gray-400'>Перенаправление на страницу входа...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-dark-900 px-4 py-12'>
			<div className='card max-w-md w-full'>
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4'>
						<UserPlus className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold text-white mb-2'>Регистрация</h1>
					<p className='text-gray-400'>Создайте новый аккаунт</p>
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
								className={`input-field pl-10 ${errors.email ? 'border-danger-500' : ''}`}
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
								className={`input-field pl-10 ${errors.password ? 'border-danger-500' : ''}`}
								placeholder='••••••••'
								disabled={isSubmitting}
							/>
						</div>
						{errors.password && <p className='mt-1 text-sm text-danger-500'>{errors.password}</p>}
					</div>

					<div>
						<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300 mb-2'>
							Подтверждение пароля
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<Lock className='w-5 h-5 text-gray-500' />
							</div>
							<input
								type='password'
								id='confirmPassword'
								name='confirmPassword'
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`input-field pl-10 ${errors.confirmPassword ? 'border-danger-500' : ''}`}
								placeholder='••••••••'
								disabled={isSubmitting}
							/>
						</div>
						{errors.confirmPassword && <p className='mt-1 text-sm text-danger-500'>{errors.confirmPassword}</p>}
					</div>

					<button
						type='submit'
						className='btn-primary w-full flex items-center justify-center gap-2'
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
								<span>Регистрация...</span>
							</>
						) : (
							<>
								<UserPlus className='w-5 h-5' />
								<span>Зарегистрироваться</span>
							</>
						)}
					</button>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-gray-400 text-sm'>
						Уже есть аккаунт?{' '}
						<Link to='/login' className='text-primary-500 hover:text-primary-400 font-medium transition-colors'>
							Войти
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
