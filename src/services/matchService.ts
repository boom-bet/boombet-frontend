import { ApiResponse, Competition, Match, MatchFilters, PaginatedResponse } from '@/types';
import { apiService } from './apiService';

class MatchService {
	// Получение всех матчей с фильтрами
	async getMatches(filters?: MatchFilters, page = 1, limit = 20): Promise<PaginatedResponse<Match>> {
		const params = {
			page,
			limit,
			...filters,
		};

		const response = await apiService.get<ApiResponse<PaginatedResponse<Match>>>('/matches', params);
		return response.data;
	}

	// Получение live матчей
	async getLiveMatches(): Promise<Match[]> {
		const response = await apiService.get<ApiResponse<Match[]>>('/matches/live');
		return response.data;
	}

	// Получение топ матчей
	async getTopMatches(): Promise<Match[]> {
		const response = await apiService.get<ApiResponse<Match[]>>('/matches/top');
		return response.data;
	}

	// Получение матча по ID
	async getMatch(matchId: string): Promise<Match> {
		const response = await apiService.get<ApiResponse<Match>>(`/matches/${matchId}`);
		return response.data;
	}

	// Получение матчей по дате
	async getMatchesByDate(date: string): Promise<Match[]> {
		const response = await apiService.get<ApiResponse<Match[]>>(`/matches/date/${date}`);
		return response.data;
	}

	// Получение предстоящих матчей
	async getUpcomingMatches(limit = 10): Promise<Match[]> {
		const response = await apiService.get<ApiResponse<Match[]>>('/matches/upcoming', { limit });
		return response.data;
	}

	// Получение завершенных матчей
	async getFinishedMatches(page = 1, limit = 20): Promise<PaginatedResponse<Match>> {
		const params = { page, limit };
		const response = await apiService.get<ApiResponse<PaginatedResponse<Match>>>('/matches/finished', params);
		return response.data;
	}

	// Получение матчей по лиге
	async getMatchesByCompetition(competitionId: string, page = 1, limit = 20): Promise<PaginatedResponse<Match>> {
		const params = { page, limit };
		const response = await apiService.get<ApiResponse<PaginatedResponse<Match>>>(
			`/matches/competition/${competitionId}`,
			params
		);
		return response.data;
	}

	// Поиск матчей
	async searchMatches(query: string): Promise<Match[]> {
		const response = await apiService.get<ApiResponse<Match[]>>('/matches/search', { q: query });
		return response.data;
	}

	// Получение всех лиг/турниров
	async getCompetitions(): Promise<Competition[]> {
		const response = await apiService.get<ApiResponse<Competition[]>>('/competitions');
		return response.data;
	}

	// Получение популярных лиг
	async getPopularCompetitions(): Promise<Competition[]> {
		const response = await apiService.get<ApiResponse<Competition[]>>('/competitions/popular');
		return response.data;
	}
}

export const matchService = new MatchService();
