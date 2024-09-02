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
        res.status(400).json({ message: "Erro ao criar tarefa" });
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
        res.status(400).json({ message: "Erro ao atualizar tarefa" });
    }
}