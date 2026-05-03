import type React from "react";
import { useState } from "react";
import type { CommentType } from "@/frontend/sections/CommentSection";
import { commentPhoto } from "@/frontend/services/photo-post.service";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import CommentInputFieldView from "../components/CommentInputFieldView";

export interface CommentInputFieldContainerProps {
	id?: string;
	onAddComment: (c: CommentType) => void;
}

const CommentInputFieldContainer: React.FC<CommentInputFieldContainerProps> = ({
	id,
	onAddComment,
}) => {
	const { user } = useAuthStore();
	const [comment, setComment] = useState("");

	const handleSubmit = async () => {
		if (!comment.trim()) {
			return;
		}

		const tempId = Math.random().toString(36).slice(2, 9);
		const newComment: CommentType = {
			comment_id: tempId,
			text: comment,
			userId: {
				id: user?.id || "unknown",
				username: user?.name || "Anonymous",
				avatarUrl: user?.image || "/profile.jpg",
			},
			createdAt: new Date().toISOString(),
		};

		onAddComment(newComment);
		setComment("");
		await commentPhoto(newComment, id || "", user?.id);
	};

	return (
		<CommentInputFieldView
			comment={comment}
			onChangeComment={setComment}
			onSubmit={handleSubmit}
			userExists={!!user}
		/>
	);
};

export default CommentInputFieldContainer;
