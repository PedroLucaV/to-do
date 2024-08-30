import sequelize from '../config/dbconfig.js'
import { DataTypes } from 'sequelize'

const Tasks = sequelize.define(
    'Tasks', 
    {
        task_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nome: {
            type: DataTypes.TEXT('medium'),
            allowNull: false,
            required: true
        },
        descricao: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        status: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "pendente"
        }
},
{
    tableName: "Tasks",
    timestamps: true,
    createdAt: true,
    updatedAt: true
})

export default Tasks;