import { Router } from "express";
import { createTask } from "../controllers/taskControllers.js";
import validateTask from "../helpers/validateTask.js";

const router = Router();

router.post('/tarefa', validateTask, createTask)

export default router