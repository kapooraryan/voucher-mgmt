import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CategoryDto) {
    try {
      const minSpend = isNaN(dto.minSpend) ? null : dto.minSpend;
      const maxSpend = isNaN(dto.maxSpend) ? null : dto.maxSpend;

      const category = await this.prisma.category.create({
        data: {
          name: dto.name,
          description: dto.description || null,
          minSpend: minSpend,
          maxSpend: maxSpend,
          dateJoinedBefore: dto.dateJoinedBefore
            ? new Date(dto.dateJoinedBefore)
            : null,
          creditCardTypeIN: dto.creditCardType || null,
          lastLoginOption: dto.lastLoginThreshold ? dto.lastLoginOption : null,
          lastLoginThreshold: dto.lastLoginThreshold
            ? new Date(dto.lastLoginThreshold)
            : null,
        },
      });

      await this.populateUserCategory(category.categoryId, dto);

      return category;
    } catch (error) {
      console.error('Error creating category:', error.message);
      throw new Error('Error creating category');
    }
  }

  async getAllCategories() {
    return this.prisma.category.findMany();
  }

  async getCategoryById(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category;
  }

  async updateCategory(categoryId: number, dto: CategoryDto) {
    const minSpend = isNaN(dto.minSpend) ? null : dto.minSpend;
    const maxSpend = isNaN(dto.maxSpend) ? null : dto.maxSpend;

    const updatedCategory = await this.prisma.category.update({
      where: { categoryId },
      data: {
        name: dto.name,
        description: dto.description || null,
        minSpend: minSpend,
        maxSpend: maxSpend,
        dateJoinedBefore: dto.dateJoinedBefore
          ? new Date(dto.dateJoinedBefore)
          : null,
        creditCardTypeIN: dto.creditCardType || null,
        lastLoginOption: dto.lastLoginThreshold ? dto.lastLoginOption : null,
        lastLoginThreshold: dto.lastLoginThreshold
          ? new Date(dto.lastLoginThreshold)
          : null,
      },
    });

    await this.populateUserCategory(updatedCategory.categoryId, dto);

    return updatedCategory;
  }

  async deleteCategory(categoryId: number) {
    await this.prisma.category.delete({
      where: { categoryId },
    });
  }

  private async populateUserCategory(categoryId: number, dto: CategoryDto) {
    await this.prisma.userCategory.deleteMany({
      where: { categoryId },
    });

    const queryConditions: Record<string, any> = {};

    if (!isNaN(dto.minSpend)) {
      queryConditions.totalSpend = queryConditions.totalSpend || {};
      queryConditions.totalSpend.gte = dto.minSpend;
    }

    if (!isNaN(dto.maxSpend)) {
      queryConditions.totalSpend = queryConditions.totalSpend || {};
      queryConditions.totalSpend.lte = dto.maxSpend;
    }

    if (dto.dateJoinedBefore) {
      queryConditions.dateJoined = { lte: new Date(dto.dateJoinedBefore) };
    }

    if (dto.creditCardType) {
      queryConditions.creditCardType = dto.creditCardType;
    }

    if (dto.lastLoginOption && dto.lastLoginThreshold) {
      queryConditions.lastLogin =
        dto.lastLoginOption === 'active'
          ? { gte: new Date(dto.lastLoginThreshold) }
          : { lte: new Date(dto.lastLoginThreshold) };
    }

    if (Object.keys(queryConditions).length > 0) {
      const users = await this.prisma.user.findMany({ where: queryConditions });

      for (const user of users) {
        await this.prisma.userCategory.create({
          data: {
            userId: user.userId,
            categoryId: categoryId,
          },
        });
      }
    }
  }
}
