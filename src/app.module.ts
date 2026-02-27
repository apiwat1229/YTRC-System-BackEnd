import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AccessControlModule } from './access-control/access-control.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApprovalsModule } from './approvals/approvals.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { CpkAnalysesModule } from './cpk-analyses/cpk-analyses.module';
import { ESignaturesModule } from './e-signatures/e-signatures.module';
import { ITAssetsModule } from './it-assets/it-assets.module';
import { ITTicketsModule } from './it-tickets/it-tickets.module';
import { JobOrdersModule } from './job-orders/job-orders.module';
import { KnowledgeBooksModule } from './knowledge-books/knowledge-books.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { MasterModule } from './master/master.module';
import { MymachineModule } from './mymachine/mymachine.module';
import { NotificationGroupsModule } from './notification-groups/notification-groups.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PlcModule } from './plc/plc.module';
import { PoolsModule } from './pools/pools.module';
import { PostsModule } from './posts/posts.module';
import { PrinterUsageModule } from './printer-usage/printer-usage.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductionReportsModule } from './production-reports/production-reports.module';
import { RawMaterialPlansModule } from './raw-material-plans/raw-material-plans.module';
import { RolesModule } from './roles/roles.module';
import { RubberTypesModule } from './rubber-types/rubber-types.module';
import { ShippingPlansModule } from './shipping-plans/shipping-plans.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/api/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    AccessControlModule,
    NotificationsModule,
    NotificationGroupsModule,
    ApprovalsModule,
    AnalyticsModule,
    BookingsModule,
    MaintenanceModule,
    MymachineModule,
    MasterModule,
    SuppliersModule,
    PostsModule,
    RubberTypesModule,
    ITAssetsModule,
    ITTicketsModule,
    KnowledgeBooksModule,
    PlcModule,
    PoolsModule,
    PrinterUsageModule,
    JobOrdersModule,
    CpkAnalysesModule,
    ProductionReportsModule,
    RawMaterialPlansModule,
    ShippingPlansModule,
    ESignaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
