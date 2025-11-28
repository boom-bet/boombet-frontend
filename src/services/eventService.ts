import type { Event, Market } from '@/types/api';
import { apiService } from './apiService';

interface EventResponse {
	content: Event[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

interface EventFilterRequest {
	sportId?: number;
	status?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
	size?: number;
}

class EventService {
	async getUpcomingEvents(): Promise<Event[]> {
		return await apiService.get<Event[]>('/v1/events/upcoming');
	}

	async getLiveEvents(): Promise<Event[]> {
		return await apiService.get<Event[]>('/v1/events/live');
	}

	async getMarketsForEvent(eventId: number): Promise<Market[]> {
		return await apiService.get<Market[]>(`/v1/events/${eventId}/markets`);
	}

	async filterEvents(filter: EventFilterRequest): Promise<EventResponse> {
		return await apiService.post<EventResponse>('/v1/events/filter', filter);
	}

	async getEventsBySport(sportId: number, page: number = 0, size: number = 20): Promise<EventResponse> {
		return await apiService.get<EventResponse>(`/v1/events/sport/${sportId}`, { page, size });
	}

	async getEventsByStatus(status: string, page: number = 0, size: number = 20): Promise<EventResponse> {
		return await apiService.get<EventResponse>(`/v1/events/status/${status}`, { page, size });
	}

	async searchEvents(query: string, page: number = 0, size: number = 20): Promise<EventResponse> {
		return await apiService.get<EventResponse>('/v1/events/search', { query, page, size });
	}

	async getEventsByDateRange(
		startDate: string,
		endDate: string,
		page: number = 0,
		size: number = 20
	): Promise<EventResponse> {
		return await apiService.get<EventResponse>('/v1/events/range', { startDate, endDate, page, size });
	}
}

export const eventService = new EventService();
