import { useAuthStore } from '@/stores/authStore';
import { LogOut, Trophy, User, Wallet } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
	const { user, isAuthenticated, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<header className='bg-dark-800 border-b border-gray-700'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between h-16'>
					<Link to='/' className='flex items-center gap-2'>
						<Trophy className='w-8 h-8 text-primary-500' />
						<span className='text-2xl font-bold text-white'>BoomBet</span>
					</Link>

					<nav className='flex items-center gap-6'>
						<Link to='/live' className='text-gray-300 hover:text-white transition-colors font-medium'>
							Live
						</Link>
						<Link to='/prematch' className='text-gray-300 hover:text-white transition-colors font-medium'>
							Prematch
						</Link>
						{isAuthenticated && (
							<Link to='/bets' className='text-gray-300 hover:text-white transition-colors font-medium'>
								Мои ставки
							</Link>
						)}
					</nav>

					<div className='flex items-center gap-4'>
						{isAuthenticated && user ? (
							<>
								<div className='flex items-center gap-2 text-white'>
									<Wallet className='w-5 h-5 text-primary-500' />
									<span className='font-semibold'>{user.balance.toFixed(2)} ₽</span>
								</div>
								<Link
									to='/profile'
									className='flex items-center gap-2 text-gray-300 hover:text-white transition-colors'
								>
									<User className='w-5 h-5' />
									<span>{user.email}</span>
								</Link>
								<button
									onClick={handleLogout}
									className='text-gray-300 hover:text-danger-500 transition-colors'
									title='Выход'
								>
									<LogOut className='w-5 h-5' />
								</button>
							</>
						) : (
							<>
								<Link to='/login' className='btn-secondary'>
									Вход
								</Link>
								<Link to='/register' className='btn-primary'>
									Регистрация
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};
