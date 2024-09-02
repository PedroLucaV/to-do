import Tasks from '../model/taskModel.js';
import formatZodError from '../helpers/formatZodError.js'
import {z} from 'zod';

const statusRegex = /^(concluida|pendente)/

const createSchema = z.object({
    nome: z.string().min(3, {message: "A tarefa deve conter pelo menos 3 caracteres"}).transform((txt) => txt.toLowerCase()),
    descricao: z.optional(z.string().min(5, {message: "A descricao deve conter pelo menos 5 caracteres"}))
})

const getSchema = z.string().uuid({message: "UUID invalido!"});

const updateTarefaSchema = z.object({
    nome: z.optional(z.string().min(3, {message: "A tarefa deve conter pelo menos 3 caracteres"}).transform((txt) => txt.toLowerCase())),
    descricao: z.optional(z.string().min(5, {message: "A descricao deve conter pelo menos 5 caracteres"})),
    status: z.optional(z.string().regex(statusRegex))
})

//REF 01
export const createTask = async (req, res) => {

    const bodyValidation = createSchema.safeParse(req.body)
    console.log(bodyValidation)

    if(!bodyValidation.success){
        return res.status(400).json({message: "Os dados recebidos no corpo da aplicação são invalidos", detalhes: formatZodError(bodyValidation.error)})
    }
    
    const {nome, descricao} = bodyValidation.data;
    try{
        const newTask = await Tasks.create({
            nome,
            descricao
        })
        res.status(201).json({message: "Tarefa Criada!"});
    }
    catch (error){
        console.error(error)
        res.status(500).json({ message: "Erro ao criar tarefa" });
    }
}

//REF 02
export const getTasksByPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    try {
        const tarefas = await Tasks.findAndCountAll({limit, offset})
        const totalPaginas = Math.ceil(tarefas.count / limit)
        
        res.status(200).json({
        totalTarefas: tarefas.count,
        totalPaginas,
        paginaAtual: page,
        itemsPorPagina: limit,
        proximaPagina: totalPaginas === 0 
            ? null 
            : `localhost:8080/tarefas?page=${page + 1}&limit=${limit}`,
        tarefas: tarefas.rows
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro ao buscar tarefas" });
    }
}

//REF 03
export const getById = async (req, res) => {
    const idValidation = getSchema.safeParse(req.params.id)
    if(!idValidation.success){
        return res.status(400).json({message: "Os dados recebidos no corpo da aplicação são invalidos", detalhes: formatZodError(idValidation.error)})
    }
    const id = idValidation.data
    try{
        const taskById = await Tasks.findByPk(id)
        if(!taskById){
            return res.status(404).json({message: "Não foi encontrado a tarefa pelo ID!"})
        }
        res.status(200).json({tarefa: taskById})
    }
    catch (error){
        console.error(error)
        res.status(400).json({ message: "Erro ao buscar tarefa" });
    }
}

//REF 04
export const updateTask = async (req, res) => {
    const idValidation = getSchema.safeParse(req.params.id)
    const updateValidation = updateTarefaSchema.safeParse(req.body)
    if(!idValidation.success){
        return res.status(400).json({message: "Os dados recebidos no corpo da aplicação são invalidos", detalhes: formatZodError(idValidation.error)})
    }

    if(!updateValidation.success){
        return res.status(400).json({message: "Os dados recebidos no corpo da aplicação são invalidos", detalhes: formatZodError(updateValidation.error)})
    }
    const id = idValidation.data
    const { nome, descricao, status } = updateValidation.data;
    
    const tarefaAtualizada = {
        nome,
        descricao,
        status,
    }

    try {
        const [linhasAfetadas] = await Tasks.update(tarefaAtualizada, { where: { task_id: id } })

        if (linhasAfetadas < 1) {
        return res.status(404).json({
            message: "Tarefa não atualizada."
        })
        }

        res.status(200).json({message: "Tarefa atualizada com sucesso."})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar tarefa" });
    }
}

//REF 05
export const updateStatus = async (req, res) => {
    const {id} = req.params;

    if(!id){
        return res.status(401).json({message: "Me informe o ID da tarefa desejada"})
    }
    try {
        const tarefa = await Tasks.findOne({raw: true,where: {task_id: id}});
        if(!tarefa){
            return res.status(404).json({message: "Não foi encontrado a tarefa pelo ID!"})
        }

        if (tarefa.status == 'pendente') {
            await Tasks.update({status: 'concluida'}, {where: {task_id: id}});
        } else if (tarefa.status == 'concluida'){
            await Tasks.update({status: 'pendente'}, {where: {task_id: id}});
        }
        
        const updatedTask = await Tasks.findOne({raw: true,where: {task_id: id}});
        res.status(200).json({tarefa: updatedTask});
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro ao atualizar tarefa" });
    }
}

//REF 06
export const getTaskBySituation = async (req, res) => {
    const {situacao} = req.params;
    if(situacao !== 'pendente' && situacao !== 'concluido'){
        return res.status(400).json({message: "Situação invalida. Use 'pendente' ou 'concluido'"});
    }

    try {
        const tarefas = await Tasks.findAll({where: {status: situacao}, raw: true});
        res.status(200).json(tarefas);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro ao atualizar tarefa" });
    }
}