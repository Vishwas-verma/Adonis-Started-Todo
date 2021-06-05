import BaseSchema from "@ioc:Adonis/Lucid/Schema";
import { ProjectRoleEnum } from "Contracts/Enums/ProjectRoleEnum";

export default class ProjectUsers extends BaseSchema {
    protected tableName = "project_users";

    public async up() {
        this.schema.createTable(this.tableName, table => {
            table.bigIncrements("id").primary();
            table.bigInteger("project_id").unsigned().references("id").inTable("projects").notNullable();
            table.bigInteger("user_id").unsigned().references("id").inTable("users").notNullable();
            table.enum("role", [ProjectRoleEnum.PROJECT_LEADER, ProjectRoleEnum.FULL_TIME, ProjectRoleEnum.INTERN]).notNullable();
            table.timestamps(true);
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
