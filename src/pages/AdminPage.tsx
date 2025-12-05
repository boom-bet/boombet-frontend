import { eventService } from '@/services/eventService';
import { Event } from '@/types/api';
import { Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const AdminPage: React.FC = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState<number | null>(null);

	useEffect(() => {
		loadEvents();
	}, []);

	const loadEvents = async () => {
		try {
			setLoading(true);
			const response = await eventService.getEventsByStatus('live', 0, 50);
			setEvents(response.content);
		} catch (err) {
			console.error('Failed to load events:', err);
		} finally {
			setLoading(false);
		}
	};

	const finishEvent = async (eventId: number, result: string) => {
		try {
			setProcessing(eventId);
			await eventService.finishEvent(eventId, result);
			alert(`Событие ${eventId} завершено с результатом ${result}. Ставки будут рассчитаны в течение 30 секунд.`);
			loadEvents();
		} catch (err: any) {
			alert('Ошибка: ' + (err?.response?.data || err.message));
		} finally {
			setProcessing(null);
		}
	};

	const generateRandomResult = () => {
		const scoreA = Math.floor(Math.random() * 5);
		const scoreB = Math.floor(Math.random() * 5);
		return `${scoreA}:${scoreB}`;
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
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold text-white'>Админ Панель - Завершение Событий</h1>
				<button onClick={loadEvents} className='btn-secondary'>
					Обновить
				</button>
			</div>

			<div className='card bg-warning-900/20 border-warning-500'>
				<p className='text-warning-500 text-sm'>
					<strong>Только для тестирования!</strong> Завершите события чтобы проверить расчет ставок. Scheduler
					автоматически рассчитает ставки через 30 секунд.
				</p>
			</div>

			{events.length === 0 ? (
				<div className='card'>
					<p className='text-gray-500 text-center py-8'>Нет live событий</p>
				</div>
			) : (
				<div className='space-y-4'>
					{events.map(event => (
						<div key={event.eventId} className='card'>
							<div className='flex items-center justify-between mb-4'>
								<div>
									<h3 className='text-white font-semibold text-lg'>
										{event.teamA} vs {event.teamB}
									</h3>
									<p className='text-gray-400 text-sm'>
										{event.sportName} • Event ID: {event.eventId}
									</p>
									{event.result && <p className='text-primary-500 font-semibold mt-1'>Текущий счет: {event.result}</p>}
								</div>
								<span className='px-3 py-1 bg-danger-500 text-white rounded-full text-sm font-semibold'>LIVE</span>
							</div>

							<div className='flex gap-2'>
								<button
									onClick={() => finishEvent(event.eventId, '2:1')}
									disabled={processing === event.eventId}
									className='btn-primary flex-1 disabled:opacity-50'
								>
									<Check className='w-4 h-4 mr-2' />
									{event.teamA} победа (2:1)
								</button>
								<button
									onClick={() => finishEvent(event.eventId, '1:2')}
									disabled={processing === event.eventId}
									className='btn-primary flex-1 disabled:opacity-50'
								>
									<Check className='w-4 h-4 mr-2' />
									{event.teamB} победа (1:2)
								</button>
								<button
									onClick={() => finishEvent(event.eventId, '1:1')}
									disabled={processing === event.eventId}
									className='btn-secondary flex-1 disabled:opacity-50'
								>
									<X className='w-4 h-4 mr-2' />
									Ничья (1:1)
								</button>
								<button
									onClick={() => {
										const result = generateRandomResult();
										finishEvent(event.eventId, result);
									}}
									disabled={processing === event.eventId}
									className='btn-secondary disabled:opacity-50'
								>
									Случайный
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
