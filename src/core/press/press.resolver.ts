import { Resolver, Query, Mutation, Args, Directive } from '@nestjs/graphql';
import { PressService } from './press.service';
import { Press, CreatePressInput, UpdatePressInput, DeletePressInput } from './press.entity'
import { awaitWrap } from '@common'


@Resolver('Press')
export class PressResolver {
    constructor(private readonly pressService: PressService) { }

    @Query(() => [Press])
    async allPress () {
        return await this.pressService.findAll();
    }

    @Query(() => Press)
    async getPress (@Args('id') id: string) {
        return await this.pressService.findOneById(id);
    }

    @Mutation(() => Press)
    async createPress (@Args('input') input: CreatePressInput) {
        return await this.pressService.addOne(new Press(input));
    }

    @Mutation(() => Press)
    async updatePress (@Args('input') input: UpdatePressInput) {
        const [err] = await awaitWrap(this.pressService.updateOne(input));
        if (err) {
            return input;
        }
        return this.pressService.findOneById(input.id);
    }

    @Mutation(() => Boolean)
    async deletePress (@Args('input') input: DeletePressInput) {
        const [err] = await awaitWrap(this.pressService.deleteOne(input.id));
        if (err) {
            return false;
        }
        return true;
    }
}