import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: `aggregated_data_${new Date().toISOString().slice(0, 13).replace(/[-T:]/g, '')}`,
  timestamps: false,
})
export class AggregatedData extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  origin_country!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  total!: number;
}
