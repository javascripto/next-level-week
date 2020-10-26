import cors from 'cors';
import express from 'express';

import router from './router';


const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(3333, () => console.log(`Servindo em http://localhost:3333`));

