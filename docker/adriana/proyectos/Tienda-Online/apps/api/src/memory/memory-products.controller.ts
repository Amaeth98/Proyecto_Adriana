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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { MemoryStoreService } from './memory-store.service';

@Controller('products')
export class MemoryProductsController {
  constructor(private readonly store: MemoryStoreService) {}

  @Get()
  findAll(@Query('query') query?: string) {
    if (!query) return this.store.products;
    const normalized = query.toLowerCase();
    return this.store.products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.store.getProduct(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateProductDto) {
    const product = {
      id: this.store.nextProductId(),
      ...dto,
      price: dto.price.toFixed(2),
    };
    this.store.products.push(product);
    return product;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    const product = this.store.getProduct(id);
    Object.assign(product, dto);
    if (dto.price !== undefined) product.price = dto.price.toFixed(2);
    return product;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.store.products = this.store.products.filter((item) => item.id !== id);
    return { deleted: true };
  }
}
