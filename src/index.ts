import { sequelize } from './config';
import { FlightService } from './services/FlightService';
import './scheduler/TaskScheduler'; // Подключаем планировщик задач

// Инициализация базы данных и немедленный запуск
sequelize.authenticate()
  .then(() => {
    console.log('Подключение к базе данных успешно');

    // Немедленный запуск функции для проверки данных
    FlightService.fetchAndAggregateFlights();
  })
  .catch((error) => {
    console.error('Ошибка подключения к базе данных:', error);
  });
