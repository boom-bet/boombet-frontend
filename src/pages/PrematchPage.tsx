import { EventCard } from '@/components/EventCard/EventCard';
import { eventService } from '@/services/eventService';
import { Event } from '@/types/api';
import { Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const PrematchPage: React.FC = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadUpcomingEvents();
	}, []);

	const loadUpcomingEvents = async () => {
		try {
			setLoading(true);
			const data = await eventService.getUpcomingEvents();
			setEvents(data);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Не удалось загрузить события');
		} finally {
			setLoading(false);
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
			<div className='flex items-center gap-3'>
				<Calendar className='w-8 h-8 text-primary-500' />
				<h1 className='text-3xl font-bold text-white'>Предстоящие Матчи</h1>
			</div>
			<p className='text-gray-400'>Предстоящие футбольные матчи для ставок</p>

			{error ? (
				<div className='card bg-danger-900/20 border-danger-500'>
					<p className='text-danger-500'>{error}</p>
				</div>
			) : events.length === 0 ? (
				<div className='card'>
					<p className='text-gray-500 text-center py-8'>Нет предстоящих матчей. Проверьте позже!</p>
				</div>
			) : (
				<div className='grid gap-4'>
					{events.map(event => (
						<EventCard key={event.eventId} event={event} />
					))}
				</div>
			)}
		</div>
	);
};
