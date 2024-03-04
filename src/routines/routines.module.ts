import { Module } from '@nestjs/common';
import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';

@Module({
  imports: [],
  controllers: [RoutinesController],
  providers: [RoutinesService],
})
export class RoutinesModule {}
