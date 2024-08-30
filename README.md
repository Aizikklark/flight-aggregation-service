# Flight Monitoring Service

## Описание

**Flight Monitoring Service** - это микросервис, который собирает данные о полетах в реальном времени с помощью OpenSky Network API, обрабатывает и агрегирует их, а затем сохраняет результаты в базе данных PostgreSQL. Данные собираются и обновляются по расписанию (каждую минуту), создавая отдельные таблицы для каждой агрегации.

## Технологии

- **Node.js**: среда выполнения JavaScript.
- **TypeScript**: статически типизированный язык программирования.
- **Sequelize**: ORM для Node.js, используемый для работы с базой данных PostgreSQL.
- **PostgreSQL**: реляционная база данных для хранения данных.
- **axios**: HTTP клиент для запросов к API.
- **node-cron**: планировщик задач для выполнения операций по расписанию.

## Установка

1. **Клонируйте репозиторий:**

    ```bash
    git clone https://github.com/yourusername/flight-monitoring-service.git
    cd flight-monitoring-service
    ```

2. **Установите зависимости:**

    ```bash
    npm install
    ```

3. **Настройте подключение к базе данных:**

   Откройте файл `src/config.ts` и настройте параметры подключения к вашей базе данных PostgreSQL:

   ```typescript
   export const sequelize = new Sequelize({
     dialect: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'your_username',
     password: 'your_password',
     database: 'flight_monitoring',
     models: [Flight, AggregatedData],
     logging: false,
   });

    Замените your_username, your_password и другие параметры на свои собственные.

## Использование

1. **Запустите приложение:**

    ```bash
    npm start
    ```

    Приложение автоматически подключится к базе данных, выполнит первоначальную синхронизацию и начнет сбор данных.

2. **Планировщик задач:**

    Приложение использует node-cron для выполнения задач по сбору и агрегации данных каждую минуту. Время выполнения задач можно изменить в файле src/scheduler/TaskScheduler.ts.

## Основные файлы и директории

    src/config.ts: конфигурация базы данных и инициализация Sequelize.
    src/models/Flight.ts: модель для таблицы flights.
    src/models/AggregatedData.ts: модель для таблиц агрегированных данных.
    src/services/FlightService.ts: сервис для получения данных о полетах и их агрегации.
    src/scheduler/TaskScheduler.ts: планировщик задач для выполнения операций по расписанию.
    src/index.ts: точка входа в приложение.

## Примечания

    Очистка таблиц: Каждую минуту таблица flights очищается перед выполнением новой задачи сбора данных.
    Агрегация данных: Каждая агрегация данных сохраняется в новую таблицу с именем в формате aggregated_data_YYYYMMDDHHmm.
