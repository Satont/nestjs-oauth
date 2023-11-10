import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from './users/users.decorator';
import { User as UserType } from './users/users.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @UseGuards(AuthGuard)
  getUser(@User() user: UserType) {
    return user;
  }
}
