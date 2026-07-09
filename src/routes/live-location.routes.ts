import { Router } from "express";

import { LiveLocationController } from "../controllers/live-location.controller.ts";

const liveLocationController = new LiveLocationController();
const router = Router();

router.post("/start", liveLocationController.start);
router.put("/update", liveLocationController.update);
router.put("/stop", liveLocationController.stop);
router.get("/live/:shareId", liveLocationController.getLiveLocation); 

export default router;
