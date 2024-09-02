const formatZodError = (error) => {
    const formatedError = {
        
    }

    error.issues.forEach((err) => {
        const path = err.path[0]
        if(!formatedError[path]){
            formatedError[path] = []
        }
        formatedError[path].push(err.message);
    })

    return formatedError;
}

export default formatZodError;