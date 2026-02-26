export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("authentications", {
    token: {
      type: "TEXT",
      notNull: true,
    },
  });
  pgm.sql(`
    INSERT INTO authentications (token) VALUES ('dummy-token');
  `);
};

export const down = (pgm) => {
  pgm.dropTable("authentications");
};
