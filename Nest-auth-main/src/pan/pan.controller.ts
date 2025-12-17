import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PanService } from './pan.service';
import { JwtGuard } from '../auth/jwt.guard';

import { Param } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/roles.enum';
import { PanStatus } from './pan.entity';



@Controller('pan')
@UseGuards(JwtGuard)
export class PanController {
  constructor(private readonly panService: PanService) {}

  // USER submits PAN request
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.panService.createPanRequest(body, req.user);
  }

  // USER sees their own PAN requests
  @Get('my')
  getMyRequests(@Req() req: any) {
    return this.panService.findMyRequests(req.user);
  }

  // ADMIN: get all PAN requests
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
@Get()
getAll() {
  return this.panService.findAllRequests();
}

// ADMIN: update PAN status
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
@Post(':id/status')
updateStatus(
  @Param('id') id: string,
  @Body('status') status: PanStatus,
) {
  return this.panService.updateStatus(Number(id), status);
}


}
