import Knex from 'knex';

import { Item } from '../interfaces';
import { Table } from '../table.enum';


export async function seed(knex: Knex) {
  const items: Array<Item> = [
    { title: 'Lâmpadas', image: 'lampadas.svg' },
    { title: 'Pilhas e Baterias', image: 'baterias.svg' },
    { title: 'Papéis e Papelão', image: 'papeis-papelao.svg' },
    { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
    { title: 'Resíduos Orgânicos', image: 'organicos.svg' },
    { title: 'Óleo de Cozinha', image: 'oleo.svg' },
  ];
  await knex(Table.items).insert(items);
}
