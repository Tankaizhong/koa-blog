const express = require("express");
const { fetchCategoriesList } = require("../controller/user.controller");
const { Tags } = require("../db/associations");

const router = express.Router({
  prefix: "/tag",
});

router.post("/fetchAllTags", async (req, res, next) => {
  try {
    // Fetch all tags from the database
    const tags = await Tags.findAll();

    // Send the fetched tags as the response
    res.status(200).json({ success: true, tags });
  } catch (error) {
    // Handle errors
    console.error("Error fetching tags:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tags" });
  }
});

router.post("/addTag", async (req, res, next) => {
  try {
    const { TagName, TagDescription } = req.body;

    // Check if the tag name is provided
    if (!TagName) {
      return res
        .status(400)
        .json({ success: false, message: "Tag name is required" });
    }
    // console.log(tagName)
    // Check if the tag already exists
    const existingTag = await Tags.findOne({
      where: {
        TagName: TagName,
      },
    });
    console.log(TagName, TagDescription);
    if (existingTag) {
      return res
        .status(400)
        .json({ success: false, message: "Tag already exists" });
    }

    // Create a new tag
    const newTag = new Tags({ TagName, TagDescription });
    await newTag.save();

    res
      .status(201)
      .json({ success: true, message: "Tag added successfully", tag: newTag });
  } catch (error) {
    console.error("Error adding tag:", error);
    res.status(500).json({ success: false, message: "Failed to add tag" });
  }
});

router.post("/deleteTag", async (req, res, next) => {
  try {
    const { tagID } = req.body; // 假设前端传来的数据中包含了要删除的标签的ID

    // 在数据库中查找要删除的标签
    const tag = await Tags.findOne({ where: { TagID: tagID } });

    if (!tag) {
      // 如果未找到要删除的标签，返回 404 错误
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    // 执行删除操作
    await tag.destroy();

    // 返回成功消息
    res
      .status(200)
      .json({ success: true, message: "Tag deleted successfully" });
  } catch (error) {
    // 如果发生错误，返回 500 错误并将错误传递给全局错误处理程序
    next(error);
  }
});

router.post("/updateTag", async (req, res, next) => {
  try {
    const { TagID, TagName, TagAlias, TagDescription } = req.body.tagDate;

    // Find the tag by its ID
    const tag = await Tags.findByPk(TagID);

    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    // Update the tag attributes
    tag.TagName = TagName;
    tag.TagAlias = TagAlias;
    tag.TagDescription = TagDescription;

    // Save the changes to the database
    await tag.save();

    // Send a success response
    res.status(200).json({ message: "Tag updated successfully" });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error updating tag:", error);
    res.status(500).json({ error: "Failed to update tag" });
  }
});

router.post("/", async (req, res, next) => {
  const { TagName, TagDescription } = req.body.tagDate;
});
module.exports = router;
