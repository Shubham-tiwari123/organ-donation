import { Module } from '@nestjs/common';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IOT, IOTSchema } from 'src/schemas/iot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: IOT.name,
      schema: IOTSchema
    }])
  ],
  controllers: [IotController],
  providers: [IotService]
})
export class IotModule {}
