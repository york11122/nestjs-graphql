import { ObjectType, Field, ID, InputType, Directive, registerEnumType } from '@nestjs/graphql'
import { User, UserType } from "./user.entity";
import { MinLength, MaxLength } from 'class-validator'

@InputType({ description: "建立帳號參數" })
export class createUserInput {
    @Field({ description: "帳號, 格式為5~10字元" })
    @MinLength(10)
    account: string
    @Field({ description: "長度為10" })
    password: string
    @Field({ description: "長度為10" })
    name: string
}

@ObjectType({ description: "當前用戶資料" })
export class UserResponse implements Partial<User>{
    @Field({ description: "長度為10" })
    name: string
    @Field(() => UserType, { description: "長度為10" })
    type: UserType
    @Field({ description: "長度為10" })
    createdAt: Date
    @Field({ description: "長度為10" })
    updatedAt: Date
}