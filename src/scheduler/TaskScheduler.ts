import cron from 'node-cron';
import { Flight } from '../models/Flight';
import { FlightService } from '../services/FlightService';

// Функция для очистки таблицы `flights`
async function clearFlightsTable() {
  try {
    await Flight.destroy({ where: {} });  // Удаляем все записи из таблицы `flights`
    console.log('Таблица flights очищена.');
  } catch (error) {
    console.error('Ошибка при очистке таблицы flights:', error);
  }
}

// Запуск задачи раз в минуту
cron.schedule('* * * * *', async () => {
  console.log('Выполняем задачу по агрегации данных каждую минуту...');

  // Очистка таблицы `flights` перед выполнением задачи
  await clearFlightsTable();

  // Запускаем функцию для агрегации данных
  await FlightService.fetchAndAggregateFlights()
    .catch(error => console.error('Ошибка выполнения задачи:', error));
});





// Запуск задачи раз в час
/*cron.schedule('0 * * * *', () => {
  console.log('Выполняем задачу по агрегации данных...');
  FlightService.fetchAndAggregateFlights()
    .catch(error => console.error('Ошибка выполнения задачи:', error));
});*/
