import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').unique().primary()
      table.string('first_name').notNullable()
      table.string('last_name').nullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.bigInteger('phone_number').nullable()
      table.enum('gender', ['male', 'female', 'transgender']).notNullable()
      table.dateTime('deletedAt').defaultTo(null)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
