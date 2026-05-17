import { api } from "@/lib/axios-client";
import { fetchPhotoOwnerByPhotoId } from "./photo.service";

export type PhotoNotificationType =
	| "photo-bookmarked"
	| "photo-commented"
	| "photo-saved";

export const fetchNotifications = async (
	recipientId: string,
	page = 1,
	limit = 10
) => {
	const res = await api.get("/notifications", {
		params: { recipientId, page, limit },
	});
	return res.data?.data ?? [];
};

const sendPhotoNotification = async (
	actorId: string,
	photoId: string,
	type: PhotoNotificationType
) => {
	const recipientId = await fetchPhotoOwnerByPhotoId(photoId);

	if (!recipientId || recipientId === actorId) {
		return null;
	}

	const res = await api.post("/notifications", {
		actorId,
		recipientId,
		photoId,
		type,
	});

	return res.data;
};

export const sendPhotoSavedNotification = (actorId: string, photoId: string) =>
	sendPhotoNotification(actorId, photoId, "photo-saved");

export const sendBookmarkedNotification = (actorId: string, photoId: string) =>
	sendPhotoNotification(actorId, photoId, "photo-bookmarked");

export const sendCommentedNotification = (actorId: string, photoId: string) =>
	sendPhotoNotification(actorId, photoId, "photo-commented");

export const clearUserNotifications = async (userId: string) => {
	const res = await api.delete(`/notifications/${userId}`);
	return res.data.success ?? false;
};

export const markUserNotificationAsRead = async (notificationId: string) => {
	const res = await api.put(`/notifications/${notificationId}/read`);
	return res.data?.success ?? false;
};
