const express = require("express");
const router = express.Router();
const { Categories } = require("../db/associations"); // 假设 Category 是你的模型

// 添加分类
router.post("/addCategory", async (req, res, next) => {
  try {
    const {
      CategoryName,
      CategoryAlias,
      CategoryDescription,
      ParentCategoryID,
    } = req.body;
    // 在这里执行添加分类的逻辑
    // 例如：创建新的分类并保存到数据库
    const newCategory = await Categories.create({
      CategoryName,
      CategoryAlias,
      CategoryDescription,
      ParentCategoryID,
    });
    res.status(201).json({ message: "分类添加成功", category: newCategory });
  } catch (error) {
    next(error);
  }
});

// 删除分类
router.post("/deleteCategory/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    // 在这里执行删除分类的逻辑
    // 例如：从数据库中删除指定 ID 的分类
    await Categories.destroy({ where: { CategoryID: categoryId } });
    res.status(200).json({ message: "分类删除成功" });
  } catch (error) {
    next(error);
  }
});

// 获取所有分类
router.get("/allCategories", async (req, res, next) => {
  try {
    // 在这里执行获取所有分类的逻辑
    // 例如：从数据库中查询所有分类
    const categories = await Categories.findAll();
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
});

// 更新分类
router.post("/updateCategory/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    console.log(req.params);
    const {
      CategoryName,
      CategoryAlias,
      CategoryDescription,
      ParentCategoryID,
    } = req.body.categoryDate;
    // 在这里执行更新分类的逻辑
    // 例如：从数据库中更新指定 ID 的分类信息
    await Categories.update(
      {
        CategoryName,
        CategoryAlias,
        CategoryDescription,
        ParentCategoryID,
      },
      { where: { CategoryID: categoryId } },
    );
    res.status(200).json({ message: "分类更新成功" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
