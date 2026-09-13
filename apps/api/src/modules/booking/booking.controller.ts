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
  createBookingRequestSchema,
  updateBookingRequestSchema,
} from '@aula-rayen/contracts/booking';
import type {
  BookingResponse,
  CreateBookingRequest,
  UpdateBookingRequest,
} from '@aula-rayen/contracts/booking';

import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { BookingService } from './booking.service';
import { toBookingResponse } from './booking.mapper';

@Roles(['user', 'admin'])
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async findAll(): Promise<BookingResponse[]> {
    const bookings = await this.bookingService.getAll();

    return bookings.map(toBookingResponse);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookingResponse> {
    const booking = await this.bookingService.getById(id);

    return toBookingResponse(booking);
  }

  @Post()
  async create(
    @Session() session: UserSession,
    @Body(new ZodValidationPipe(createBookingRequestSchema))
    dto: CreateBookingRequest,
  ): Promise<BookingResponse> {
    const booking = await this.bookingService.create(dto, session.user.id);

    return toBookingResponse(booking);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateBookingRequestSchema))
    dto: UpdateBookingRequest,
  ): Promise<BookingResponse> {
    const booking = await this.bookingService.update(id, dto);

    return toBookingResponse(booking);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookingResponse> {
    const booking = await this.bookingService.remove(id);

    return toBookingResponse(booking);
  }
}
