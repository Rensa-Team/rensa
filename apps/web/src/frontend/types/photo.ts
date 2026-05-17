export interface PhotoMetadata {
	exif?: Record<string, string>;
	format?: "jpg" | "jpeg" | string;
	height?: number;
	size?: number;
	uploaded_at?: Date | string;
	width?: number;
}

export interface PhotoUser {
	avatar_url?: string;
	avatarUrl?: string;
	user_id?: string;
	username?: string;
}

export interface Photo {
	bookmarkedBy?: string[];
	bookmarks?: number;
	camera?: string;
	category?: string;
	color?: string;
	created_at?: string;
	createdAt?: string;
	description: string;
	metadata?: PhotoMetadata;
	photo_id: string;
	style?: string;
	tags?: string[];
	title: string;
	updated_at?: string;
	updatedAt?: string;
	url: string;
	user: PhotoUser;
}

export interface BackendPhotosResponse {
	currentPage: number;
	hasMore: boolean;
	photos: Photo[];
	total: number;
	totalPages: number;
}

export type ExplorePhotoSource = "db" | "picsum";

export interface FetchPhotosResponse {
	data: Photo[];
	nextPage: number | undefined;
	source?: ExplorePhotoSource;
}

export interface PicsumPhotosResponse {
	hasMore: boolean;
	photos: Photo[];
}
