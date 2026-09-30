import { Router } from "express";
import { trailsRouter } from "./trails.routes.js";

export const routes = Router();

routes.use("/trails", trailsRouter);