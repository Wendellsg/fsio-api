import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createLeadDto: Prisma.LeadCreateInput) {
    return this.prisma.lead.create({
      data: createLeadDto,
    });
  }

  findAll() {
    return this.prisma.lead.findMany();
  }
}
