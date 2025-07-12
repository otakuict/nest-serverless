import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.getFileContent();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    const users: User[] = await this.userService.getFileContent();
    return users.find((user) => user.id === id) || null;
  }

  @Post()
  async addUser(@Body() newUser: User): Promise<any> {
    const users: User[] = await this.userService.getFileContent();

    users.push(newUser);
    return this.userService.createOrUpdateFile(users, `Add user ${newUser.id}`);
  }
}
