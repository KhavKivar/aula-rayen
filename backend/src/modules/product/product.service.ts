import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../../db/schema';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  getAll() {
    return this.repository.findAll();
  }
  async getById(id: number) {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }
  create(dto: CreateProductDto): Promise<Product> {
    return this.repository.create(dto);
  }

  async delete(id: number): Promise<Product | null> {
    const deleteProduct = await this.repository.delete(id);
    if (!deleteProduct) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return deleteProduct;
  }
  async update(id: number, dto: UpdateProductDto): Promise<Product | null> {
    const product = await this.repository.update(id, dto);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  deleteAll() {
    return this.repository.deleteAll();
  }
}
