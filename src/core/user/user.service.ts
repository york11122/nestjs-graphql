import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import { User } from './user.entity'
import { UserResponse, createUserResponse, createUserError } from "./user.dto";
import {
    ApolloError,
    AuthenticationError,
    ForbiddenError,
    UserInputError
} from 'apollo-server-core'
import { hashPassword } from '@utils/password'

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    public async findUserByID (id: string) {
        return await this.userRepository.findOne(id)
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

}