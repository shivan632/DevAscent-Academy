"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getOverview() {
        return this.adminService.getOverview();
    }
    async getBadgeCounts() {
        return this.adminService.getBadgeCounts();
    }
    async getStudents(page, limit, search, degree, status) {
        return this.adminService.getStudents(page, limit, { search, degree, status });
    }
    async getStudentDetail(id) {
        return this.adminService.getStudentDetail(id);
    }
    async suspendStudent(id, reason, admin, req) {
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
        const ua = req.headers['user-agent'];
        return this.adminService.suspendStudent(admin.id, id, reason || 'No reason provided', ip, ua);
    }
    async restoreStudent(id, admin, req) {
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
        const ua = req.headers['user-agent'];
        return this.adminService.restoreStudent(admin.id, id, ip, ua);
    }
    async getRefunds(status) {
        return this.adminService.getRefunds(status);
    }
    async approveRefund(id, admin, req) {
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
        const ua = req.headers['user-agent'];
        return this.adminService.approveRefund(admin.id, id, ip, ua);
    }
    async rejectRefund(id, reason, admin, req) {
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
        const ua = req.headers['user-agent'];
        return this.adminService.rejectRefund(admin.id, id, reason || 'Does not meet policy criteria', ip, ua);
    }
    async getSubmissions(status, page = 1, limit = 20) {
        return this.adminService.getSubmissions(status, page, limit);
    }
    async approveSubmission(id, adminNote, admin, req) {
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
        const ua = req.headers['user-agent'];
        return this.adminService.approveSubmission(admin.id, id, adminNote, ip, ua);
    }
    async rejectSubmission(id, reason, admin, req) {
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
        const ua = req.headers['user-agent'];
        return this.adminService.rejectSubmission(admin.id, id, reason, ip, ua);
    }
    async bulkApproveSubmissions(ids, admin) {
        return this.adminService.bulkApproveSubmissions(admin.id, ids);
    }
    async getCourseStats() {
        return this.adminService.getCourseStats();
    }
    async getAnalytics() {
        return this.adminService.getAnalytics();
    }
    async getAuditLog(page, limit, action, adminId) {
        return this.adminService.getAuditLog(page, limit, { action, adminId });
    }
    async exportStudents(res) {
        const csv = await this.adminService.exportStudentsCSV();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="students-${new Date().toISOString().split('T')[0]}.csv"`);
        return res.send(csv);
    }
    async exportRevenue(res) {
        const csv = await this.adminService.exportRevenueCSV();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="revenue-${new Date().toISOString().split('T')[0]}.csv"`);
        return res.send(csv);
    }
    async updateRole(userId, role, admin, req) {
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
        const ua = req.headers['user-agent'];
        return this.adminService.updateUserRole(admin.id, userId, role, ip, ua);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('badge-counts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBadgeCounts", null);
__decorate([
    (0, common_1.Get)('students'),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('degree')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Get)('students/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStudentDetail", null);
__decorate([
    (0, common_1.Patch)('students/:id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "suspendStudent", null);
__decorate([
    (0, common_1.Patch)('students/:id/restore'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreStudent", null);
__decorate([
    (0, common_1.Get)('refunds'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRefunds", null);
__decorate([
    (0, common_1.Post)('refunds/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveRefund", null);
__decorate([
    (0, common_1.Post)('refunds/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectRefund", null);
__decorate([
    (0, common_1.Get)('submissions'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSubmissions", null);
__decorate([
    (0, common_1.Post)('submissions/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('adminNote')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveSubmission", null);
__decorate([
    (0, common_1.Post)('submissions/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectSubmission", null);
__decorate([
    (0, common_1.Post)('submissions/bulk-approve'),
    __param(0, (0, common_1.Body)('ids')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "bulkApproveSubmissions", null);
__decorate([
    (0, common_1.Get)('courses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCourseStats", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('audit-log'),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(30), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('action')),
    __param(3, (0, common_1.Query)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLog", null);
__decorate([
    (0, common_1.Get)('export/students'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportStudents", null);
__decorate([
    (0, common_1.Get)('export/revenue'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportRevenue", null);
__decorate([
    (0, common_1.Patch)('settings/role/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)('role')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRole", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map