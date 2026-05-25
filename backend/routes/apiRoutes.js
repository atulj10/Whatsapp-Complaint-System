import { Router } from "express";
import {
  listComplaints,
  getComplaint,
  updateStatus,
} from "../controllers/complaintController.js";
import { listCircles } from "../controllers/circleController.js";

const router = Router();

router.get("/complaints", listComplaints);
router.get("/complaints/:id", getComplaint);
router.patch("/complaints/:id/status", updateStatus);
router.get("/circles", listCircles);

export default router;
