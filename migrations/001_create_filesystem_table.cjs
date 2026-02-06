exports.up = function (knex) {
  return knex.schema
    .createTable('filesystem', (table) => {
      table.string('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('userId').notNullable().index();

      table.string('parentId').nullable();

      table.foreign('parentId').references('id').inTable('filesystem').onDelete('CASCADE');

      table.string('name', 255)
      table.enu('type', ['FILE', 'FOLDER']).notNullable();
      table.bigInteger('size').nullable();
      table.string('status', 50).notNullable().defaultTo('ACTIVE');
      table.string('icon').notNullable().defaultTo("document-blank");
      table.integer('createdAt').notNullable().defaultTo(knex.raw("EXTRACT(EPOCH FROM NOW())::INTEGER"));
      table.integer('updatedAt').notNullable().defaultTo(knex.raw("EXTRACT(EPOCH FROM NOW())::INTEGER"));

      table.unique(['parentId', 'name']);
    })
    .then(() => {
      return knex('filesystem').insert([
        {
          id: 'c_drive',
          userId: 'global',
          parentId: null,
          name: 'C:',
          type: 'FOLDER',
          size: 244322607104,
          status: 'ACTIVE',
          icon: "drive-harddisk",
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000)
        },
        {
          id: 'd_drive',
          userId: 'global',
          parentId: null,
          name: 'D:',
          type: 'FOLDER',
          size: 14322607104,
          status: 'ACTIVE',
          icon: "drive-harddisk",
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000)
        }
      ]);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('filesystem');
};