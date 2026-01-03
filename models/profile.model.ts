// models/Profile.ts
import mongoose, { type Document, Schema } from "mongoose";

export interface IProfile extends Document {
	avatar: string;
	authorName: string;
	authorTitle: string;
	authorSlogan: string;
	authorBio: string;
	authorStory: string;
	email: string;
	x?: string;
	instagram?: string;
	facebook?: string;
	portfolio?: string;
}

const profileSchema = new Schema<IProfile>(
	{
		avatar: {
			type: String,
			required: [true, "Avatar is required"],
		},
		authorName: {
			type: String,
			required: [true, "Author name is required"],
			trim: true,
		},
		authorTitle: {
			type: String,
			required: [true, "Author title is required"],
			trim: true,
		},
		authorSlogan: {
			type: String,
			required: [true, "Author slogan is required"],
			trim: true,
		},
		authorBio: {
			type: String,
			required: [true, "Author bio is required"],
			trim: true,
		},
		authorStory: {
			type: String,
			required: [true, "Author story is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
		},
		x: {
			type: String,
			trim: true,
		},
		instagram: {
			type: String,
			trim: true,
		},
		facebook: {
			type: String,
			trim: true,
		},
		portfolio: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

const Profile = mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;
