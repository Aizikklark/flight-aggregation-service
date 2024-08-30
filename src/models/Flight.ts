import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'flights',
  timestamps: false,
})
export class Flight extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  icao24!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  callsign!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  origin_country!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  longitude!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  latitude!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  altitude!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  velocity!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  heading!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  last_contact!: Date;
}
