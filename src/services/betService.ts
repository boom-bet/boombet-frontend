import { ApiResponse, Bet, BetHistoryFilters, BetSlip, PaginatedResponse } from '@/types';
import { apiService } from './apiService';

class BetService {
	// Размещение ставки
	async placeBet(betSlip: BetSlip): Promise<Bet[]> {
		const response = await apiService.post<ApiResponse<Bet[]>>('/bets/place', betSlip);
		return response.data;
	}

	// Получение истории ставок пользователя
	async getBetHistory(filters?: BetHistoryFilters, page = 1, limit = 20): Promise<PaginatedResponse<Bet>> {
		const params = {
			page,
			limit,
			...filters,
		};

		const response = await apiService.get<ApiResponse<PaginatedResponse<Bet>>>('/bets/history', params);
		return response.data;
	}

	// Получение активных ставок
	async getActiveBets(): Promise<Bet[]> {
		const response = await apiService.get<ApiResponse<Bet[]>>('/bets/active');
		return response.data;
	}

	// Получение ставки по ID
	async getBet(betId: string): Promise<Bet> {
		const response = await apiService.get<ApiResponse<Bet>>(`/bets/${betId}`);
		return response.data;
	}

	// Отмена ставки (если возможно)
	async cancelBet(betId: string): Promise<void> {
		await apiService.post(`/bets/${betId}/cancel`);
	}

	// Получение статистики ставок
	async getBetStats(): Promise<{
		totalBets: number;
		totalWon: number;
		totalLost: number;
		totalAmount: number;
		totalReturn: number;
		winRate: number;
	}> {
		const response = await apiService.get<ApiResponse<any>>('/bets/stats');
		return response.data;
	}

	// Получение рекомендованных ставок
	async getRecommendedBets(): Promise<
		{
			matchId: string;
			betType: string;
			odds: number;
			confidence: number;
			reason: string;
		}[]
	> {
		const response = await apiService.get<ApiResponse<any[]>>('/bets/recommended');
		return response.data;
	}

	// Проверка лимитов ставок
	async checkBetLimits(amount: number): Promise<{
		isValid: boolean;
		minAmount: number;
		maxAmount: number;
		userBalance: number;
	}> {
		const response = await apiService.post<ApiResponse<any>>('/bets/check-limits', { amount });
		return response.data;
	}
}

export const betService = new BetService();
