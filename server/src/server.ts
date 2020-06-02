import express, { Request, Response } from 'express'

const app = express();

app.get('/users', (request: Request, response: Response) => {
  response.json([
    { name: 'John' },
    { name: 'Doe' },
  ]);
});

app.listen(3333);
