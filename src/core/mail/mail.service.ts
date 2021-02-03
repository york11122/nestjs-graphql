import { Injectable } from '@nestjs/common';
import { User } from '@core/user/user.entity'
import { sendMail } from '@utils/mail'
import { generateToken } from '@utils/auth/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import { sendEmailResponse } from "./mail.dto";
@Injectable()
export class MailService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    public async sendVerifyEmail (email: string, user: User): Promise<typeof sendEmailResponse> {
        const existedUser = await this.userRepository.findOne({ where: { email, isVerified: true } })
        if (existedUser) {
            return { message: "Email already existed." }
        }
        const emailToken = await generateToken(user, 'emailToken', email)
        await sendMail('verifyEmail', user.name, email, emailToken)
        return { email: email }
    }

    public async sendForgetPasswordEmail (email: string): Promise<typeof sendEmailResponse> {
        const user = await this.userRepository.findOne({ where: { email } })
        if (!user) {
            return { message: "Email is not binding any account" }
        }
        const resetPassToken = await generateToken(user, 'resetPassToken')
        await sendMail('forgotPassword', user.name, email, resetPassToken)
        return { email: email }
    }

}
