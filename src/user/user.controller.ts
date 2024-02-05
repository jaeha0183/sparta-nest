import { Controller, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login() {
    return await this.userService.login('userId', 'password');
  }

  @Post('/signup')
  async createUser() {
    return await this.userService.createUser('userId', 'name', 'password');
  }

  @Put('/update')
  updateUser() {
    this.userService.updateUser('userId', 'new_name', 'new_password');
  }
}
