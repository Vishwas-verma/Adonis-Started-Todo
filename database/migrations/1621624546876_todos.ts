import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Todos extends BaseSchema {
    protected tableName = "todos";

    public async up() {
        this.schema.createTable(this.tableName, table => {
            table.bigIncrements("id").unique().primary();
            table.string("title").notNullable();
            table.boolean("is_created").defaultTo(true);
            table.bigInteger("created_by").unsigned().references("users.id").onDelete("CASCADE").notNullable();
            table.dateTime("deleted_at").defaultTo(null);
            table.timestamps(true);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
