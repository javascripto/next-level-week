import HttpStatus, { getStatusText } from 'http-status-codes';
import { Request, Response } from 'express';

import connection from '../database/connections';
import { Table } from './../database/table.enum';
import { Point, PointItem } from './../database/interfaces';


type ErrorMessage = { message: string };
type ShowPoint = { point: Point, items: { title: string }[] };
type CreatePointRequest = Request<any, any, Point & { items: number[] }>;
type IndexRequest = Request<any, any, any, { city?: string, uf?: string, items?: string[] }>

export class PointsController {

  async index(request: IndexRequest, response: Response<Point[]>) {
    const { city = '', uf = '', items = [] } = request.query;
    const points: Point[] = await connection(Table.points)
      .join(Table.point_items, 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', items?.map(Number))
      .where('city', city)
      .where('uf', uf)
      .distinct()
      .select(Table.points + '.*');
    response.json(points);
  }

  async show(request: Request, response: Response<ShowPoint|ErrorMessage>) {
    const { id } = request.params;
    const point = await connection(Table.points).where('id', id).first();
    if (!point) {
      const message = getStatusText(HttpStatus.NOT_FOUND);
      return response.status(HttpStatus.NOT_FOUND).json({ message });
    }
    const items: { title: string}[] = await connection(Table.items)
      .join(Table.point_items, 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');
    return response.json({ point, items});
  }

  async create(request: CreatePointRequest, response: Response) {
    const { items, id, ...body } = request.body;
    const image_url = 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea' +
      '?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60';
    const point = {...body, image: image_url };
    const transaction = await connection.transaction();
    try {
      const [ point_id ] = await transaction(Table.points).insert({...point});
      const pointItems: PointItem[] = items.map(item_id => ({ item_id, point_id }));
      await transaction(Table.point_items).insert(pointItems);
      await transaction.commit();
      return response.json({ ...point, id: point_id, items: pointItems });
    } catch (e) {
      await transaction.rollback();
      return response.json(e);
    }
  }
}
