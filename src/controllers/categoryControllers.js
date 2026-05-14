import slugify from "slugify";

import prisma from "../lib/prisma.js";

export async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const existingCategory =
      await prisma.category.findFirst({
        where: {
          OR: [
            {
              name,
            },
            {
              slug,
            },
          ],
        },
      });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category created",
      data: category,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;

    const { name, description } = req.body;

    const category =
      await prisma.category.findUnique({
        where: {
          id: Number(id),
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const slug = name
      ? slugify(name, {
          lower: true,
          strict: true,
        })
      : category.slug;

    const updatedCategory =
      await prisma.category.update({
        where: {
          id: Number(id),
        },

        data: {
          name: name || category.name,
          slug,
          description:
            description || category.description,
        },
      });

    return res.status(200).json({
      success: true,
      message: "Category updated",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const category =
      await prisma.category.findUnique({
        where: {
          id: Number(id),
        },

        include: {
          _count: {
            select: {
              reports: true,
            },
          },
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category._count.reports > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Category still used by reports",
      });
    }

    await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}