import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column, manyToMany, ManyToMany } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";

export default class Project extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public name: string;

    @column()
    public description?: string;

    @column()
    public createdBy: number;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @manyToMany(() => User, {
        pivotForeignKey: "project_id",
        pivotColumns: ["role"], // Extra columns in pivot table are placed here
        pivotTable: "project_users",
        pivotRelatedForeignKey: "user_id"
    })
    public members: ManyToMany<typeof User>;

    @belongsTo(() => User, {
        foreignKey: "createdBy"
    })
    public creator: BelongsTo<typeof User>;
}
