import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";

// GET POSTS
export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    console.log(postMessages);
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// CREATE POST
export const createPost = async (req, res) => {
  const { creator, title, message, tags, selectedFile } = req.body;

  const newPostMessage = new PostMessage({
    creator,
    title,
    message,
    selectedFile,
    tags,
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id.");

  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { ...post, id },
    {
      new: true,
    }
  );

  res.json(updatedPost);
};

// DELETE POST

export const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id.");

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "post deleted successfully" });
};

// LIKE POST

export const likePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id.");

  const post = await PostMessage.findById(id);
  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );

  res.json(updatedPost);
};
