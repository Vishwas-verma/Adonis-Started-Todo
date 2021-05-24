import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UserNotFoundException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/

const message = 'User Not Found Exception'
const status = 501

export default class UserNotFoundException extends Exception {
  constructor () {
    super(message, status)
  }
}
