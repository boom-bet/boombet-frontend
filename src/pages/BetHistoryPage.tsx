import { betService } from '@/services/betService';
import { Bet } from '@/types/api';
import { Clock, TrendingUp, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const BetHistoryPage: React.FC = () => {
	const [bets, setBets] = useState<Bet[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		loadBets();
	}, [page]);

	const loadBets = async () => {
		try {
			setLoading(true);
			const response = await betService.getBetHistory(page, 10);
			setBets(response.content);
			setTotalPages(response.totalPages);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Не удалось загрузить историю');
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'WON':
				return 'text-success-500';
			case 'LOST':
				return 'text-danger-500';
			case 'PENDING':
				return 'text-warning-500';
			default:
				return 'text-gray-400';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'WON':
				return <TrendingUp className='w-5 h-5' />;
			case 'LOST':
				return <X className='w-5 h-5' />;
			case 'PENDING':
				return <Clock className='w-5 h-5' />;
			default:
				return null;
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin' />
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<h1 className='text-3xl font-bold text-white'>История Ставок</h1>

			{error ? (
				<div className='card bg-danger-900/20 border-danger-500'>
					<p className='text-danger-500'>{error}</p>
				</div>
			) : bets.length === 0 ? (
				<div className='card'>
					<p className='text-gray-500 text-center py-8'>У вас пока нет ставок. Сделайте вашу первую ставку!</p>
				</div>
			) : (
				<>
					<div className='space-y-4'>
						{bets.map(bet => (
							<div key={bet.betId} className='card hover:border-primary-600/50 transition-colors'>
								<div className='flex items-center justify-between mb-4'>
									<div className='flex items-center gap-2'>
										<span className={`flex items-center gap-2 ${getStatusColor(bet.status)}`}>
											{getStatusIcon(bet.status)}
											<span className='font-semibold'>{bet.status}</span>
										</span>
									</div>
									<span className='text-gray-400 text-sm'>{new Date(bet.createdAt).toLocaleString('ru-RU')}</span>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div>
										<p className='text-gray-400 text-sm'>Сумма ставки</p>
										<p className='text-white font-semibold'>{bet.stakeAmount.toFixed(2)} ₽</p>
									</div>
									<div>
										<p className='text-gray-400 text-sm'>Коэффициент</p>
										<p className='text-white font-semibold'>{bet.totalOdds.toFixed(2)}</p>
									</div>
									<div>
										<p className='text-gray-400 text-sm'>Возможный выигрыш</p>
										<p className='text-primary-500 font-semibold'>{bet.potentialPayout.toFixed(2)} ₽</p>
									</div>
								</div>
							</div>
						))}
					</div>

					{totalPages > 1 && (
						<div className='flex justify-center gap-2'>
							<button
								onClick={() => setPage(p => Math.max(0, p - 1))}
								disabled={page === 0}
								className='btn-secondary disabled:opacity-50'
							>
								Назад
							</button>
							<span className='text-white px-4 py-2'>
								{page + 1} / {totalPages}
							</span>
							<button
								onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
								disabled={page >= totalPages - 1}
								className='btn-secondary disabled:opacity-50'
							>
								Вперёд
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};
