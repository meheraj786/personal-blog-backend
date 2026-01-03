// models/Post.ts
import mongoose, { type Document, Schema } from "mongoose";

export interface IPost extends Document {
	title: string;
	excerpt: string;
	fullStory: string;
	category: string;
	image: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
}

const postSchema = new Schema<IPost>(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
		},
		excerpt: {
			type: String,
			required: [true, "Excerpt is required"],
			trim: true,
		},
		fullStory: {
			type: String,
			required: [true, "Full story is required"],
			trim: true,
		},
		category: {
			type: String,
			required: [true, "Category is required"],
			trim: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		slug: {
			type: String,
			required: [true, "Slug is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

// Index for faster queries
postSchema.index({ slug: 1 });
postSchema.index({ category: 1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;
