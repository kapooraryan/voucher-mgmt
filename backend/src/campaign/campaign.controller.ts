import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignDto } from './dto';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async createCampaign(@Body() dto: CampaignDto) {
    return this.campaignService.createCampaign(dto);
  }

  @Get()
  async getAllCampaigns() {
    return this.campaignService.getAllCampaigns();
  }

  @Get(':id')
  async getCampaignById(@Param('id', ParseIntPipe) campaignId: number) {
    return this.campaignService.getCampaignById(campaignId);
  }

  @Delete(':id')
  async deleteCampaign(@Param('id', ParseIntPipe) campaignId: number) {
    return this.campaignService.deleteCampaign(campaignId);
  }
}
