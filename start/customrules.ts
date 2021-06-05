/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from "@ioc:Adonis/Core/Validator";

const ruleName = "password";
validator.rule(ruleName, (value, _args, { pointer, errorReporter }) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const result = new RegExp(regex, "g").test(value);
    if (!result)
        errorReporter.report(pointer, ruleName, "String must contain One lowercase, one uppercase, one number and one special character and should be minimum of 8 character");
});
