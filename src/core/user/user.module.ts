import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { DateScalar } from '@config/graphql/scalar/date.scalar'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [DateScalar, UserService, UserResolver],
  exports: [UserService]
})
export class UserModule { }
