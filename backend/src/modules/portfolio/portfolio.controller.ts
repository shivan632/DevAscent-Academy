import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get('public/:username')
  async getPublicPortfolio(@Param('username') username: string) {
    return this.portfolioService.getPublicPortfolio(username);
  }

  @Get('my-handle')
  @UseGuards(JwtAuthGuard)
  async getMyHandle(@CurrentUser() user: any) {
    const username = await this.portfolioService.ensureUsername(user.id || user.sub);
    return { username };
  }

  @Patch('update-settings')
  @UseGuards(JwtAuthGuard)
  async updatePortfolioProfile(
    @CurrentUser() user: any,
    @Body() dto: any,
  ) {
    return this.portfolioService.updatePortfolioProfile(user.id || user.sub, dto);
  }
}

