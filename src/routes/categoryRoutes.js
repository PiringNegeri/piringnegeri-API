import express from "express";

import { getCategories,createCategory,updateCategory,deleteCategory } from "../controllers/categoryControllers.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/",verifyToken,allowRoles("ADMIN","SUPER_ADMIN"),
  createCategory
);

router.patch("/:id",verifyToken,allowRoles("ADMIN","SUPER_ADMIN"),
  updateCategory
);

router.delete("/:id",verifyToken,allowRoles("ADMIN","SUPER_ADMIN"),
  deleteCategory
);

export default router;