import { Router } from "express";
import * as controller from "./checkbox.controller.js";

const router: Router = Router();

router.get("/", controller.getCheckboxes);

export default router;
