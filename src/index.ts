import express from 'express';
require('dotenv').config()

import connectDB from "./utils/db";
import router from './routes';



const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();


app.use('/api/v1', router);


app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
})
