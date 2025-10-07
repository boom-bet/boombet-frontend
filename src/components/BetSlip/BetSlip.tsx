import React from 'react';

export const BetSlip: React.FC = () => {
	return (
		<div className='fixed right-4 bottom-4 bg-dark-800 border border-dark-700 rounded-lg p-4 min-w-[300px] shadow-lg'>
			<h3 className='text-lg font-semibold text-white mb-4'>Купон ставок</h3>
			<p className='text-gray-400 text-sm'>Пока что купон пустой</p>
		</div>
	);
};
