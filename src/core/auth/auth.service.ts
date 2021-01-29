import { Injectable, Req, Res } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import { User } from '@core/user/user.entity'
import { LoginResponse } from "@core/auth/auth.dto";
import { comparePassword } from "@utils/password";
import { tradeToken } from "@utils/auth/jwt";
import {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError
} from 'apollo-server-core'
import {
    authenticateLine,
    authenticateFacebook,
    authenticateGoogle
} from '@utils/auth/passport'


@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    //一般登入
    public async login (account: string, password: string): Promise<LoginResponse> {
        let user = await this.userRepository.findOne({
            where: {
                'local.account': account
            }
        })

        if (user && (await comparePassword(password, user.local.password))) {
            return await tradeToken(user)
        }

        throw new AuthenticationError('Login failed.')
    }

    //Line
    public async oauthLine (req: Request, res: Response): Promise<LoginResponse> {

        const { data, info } = await authenticateLine(req, res)
        if (data) {
            const { profile } = data
            let user

            user = await this.userRepository.findOne({
                where: {
                    'line._id': profile.id
                }
            })

            if (!user) {
                // add create User
                user = await this.userRepository.save(
                    new User({
                        line: {
                            _id: profile.id,
                            name: profile.displayName,
                            email: profile.email ? profile.email : ''
                        },
                        name: profile.displayName,
                        avatar: profile.pictureUrl
                    })
                )
            }
            return await tradeToken(user)
        }

        if (info) {
            const { code } = info
            console.log(info)
            switch (code) {
                case 'ETIMEDOUT':
                    throw new ApolloError('Failed to reach Line: Try Again')
                default:
                    throw new ApolloError('Something went wrong')
            }
        }
    }

    //facebook
    public async oauthFacebook (req: Request, res: Response): Promise<LoginResponse> {

        const { data, info } = await authenticateFacebook(req, res)
        if (data) {
            const { profile } = data
            let user

            user = await this.userRepository.findOne({
                where: {
                    'facebook._id': profile.id
                }
            })

            if (!user) {
                // add create User
                user = await this.userRepository.save(
                    new User({
                        facebook: {
                            _id: profile.id,
                            name: profile.name.givenName + profile.name.familyName,
                            email: profile.emails[0].value
                        },
                        name: profile.name.givenName + profile.name.familyName,
                        avatar: profile.photos[0].value
                    })
                )
            }
            return await tradeToken(user)
        }

        if (info) {
            const { code } = info
            switch (code) {
                case 'ETIMEDOUT':
                    throw new ApolloError('Failed to reach Line: Try Again')
                default:
                    throw new ApolloError('Something went wrong')
            }
        }
    }

    //Google
    public async oauthGoogle (req: Request, res: Response): Promise<LoginResponse> {

        const { data, info } = await authenticateGoogle(req, res)
        if (data) {
            const { profile } = data
            let user

            user = await this.userRepository.findOne({
                where: {
                    'google._id': profile.id
                }
            })
            console.log(profile)
            if (!user) {
                // add create User
                user = await this.userRepository.save(
                    new User({
                        google: {
                            _id: profile.id,
                            name: profile.name.givenName + profile.name.familyName,
                            email: profile.emails[0].value
                        },
                        name: profile.name.givenName + profile.name.familyName,
                        avatar: profile.photos ? profile.photos[0].value : ''
                    })
                )
            }
            return await tradeToken(user)
        }

        if (info) {
            const { code } = info
            console.log(info)
            switch (code) {
                case 'ETIMEDOUT':
                    throw new ApolloError('Failed to reach Line: Try Again')
                default:
                    throw new ApolloError('Something went wrong')
            }
        }
    }
}
