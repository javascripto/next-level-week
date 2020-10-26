import { Request, Response } from 'express';

export class MainController {
  index(request: Request, response: Response) {
    response.send('');
  }

  health(request: Request, response: Response) {
    response.json({ alive: true });
  }
}
