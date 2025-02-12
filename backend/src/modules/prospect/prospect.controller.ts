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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UpdateProspectDto } from '@/common/dto/prospects/update-prospect.dto';

import { CreateProspectDto } from '../../common/dto/prospects/create-prospect.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProspectService } from './prospect.service';

@ApiTags('Prospects')
@Controller('prospects')
export class ProspectController {
  constructor(private readonly prospectsService: ProspectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prospect' })
  @ApiResponse({ status: 201, description: 'Prospect successfully created' })
  async create(@Body() createProspectDto: CreateProspectDto) {
    return await this.prospectsService.create(createProspectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all prospects' })
  @ApiResponse({ status: 200, description: 'Returns all prospects' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return await this.prospectsService.findAll();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a prospect' })
  @ApiResponse({ status: 200, description: 'Prospect successfully updated' })
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
  @ApiResponse({ status: 200, description: 'Prospect successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Prospect not found' })
  async remove(@Param('id') id: string) {
    return await this.prospectsService.remove(id);
  }
}
