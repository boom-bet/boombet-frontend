import { useAuthStore } from '@/stores/authStore';
import { useBetSlipStore } from '@/stores/betSlipStore';
import { LogOut, ShoppingCart, Trophy, User } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
	const { user, isAuthenticated, logout } = useAuthStore();
	const { betSlip, isOpen, toggleBetSlip } = useBetSlipStore();

	const handleLogout = () => {
		logout();
	};

	return (
		<header className='bg-dark-800 border-b border-dark-700 sticky top-0 z-50'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between h-16'>
					{/* Логотип */}
					<Link to='/' className='flex items-center space-x-2'>
						<Trophy className='h-8 w-8 text-primary-500' />
						<span className='text-xl font-bold text-white'>BoomBet</span>
					</Link>

					{/* Навигация */}
					<nav className='hidden md:flex items-center space-x-6'>
						<Link to='/' className='text-gray-300 hover:text-white transition-colors'>
							Главная
						</Link>
						<Link to='/live' className='text-gray-300 hover:text-white transition-colors'>
							Live
						</Link>
						<Link to='/prematch' className='text-gray-300 hover:text-white transition-colors'>
							Линия
						</Link>
					</nav>

					{/* Правая часть */}
					<div className='flex items-center space-x-4'>
						{isAuthenticated && user ? (
							<>
								{/* Баланс */}
								<div className='text-sm'>
									<span className='text-gray-400'>Баланс:</span>
									<span className='ml-1 font-semibold text-success-500'>{user.balance.toFixed(2)} ₽</span>
								</div>

								{/* Купон ставок */}
								<button
									onClick={toggleBetSlip}
									className={`relative p-2 rounded-lg transition-colors ${
										isOpen ? 'bg-primary-600' : 'bg-dark-700 hover:bg-dark-600'
									}`}
								>
									<ShoppingCart className='h-5 w-5 text-white' />
									{betSlip.selections.length > 0 && (
										<span className='absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
											{betSlip.selections.length}
										</span>
									)}
								</button>

								{/* Меню пользователя */}
								<div className='relative group'>
									<button className='flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-700 transition-colors'>
										<User className='h-5 w-5 text-gray-400' />
										<span className='text-sm text-white hidden sm:inline'>{user.username}</span>
									</button>

									{/* Выпадающее меню */}
									<div className='absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
										<Link
											to='/profile'
											className='block px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors'
										>
											Профиль
										</Link>
										<Link
											to='/bets'
											className='block px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors'
										>
											История ставок
										</Link>
										<div className='border-t border-dark-700'></div>
										<button
											onClick={handleLogout}
											className='w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors flex items-center space-x-2'
										>
											<LogOut className='h-4 w-4' />
											<span>Выйти</span>
										</button>
									</div>
								</div>
							</>
						) : (
							<div className='flex items-center space-x-2'>
								<Link to='/login' className='btn-secondary text-sm'>
									Войти
								</Link>
								<Link to='/register' className='btn-primary text-sm'>
									Регистрация
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};
