import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Press } from './press.entity'
import { PressService } from './press.service';
import { PressResolver } from './press.resolver';
import { DateScalar } from '@config/graphql/scalar/date.scalar'

@Module({
  imports: [TypeOrmModule.forFeature([Press])],
  providers: [DateScalar, PressService, PressResolver]
})
export class PressModule { }
