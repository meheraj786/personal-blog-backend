// controllers/userController.ts
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// Generate JWT Token
const generateToken = (id: string): string => {
	return jwt.sign({ id }, process.env.JWT_SECRET as string, {
		expiresIn: "30d",
	});
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		// Validate input
		if (!email || !password) {
			throw new ApiError(400, "Please provide email and password");
		}

		// Check if user exists
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			throw new ApiError(401, "Invalid credentials");
		}

		// Check password
		const isPasswordValid = await user.comparePassword(password);

		if (!isPasswordValid) {
			throw new ApiError(401, "Invalid credentials");
		}

		// Generate token
		const token = generateToken(user._id!.toString());

		const responseData = {
			token,
			user: {
				id: user._id,
				email: user.email,
			},
		};

		res.status(200).json(new ApiResponse(responseData, "Login successful"));
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

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { currentPassword, newPassword } = req.body;
		const userId = (req as any).user.id; // From auth middleware

		// Validate input
		if (!currentPassword || !newPassword) {
			throw new ApiError(400, "Please provide current and new password");
		}

		if (newPassword.length < 6) {
			throw new ApiError(400, "New password must be at least 6 characters");
		}

		// Get user with password
		const user = await User.findById(userId).select("+password");

		if (!user) {
			throw new ApiError(404, "User not found");
		}

		// Verify current password
		const isPasswordValid = await user.comparePassword(currentPassword);

		if (!isPasswordValid) {
			throw new ApiError(401, "Current password is incorrect");
		}

		// Update password
		user.password = newPassword;
		await user.save();

		res
			.status(200)
			.json(new ApiResponse(null, "Password updated successfully"));
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

// @desc    Update user email
// @route   PUT /api/users/email
// @access  Private
export const updateEmail = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { email, password } = req.body;
		const userId = (req as any).user.id; // From auth middleware

		// Validate input
		if (!email || !password) {
			throw new ApiError(400, "Please provide email and password");
		}

		// Validate email format
		const emailRegex = /^\S+@\S+\.\S+$/;
		if (!emailRegex.test(email)) {
			throw new ApiError(400, "Please provide a valid email");
		}

		// Get user with password
		const user = await User.findById(userId).select("+password");

		if (!user) {
			throw new ApiError(404, "User not found");
		}

		// Verify password
		const isPasswordValid = await user.comparePassword(password);

		if (!isPasswordValid) {
			throw new ApiError(401, "Password is incorrect");
		}

		// Check if email already exists
		const existingUser = await User.findOne({ email });
		if (existingUser && existingUser?._id?.toString() !== userId) {
			throw new ApiError(400, "Email already in use");
		}

		// Update email
		user.email = email;
		await user.save();

		const responseData = {
			id: user._id,
			email: user.email,
		};

		res
			.status(200)
			.json(new ApiResponse(responseData, "Email updated successfully"));
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
