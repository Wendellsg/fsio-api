import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Prisma, UserRoleEnum } from '@prisma/client';
import { AuthGuard, Roles } from 'src/auth/auth.guard';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() createLeadDto: Prisma.LeadCreateInput) {
    return this.leadsService.create(createLeadDto);
  }

  @Roles(UserRoleEnum.admin)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.leadsService.findAll();
  }
}
