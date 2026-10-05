import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CouponsModule } from '../coupons/coupons.module';
import { MailService } from '../../shared/mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'devascent_jwt_secret_key_change_in_production_min_64_characters_long',
      signOptions: { expiresIn: '7d' },
    }),
    CouponsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, MailService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
