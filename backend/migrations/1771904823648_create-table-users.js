export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    username: {
      type: "varchar(50)",
      notNull: true,
    },
    password: {
      type: "TEXT",
      notNull: true,
    },
    fullname: {
      type: "TEXT",
      notNull: true,
    },
  });
  pgm.sql(`
    INSERT INTO users (id, username, password, fullname) VALUES ('user-1', 'admin', 'password', 'Admin User') ON CONFLICT (id) DO NOTHING;
  `);
};

export const down = (pgm) => {
  pgm.dropTable("users");
};
