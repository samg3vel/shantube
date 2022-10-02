import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
    const newComment = new Comment({
        ...req.body,
        userId: req.user.id
    })
    try {
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return next(createError(404, "No Comment found"));
        const video = await Video.findById(comment.videoId);
        if (req.user.id === comment.userId || video.userId === req.user.id) {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("The Comment deleted successfully!")
        }
        else {
            return next(createError(403, "You can delete only your comments!"))
        }


    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoid }).limit(40);
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}