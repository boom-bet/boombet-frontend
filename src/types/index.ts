// Пользователь
export interface User {
	id: string;
	username: string;
	email: string;
	balance: number;
	createdAt: Date;
}

// Аутентификация
export interface LoginRequest {
	username: string;
	password: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

// Матчи и события
export interface Match {
	id: string;
	homeTeam: Team;
	awayTeam: Team;
	competition: Competition;
	startTime: Date;
	status: MatchStatus;
	score?: Score;
	odds: MatchOdds;
	isLive: boolean;
}

export interface Team {
	id: string;
	name: string;
	logo?: string;
	country: string;
}

export interface Competition {
	id: string;
	name: string;
	country: string;
	logo?: string;
}

export interface Score {
	home: number;
	away: number;
	halfTime?: {
		home: number;
		away: number;
	};
}

export enum MatchStatus {
	SCHEDULED = 'SCHEDULED',
	LIVE = 'LIVE',
	HALF_TIME = 'HALF_TIME',
	FINISHED = 'FINISHED',
	POSTPONED = 'POSTPONED',
	CANCELLED = 'CANCELLED',
}

// Коэффициенты
export interface MatchOdds {
	matchId: string;
	homeWin: number;
	draw: number;
	awayWin: number;
	over25?: number;
	under25?: number;
	bothTeamsScore?: {
		yes: number;
		no: number;
	};
	handicap?: {
		home: number;
		away: number;
		value: number;
	};
	updatedAt: Date;
}

// Ставки
export interface Bet {
	id: string;
	userId: string;
	matchId: string;
	betType: BetType;
	odds: number;
	amount: number;
	potentialWin: number;
	status: BetStatus;
	placedAt: Date;
	settledAt?: Date;
	match: Match;
}

export enum BetType {
	HOME_WIN = 'HOME_WIN',
	DRAW = 'DRAW',
	AWAY_WIN = 'AWAY_WIN',
	OVER_25 = 'OVER_25',
	UNDER_25 = 'UNDER_25',
	BOTH_TEAMS_SCORE_YES = 'BOTH_TEAMS_SCORE_YES',
	BOTH_TEAMS_SCORE_NO = 'BOTH_TEAMS_SCORE_NO',
	HANDICAP_HOME = 'HANDICAP_HOME',
	HANDICAP_AWAY = 'HANDICAP_AWAY',
}

export enum BetStatus {
	PENDING = 'PENDING',
	WON = 'WON',
	LOST = 'LOST',
	CANCELLED = 'CANCELLED',
}

// Купон ставок
export interface BetSlip {
	selections: BetSelection[];
	totalOdds: number;
	stake: number;
	potentialReturn: number;
}

export interface BetSelection {
	matchId: string;
	match: Match;
	betType: BetType;
	odds: number;
	selection: string; // Читаемое описание выбора
}

// API Response types
export interface ApiResponse<T> {
	data: T;
	message?: string;
	success: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

// WebSocket types
export interface OddsUpdate {
	matchId: string;
	odds: MatchOdds;
}

export interface MatchUpdate {
	matchId: string;
	score?: Score;
	status: MatchStatus;
	minute?: number;
}

// Фильтры и поиск
export interface MatchFilters {
	competition?: string[];
	date?: {
		from: Date;
		to: Date;
	};
	isLive?: boolean;
	search?: string;
}

export interface BetHistoryFilters {
	status?: BetStatus[];
	dateFrom?: Date;
	dateTo?: Date;
	minAmount?: number;
	maxAmount?: number;
}
