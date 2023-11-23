// recommendation.service.ts

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { ProductInteraction } from 'src/entities/product-interaction.entity';
import { Product } from 'src/entities/product.entity';
import { ProductInteractionTypeEnum } from 'src/enum/product-interation-type.enum';
import { ProductRepository } from 'src/repositories/product.repository';
import { ApiResponse } from 'src/utils/response.util';

@Injectable()
export class RecomService {
  async getLandingPageData(user: any) {
    const popularProducts = await this.getProductsOfCurrentMonth(
      ProductInteractionTypeEnum.like,
    );
    const mostViewedProducts = await this.getProductsOfCurrentMonth(
      ProductInteractionTypeEnum.views,
    );
    const mostOrderedProducts = await this.getProductsOfCurrentMonth(
      ProductInteractionTypeEnum.purchased,
    );
    const mostWishListed = await this.getProductsOfCurrentMonth(
      ProductInteractionTypeEnum.add_to_wishlist,
    );
    const recomProduct = await this.getRecommendationsForUser(user.id);

    const data = {
      popular: popularProducts,
      visited: mostViewedProducts,
      orders: mostOrderedProducts,
      recom: recomProduct,
      wish: mostWishListed,
    };
    return ApiResponse.success(data, 200);
  }
  constructor(
    @InjectRepository(ProductInteraction)
    private readonly intRepo: Repository<ProductInteraction>,

    @Inject(forwardRef(() => ProductRepository))
    private readonly prodRepo: ProductRepository,
  ) {}

  async getRecommendationsForUser(userId: number): Promise<Product[]> {
    // Fetch user behavior from the database
    const userBehavior = await this.intRepo.find({
      where: { user: { id: userId } },
      relations: {
        product: true,
        user: true,
      },
      select: ['product', 'type', 'user'],
    });
    // Get all users who have liked similar products
    const similarUsers = await this.findSimilarUsers(userId, userBehavior);

    // Get products liked by similar users
    const recommendedProducts =
      await this.findRecommendedProducts(similarUsers);

    return recommendedProducts;
  }

  private async findSimilarUsers(
    userId: number,
    userBehaviors: ProductInteraction[],
  ): Promise<number[]> {
    // Find users who have liked similar products
    const similarUsers = new Set<number>();

    for (const intraction of userBehaviors) {
      const similarBehaviors = await this.intRepo.find({
        where: {
          product: {
            id: intraction.product.id,
          },
          type: ProductInteractionTypeEnum.like,
        },
        relations: {
          product: true,
          user: true,
        },
      });

      for (const similarBehavior of similarBehaviors) {
        if (similarBehavior.user.id !== userId) {
          similarUsers.add(similarBehavior.user.id);
        }
      }
    }

    return Array.from(similarUsers);
  }

  private async findRecommendedProducts(
    similarUsers: number[],
  ): Promise<Product[]> {
    // Calculate similarity scores between the target user and similar users
    const similarityScores: Record<number, number> = {};

    for (const user of similarUsers) {
      const userBehaviors = await this.intRepo.find({
        where: {
          user: {
            id: user,
          },
        },
        relations: {
          product: true,
          user: true,
        },
      });
      const similarity = this.calculateCosineSimilarity(userBehaviors);
      similarityScores[user] = similarity;
    }

    // Sort users by similarity scores
    const sortedUsers = similarUsers.sort(
      (a, b) => similarityScores[b] - similarityScores[a],
    );

    // Get products liked by the most similar user
    const mostSimilarUserBehaviors = await this.intRepo.find({
      where: {
        user: {
          id: sortedUsers[0],
        },
        type: ProductInteractionTypeEnum.like,
      },
      relations: {
        product: true,
        user: true,
      },
    });

    // Get unique recommended product ids
    const recommendedProductIds = new Set<number>();
    mostSimilarUserBehaviors.forEach((behavior) =>
      recommendedProductIds.add(behavior.product.id),
    );

    // Get product details for recommended product ids
    const recommendedProducts = await this.prodRepo.find({
      where: {
        id: In(Array.from(recommendedProductIds)),
      },
      relations: {
        images: true,
        categories: true,
        translations: {
          language: true,
        },
      },
    });

    return recommendedProducts;
  }

  private calculateCosineSimilarity(
    userBehaviors: ProductInteraction[],
  ): number {
    // Convert user behaviors to a vector representation
    const vector = userBehaviors.map((behavior) =>
      behavior.type === ProductInteractionTypeEnum.like ? 1 : 0,
    );

    // Calculate cosine similarity
    // const cosineSimilarity = new CosineSimilarity();
    const similarity = this.cosineSimilarity(vector, vector);

    return similarity;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((acc, val, i) => acc + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0; // Avoid division by zero
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  async getProductsOfCurrentMonth(
    type: ProductInteractionTypeEnum,
  ): Promise<Product[]> {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based

    // Get user behaviors for the current month with 'rate' action
    const userBehaviors = await this.intRepo.find({
      where: {
        type: type,
        created_at: Between(
          new Date(`${currentDate.getFullYear()}-${currentMonth}-01`),
          new Date(`${currentDate.getFullYear()}-${currentMonth + 1}-01`),
        ),
      },
      relations: {
        product: true,
        user: true,
      },
    });

    // Calculate the average rating for each product
    const productRatings: Record<number, { sum: number; count: number }> = {};

    userBehaviors.forEach((behavior) => {
      if (!productRatings[behavior.product.id]) {
        productRatings[behavior.product.id] = { sum: 0, count: 0 };
      }
      productRatings[behavior.product.id].sum += behavior.rating;
      productRatings[behavior.product.id].count += 1;
    });

    // Calculate average ratings
    const averageRatings: Record<number, number> = {};
    Object.keys(productRatings).forEach((productId) => {
      averageRatings[productId] =
        productRatings[productId].sum / productRatings[productId].count;
    });

    // Sort products by average rating
    const sortedProductIds = Object.keys(averageRatings).sort(
      (a, b) => averageRatings[b] - averageRatings[a],
    );

    // Get top 10 product ids
    const top10ProductIds = sortedProductIds.slice(0, 10);

    // Get product details for top 10 product ids
    const top10Products = await this.prodRepo.find({
      where: {
        id: In(top10ProductIds),
      },
      relations: {
        images: true,
        categories: true,
        translations: {
          language: true,
        },
      },
    });

    return top10Products;
  }
}
