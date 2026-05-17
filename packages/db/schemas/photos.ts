import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const photos = pgTable(
	"photos",
	{
		photo_id: uuid("photo_id").primaryKey().defaultRandom(),
		user_id: uuid("user_id").references(() => users.user_id, {
			onDelete: "cascade",
		}),
		url: text("url").notNull(),
		title: text("title").notNull(),
		description: text("description"),
		category: text("category"),
		style: text("style"),
		color: text("color"),
		camera: text("camera"),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [index("idx_photos_user").on(table.user_id)]
);

export const photoMetadata = pgTable("photo_metadata", {
	photo_metadata_id: uuid("photo_metadata_id")
		.primaryKey()
		.references(() => photos.photo_id, { onDelete: "cascade" }),
	exif: jsonb("exif").$type<Record<string, unknown>>(),
	width: integer("width"),
	height: integer("height"),
	format: text("format"),
	size: integer("size"),
	uploaded_at: timestamp("uploaded_at", { withTimezone: true }),
});

interface Passthrough {
	[key: string]: unknown;
}

export interface ListPhotosQueryDto {
	filters?: string[];
	limit: number;
	page: number;
	sort: "recent" | "popular";
}

export interface PhotoResponseDto extends Passthrough {
	bookmarks: number;
	camera: string;
	category: string;
	color: string;
	created_at?: string;
	description: string;
	metadata?: {
		exif?: Record<string, unknown>;
		format?: string;
		height?: number;
		size?: number;
		uploaded_at?: string;
		width?: number;
	};
	photo_id: string;
	style: string;
	title: string;
	updated_at?: string;
	url: string;
	user: {
		username: string;
		avatar_url: string;
		user_id: string;
	};
}

export interface ListPhotosResult {
	photos: PhotoResponseDto[];
	total: number;
}

export interface PhotoRepositoryInterface {
	createUploadedPhoto(
		payload: CreateUploadedPhotoDto
	): Promise<UploadedPhotoDto>;
	deleteById(id: string): Promise<void>;
	exists(id: string): Promise<boolean>;
	getById(id: string): Promise<PhotoResponseDto | null>;
	getOwnerId(id: string): Promise<string | null>;
	list(query: ListPhotosQueryDto): Promise<ListPhotosResult>;
	listBookmarkedByUser(
		userId: string,
		page: number,
		limit: number
	): Promise<ListPhotosResult>;
	listByIds(
		ids: string[],
		page: number,
		limit: number
	): Promise<ListPhotosResult>;
}

export interface CreateUploadedPhotoDto {
	camera: string;
	category: string;
	color: string;
	description: string;
	exif?: Record<string, unknown>;
	format?: string;
	height?: number;
	size?: number;
	style: string;
	title: string;
	uploaded_at?: Date;
	url: string;
	user_id: string;
	width?: number;
}

export interface UploadedPhotoDto {
	camera: string | null;
	category: string | null;
	color: string | null;
	created_at?: Date | null;
	description: string | null;
	exif?: Record<string, unknown>;
	format?: string;
	height?: number;
	photo_id: string;
	size?: number;
	style: string | null;
	title: string;
	updated_at?: Date | null;
	uploaded_at?: Date;
	url: string;
	user_id: string | null;
	width?: number;
}
