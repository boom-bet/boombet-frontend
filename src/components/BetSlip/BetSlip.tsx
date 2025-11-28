import { betService } from '@/services/betService';
import { useAuthStore } from '@/stores/authStore';
import { useBetSlipStore } from '@/stores/betSlipStore';
import { DollarSign, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const BetSlip: React.FC = () => {
	const { selections, stake, setStake, removeSelection, clearSelections, getTotalOdds, getPotentialPayout } =
		useBetSlipStore();
	const { isAuthenticated, updateUser } = useAuthStore();
	const navigate = useNavigate();
	const [isPlacing, setIsPlacing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handlePlaceBet = async () => {
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}

		if (selections.length === 0) {
			setError('Добавьте хотя бы один исход');
			return;
		}

		if (stake <= 0) {
			setError('Введите корректную сумму ставки');
			return;
		}

		setIsPlacing(true);
		setError(null);

		try {
			const outcomeIds = selections.map(s => s.outcomeId);
			await betService.placeBet({ stakeAmount: stake, outcomeIds });

			setSuccess(true);
			clearSelections();
			setTimeout(() => setSuccess(false), 3000);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Не удалось сделать ставку');
		} finally {
			setIsPlacing(false);
		}
	};

	return (
		<div className='card sticky top-4'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl font-bold text-white'>Купон</h2>
				{selections.length > 0 && (
					<button
						onClick={clearSelections}
						className='text-gray-400 hover:text-danger-500 transition-colors'
						title='Очистить'
					>
						<Trash2 className='w-5 h-5' />
					</button>
				)}
			</div>

			{selections.length === 0 ? (
				<p className='text-gray-500 text-center py-8'>Купон пуст. Выберите исходы для ставки.</p>
			) : (
				<>
					<div className='space-y-3 mb-4'>
						{selections.map(selection => (
							<div key={selection.outcomeId} className='bg-dark-700 rounded-lg p-3 relative'>
								<button
									onClick={() => removeSelection(selection.outcomeId)}
									className='absolute top-2 right-2 text-gray-400 hover:text-danger-500'
								>
									<X className='w-4 h-4' />
								</button>
								<div className='pr-6'>
									<p className='text-sm text-gray-400'>
										{selection.event.teamA} - {selection.event.teamB}
									</p>
									<p className='text-white font-semibold'>{selection.market.name}</p>
									<p className='text-sm text-gray-400'>{selection.outcome.name}</p>
									<p className='text-primary-500 font-bold mt-1'>
										{selection.outcome.currentOdds ? selection.outcome.currentOdds.toFixed(2) : '-'}
									</p>
								</div>
							</div>
						))}
					</div>

					<div className='space-y-4 border-t border-gray-700 pt-4'>
						<div>
							<label className='block text-sm text-gray-400 mb-2'>Сумма ставки (₽)</label>
							<div className='relative'>
								<DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
								<input
									type='number'
									value={stake}
									onChange={e => setStake(Number(e.target.value))}
									className='input-field pl-10'
									min='10'
									step='10'
								/>
							</div>
						</div>

						<div className='bg-dark-700 rounded-lg p-3 space-y-2'>
							<div className='flex justify-between text-sm'>
								<span className='text-gray-400'>Количество исходов:</span>
								<span className='text-white font-semibold'>{selections.length}</span>
							</div>
							<div className='flex justify-between text-sm'>
								<span className='text-gray-400'>Общий коэффициент:</span>
								<span className='text-white font-semibold'>{getTotalOdds().toFixed(2)}</span>
							</div>
							<div className='flex justify-between pt-2 border-t border-gray-600'>
								<span className='text-gray-400'>Возможный выигрыш:</span>
								<span className='text-primary-500 font-bold text-lg'>{getPotentialPayout().toFixed(2)} ₽</span>
							</div>
						</div>

						{error && (
							<div className='bg-danger-900/20 border border-danger-500 rounded-lg p-3'>
								<p className='text-danger-500 text-sm'>{error}</p>
							</div>
						)}

						{success && (
							<div className='bg-success-900/20 border border-success-500 rounded-lg p-3'>
								<p className='text-success-500 text-sm'>Ставка успешно принята!</p>
							</div>
						)}

						<button
							onClick={handlePlaceBet}
							disabled={isPlacing || selections.length === 0}
							className='btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{isPlacing ? 'Обработка...' : 'Сделать ставку'}
						</button>
					</div>
				</>
			)}
		</div>
	);
};
