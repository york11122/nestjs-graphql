import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import { User } from './user.entity'
import { resetPasswordResponse, createUserResponse, verifyEmailResponse } from "./user.dto";
import {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError
} from 'apollo-server-core'
import { hashPassword } from '@utils/password'
import { verifyToken } from '@utils/auth/jwt'
@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    public async findUserByID (id: string) {
        return await this.userRepository.findOne({ where: { _id: id } })
    }

    //建立帳號
    public async createUser (account: string, password: string, name: string): Promise<typeof createUserResponse> {

        //檢查帳號是否重複
        let existedUser = await this.userRepository.findOne({
            where: {
                'local.account': account
            }
        })

        if (existedUser) {
            return { message: 'User already exists.' }
        }

        //新增user
        let createdUser = await this.userRepository.save(new User({ local: { account, password: await hashPassword(password) }, name }))

        return createdUser
    }

    public async verifyEmail (emailToken: string): Promise<typeof verifyEmailResponse> {
        const data = await verifyToken(emailToken, 'emailToken')
        const user = await this.userRepository.findOne({ where: { _id: data._id } })
        console.log(user)
        if (!user.isVerified) {
            return await this.userRepository.save(new User({ ...user, isVerified: true, email: data.email }))
        }
        else {
            return { message: "Your email has been verified." }
        }
    }

    public async resetPassword (emailToken: string, newPassword: string): Promise<typeof resetPasswordResponse> {
        const data = await verifyToken(emailToken, 'resetPassToken')
        const user = await this.userRepository.findOne({ where: { _id: data._id } })
        if (!user) {
            return { message: "User not found." }
        }
        return await this.userRepository.save(
            new User({
                ...user,
                local: {
                    account: user.local.account,
                    password: await hashPassword(newPassword)
                },
            })
        )
    }
}