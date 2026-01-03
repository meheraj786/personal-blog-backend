// controllers/siteController.ts
import type { Request, Response } from "express";
import uploadOnCloudinary from "../config/cloudinary";
import Site from "../models/site.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// @desc    Get site settings
// @route   GET /api/site
// @access  Public
export const getSite = async (req: Request, res: Response): Promise<void> => {
	try {
		const site = await Site.findOne();

		if (!site) {
			throw new ApiError(404, "Site settings not found");
		}

		res
			.status(200)
			.json(new ApiResponse(site, "Site settings fetched successfully"));
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

// @desc    Update site settings
// @route   PUT /api/site
// @access  Private
export const updateSite = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { bannerSlogan, bannerTitle, bannerBio, websiteName } = req.body;
		const bannerImageFile = (req as any).file;

		const site = await Site.findOne();

		if (!site) {
			throw new ApiError(404, "Site settings not found");
		}

		// Upload banner image to Cloudinary if provided
		if (bannerImageFile) {
			const cloudinaryResult = await uploadOnCloudinary(bannerImageFile.path);
			if (cloudinaryResult) {
				site.bannerImage = cloudinaryResult.secure_url;
			}
		}

		// Update fields if provided
		if (bannerSlogan) site.bannerSlogan = bannerSlogan;
		if (bannerTitle) site.bannerTitle = bannerTitle;
		if (bannerBio) site.bannerBio = bannerBio;
		if (websiteName) site.websiteName = websiteName;

		await site.save();

		res
			.status(200)
			.json(new ApiResponse(site, "Site settings updated successfully"));
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
