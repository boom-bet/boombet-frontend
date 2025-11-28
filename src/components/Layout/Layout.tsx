import React from 'react';
import { Outlet } from 'react-router-dom';
import { BetSlip } from '../BetSlip/BetSlip';
import { Header } from './Header';

export const Layout: React.FC = () => {
	return (
		<div className='min-h-screen bg-dark-900'>
			<Header />
			<div className='container mx-auto px-4 py-8'>
				<div className='flex gap-6'>
					<main className='flex-1'>
						<Outlet />
					</main>
					<aside className='w-80 hidden lg:block'>
						<BetSlip />
					</aside>
				</div>
			</div>
		</div>
	);
};
