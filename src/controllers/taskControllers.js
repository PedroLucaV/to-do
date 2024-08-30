import Tasks from '../model/taskModel.js';

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
        res.status(400).json({ message: error.message });
    }
}