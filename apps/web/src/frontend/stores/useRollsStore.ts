import { create } from "zustand";
import type { ApiRoll, Roll, RollsState } from "@/frontend/types/roll";
import { api } from "@/lib/axios-client";
import { useAuthStore } from "./useAuthStore";

const normalizeRoll = (roll: ApiRoll): Roll | null => {
	const rollId = roll.roll_id;
	if (!rollId) {
		return null;
	}

	return {
		roll_id: rollId,
		name: roll.name,
		image_url: roll.image_url ?? roll.imageUrl ?? "/images/default-roll.jpg",
	};
};

export const useRollsStore = create<RollsState>((set, get) => ({
	rolls: [],
	isLoading: false,

	fetchRolls: async () => {
		const user = useAuthStore.getState().user;
		if (!user) {
			return;
		}

		// Avoid refetching if already fetched
		if (get().rolls.length > 0) {
			return;
		}

		set({ isLoading: true });
		try {
			const res = await api.get(`/rolls?userId=${user.id}`);
			const apiRolls = (res.data.data.rolls ?? []) as ApiRoll[];
			const normalizedRolls = apiRolls
				.map(normalizeRoll)
				.filter((roll): roll is Roll => roll !== null);
			set({ rolls: normalizedRolls });
		} catch {
			set({ rolls: [] });
		} finally {
			set({ isLoading: false });
		}
	},
	createRoll: async (newRoll: {
		name: string;
		image_url?: string;
		imageUrl?: string;
	}) => {
		const user = useAuthStore.getState().user;
		if (!user) {
			throw new Error("User not authenticated");
		}
		set({ isLoading: true });
		try {
			const res = await api.post("/rolls/", {
				...newRoll,
				userId: user.id,
			});
			const normalizedRoll = normalizeRoll(res.data.data as ApiRoll);
			if (!normalizedRoll) {
				throw new Error("Created roll is missing roll_id");
			}
			set((state) => ({
				rolls: [...state.rolls, normalizedRoll],
			}));
		} catch (error) {
			throw error instanceof Error ? error : new Error("Failed to create roll");
		} finally {
			set({ isLoading: false });
		}
	},

	clearRolls: () => set({ rolls: [] }),
}));
