import { type Request, type Response } from "express";
import * as checkboxService from "../checkbox/checkbox.service.js";
import ApiResponse from "../../common/utils/api-response.js";

// import * as controller from "./checkbox.service.js"
const getCheckboxes = async (req: Request, res: Response) => {
  const checkBox = await checkboxService.getCheckboxes(req.body);

  ApiResponse.ok(res, "Checboxes ", checkBox);
};

export { getCheckboxes };
