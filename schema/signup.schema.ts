import { GenderEnum } from "App/Enums/gender.enum";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

export const signupSchema = schema.create({
    first_name: schema.string(),
    last_name: schema.string.optional(),
    gender: schema.enum([GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.TRANSGENDER]),
    phone_number: schema.number.optional(),
    email: schema.string({}, [rules.email(), rules.unique({ table: "users", column: "email" })]),
    password: schema.string({ trim: true })
});
