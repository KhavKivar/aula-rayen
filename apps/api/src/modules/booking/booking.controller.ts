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
  bookingCreateRequestSchema,
  bookingUpdateRequestSchema,
} from '@aula-rayen/contracts/booking';
import type {
  BookingResponse,
  BookingCreateRequest,
  BookingUpdateRequest,
} from '@aula-rayen/contracts/booking';

import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { BookingService } from './booking.service';
import { toBookingResponse } from './booking.mapper';

@Roles(['user', 'admin'])
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async findAll(@Session() session: UserSession): Promise<BookingResponse[]> {
    const bookings = await this.bookingService.getAll(session.user);

    return bookings.map(toBookingResponse);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ): Promise<BookingResponse> {
    const booking = await this.bookingService.getById(id, session.user);

    return toBookingResponse(booking);
  }

  @Post()
  async create(
    @Session() session: UserSession,
    @Body(new ZodValidationPipe(bookingCreateRequestSchema))
    dto: BookingCreateRequest,
  ): Promise<BookingResponse> {
    const booking = await this.bookingService.create(dto, session.user.id);

    return toBookingResponse(booking);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(bookingUpdateRequestSchema))
    dto: BookingUpdateRequest,
    @Session() session: UserSession,
  ): Promise<BookingResponse> {
    const booking = await this.bookingService.update(id, dto, session.user);

    return toBookingResponse(booking);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ): Promise<BookingResponse> {
    const booking = await this.bookingService.remove(id, session.user);

    return toBookingResponse(booking);
  }
}
