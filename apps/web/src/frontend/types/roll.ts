export interface Roll {
	created_at?: string;
	createdAt?: string;
	image_url?: string;
	imageUrl?: string;
	name: string;
	photos?: string[];
	previewPhotos?: string[];
	roll_id: string;
	user_id?: string;
	userId?: string;
}

export interface ApiRoll {
	image_url?: string;
	imageUrl?: string;
	name: string;
	roll_id?: string;
}

export interface RollsState {
	clearRolls: () => void;
	createRoll: (newRoll: {
		image_url?: string;
		imageUrl?: string;
		name: string;
	}) => Promise<void>;
	fetchRolls: () => Promise<void>;
	isLoading: boolean;
	rolls: Roll[];
}
