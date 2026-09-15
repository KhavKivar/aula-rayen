import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import {
  availabilitySlotCreateRequestSchema,
  availabilitySlotBulkCreateRequestSchema,
  availabilitySlotUpdateRequestSchema,
} from '@aula-rayen/contracts/availability';
import type {
  AvailabilitySlotResponse,
  AvailabilitySlotCreateRequest,
  AvailabilitySlotBulkCreateRequest,
  AvailabilitySlotUpdateRequest,
} from '@aula-rayen/contracts/availability';

import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { AvailabilityService } from './availability.service';
import { toAvailabilitySlotResponse } from './availability.mapper';

@Roles(['admin'])
@Controller('availability-slots')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  @Roles(['user', 'admin'])
  async findAll(): Promise<AvailabilitySlotResponse[]> {
    const slots = await this.availabilityService.getAll();

    return slots.map(toAvailabilitySlotResponse);
  }

  @Get(':id')
  @Roles(['user', 'admin'])
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AvailabilitySlotResponse> {
    const slot = await this.availabilityService.getById(id);

    return toAvailabilitySlotResponse(slot);
  }

  @Post()
  async create(
    @Session() session: UserSession,
    @Body(new ZodValidationPipe(availabilitySlotCreateRequestSchema))
    dto: AvailabilitySlotCreateRequest,
  ): Promise<AvailabilitySlotResponse> {
    const slot = await this.availabilityService.create(dto, session.user.id);

    return toAvailabilitySlotResponse(slot);
  }

  @Post('batch')
  async createMany(
    @Session() session: UserSession,
    @Body(new ZodValidationPipe(availabilitySlotBulkCreateRequestSchema))
    dto: AvailabilitySlotBulkCreateRequest,
  ): Promise<AvailabilitySlotResponse[]> {
    const slots = await this.availabilityService.createMany(
      dto,
      session.user.id,
    );

    return slots.map(toAvailabilitySlotResponse);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(availabilitySlotUpdateRequestSchema))
    dto: AvailabilitySlotUpdateRequest,
  ): Promise<AvailabilitySlotResponse> {
    const slot = await this.availabilityService.update(id, dto);

    return toAvailabilitySlotResponse(slot);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AvailabilitySlotResponse> {
    const slot = await this.availabilityService.remove(id);

    return toAvailabilitySlotResponse(slot);
  }
}
