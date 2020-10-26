import Knex from 'knex';

import { Table } from './../table.enum';


export async function up(knex: Knex) {
  return knex.schema.createTable(Table.items, table => {
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('title').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(Table.items);
}
