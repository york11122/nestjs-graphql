import { Entity, Column, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm'
import { ObjectType, Field, ID, InputType, Directive } from '@nestjs/graphql'
import { Expose, plainToClass } from 'class-transformer'
import { MinLength, MaxLength } from 'class-validator'

@Entity()
@ObjectType()
export class Press {
    @PrimaryGeneratedColumn()
    @ObjectIdColumn()
    @Field(() => ID)
    id: string

    @Expose()
    @Column()
    @Field()
    @MinLength(2)
    @MaxLength(10)
    title: string

    @Expose()
    @Column()
    @Field()
    @MinLength(2)
    @MaxLength(100)
    context: string

    @Expose()
    @Column()
    @Field()
    createdAt: Date

    @Expose()
    @Column()
    @Field()
    updatedAt: Date

    constructor(press: Partial<Press>) {
        if (press) {
            Object.assign(
                this,
                plainToClass(Press, press, {
                    excludeExtraneousValues: true
                })
            )
            this.title = this.title || ""
            this.context = this.context || ""
            this.createdAt = this.createdAt || new Date()
            this.updatedAt = new Date()
        }
    }
}

@InputType()
export class CreatePressInput {
    @Field()
    title: string
    @Field()
    context: string
}

@InputType()
export class UpdatePressInput {
    @Field(() => ID)
    id: string
    @Field()
    title: string
    @Field()
    context: string
}

@InputType()
export class DeletePressInput {
    @Field(() => ID)
    id: string
}
