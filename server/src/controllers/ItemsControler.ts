import url from 'url';
import { Request, Response } from 'express';

import { Item } from '../database/interfaces';
import { Table } from '../database/table.enum';
import connection from '../database/connections';


export class ItemsController {
  async index(request: Request, response: Response<Item[]>) {
    const items: Item[] = await connection(Table.items).select('*');
    const serialized = items.map(item => ({
      id: item.id,
      title: item.title,
      image: url.format({
        protocol: request.protocol,
        host: request.get('host'),
        pathname: `uploads/${item.image}`,
      })
    }));
    response.json(serialized);
  }
}

