export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("telemetries", {
    deviceId: {
      type: "varchar(50)",
      primaryKey: true,
    },
    timestamp: {
      type: "TEXT",
      notNull: true,
    },
    longitude: {
      type: "decimal(10,7)",
      notNull: true,
    },
    latitude: {
      type: "decimal(10,7)",
      notNull: true,
    },
    heartrate: {
      type: "float",
      notNull: true,
    },
    spo2: {
      type: "float",
      notNull: true,
    },
  });
  
  pgm.addConstraint(
    'telemetries',
    'fk_telemetries.deviceId',
    'FOREIGN KEY ("deviceId") REFERENCES workers(id) ON DELETE CASCADE'
  );
};

export const down = (pgm) => {
  pgm.dropTable("telemetries");
};
