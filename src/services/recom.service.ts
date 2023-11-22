// recommendation.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '@elastic/elasticsearch';
import { RecomModel } from 'src/model/recom.model';
import { ProductInteraction } from 'src/entities/product-interaction.entity';

@Injectable()
export class RecomService {
  private recommendationModel: RecomModel;

  constructor(
    @InjectRepository(ProductInteraction)
    private readonly interactionRepository: Repository<ProductInteraction>,
    private readonly esClient: Client,
  ) {
    this.recommendationModel = new RecomModel();
  }

  async getRecommendationsForUser(userId: number): Promise<number[]> {
    // Fetch user behavior from the database
    const userBehavior = await this.interactionRepository.find({
      where: { user: { id: userId } },
      select: ['product', 'type'],
    });

    // Assume 'userBehavior' contains the user's historical behavior (views, likes, purchases)

    // Train the recommendation model based on historical behavior
    const trainingData = this.prepareTrainingData(userBehavior);
    this.recommendationModel.train(trainingData);

    // Make predictions based on user behavior
    const userInput = this.prepareUserInput(userBehavior);
    const predictedItemIds = this.recommendationModel.predict(userInput);

    // Example: For simplicity, just return the top N items from Elasticsearch
    const esResponse = await this.esClient.search({
      index: process.env.PRODUCT_INDEX_ELK || 'nest-ecom-elk-product',
      body: {
        query: {
          terms: { itemId: predictedItemIds },
        },
        size: 10,
      },
    });

    console.log(esResponse.hits.hits);
    const recommendedItems = [];
    return recommendedItems;
  }

  // Convert user behavior into Brain.js training data
  private prepareTrainingData(userBehavior: any[]): any[] {
    return userBehavior.map((interaction) => ({
      input: this.extractFeatures(interaction),
      output: this.extractLabel(interaction),
    }));
  }

  // Extract features from user behavior for input to the recommendation model
  private prepareUserInput(userBehavior: any[]): any {
    const recentInteractions = userBehavior.slice(-10); // Consider the last 10 interactions
    return this.extractFeatures(recentInteractions);
  }

  // Extract features from an interaction for input to the recommendation model
  private extractFeatures(interaction: any): any {
    return { product: interaction.product };
  }

  // Extract the label from an interaction for training the recommendation model
  private extractLabel(interaction: any): any {
    return { type: interaction.type };
  }
}
