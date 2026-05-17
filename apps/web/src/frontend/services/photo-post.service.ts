import type { CommentType } from "@/frontend/types/comment";
import { api } from "@/lib/axios-client";
import {
	sendBookmarkedNotification,
	sendCommentedNotification,
} from "./notification.service";

export const bookmarkPhoto = async (
	userId: string | undefined,
	photoId: string,
	action: "decrement" | "increment"
) => {
	const res = await api.post(`/photos/bookmark/${photoId}`, {
		action,
		userId,
	});

	if (action === "increment") {
		await sendBookmarkedNotification(userId || "", photoId);
	}

	return res.data.bookmarks;
};

export const commentPhoto = async (
	newComment: CommentType,
	id: string,
	userId: string | undefined
) => {
	await api.post(`/photos/${id}/comments`, {
		text: newComment.text,
		userId,
	});
	await sendCommentedNotification(userId || "", id);
};

export const removeUserPhoto = async (photoId: string) => {
	await api.delete(`/photos/${photoId}`);
};
