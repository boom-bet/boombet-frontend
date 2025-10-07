import { BetSelection, BetSlip, BetType, Match } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BetSlipState {
	betSlip: BetSlip;
	isOpen: boolean;
	isPlacing: boolean;
	error: string | null;
}

interface BetSlipActions {
	addSelection: (match: Match, betType: BetType, odds: number, selection: string) => void;
	removeSelection: (matchId: string, betType: BetType) => void;
	clearBetSlip: () => void;
	updateStake: (stake: number) => void;
	toggleBetSlip: () => void;
	setBetSlipOpen: (open: boolean) => void;
	setPlacing: (placing: boolean) => void;
	setError: (error: string | null) => void;
	placeBet: () => Promise<void>;
}

type BetSlipStore = BetSlipState & BetSlipActions;

const initialState: BetSlipState = {
	betSlip: {
		selections: [],
		totalOdds: 1,
		stake: 0,
		potentialReturn: 0,
	},
	isOpen: false,
	isPlacing: false,
	error: null,
};

const calculateTotalOdds = (selections: BetSelection[]): number => {
	return selections.reduce((total, selection) => total * selection.odds, 1);
};

const calculatePotentialReturn = (totalOdds: number, stake: number): number => {
	return totalOdds * stake;
};

export const useBetSlipStore = create<BetSlipStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			addSelection: (match: Match, betType: BetType, odds: number, selection: string) => {
				const { betSlip } = get();
				const existingIndex = betSlip.selections.findIndex(s => s.matchId === match.id && s.betType === betType);

				let newSelections: BetSelection[];

				if (existingIndex >= 0) {
					// Обновляем существующий выбор
					newSelections = betSlip.selections.map((s, index) =>
						index === existingIndex ? { ...s, odds, selection } : s
					);
				} else {
					// Добавляем новый выбор
					const newSelection: BetSelection = {
						matchId: match.id,
						match,
						betType,
						odds,
						selection,
					};
					newSelections = [...betSlip.selections, newSelection];
				}

				const totalOdds = calculateTotalOdds(newSelections);
				const potentialReturn = calculatePotentialReturn(totalOdds, betSlip.stake);

				set({
					betSlip: {
						...betSlip,
						selections: newSelections,
						totalOdds,
						potentialReturn,
					},
					error: null,
				});
			},

			removeSelection: (matchId: string, betType: BetType) => {
				const { betSlip } = get();
				const newSelections = betSlip.selections.filter(s => !(s.matchId === matchId && s.betType === betType));

				const totalOdds = calculateTotalOdds(newSelections);
				const potentialReturn = calculatePotentialReturn(totalOdds, betSlip.stake);

				set({
					betSlip: {
						...betSlip,
						selections: newSelections,
						totalOdds,
						potentialReturn,
					},
				});
			},

			clearBetSlip: () => {
				set({
					betSlip: {
						selections: [],
						totalOdds: 1,
						stake: 0,
						potentialReturn: 0,
					},
					error: null,
				});
			},

			updateStake: (stake: number) => {
				const { betSlip } = get();
				const potentialReturn = calculatePotentialReturn(betSlip.totalOdds, stake);

				set({
					betSlip: {
						...betSlip,
						stake,
						potentialReturn,
					},
				});
			},

			toggleBetSlip: () => {
				const { isOpen } = get();
				set({ isOpen: !isOpen });
			},

			setBetSlipOpen: (open: boolean) => {
				set({ isOpen: open });
			},

			setPlacing: (placing: boolean) => {
				set({ isPlacing: placing });
			},

			setError: (error: string | null) => {
				set({ error });
			},

			placeBet: async () => {
				const { betSlip } = get();

				if (betSlip.selections.length === 0) {
					set({ error: 'Добавьте ставки в купон' });
					return;
				}

				if (betSlip.stake <= 0) {
					set({ error: 'Введите сумму ставки' });
					return;
				}

				set({ isPlacing: true, error: null });

				try {
					// Здесь будет вызов API для размещения ставки
					// await apiService.placeBet(betSlip);

					// После успешного размещения очищаем купон
					set({
						betSlip: {
							selections: [],
							totalOdds: 1,
							stake: 0,
							potentialReturn: 0,
						},
						isOpen: false,
						isPlacing: false,
					});
				} catch (error) {
					set({
						error: error instanceof Error ? error.message : 'Ошибка при размещении ставки',
						isPlacing: false,
					});
				}
			},
		}),
		{ name: 'betslip-store' }
	)
);
