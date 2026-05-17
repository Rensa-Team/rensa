export interface CommentUser {
	avatar_url?: string;
	id: string;
	username: string;
}

export interface CommentType {
	comment_id: string;
	created_at?: string;
	text: string;
	user_id: CommentUser | string;
}
