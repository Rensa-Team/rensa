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
		photoId: string,
		payload: CreateCommentDto,
		actorId?: string
	): Promise<unknown> {
		const effective_actorId = actorId ?? payload.userId;
		if (!effective_actorId) {
			throw new UnauthorizedError();
		}

		if (payload.userId && payload.userId !== effective_actorId) {
			throw new ForbiddenError(
				"Cannot create comments on behalf of other users"
			);
		}

		try {
			return await this.commentRepository.create({
				photoId,
				userId: effective_actorId,
				text: payload.text,
			});
		} catch {
			throw new ValidationError("Invalid comment payload");
		}
	}

	async listByPhotoId(
		photoId: string,
		offset: number,
		limit: number
	): Promise<CommentListResult> {
		const { comments, total } = await this.commentRepository.listByPhotoId({
			photoId,
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
