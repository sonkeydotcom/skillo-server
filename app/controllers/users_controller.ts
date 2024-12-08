import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      const user = await User.verifyCredentials(email, password)

      if (!user) {
        throw new Error('Invalid email or password')
      }

      const token = await User.accessTokens.create(user)
      return response.ok({
        status: 200,
        message: 'Logged in successfully',
        user: {
          ...user.toJSON(),
          token: token.value!.release(),
        },
      })
    } catch (error) {
      return response.badRequest({
        status: error.status,
        message: error.message,
      })
    }
  }

  async register({ request, response }: HttpContext) {
    const { fullName, email, password } = request.only(['fullName', 'email', 'password'])

    try {
      if (!fullName || !email || !password) {
        throw new Error('Full name, email and password are required')
      }

      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        throw new Error('A user with that email already exists')
      }

      const user = await User.create({ fullName, email, password })
      return response.ok({
        status: 200,
        message: 'Registered successfully',
        user: user.toJSON(),
      })
    } catch (error) {
      return response.badRequest({
        status: error.status,
        message: error.message,
      })
    }
  }

  async profile({ response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()

      if (!user) {
        throw new Error('User not authenticated')
      }
      return response.ok({
        status: 200,
        message: 'Retrieved user profile',
        user: user.toJSON(),
      })
    } catch (error) {
      return response.badRequest({
        status: error.status,
        message: error.message,
      })
    }
  }
}
