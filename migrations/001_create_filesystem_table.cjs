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
  const now = Math.floor(Date.now() / 1000);

  return knex('filesystem').insert([
    {
      id: 'c_drive', userId: 'global', parentId: null, name: 'C:',
      type: 'FOLDER', size: 244322607104, status: 'ACTIVE', icon: 'drive-harddisk',
      createdAt: now, updatedAt: now
    },
    {
      id: 'd_drive', userId: 'global', parentId: null, name: 'D:',
      type: 'FOLDER', size: 24322607104, status: 'ACTIVE', icon: 'drive-harddisk',
      createdAt: now, updatedAt: now
    },
    {
      id: 'programfiles', userId: 'global', parentId: 'c_drive', name: 'Program Files',
      type: 'FOLDER', size: 452224343, status: 'ACTIVE', icon: 'folder',
      createdAt: now, updatedAt: now
    },
    {
      id: 'programfilesx', userId: 'global', parentId: 'c_drive', name: 'Program Files (x86)',
      type: 'FOLDER', size: 343524321, status: 'ACTIVE', icon: 'folder',
      createdAt: now, updatedAt: now
    },
    {
      id: 'windows', userId: 'global', parentId: 'c_drive', name: 'Windows',
      type: 'FOLDER', size: 18345220352, status: 'ACTIVE', icon: 'folder',
      createdAt: now, updatedAt: now
    },
    {
      id: 'users', userId: 'global', parentId: 'c_drive', name: 'Users',
      type: 'FOLDER', size: 122334455, status: 'DISABLED', icon: 'folder',
      createdAt: now, updatedAt: now
    },
    {
      id: 'programdata', userId: 'global', parentId: 'c_drive', name: 'ProgramData',
      type: 'FOLDER', size: 22334455, status: 'ACTIVE', icon: 'folder',
      createdAt: now, updatedAt: now
    },
    {
      id: 'perflogs', userId: 'global', parentId: 'c_drive', name: 'PerfLogs',
      type: 'FOLDER', size: 1048576, status: 'ACTIVE', icon: 'folder',
      createdAt: now, updatedAt: now
    },
    {
      id: 'onedrivetemp', userId: 'global', parentId: 'c_drive', name: 'OneDriveTemp',
      type: 'FOLDER', size: 1324576, status: 'HIDDEN', icon: 'folder',
      createdAt: now, updatedAt: now
    }
    ]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('filesystem');
};