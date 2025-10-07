import React from 'react';
import { Outlet } from 'react-router-dom';
import { BetSlip } from '../BetSlip/BetSlip';
import { Header } from './Header';

export const Layout: React.FC = () => {
	return (
		<div className='min-h-screen bg-dark-900'>
			<Header />
			<main className='container mx-auto px-4 py-6'>
				<Outlet />
			</main>
			<BetSlip />
		</div>
	);
};
