import { BetSlipSelection } from '@/types/api';
import { create } from 'zustand';

interface BetSlipState {
	selections: BetSlipSelection[];
	stake: number;
}

interface BetSlipActions {
	addSelection: (selection: BetSlipSelection) => void;
	removeSelection: (outcomeId: number) => void;
	clearSelections: () => void;
	setStake: (stake: number) => void;
	getTotalOdds: () => number;
	getPotentialPayout: () => number;
}

type BetSlipStore = BetSlipState & BetSlipActions;

export const useBetSlipStore = create<BetSlipStore>((set, get) => ({
	selections: [],
	stake: 100,

	addSelection: (selection: BetSlipSelection) => {
		set(state => {
			const exists = state.selections.find(s => s.outcomeId === selection.outcomeId);
			if (exists) return state;
			return { selections: [...state.selections, selection] };
		});
	},

	removeSelection: (outcomeId: number) => {
		set(state => ({
			selections: state.selections.filter(s => s.outcomeId !== outcomeId),
		}));
	},

	clearSelections: () => {
		set({ selections: [] });
	},

	setStake: (stake: number) => {
		set({ stake });
	},

	getTotalOdds: () => {
		const { selections } = get();
		if (selections.length === 0) return 0;
		return selections.reduce((acc, sel) => acc * (sel.outcome.currentOdds || 1), 1);
	},

	getPotentialPayout: () => {
		const { stake } = get();
		const totalOdds = get().getTotalOdds();
		return stake * totalOdds;
	},
}));
