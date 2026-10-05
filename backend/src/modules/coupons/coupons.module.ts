import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { AdminCouponsController, PublicCouponsController } from './coupons.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminCouponsController, PublicCouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
