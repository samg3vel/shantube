import { createError } from "../error.js"
import User from "../models/User.js";
import Video from "../models/Video.js";

export const updateUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
    else {
        return next(createError(403, "You can update only your account!"))
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const resp = await User.findByIdAndDelete(req.params.id)
            res.status(200).json(resp ? "User has been deleted!" : "User has already been deleted!");
        } catch (error) {
            next(error);
        }
    }
    else {
        return next(createError(403, "You can delete only your account!"))
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const subscribe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.subscribedUsers.includes(req.params.id)) {
            await User.findByIdAndUpdate(req.user.id, {
                $push: { subscribedUsers: req.params.id }
            })
            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: 1 }
            })
            res.status(200).json("Subscription successfull.")
        }
        else {
            res.status(200).json("User already Subscribed!")
        }
    } catch (error) {
        next(error);
    }
}

export const unsubscribe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.subscribedUsers.includes(req.params.id)) {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { subscribedUsers: req.params.id }
            })
            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: -1 }
            })
            res.status(200).json("Unsubscription successfull.")
        }
        else {
            res.status(200).json("User was not subscribed!")
        }
    } catch (error) {
        next(error);
    }
}

export const like = async (req, res, next) => {
    try {
        const { videoid } = req.params;
        await Video.findByIdAndUpdate(videoid, {
            $addToSet: { likes: req.user.id },
            $pull: { dislikes: req.user.id }
        })
        res.status(200).json("The video has been liked.")
    } catch (error) {
        next(error);
    }
}

export const dislike = async (req, res, next) => {
    try {
        const { videoid } = req.params;
        await Video.findByIdAndUpdate(videoid, {
            $addToSet: { dislikes: req.user.id },
            $pull: { likes: req.user.id }
        })
        res.status(200).json("The video has been disliked.")
    } catch (error) {
        next(error);
    }
}