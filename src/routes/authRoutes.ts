import { Router } from "express";
import authController from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authenticateToken, authController.getProfile);
router.patch("/profile", authenticateToken, authController.patchProfile);
router.delete("/profile", authenticateToken, authController.deleteProfile);

export default router;
