// recommendation.service.ts

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductInteraction } from 'src/entities/product-interaction.entity';
import { Product } from 'src/entities/product.entity';
import { ProductInteractionTypeEnum } from 'src/enum/product-interation-type.enum';
import { ProductRepository } from 'src/repositories/product.repository';

@Injectable()
export class RecomService {
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
}
