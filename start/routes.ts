/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.get('/facebook', ({ ally }) => {
      // const facebook = ally.use('facebook')

      return ally.use('facebook').redirect()
    })
  })
  .prefix('api/v1/users/social-auth')

router
  .group(() => {
    router.post('/login', [UsersController, 'login'])
    router.post('/register', [UsersController, 'register'])
    router.get('/profile', [UsersController, 'profile'])
  })
  .prefix('api/v1/users')
