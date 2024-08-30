import { Sequelize } from 'sequelize-typescript';
import { Flight } from './models/Flight';
import { AggregatedData } from './models/AggregatedData';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'flight_monitoring',
  models: [Flight, AggregatedData], // Указываем модели для подключения
  logging: false,
});

sequelize.sync({ force: true }); // Синхронизация базы данных
