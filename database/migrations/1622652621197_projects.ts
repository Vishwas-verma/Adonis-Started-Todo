import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Projects extends BaseSchema {
    protected tableName = "projects";

    public async up() {
        this.schema.createTable(this.tableName, table => {
            table.bigIncrements("id").primary();
            table.string("name").notNullable();
            table.string("description").nullable();
            table.bigInteger("created_by").notNullable().unsigned().references("id").inTable("users");
            table.timestamps(true);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
