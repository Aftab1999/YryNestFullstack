import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanRequest } from './pan.entity';
import { PanService } from './pan.service';
import { PanController } from './pan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PanRequest])],
  providers: [PanService],
  controllers: [PanController],
})
export class PanModule {}
