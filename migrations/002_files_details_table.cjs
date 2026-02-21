exports.up = function (knex) {
  return knex.schema
    .createTable('filedetails', (table) => {
      table.string('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.foreign('id').references('id').inTable('filesystem').onDelete('CASCADE');

      table.bigInteger('size').nullable();
      table.string('status', 50).notNullable().defaultTo('ACTIVE');

      table.integer('createdAt').notNullable().defaultTo(knex.raw("EXTRACT(EPOCH FROM NOW())::INTEGER"));
      table.integer('updatedAt').notNullable().defaultTo(knex.raw("EXTRACT(EPOCH FROM NOW())::INTEGER"));
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('filedetails');
};
// store file information in PVC with file id.
// location: /data/{userid}/filesystem/{parentId}.extenstion
//
