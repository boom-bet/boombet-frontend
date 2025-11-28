// Пользователь
export interface User {
	userId: number;
	email: string;
	balance: number;
	createdAt: string;
	status: string;
}

// Аутентификация
export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	token: string;
}

// События и спорт
export interface Event {
	eventId: number;
	sportId: number;
	sportName: string;
	teamA: string;
	teamB: string;
	startTime: string;
	status: string;
	result?: string;
	externalId?: string;
}

export interface Sport {
	sportId: number;
	name: string;
}

export enum EventStatus {
	UPCOMING = 'UPCOMING',
	LIVE = 'LIVE',
	FINISHED = 'FINISHED',
	CANCELLED = 'CANCELLED',
}

// Рынки и исходы
export interface Market {
	marketId: number;
	name: string;
	outcomes: Outcome[];
}

export interface Outcome {
	outcomeId: number;
	name: string;
	currentOdds: number;
	isActive: boolean;
}

// Ставки
export interface Bet {
	betId: number;
	userId: number;
	stakeAmount: number;
	totalOdds: number;
	potentialPayout: number;
	status: BetStatus;
	createdAt: string;
}

export interface PlaceBetRequest {
	stakeAmount: number;
	outcomeIds: number[];
}

export enum BetStatus {
	PENDING = 'PENDING',
	WON = 'WON',
	LOST = 'LOST',
	CANCELLED = 'CANCELLED',
	REFUNDED = 'REFUNDED',
}

// Купон ставок (для UI)
export interface BetSlipSelection {
	outcomeId: number;
	eventId: number;
	event: Event;
	outcome: Outcome;
	market: Market;
}
