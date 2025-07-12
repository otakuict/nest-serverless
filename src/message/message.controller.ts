import { Controller, Get } from '@nestjs/common';

@Controller('message')
export class MessageController {
  constructor() {}

  @Get()
  getExampleMessage(): object {
    return {
      id: 1,
      name: 'otaku ice',
    };
  }
}
