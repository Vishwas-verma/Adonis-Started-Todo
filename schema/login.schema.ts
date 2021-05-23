import {rules, schema} from "@ioc:Adonis/Core/Validator";

export const loginSchema = schema.create({
  email: schema.string({}, [
    rules.email(),
    rules.unique({table: 'users', column: 'email'})
  ]),
  password: schema.string({}, [
    rules.minLength(8),
  ])
})
