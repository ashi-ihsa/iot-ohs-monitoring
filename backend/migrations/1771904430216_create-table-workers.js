export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("workers", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    department: {
      type: "varchar(100)",
      notNull: false,
    },
  });

  pgm.sql(`
    INSERT INTO workers (id, name, department) VALUES ('device-1', 'Worker 1', 'Engineering');
    INSERT INTO workers (id, name, department) VALUES ('device-2', 'Worker 2', 'Engineering');
  `);
};

export const down = (pgm) => {
  pgm.dropTable("workers");
};
