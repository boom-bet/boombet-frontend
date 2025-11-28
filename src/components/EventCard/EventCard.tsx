import { eventService } from '@/services/eventService';
import { useBetSlipStore } from '@/stores/betSlipStore';
import { Event, Market } from '@/types/api';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface EventCardProps {
	event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
	const [expanded, setExpanded] = useState(false);
	const [markets, setMarkets] = useState<Market[]>([]);
	const [loading, setLoading] = useState(false);
	const { selections, addSelection, removeSelection } = useBetSlipStore();

	useEffect(() => {
		if (expanded && markets.length === 0) {
			loadMarkets();
		}
	}, [expanded]);

	const loadMarkets = async () => {
		setLoading(true);
		try {
			const data = await eventService.getMarketsForEvent(event.eventId);
			setMarkets(data);
		} catch (error) {
			console.error('Failed to load markets:', error);
		} finally {
			setLoading(false);
		}
	};

	const isOutcomeSelected = (outcomeId: number) => {
		return selections.some(s => s.outcomeId === outcomeId);
	};

	const handleOutcomeClick = (market: Market, outcomeId: number) => {
		const outcome = market.outcomes.find(o => o.outcomeId === outcomeId);
		if (!outcome || !outcome.isActive) return;

		if (isOutcomeSelected(outcomeId)) {
			removeSelection(outcomeId);
		} else {
			addSelection({
				outcomeId,
				eventId: event.eventId,
				event,
				outcome,
				market,
			});
		}
	};

	return (
		<div className='card hover:border-primary-600/50 transition-colors'>
			<div className='flex items-center justify-between mb-3'>
				<span className='text-sm text-gray-400'>{event.sportName}</span>
				<span className='text-sm text-gray-400'>{new Date(event.startTime).toLocaleString('ru-RU')}</span>
			</div>

			<div className='flex items-center justify-between mb-3'>
				<div className='flex-1'>
					<h3 className='text-white font-semibold text-lg'>
						{event.teamA} - {event.teamB}
					</h3>
					{event.status === 'LIVE' && event.result && (
						<p className='text-primary-500 font-semibold mt-1'>Счёт: {event.result}</p>
					)}
				</div>
				<button
					onClick={() => setExpanded(!expanded)}
					className='text-gray-400 hover:text-white transition-colors ml-4'
				>
					{expanded ? <ChevronUp className='w-5 h-5' /> : <ChevronDown className='w-5 h-5' />}
				</button>
			</div>

			{expanded && (
				<div className='border-t border-gray-700 pt-4 mt-4'>
					{loading ? (
						<div className='flex justify-center py-4'>
							<div className='w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin' />
						</div>
					) : markets.length === 0 ? (
						<p className='text-gray-500 text-center py-4'>Нет доступных рынков</p>
					) : (
						<div className='space-y-4'>
							{markets.map(market => (
								<div key={market.marketId}>
									<h4 className='text-sm font-medium text-gray-300 mb-2'>{market.name}</h4>
									<div className='grid grid-cols-3 gap-2'>
										{market.outcomes.map(outcome => (
											<button
												key={outcome.outcomeId}
												onClick={() => handleOutcomeClick(market, outcome.outcomeId)}
												disabled={!outcome.isActive || !outcome.currentOdds}
												className={`odds-button ${isOutcomeSelected(outcome.outcomeId) ? 'selected' : ''} ${
													!outcome.isActive || !outcome.currentOdds ? 'opacity-50 cursor-not-allowed' : ''
												}`}
											>
												<div className='text-xs text-gray-400'>{outcome.name}</div>
												<div className='text-sm font-bold text-white'>
													{outcome.currentOdds ? outcome.currentOdds.toFixed(2) : '-'}
												</div>
											</button>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
