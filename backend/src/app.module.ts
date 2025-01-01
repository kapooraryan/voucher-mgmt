import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { CampaignModule } from './campaign/campaign.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CategoryModule, CampaignModule, PrismaModule],
})
export class AppModule {}
