import { Match, MatchFilters, MatchOdds } from '@/types';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

interface MatchesState {
	matches: Match[];
	liveMatches: Match[];
	topMatches: Match[];
	isLoading: boolean;
	error: string | null;
	filters: MatchFilters;
	lastUpdate: Date | null;
}

interface MatchesActions {
	setMatches: (matches: Match[]) => void;
	setLiveMatches: (matches: Match[]) => void;
	setTopMatches: (matches: Match[]) => void;
	updateMatch: (matchId: string, updates: Partial<Match>) => void;
	updateOdds: (matchId: string, odds: MatchOdds) => void;
	setFilters: (filters: Partial<MatchFilters>) => void;
	clearFilters: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	refreshMatches: () => void;
}

type MatchesStore = MatchesState & MatchesActions;

const initialState: MatchesState = {
	matches: [],
	liveMatches: [],
	topMatches: [],
	isLoading: false,
	error: null,
	filters: {},
	lastUpdate: null,
};

export const useMatchesStore = create<MatchesStore>()(
	devtools(
		subscribeWithSelector((set, get) => ({
			...initialState,

			setMatches: (matches: Match[]) => {
				set({
					matches,
					lastUpdate: new Date(),
					error: null,
				});
			},

			setLiveMatches: (liveMatches: Match[]) => {
				set({
					liveMatches,
					lastUpdate: new Date(),
				});
			},

			setTopMatches: (topMatches: Match[]) => {
				set({
					topMatches,
					lastUpdate: new Date(),
				});
			},

			updateMatch: (matchId: string, updates: Partial<Match>) => {
				const { matches, liveMatches, topMatches } = get();

				set({
					matches: matches.map(match => (match.id === matchId ? { ...match, ...updates } : match)),
					liveMatches: liveMatches.map(match => (match.id === matchId ? { ...match, ...updates } : match)),
					topMatches: topMatches.map(match => (match.id === matchId ? { ...match, ...updates } : match)),
					lastUpdate: new Date(),
				});
			},

			updateOdds: (matchId: string, odds: MatchOdds) => {
				const { matches, liveMatches, topMatches } = get();

				set({
					matches: matches.map(match => (match.id === matchId ? { ...match, odds } : match)),
					liveMatches: liveMatches.map(match => (match.id === matchId ? { ...match, odds } : match)),
					topMatches: topMatches.map(match => (match.id === matchId ? { ...match, odds } : match)),
					lastUpdate: new Date(),
				});
			},

			setFilters: (newFilters: Partial<MatchFilters>) => {
				const currentFilters = get().filters;
				set({
					filters: { ...currentFilters, ...newFilters },
				});
			},

			clearFilters: () => {
				set({ filters: {} });
			},

			setLoading: (loading: boolean) => {
				set({ isLoading: loading });
			},

			setError: (error: string | null) => {
				set({ error });
			},

			refreshMatches: () => {
				set({ lastUpdate: new Date() });
			},
		})),
		{ name: 'matches-store' }
	)
);
