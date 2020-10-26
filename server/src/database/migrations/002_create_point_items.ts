import Knex from 'knex';

import { Table } from '../table.enum';

// Pivot Table
export async function up(knex: Knex) {
  return knex.schema.createTable(Table.point_items, table => {
    table.increments('id').primary();
    table.integer('point_id')
      .notNullable()
      .references('id')
      .inTable(Table.points);

    table.integer('item_id')
      .notNullable()
      .references('id')
      .inTable(Table.items);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(Table.point_items);
}
