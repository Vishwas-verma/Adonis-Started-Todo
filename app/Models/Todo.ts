import {DateTime} from 'luxon'
import {BaseModel, belongsTo, BelongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";

export default class Todo extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public title: string

  @column()
  public is_created: string

  @column()
  public created_by: number

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @column.dateTime({serializeAs: null})
  public deletedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'created_by'
  })
  public creator: BelongsTo<typeof User>
}
