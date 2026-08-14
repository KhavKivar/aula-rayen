import { Inject, Injectable } from '@nestjs/common';

import { DRIZZLE } from '../../db/drizzle';
import { Product, products } from '../../db/schema';
import type { Database } from '../../db/drizzle';
import { eq } from 'drizzle-orm';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  findAll(): Promise<Product[]> {
    return this.db.select().from(products);
  }
  async findById(id: number): Promise<Product | null> {
    const [product] = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product ?? null;
  }
  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const [createdProduct] = await this.db
      .insert(products)
      .values(product)
      .returning();
    return createdProduct;
  }

  async update(id: number, product: UpdateProductDto): Promise<Product | null> {
    const [updatedProduct] = await this.db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct ?? null;
  }

  async delete(id: number): Promise<Product | null> {
    const [deleteProduct] = await this.db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return deleteProduct ?? null;
  }

  async deleteAll(): Promise<void> {
    await this.db.delete(products);
  }
}
