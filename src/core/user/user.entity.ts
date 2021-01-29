import { Entity, Column, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm'
import { ObjectType, Field, ID, InputType, Directive, registerEnumType } from '@nestjs/graphql'
import { Expose, plainToClass } from 'class-transformer'

@ObjectType()
export class Local {
    @Field()
    account: string
    @Field()
    password: string
}

@ObjectType()
export class Line {
    @Field()
    _id: string
    @Field()
    token?: string
    @Field()
    name?: string
    @Field()
    email?: string
}

@ObjectType()
export class Facebook {
    @Field()
    _id: string
    @Field()
    token?: string
    @Field()
    name?: string
    @Field()
    email?: string
}

@ObjectType()
export class Google {
    @Field()
    _id: string
    @Field()
    token?: string
    @Field()
    name?: string
    @Field()
    email?: string
}

export enum UserType {
    BASIC,
    ADMIN
}
registerEnumType(UserType, {
    name: 'UserType',
});


@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn()
    @ObjectIdColumn()
    @Field(() => ID)
    id: string

    @Expose()
    @Column()
    @Field({ nullable: true })
    local: Local

    @Expose()
    @Column()
    @Field({ nullable: true })
    line: Line

    @Expose()
    @Column()
    @Field({ nullable: true })
    facebook: Facebook


    @Expose()
    @Column()
    @Field({ nullable: true })
    google: Google

    @Expose()
    @Column()
    @Field()
    name: string

    @Expose()
    @Column()
    @Field()
    avatar: string

    @Expose()
    @Column()
    @Field(() => UserType)
    type: UserType

    @Expose()
    @Column()
    @Field()
    createdAt: Date

    @Expose()
    @Column()
    @Field()
    updatedAt: Date

    constructor(user: Partial<User>) {
        if (user) {
            Object.assign(
                this,
                plainToClass(User, user, {
                    excludeExtraneousValues: true
                })
            )
            this.name = this.name || ""
            this.type = this.type || UserType.BASIC
            this.createdAt = this.createdAt || new Date()
            this.updatedAt = new Date()
        }
    }
}
