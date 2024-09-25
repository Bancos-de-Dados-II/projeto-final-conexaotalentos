import { Router } from "express";
import jobController from "../controllers/jobController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticateToken, jobController.createJob);
router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJobById);
router.put("/:id", authenticateToken, jobController.updateJob);
router.patch("/:id", authenticateToken, jobController.patchJob);
router.delete("/:id", authenticateToken, jobController.deleteJob);

export default router;
