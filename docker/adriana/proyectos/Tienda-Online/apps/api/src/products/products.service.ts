import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CartItem } from '../cart/cart-item.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
  ) {}

  findAll(query?: string) {
    const where = query
      ? [
          { name: ILike(`%${query}%`) },
          { description: ILike(`%${query}%`) },
        ]
      : undefined;
    return this.productsRepository.find({ where, order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  create(dto: CreateProductDto) {
    return this.productsRepository.save(
      this.productsRepository.create({ ...dto, price: dto.price.toFixed(2) }),
    );
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto, {
      price: dto.price === undefined ? product.price : dto.price.toFixed(2),
    });
    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.cartItemsRepository.update(
      { productId: product.id },
      {
        productId: null,
        productName: product.name,
        productPrice: product.price,
      },
    );
    await this.productsRepository.remove(product);
    return { deleted: true };
  }
}
