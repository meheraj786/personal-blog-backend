// utils/seeder.ts

import Profile from "../models/profile.model";
import Site from "../models/site.model";
import User from "../models/user.model";

export const seedDatabase = async (): Promise<void> => {
	try {
		console.log("🌱 Starting database seeding...");

		// Check and create User
		const userExists = await User.findOne();
		if (!userExists) {
			await User.create({
				email: "admin@example.com",
				password: "admin123",
			});
			console.log("✅ Default user created");
		} else {
			console.log("ℹ️  User already exists, skipping...");
		}

		// Check and create Site settings
		const siteExists = await Site.findOne();
		if (!siteExists) {
			await Site.create({
				bannerImage: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
				bannerSlogan: "Welcome to My Blog",
				bannerTitle: "Sharing Ideas, Stories & Insights",
				bannerBio:
					"A personal blog where I share my thoughts, experiences, and knowledge with the world.",
				websiteName: "My Blog",
			});
			console.log("✅ Default site settings created");
		} else {
			console.log("ℹ️  Site settings already exist, skipping...");
		}

		// Check and create Profile
		const profileExists = await Profile.findOne();
		if (!profileExists) {
			await Profile.create({
				avatar: "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
				authorName: "John Doe",
				authorTitle: "Full Stack Developer & Content Creator",
				authorSlogan: "Code, Create, Inspire",
				authorBio:
					"Passionate developer who loves to share knowledge and build amazing things.",
				authorStory:
					"I started my journey in tech 5 years ago and have been loving every moment of it. Through this blog, I share my experiences, tutorials, and insights to help others in their tech journey.",
				email: "contact@example.com",
				x: "https://x.com/johndoe",
				instagram: "https://instagram.com/johndoe",
				facebook: "https://facebook.com/johndoe",
				portfolio: "https://johndoe.com",
			});
			console.log("✅ Default profile created");
		} else {
			console.log("ℹ️  Profile already exists, skipping...");
		}

		console.log("🎉 Database seeding completed successfully!");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	}
};
