import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProspectResponseDto } from '@/common/dto/prospects/prospect-response.dto';
import { UpdateProspectDto } from '@/common/dto/prospects/update-prospect.dto';
import { BudgetRange, ProspectStatus } from '@/common/enums';

import { CreateProspectDto } from '../../common/dto/prospects/create-prospect.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProspectService } from './prospect.service';

@ApiTags('Prospects')
@Controller('prospects')
export class ProspectController {
  constructor(private readonly prospectsService: ProspectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prospect' })
  @ApiResponse({
    status: 201,
    description: 'Prospect successfully created',
    type: ProspectResponseDto,
  })
  @ApiBody({
    type: CreateProspectDto,
    examples: {
      example1: {
        summary: 'New Prospect Example',
        value: {
          contact: {
            name: {
              firstName: 'John',
              lastName: 'Doe',
            },
            email: 'john.doe@example.com',
            phone: '+1234567890',
            preferredContact: 'email',
          },
          goals: {
            financialGoals:
              'Targeting 25% revenue growth in the next fiscal year',
            challenges:
              'Current market penetration is limited and facing strong competition',
          },
          services: {
            selectedServices: [
              'websiteDevelopment',
              'digitalMarketing',
              'consultingStrategy',
            ],
          },
          budget: {
            budgetRange: '10k-25k',
          },
          status: 'pending',
          notes:
            'Interested in our enterprise solution, particularly focused on web development and digital marketing services.',
        },
      },
    },
  })
  async create(@Body() createProspectDto: CreateProspectDto) {
    console.log(
      'Received prospect data:',
      JSON.stringify(createProspectDto, null, 2)
    );
    return await this.prospectsService.create(createProspectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all prospects' })
  @ApiResponse({
    status: 200,
    description: 'Returns all prospects',
    type: [ProspectResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return await this.prospectsService.findAll();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a prospect' })
  @ApiParam({
    name: 'id',
    example: '65f1a3c3e2c1234567890abc',
    description: 'Prospect ID',
  })
  @ApiBody({
    type: UpdateProspectDto,
    examples: {
      example1: {
        summary: 'Update Prospect Example',
        value: {
          contact: {
            name: {
              firstName: 'John',
              lastName: 'Smith',
            },
            email: 'john.smith@example.com',
            phone: '+1234567890',
            preferredContact: 'email',
          },
          status: ProspectStatus.CONTACTED,
          notes: 'Updated after follow-up call',
          goals: {
            financialGoals: 'Updated revenue target to 30% growth',
            challenges: 'New competitor entered the market',
          },
          services: {
            selectedServices: ['websiteDevelopment', 'digitalMarketing'],
          },
          budget: {
            budgetRange: BudgetRange.ABOVE_50K,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Prospect successfully updated',
    type: ProspectResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Prospect not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProspectDto: UpdateProspectDto
  ) {
    return await this.prospectsService.update(id, updateProspectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a prospect' })
  @ApiParam({
    name: 'id',
    example: '65f1a3c3e2c1234567890abc',
    description: 'Prospect ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Prospect successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Prospect 123 has been successfully deleted',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Prospect not found' })
  async remove(@Param('id') id: string) {
    return await this.prospectsService.remove(id);
  }
}
