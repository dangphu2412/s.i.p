import { OptionalJwtAuthGuard } from './../guard/optional-jwt.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt.guard';

export const Protected = applyDecorators(
  UseGuards(JwtAuthGuard),
  ApiBearerAuth(),
  ApiUnauthorizedResponse({ description: 'Unauthorized' }),
);

export const OptionalProtected = applyDecorators(
  UseGuards(OptionalJwtAuthGuard),
  ApiBearerAuth(),
  ApiUnauthorizedResponse({ description: 'Unauthorized' }),
);
