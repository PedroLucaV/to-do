import { Router } from "express";
import { createTask, getById, getTaskBySituation, getTasksByPage, updateStatus, updateTask } from "../controllers/taskControllers.js";
import validateTask from "../helpers/validateTask.js";

const router = Router();

router.post('/tarefa', validateTask, createTask);
router.get('/tarefa', getTasksByPage);
router.get('/tarefa/:id', getById);
router.put('/tarefas/:id', updateTask);
router.patch('/tarefa/:id/status', updateStatus);
router.get('/tarefas/status/:situacao', getTaskBySituation);

export default router