// models/Site.ts
import mongoose, { type Document, Schema } from "mongoose";

export interface ISite extends Document {
	bannerImage: string;
	bannerSlogan: string;
	bannerTitle: string;
	bannerBio: string;
	websiteName: string;
	primaryColor: string;
	accentColor: string;
}

const siteSchema = new Schema<ISite>(
	{
		bannerImage: {
			type: String,
			required: [true, "Banner image is required"],
		},
		bannerSlogan: {
			type: String,
			required: [true, "Banner slogan is required"],
			trim: true,
		},
		bannerTitle: {
			type: String,
			required: [true, "Banner title is required"],
			trim: true,
		},
		bannerBio: {
			type: String,
			required: [true, "Banner bio is required"],
			trim: true,
		},
		websiteName: {
			type: String,
			required: [true, "Website name is required"],
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

const Site = mongoose.model<ISite>("Site", siteSchema);

export default Site;
