import type { Bet, PlaceBetRequest } from '@/types/api';
import { apiService } from './apiService';

interface BetHistoryResponse {
	content: Bet[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

interface BetStatsResponse {
	totalBets: number;
	totalWagered: number;
	totalWon: number;
	totalLost: number;
	winRate: number;
}

class BetService {
	async placeBet(request: PlaceBetRequest): Promise<Bet> {
		return await apiService.post<Bet>('/v1/bets', request);
	}

	async getBetHistory(page: number = 0, size: number = 20): Promise<BetHistoryResponse> {
		return await apiService.get<BetHistoryResponse>('/v1/bets/history', { page, size });
	}

	async getBetHistoryByStatus(status: string, page: number = 0, size: number = 20): Promise<BetHistoryResponse> {
		return await apiService.get<BetHistoryResponse>(`/v1/bets/history/status/${status}`, { page, size });
	}

	async getBetStats(): Promise<BetStatsResponse> {
		return await apiService.get<BetStatsResponse>('/v1/bets/stats');
	}

	async getBetDetails(betId: number): Promise<Bet> {
		return await apiService.get<Bet>(`/v1/bets/${betId}`);
	}

	async cancelBet(betId: number): Promise<Bet> {
		return await apiService.delete<Bet>(`/v1/bets/${betId}`);
	}
}

export const betService = new BetService();
