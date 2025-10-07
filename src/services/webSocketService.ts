import { useAuthStore } from '@/stores/authStore';
import { useMatchesStore } from '@/stores/matchesStore';
import { MatchUpdate, OddsUpdate } from '@/types';
import { io, Socket } from 'socket.io-client';

class WebSocketService {
	private socket: Socket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 1000;

	connect() {
		const token = useAuthStore.getState().token;

		this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:8080', {
			auth: {
				token,
			},
			transports: ['websocket'],
			timeout: 5000,
		});

		this.setupEventListeners();
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	private setupEventListeners() {
		if (!this.socket) return;

		// Подключение установлено
		this.socket.on('connect', () => {
			console.log('WebSocket connected');
			this.reconnectAttempts = 0;

			// Подписываемся на обновления коэффициентов
			this.socket?.emit('subscribe', 'odds');
			// Подписываемся на обновления матчей
			this.socket?.emit('subscribe', 'matches');
		});

		// Ошибка подключения
		this.socket.on('connect_error', error => {
			console.error('WebSocket connection error:', error);
			this.handleReconnect();
		});

		// Соединение разорвано
		this.socket.on('disconnect', reason => {
			console.log('WebSocket disconnected:', reason);

			if (reason === 'io server disconnect') {
				// Сервер отключил соединение, переподключаемся вручную
				this.handleReconnect();
			}
		});

		// Обновление коэффициентов
		this.socket.on('odds_update', (data: OddsUpdate) => {
			const matchesStore = useMatchesStore.getState();
			matchesStore.updateOdds(data.matchId, data.odds);
		});

		// Обновление матча (счет, статус и т.д.)
		this.socket.on('match_update', (data: MatchUpdate) => {
			const matchesStore = useMatchesStore.getState();
			matchesStore.updateMatch(data.matchId, {
				score: data.score,
				status: data.status,
			});
		});

		// Обновление баланса пользователя
		this.socket.on('balance_update', (data: { balance: number }) => {
			const authStore = useAuthStore.getState();
			authStore.updateBalance(data.balance);
		});

		// Уведомления
		this.socket.on(
			'notification',
			(data: { type: 'info' | 'success' | 'warning' | 'error'; title: string; message: string }) => {
				// Здесь можно добавить показ уведомлений
				console.log('Notification:', data);
			}
		);
	}

	private handleReconnect() {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.error('Max reconnection attempts reached');
			return;
		}

		this.reconnectAttempts++;
		const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

		setTimeout(() => {
			console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
			this.connect();
		}, delay);
	}

	// Подписка на конкретный матч
	subscribeToMatch(matchId: string) {
		if (this.socket) {
			this.socket.emit('subscribe_match', matchId);
		}
	}

	// Отписка от конкретного матча
	unsubscribeFromMatch(matchId: string) {
		if (this.socket) {
			this.socket.emit('unsubscribe_match', matchId);
		}
	}

	// Проверка состояния подключения
	isConnected(): boolean {
		return this.socket?.connected ?? false;
	}
}

export const webSocketService = new WebSocketService();
