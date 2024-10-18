import { Router } from "express";
import { createTask, getById, getTaskBySituation, getTasksByPage, updateStatus, updateTask } from "../controllers/taskControllers.js";

const router = Router();

router.post('/tarefa', createTask);
router.get('/tarefa', getTasksByPage);
router.get('/tarefa/:id', getById);
router.put('/tarefas/:id', updateTask);
router.patch('/tarefa/:id/status', updateStatus);
router.get('/tarefas/status/:situacao', getTaskBySituation);

export default router