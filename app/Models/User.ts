import {DateTime} from 'luxon'
import {BaseModel, beforeSave, column, hasMany, HasMany, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import {GenderEnum} from "App/Enums/gender.enum";
import Hash from "@ioc:Adonis/Core/Hash";
import Todo from "App/Models/Todo";
import Project from "App/Models/Project";

export default class User extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public first_name: string

  @column()
  public last_name: string | null

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string


  @column()
  public phone_number: number

  @column()
  public gender: GenderEnum

  public async getFullName(){
    return `${this.first_name} ${this.last_name}`
  }

  @column.dateTime({serializeAs: null}) // serializeAs is used to hide field in response
  public deletedAt: DateTime

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @hasMany(() => Todo, {
    foreignKey: 'created_by',
  })
  public todos: HasMany<typeof Todo>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Project, {
    localKey: 'createdBy'
  })
  public works: HasMany<typeof Project>

  @manyToMany(() => Project, {
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'project_id',
    pivotColumns: ['role'], // Extra columns in pivot table are placed here
    pivotTable: 'project_users'
  })
  public projects: ManyToMany<typeof Project>

  public serializeExtras() {
    return {
      role: this.$extras.pivot_role
    }
  }
  //
  // public serializeExtras() {
  //   return {
  //     pivot: {
  //       role: this.$extras.pivot_role
  //     }
  //   }
  // }

  // public serializeExtras = true
}
