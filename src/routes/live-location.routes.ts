import { Router } from "express";

import { LiveLocationController } from "../controllers/live-location.controller.ts";

const liveLocationController = new LiveLocationController();
const router = Router();

router.post("/start", liveLocationController.start);
router.put("/update", liveLocationController.update);
router.put("/stop", liveLocationController.stop);
router.get("/live/:shareId", liveLocationController.getLiveLocation); //live location route to get the live location data based on shareId
router.post("/share-contact", liveLocationController.shareWithContacts);

export default router;
