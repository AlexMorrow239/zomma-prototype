import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { UpdateProspectDto } from '@/common/dto/prospects/update-prospect.dto';

import { CreateProspectDto } from '../../common/dto/prospects/create-prospect.dto';
import { Prospect, ProspectDocument } from './schemas/prospect.schema';

@Injectable()
export class ProspectService {
  constructor(
    @InjectModel(Prospect.name)
    private prospectModel: Model<ProspectDocument>
  ) {}

  async create(
    createProspectDto: CreateProspectDto
  ): Promise<ProspectDocument> {
    const createdProspect = new this.prospectModel({
      ...createProspectDto,
      status: 'pending', // Set default status
    });
    return createdProspect.save();
  }

  async findAll(): Promise<ProspectDocument[]> {
    return this.prospectModel
      .find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
  }

  async update(
    id: string,
    updateProspectDto: UpdateProspectDto
  ): Promise<ProspectDocument> {
    const updatedProspect = await this.prospectModel
      .findByIdAndUpdate(id, updateProspectDto, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      })
      .exec();

    if (!updatedProspect) {
      throw new NotFoundException(`Prospect with ID "${id}" not found`);
    }

    return updatedProspect;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedProspect = await this.prospectModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedProspect) {
      throw new NotFoundException(`Prospect with ID "${id}" not found`);
    }

    return {
      message: `Prospect ${id} has been successfully deleted`,
    };
  }
}
