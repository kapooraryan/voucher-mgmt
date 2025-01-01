import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CampaignDto } from './dto';
import { Campaign } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async createCampaign(dto: CampaignDto) {
    try {
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);

      const campaign = await this.prisma.campaign.create({
        data: {
          name: dto.name,
          description: dto.description,
          startDate,
          endDate,
          targetCategoryId: dto.targetCategoryId
            ? Number(dto.targetCategoryId)
            : null,
          discountType: dto.discountType,
          discountValue: dto.discountValue,
          maxUsageLimit: dto.maxUsageLimit,
          minCartValue: dto.minCartValue,
        },
      });

      if (dto.targetCategoryId) {
        await this.generateCouponsForCategory(
          campaign.campaignId,
          Number(dto.targetCategoryId),
          startDate,
          endDate,
        );
      }

      return campaign;
    } catch (error) {
      console.error('Error creating campaign:', {
        message: error.message,
        stack: error.stack,
        dto,
      });
      throw new Error('Error creating campaign');
    }
  }

  private async generateCouponsForCategory(
    campaignId: number,
    categoryId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const userCategories = await this.prisma.userCategory.findMany({
      where: { categoryId },
      include: { user: true },
    });

    for (const userCategory of userCategories) {
      await this.prisma.coupon.create({
        data: {
          code: `COUPON-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          campaignId,
          userId: userCategory.user.userId,
          startDate,
          expiryDate: endDate,
        },
      });
    }
  }

  async getAllCampaigns() {
    return this.prisma.campaign.findMany({
      include: { coupons: true },
    });
  }

  async getCampaignById(campaignId: number) {
    try {
      const campaign = await this.prisma.campaign.findUnique({
        where: { campaignId },
        include: { coupons: true },
      });

      if (!campaign) {
        throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
      }

      return campaign;
    } catch (error) {
      console.error('Error retrieving campaign by ID:', { campaignId, error });
      throw new Error('Failed to retrieve campaign');
    }
  }

  async deleteCampaign(campaignId: number) {
    try {
      const campaign = await this.getCampaignById(campaignId);

      if (!campaign) {
        throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
      }

      await this.prisma.campaign.delete({
        where: { campaignId },
      });

      console.log(
        `Campaign with ID ${campaignId} and related coupons deleted successfully`,
      );
    } catch (error) {
      console.error('Error deleting campaign by ID:', { campaignId, error });
      throw new Error('Failed to delete campaign');
    }
  }
}
