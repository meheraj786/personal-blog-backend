// controllers/profileController.ts
import type { Request, Response } from "express";
import uploadOnCloudinary from "../config/cloudinary";
import Profile from "../models/profile.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// @desc    Get profile
// @route   GET /api/profile
// @access  Public
export const getProfile = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const profile = await Profile.findOne();

		if (!profile) {
			throw new ApiError(404, "Profile not found");
		}

		res
			.status(200)
			.json(new ApiResponse(profile, "Profile fetched successfully"));
	} catch (error) {
		if (error instanceof ApiError) {
			res.status(error.statusCode).json({
				success: false,
				message: error.message,
				errors: error.errors,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "Server error",
			});
		}
	}
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const {
			authorName,
			authorTitle,
			authorSlogan,
			authorBio,
			authorStory,
			email,
			x,
			instagram,
			facebook,
			portfolio,
		} = req.body;
		const avatar = (req as any).file;

		const profile = await Profile.findOne();

		if (!profile) {
			throw new ApiError(404, "Profile not found");
		}

		// Handle avatar update: prioritize file upload, fallback to URL from body
		if (avatar) {
			const cloudinaryResult = await uploadOnCloudinary(avatar.path);
			if (cloudinaryResult) {
				profile.avatar = cloudinaryResult.secure_url;
			}
		} else if (avatar) {
			profile.avatar = avatar;
		}

		// Update fields if provided
		if (authorName) profile.authorName = authorName;
		if (authorTitle) profile.authorTitle = authorTitle;
		if (authorSlogan) profile.authorSlogan = authorSlogan;
		if (authorBio) profile.authorBio = authorBio;
		if (authorStory) profile.authorStory = authorStory;
		if (email) profile.email = email;
		if (x !== undefined) profile.x = x;
		if (instagram !== undefined) profile.instagram = instagram;
		if (facebook !== undefined) profile.facebook = facebook;
		if (portfolio !== undefined) profile.portfolio = portfolio;

		await profile.save();

		res
			.status(200)
			.json(new ApiResponse(profile, "Profile updated successfully"));
	} catch (error) {
		if (error instanceof ApiError) {
			res.status(error.statusCode).json({
				success: false,
				message: error.message,
				errors: error.errors,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "Server error",
			});
		}
	}
};