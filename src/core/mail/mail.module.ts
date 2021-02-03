import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailResolver } from './mail.resolver';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@core/user/user.entity'
import { UserService } from "@core/user/user.service";
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, MailService, MailResolver],
})
export class MailModule { }
