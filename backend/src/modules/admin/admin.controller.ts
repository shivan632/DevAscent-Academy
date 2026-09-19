import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ─── Overview & Badges ───────────────────────────────────────────────────────
  @Get('overview')
  async getOverview() {
    return this.adminService.getOverview();
  }

  @Get('badge-counts')
  async getBadgeCounts() {
    return this.adminService.getBadgeCounts();
  }

  // ─── Students ────────────────────────────────────────────────────────────────
  @Get('students')
  async getStudents(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('degree') degree?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getStudents(page, limit, { search, degree, status });
  }

  @Get('students/:id')
  async getStudentDetail(@Param('id') id: string) {
    return this.adminService.getStudentDetail(id);
  }

  @Patch('students/:id/suspend')
  async suspendStudent(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() admin: any,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const ua = req.headers['user-agent'];
    return this.adminService.suspendStudent(admin.id, id, reason || 'No reason provided', ip, ua);
  }

  @Patch('students/:id/restore')
  async restoreStudent(
    @Param('id') id: string,
    @CurrentUser() admin: any,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const ua = req.headers['user-agent'];
    return this.adminService.restoreStudent(admin.id, id, ip, ua);
  }

  // ─── Refunds ─────────────────────────────────────────────────────────────────
  @Get('refunds')
  async getRefunds(@Query('status') status?: string) {
    return this.adminService.getRefunds(status);
  }

  @Post('refunds/:id/approve')
  async approveRefund(
    @Param('id') id: string,
    @CurrentUser() admin: any,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const ua = req.headers['user-agent'];
    return this.adminService.approveRefund(admin.id, id, ip, ua);
  }

  @Post('refunds/:id/reject')
  async rejectRefund(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() admin: any,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const ua = req.headers['user-agent'];
    return this.adminService.rejectRefund(
      admin.id,
      id,
      reason || 'Does not meet policy criteria',
      ip,
      ua,
    );
  }

  // ─── Submissions ─────────────────────────────────────────────────────────────
  @Get('submissions')
  async getSubmissions(
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.adminService.getSubmissions(status, page, limit);
  }

  @Post('submissions/:id/approve')
  async approveSubmission(
    @Param('id') id: string,
    @Body('adminNote') adminNote: string,
    @CurrentUser() admin: any,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const ua = req.headers['user-agent'];
    return this.adminService.approveSubmission(admin.id, id, adminNote, ip, ua);
  }

  @Post('submissions/:id/reject')
  async rejectSubmission(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() admin: any,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const ua = req.headers['user-agent'];
    return this.adminService.rejectSubmission(admin.id, id, reason, ip, ua);
  }

  @Post('submissions/bulk-approve')
  async bulkApproveSubmissions(
    @Body('ids') ids: string[],
    @CurrentUser() admin: any,
  ) {
    return this.adminService.bulkApproveSubmissions(admin.id, ids);
  }

  // ─── Courses ─────────────────────────────────────────────────────────────────
  @Get('courses')
  async getCourseStats() {
    return this.adminService.getCourseStats();
  }

  // ─── Analytics ───────────────────────────────────────────────────────────────
  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  // ─── Audit Log ───────────────────────────────────────────────────────────────
  @Get('audit-log')
  async getAuditLog(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
    @Query('action') action?: string,
    @Query('adminId') adminId?: string,
  ) {
    return this.adminService.getAuditLog(page, limit, { action, adminId });
  }

  // ─── Exports ─────────────────────────────────────────────────────────────────
  @Get('export/students')
  async exportStudents(@Res() res: Response) {
    const csv = await this.adminService.exportStudentsCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="students-${new Date().toISOString().split('T')[0]}.csv"`,
    );
    return res.send(csv);
  }

  @Get('export/revenue')
  async exportRevenue(@Res() res: Response) {
    const csv = await this.adminService.exportRevenueCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="revenue-${new Date().toISOString().split('T')[0]}.csv"`,
    );
    return res.send(csv);
  }

  // ─── Role Management ─────────────────────────────────────────────────────────
  @Patch('settings/role/:userId')
  async updateRole(
    @Param('userId') userId: string,
    @Body('role') role: string,
    @CurrentUser() admin: any,
    @Req() req: Request,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress;
    const ua = req.headers['user-agent'];
    return this.adminService.updateUserRole(admin.id, userId, role, ip, ua);
  }
}
