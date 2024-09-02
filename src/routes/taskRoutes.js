import { Router } from "express";
import { createTask, getById, updateStatus } from "../controllers/taskControllers.js";
import validateTask from "../helpers/validateTask.js";

const router = Router();

router.post('/tarefa', validateTask, createTask);
router.get('/tarefa/:id', getById);
router.patch('/tarefa/:id/status', updateStatus);

export default router