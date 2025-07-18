import { Module } from '@nestjs/common';

import { UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UserService],
})
export class UserModule {}
