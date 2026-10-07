import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CouponsModule } from '../coupons/coupons.module';
import { MailService } from '../../shared/mail.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET;
        if (!secret && process.env.NODE_ENV === 'production') {
          throw new Error('FATAL: JWT_SECRET environment variable is missing in production.');
        }
        return {
          secret: secret || 'devascent_dev_fallback_secret_never_use_in_production_min_64_chars',
          signOptions: { expiresIn: '7d' },
        };
      },
      inject: [ConfigService],
    }),
    CouponsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, MailService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
