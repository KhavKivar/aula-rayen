import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import {
  bookingCreateRequestSchema,
  bookingUpdateRequestSchema,
  bookingGetRequestSchema,
} from '@aula-rayen/contracts/booking';
import type {
  BookingResponse,
  BookingGetRequest,
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
  async findAll(
    @Session() session: UserSession,
    @Query(new ZodValidationPipe(bookingGetRequestSchema))
    query: BookingGetRequest,
  ): Promise<BookingResponse[]> {
    const bookings = await this.bookingService.getAll(query);
    return bookings.map(toBookingResponse);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ): Promise<BookingResponse> {
    return toBookingResponse(
      await this.bookingService.getById(id, session.user),
    );
  }

  @Post()
  async create(
    @Session() session: UserSession,
    @Body(new ZodValidationPipe(bookingCreateRequestSchema))
    dto: BookingCreateRequest,
  ): Promise<BookingResponse> {
    return toBookingResponse(
      await this.bookingService.create(dto, session.user.id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(bookingUpdateRequestSchema))
    dto: BookingUpdateRequest,
    @Session() session: UserSession,
  ): Promise<BookingResponse> {
    return toBookingResponse(
      await this.bookingService.update(id, dto, session.user),
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ): Promise<BookingResponse> {
    return toBookingResponse(
      await this.bookingService.remove(id, session.user),
    );
  }
}
