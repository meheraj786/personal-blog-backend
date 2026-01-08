// controllers/postController.ts
import type { Request, Response } from "express";
import uploadOnCloudinary from "../config/cloudinary";
import Post from "../models/post.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import slugify from "slugify";

// @desc    Get all posts with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Public
export const getAllPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    // Get posts with pagination
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const responseData = {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    res
      .status(200)
      .json(new ApiResponse(responseData, "Posts fetched successfully"));
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

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug }).select("-__v");

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    res.status(200).json(new ApiResponse(post, "Post fetched successfully"));
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

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, excerpt, fullStory, category } = req.body;
    const image = (req as any).file;
    const slug = slugify(title);

    console.log(req.body);

    // Validate required fields
    if (!title || !excerpt || !fullStory || !category || !slug) {
      throw new ApiError(400, "Please provide all required fields");
    }

    // Validate image
    if (!image) {
      throw new ApiError(400, "Please provide an image");
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      throw new ApiError(400, "Post with this slug already exists");
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadOnCloudinary(image.path);

    if (!cloudinaryResult) {
      throw new ApiError(500, "Failed to upload image");
    }

    // Create post
    const post = await Post.create({
      title,
      excerpt,
      fullStory,
      category,
      image: cloudinaryResult.secure_url,
      slug,
    });

    res.status(201).json(new ApiResponse(post, "Post created successfully"));
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

// @desc    Update post
// @route   PUT /api/posts/:slug
// @access  Private
export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { title, excerpt, fullStory, category, newSlug } = req.body;
    const imageFile = (req as any).file;

    const post = await Post.findOne({ slug });

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    // Upload new image if provided
    if (imageFile) {
      const cloudinaryResult = await uploadOnCloudinary(imageFile.path);
      if (cloudinaryResult) {
        post.image = cloudinaryResult.secure_url;
      }
    }

    // Update fields if provided
    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (fullStory) post.fullStory = fullStory;
    if (category) post.category = category;

    // Update slug if new slug provided and different from current
    if (newSlug && newSlug !== slug) {
      const existingPost = await Post.findOne({ slug: newSlug });
      if (existingPost) {
        throw new ApiError(400, "Post with this slug already exists");
      }
      post.slug = newSlug;
    }

    await post.save();

    res.status(200).json(new ApiResponse(post, "Post updated successfully"));
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

// @desc    Delete post
// @route   DELETE /api/posts/:slug
// @access  Private
export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const post = await Post.findOneAndDelete({ slug });

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    res.status(200).json(new ApiResponse(null, "Post deleted successfully"));
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

// @desc    Get posts by category with pagination
// @route   GET /api/posts/category/:category?page=1&limit=10
// @access  Public
export const getPostsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalPosts = await Post.countDocuments({ category });
    const totalPages = Math.ceil(totalPosts / limit);

    // Get posts with pagination
    const posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const responseData = {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    res
      .status(200)
      .json(new ApiResponse(responseData, "Posts fetched successfully"));
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
