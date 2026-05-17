import { z } from "zod";

export const bookmarkResponseDto = z.object({
	bookmarkId: z.string(),
	userId: z.string(),
	photoId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const createBookmarkDto = bookmarkResponseDto.omit({
	bookmarkId: true,
	createdAt: true,
	updatedAt: true,
});
export const updateBookmarkDto = bookmarkResponseDto.partial().omit({
	bookmarkId: true,
	userId: true,
	photoId: true,
	createdAt: true,
	updatedAt: true,
});

export const bookmarkActionDto = z
	.object({
		action: z.enum(["increment", "decrement"]),
		userId: z.uuid().optional(),
	})
	.refine((value) => value.userId, {
		message: "userId is required",
	})
	.transform((value) => ({
		action: value.action,
		userId: value.userId as string,
	}));

export type BookmarkResponseDto = z.infer<typeof bookmarkResponseDto>;
export type CreateBookmarkDto = z.infer<typeof createBookmarkDto>;
export type UpdateBookmarkDto = z.infer<typeof updateBookmarkDto>;
