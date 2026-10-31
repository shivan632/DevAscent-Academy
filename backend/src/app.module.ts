import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ProgressModule } from './modules/progress/progress.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { RefundsModule } from './modules/refunds/refunds.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiVideosModule } from './modules/ai-videos/ai-videos.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { DoubtsModule } from './modules/doubts/doubts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { CacheModule } from './shared/cache.module';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    CacheModule,
    PrismaModule,
    AuthModule,
    CoursesModule,
    ProgressModule,
    PaymentsModule,
    CertificatesModule,
    SubmissionsModule,
    RefundsModule,
    AdminModule,
    AiVideosModule,
    CouponsModule,
    DoubtsModule,
    NotificationsModule,
    DocumentsModule,
    PortfolioModule,
    ReferralsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
