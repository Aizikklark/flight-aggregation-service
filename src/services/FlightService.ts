import axios from 'axios';
import { Flight } from '../models/Flight';
import { sequelize } from '../config';
import { DataTypes } from 'sequelize';

export class FlightService {
  private static API_URL = 'https://opensky-network.org/api/states/all';

  public static async fetchAndAggregateFlights(): Promise<void> {
    try {
      console.log('Подключение к базе данных успешно');

      // Тестируем запрос к API
      console.log('Тестируем запрос к API OpenSky Network...');
      try {
        const testResponse = await axios.get(FlightService.API_URL, { timeout: 5000 }); // Установите тайм-аут 5 секунд
        console.log('Данные успешно получены от API:', testResponse.data);
      } catch (apiError) {
        if (axios.isAxiosError(apiError)) {
          console.error('Ошибка при запросе к API OpenSky Network:', apiError.message);
        } else if (apiError instanceof Error) {
          console.error('Ошибка запроса к API OpenSky Network:', apiError.message);
        } else {
          console.error('Неизвестная ошибка при запросе к API OpenSky Network:', apiError);
        }
        return;  // Выход из функции, если запрос к API не удался
      }

      console.log('Запрашиваем данные о полетах с API...');
      const response = await axios.get(FlightService.API_URL);
      console.log('Данные успешно получены от API.');

      const flightsData = response.data.states;

      if (!flightsData) {
        console.error('Нет данных о полетах');
        return;
      }

      console.log(`Получено ${flightsData.length} записей о полетах. Обрабатываем данные...`);

      const flights = flightsData.map((flight: any) => ({
        icao24: flight[0],
        callsign: flight[1] || '',
        origin_country: flight[2],
        longitude: flight[5],
        latitude: flight[6],
        altitude: flight[7],
        velocity: flight[9],
        heading: flight[10],
        last_contact: new Date(flight[4] * 1000),
      }));

      console.log('Сохраняем данные о полетах в базе данных...');
      await Flight.bulkCreate(flights, { ignoreDuplicates: true });
      console.log('Данные о полетах успешно сохранены в таблице flights.');

      // Генерируем имя таблицы на основе текущего времени (с учетом минут)
      const tableName = `aggregated_data_${new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '')}`;
      console.log(`Создаем таблицу для агрегированных данных: ${tableName}`);

      const AggregatedData = sequelize.define(tableName, {
        origin_country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        total: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      }, {
        tableName: tableName,
        timestamps: false,
      });

      await AggregatedData.sync();
      console.log(`Таблица ${tableName} создана успешно.`);

      console.log('Выполняем агрегацию данных...');
      const aggregatedData = await Flight.findAll({
        attributes: [
          'origin_country',
          [sequelize.fn('COUNT', sequelize.col('origin_country')), 'total']
        ],
        group: ['origin_country'],
        order: [[sequelize.literal('total'), 'DESC']]
      });

      if (aggregatedData.length === 0) {
        console.error('Нет данных для агрегации. Таблица осталась пустой.');
        return;
      }

      console.log(`Агрегация выполнена успешно. Найдено ${aggregatedData.length} строк для вставки.`);

      const aggregatedDataToInsert = aggregatedData.map((data: any) => ({
        origin_country: data.get('origin_country'),
        total: data.get('total')
      }));

      console.log(`Вставляем ${aggregatedDataToInsert.length} строк в таблицу ${tableName}.`);

      await AggregatedData.bulkCreate(aggregatedDataToInsert);
      console.log(`Агрегированные данные успешно сохранены в таблицу: ${tableName}`);
    } catch (error) {
      console.error('Ошибка при обработке данных о полетах:', error);

      if (axios.isAxiosError(error)) {
        console.error('Ошибка запроса к API:', error.message);
      } else if (error instanceof Error) {
        console.error('Ошибка в коде:', error.message);
      } else {
        console.error('Неизвестная ошибка:', error);
      }
    }
  }
}
