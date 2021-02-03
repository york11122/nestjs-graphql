import { ObjectType, Field, ID, InputType, Directive, createUnionType, Extensions } from '@nestjs/graphql'
import { User, UserType } from "./user.entity";
import { MinLength, MaxLength, IsEmail } from 'class-validator'
import { roleMiddleware } from '@fieldMiddleware/role'
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

@InputType({ description: "重設密碼參數" })
export class resetPasswordInput {
    @Field({ description: "長度為10" })
    newPassword: string
    @Field({ description: "長度為10" })
    token: string
}

export const createUserResponse = createUnionType({
    name: 'createUserResponse',
    types: () => [UserResponse, createUserError],
    resolveType (value) {
        if (value.message) {
            return createUserError;
        }
        return UserResponse;
    },
});

export const verifyEmailResponse = createUnionType({
    name: 'verifyEmailResponse',
    types: () => [UserResponse, verifyEmailError],
    resolveType (value) {
        if (value.message) {
            return verifyEmailError;
        }
        return UserResponse;
    },
});

export const resetPasswordResponse = createUnionType({
    name: 'resetPasswordResponse',
    types: () => [UserResponse, resetPasswordError],
    resolveType (value) {
        if (value.message) {
            return resetPasswordError;
        }
        return UserResponse;
    },
});

@ObjectType({ description: "建立帳號異常" })
export class createUserError {
    @Field({ description: "異常訊息" })
    message: string
}

@ObjectType({ description: "驗證Email異常" })
export class verifyEmailError {
    @Field({ description: "異常訊息" })
    message: string
}

@ObjectType({ description: "重設密碼異常" })
export class resetPasswordError {
    @Field({ description: "異常訊息" })
    message: string
}

@ObjectType({ description: "當前用戶資料" })
export class UserResponse implements Partial<User>{
    @Field({ description: "用戶名稱" })
    name: string
    @Field(() => UserType, { description: "用戶類別" })
    type: UserType
    @Field({ description: "用戶頭像" })
    isVerified: boolean
    @Field({ description: "用戶頭像" })
    avatar: string
    @Field()
    createdAt: Date
    @Field()
    updatedAt: Date
}