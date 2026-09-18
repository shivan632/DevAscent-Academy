import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  async getOverview() {
    return this.adminService.getOverview();
  }

  @Get('students')
  async getStudents() {
    return this.adminService.getStudents();
  }

  @Get('refunds')
  async getRefunds(@Query('status') status?: string) {
    return this.adminService.getRefunds(status);
  }

  @Post('refunds/:id/approve')
  async approveRefund(@Param('id') id: string) {
    return this.adminService.approveRefund(id);
  }

  @Post('refunds/:id/reject')
  async rejectRefund(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.rejectRefund(id, reason || 'Does not meet policy criteria');
  }
}
