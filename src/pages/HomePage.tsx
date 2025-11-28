import { Calendar, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { Event } from '../types/api';

export const HomePage = () => {
	const [liveEvents, setLiveEvents] = useState<Event[]>([]);
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const [live, upcoming] = await Promise.all([eventService.getLiveEvents(), eventService.getUpcomingEvents()]);
				setLiveEvents(live.slice(0, 3));
				setUpcomingEvents(upcoming.slice(0, 3));
			} catch (error) {
				console.error('Failed to fetch events:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-8'>
			{/* Hero Section */}
			<div className='bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white'>
				<h1 className='text-4xl font-bold mb-4'>Добро пожаловать в BoomBet</h1>
				<p className='text-xl mb-6'>Лучшие коэффициенты на футбольные матчи</p>
				<div className='flex gap-4'>
					<Link to='/live' className='btn-primary bg-white text-primary-600 hover:bg-gray-100'>
						<TrendingUp size={20} />
						Прямой эфир
					</Link>
					<Link to='/prematch' className='btn-secondary border-white text-white hover:bg-white/10'>
						<Calendar size={20} />
						Предматчевые ставки
					</Link>
				</div>
			</div>

			{/* Live Events */}
			{liveEvents.length > 0 && (
				<section>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-2xl font-bold'>
							<TrendingUp className='inline mr-2' size={24} />
							Прямой эфир
						</h2>
						<Link to='/live' className='text-primary-500 hover:text-primary-400'>
							Смотреть все →
						</Link>
					</div>
					<div className='grid gap-4'>
						{liveEvents.map(event => (
							<div key={event.eventId} className='card p-4'>
								<div className='flex items-center justify-between'>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-2'>
											<span className='px-2 py-1 bg-danger-500 text-white text-xs rounded-full animate-pulse'>
												LIVE
											</span>
											<span className='text-sm text-gray-400'>{event.sportName}</span>
										</div>
										<h3 className='font-semibold text-lg mb-1'>
											{event.teamA} vs {event.teamB}
										</h3>
										{event.result && <p className='text-2xl font-bold text-primary-500'>{event.result}</p>}
									</div>
									<Link to='/live' className='btn-primary'>
										Сделать ставку
									</Link>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Upcoming Events */}
			{upcomingEvents.length > 0 && (
				<section>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-2xl font-bold'>
							<Calendar className='inline mr-2' size={24} />
							Предстоящие матчи
						</h2>
						<Link to='/prematch' className='text-primary-500 hover:text-primary-400'>
							Смотреть все →
						</Link>
					</div>
					<div className='grid gap-4'>
						{upcomingEvents.map(event => (
							<div key={event.eventId} className='card p-4'>
								<div className='flex items-center justify-between'>
									<div className='flex-1'>
										<div className='text-sm text-gray-400 mb-2'>
											{event.sportName} • {new Date(event.startTime).toLocaleString('ru-RU')}
										</div>
										<h3 className='font-semibold text-lg'>
											{event.teamA} vs {event.teamB}
										</h3>
									</div>
									<Link to='/prematch' className='btn-primary'>
										Сделать ставку
									</Link>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Empty State */}
			{liveEvents.length === 0 && upcomingEvents.length === 0 && (
				<div className='text-center py-12'>
					<p className='text-gray-500 text-xl'>Нет доступных событий</p>
					<p className='text-gray-600 mt-2'>Проверьте позже для новых матчей</p>
				</div>
			)}
		</div>
	);
};
