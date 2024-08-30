const validateTask = (req, res, next) => {
    let {nome, descricao} = req.body;
    
    if(!nome){
        return res.status(401).json({message: "Informe o nome da requisição"})
    }

    if(!descricao){
        descricao = ''
    }

    next()
}

export default validateTask;