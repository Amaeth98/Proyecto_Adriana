import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  product?: Product | null;

  @Column({ type: 'int', nullable: true })
  productId?: number | null;

  @Column({ type: 'varchar', nullable: true })
  productName?: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  productPrice?: string | null;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'timestamp', nullable: true })
  paymentDate?: Date | null;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod?: string | null;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
