import { Controller, Get } from '@nestjs/common';

@Controller('message')
export class MessageController {
  constructor() {}

  @Get()
  getExampleMessage(): string {
     return 'Hello World!';
  }
}
