import Express, { json, urlencoded } from 'express';
import dotenv from 'dotenv';
import router from './routes/taskRoutes.js';
import sequelize from './config/dbconfig.js'
import Task from './model/taskModel.js';

dotenv.config();

const PORT = process.env.PORT;
const app = Express();

app.use(json())
app.use(urlencoded({extended: true}))

app.use('/', router);

app.use((req, res) => {
    res.status(404).json("Page Not Found")
})

sequelize.sync().then(() => {
    console.log('Database connected!');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});