import React from 'react';

export const HomePage: React.FC = () => {
	return (
		<div className='space-y-6'>
			<h1 className='text-3xl font-bold text-white'>Добро пожаловать в BoomBet</h1>
			<p className='text-gray-400'>
				Лучшая платформа для футбольных ставок с live обновлениями и высокими коэффициентами.
			</p>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='card'>
					<h3 className='text-lg font-semibold text-white mb-2'>Live Матчи</h3>
					<p className='text-gray-400 text-sm'>Смотрите и делайте ставки на матчи в реальном времени</p>
				</div>

				<div className='card'>
					<h3 className='text-lg font-semibold text-white mb-2'>Высокие коэффициенты</h3>
					<p className='text-gray-400 text-sm'>Лучшие коэффициенты на рынке для максимальной прибыли</p>
				</div>

				<div className='card'>
					<h3 className='text-lg font-semibold text-white mb-2'>Быстрые выплаты</h3>
					<p className='text-gray-400 text-sm'>Мгновенные выплаты выигрышей на ваш счет</p>
				</div>
			</div>
		</div>
	);
};
