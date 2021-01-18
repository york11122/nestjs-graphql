import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import { Press } from './press.entity'

@Injectable()
export class PressService {
    constructor(@InjectRepository(Press) private readonly pressRepository: Repository<Press>) { }

    public findAll () {
        return this.pressRepository.find()
    }

    public findOneById (id: string) {
        return this.pressRepository.findOne(id)
    }

    public updateOne (press: Partial<Press>) {
        return this.pressRepository.update(press.id, press)
    }

    public addOne (press: Partial<Press>) {
        return this.pressRepository.save(press)
    }

    public deleteOne (id: string) {
        return this.pressRepository.delete(id)
    }
}