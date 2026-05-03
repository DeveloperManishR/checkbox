import { type Request, type Response } from "express";
import ApiResponse from "../../common/utils/api-response.js";
import { redis } from "../../common/utils/redis-connection.js";

const CheckBoxSize = 100;
const CheckBoxStateKey = "checkbox-state-v332";
const CheckBoxState = {
  checkboxes: new Array(CheckBoxSize).fill(false),
};

const getCheckboxes = async (data: any) => {
  const existingState = await redis.get(CheckBoxStateKey);


 
  if (existingState) {
    const remoteData = JSON.parse(existingState);
    return remoteData;
  } else {
    return CheckBoxState;
  }
};

export { getCheckboxes, CheckBoxState, CheckBoxStateKey, CheckBoxSize };
