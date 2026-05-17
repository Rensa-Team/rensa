import { CommentRepository } from "@rensa/db/queries/comment.repository";
import type {
	CommentRepositoryInterface,
	CreateCommentDto,
} from "@rensa/db/schema";
import {
	ForbiddenError,
	UnauthorizedError,
	ValidationError,
} from "@/backend/common/backend.error";
import type { CommentListResult } from "@/backend/types/service.types";

export class CommentService {
	readonly commentRepository: CommentRepositoryInterface;

	constructor(commentRepository: CommentRepositoryInterface) {
		this.commentRepository = commentRepository;
	}

	async createForPhoto(
		photo_id: string,
		payload: CreateCommentDto,
		actor_id?: string
	): Promise<unknown> {
		const effective_actor_id = actor_id ?? payload.user_id;
		if (!effective_actor_id) {
			throw new UnauthorizedError();
		}

		if (payload.user_id && payload.user_id !== effective_actor_id) {
			throw new ForbiddenError(
				"Cannot create comments on behalf of other users"
			);
		}

		try {
			return await this.commentRepository.create({
				photo_id,
				user_id: effective_actor_id,
				text: payload.text,
			});
		} catch {
			throw new ValidationError("Invalid comment payload");
		}
	}

	async listByPhotoId(
		photo_id: string,
		offset: number,
		limit: number
	): Promise<CommentListResult> {
		const { comments, total } = await this.commentRepository.listByPhotoId({
			photo_id,
			offset,
			limit,
		});

		return {
			comments,
			hasMore: offset + comments.length < total,
			total,
		};
	}
}

export const commentService = new CommentService(new CommentRepository());
