import Tasks from '../model/taskModel.js';

//REF 01
export const createTask = async (req, res) => {
    const {nome, descricao} = req.body;

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
    const {id} = req.params;
    if(!id){
        return res.status(401).json({message: "Me informe o ID da tarefa desejada"})
    }
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
    const { id } = req.params
    const { nome, descricao, status } = req.body
    
    const tarefaAtualizada = {
        nome,
        descricao,
        status,
    }

    try {
        const [linhasAfetadas] = await Tarefa.update(tarefaAtualizada, { where: { tarefa_id: id } })

        if (linhasAfetadas < 1) {
        return res.status(404).json({
            message: "Tarefa não encontrada."
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