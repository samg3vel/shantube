import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        const user = await User.find({ $or: [{ name: req.body.name }, { email: req.body.email }] });
        console.log(user);
        if (user && user.length > 0) return next(createError(404, "User Name/Email already available!"));

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });

        await newUser.save();
        res.status(200).send("User has been Created Successfully!");
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) return next(createError(404, "User not Found"));

        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect) return next(createError(400, "Wrong Credential!"));

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, __v, ...rest } = user._doc;
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)
    } catch (error) {
        next(error);
    }
}

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            res.cookie("access_token", token, { httpOnly: true }).status(200).json(user._doc)
        }
        else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            });
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
            res.cookie("access_token", token, { httpOnly: true }).status(200).json(savedUser._doc)
        }

    } catch (error) {
        next(error);
    }
}