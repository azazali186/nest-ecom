// recommendation-model.ts

import { NeuralNetwork } from 'brain.js';

export class RecomModel {
  private net: NeuralNetwork<any, any>;

  constructor() {
    this.net = new NeuralNetwork<any, any>();
  }

  train(data: { input: any; output: any }[]) {
    const formattedData = data.map((example) => ({
      input: example.input, 
      output: example.output, 
    }));

    this.net.train(formattedData);
  }

  predict(input: any): number[] {
    // Run the neural network on the input
    const output = this.net.run(input);

    // Extract the predicted values (item IDs in this case)
    const predictedItemIds: number[] = [];

    // Assuming output is an object with properties representing item IDs
    for (const key in output) {
      if (output.hasOwnProperty(key)) {
        predictedItemIds.push(parseInt(key, 10));
      }
    }

    return predictedItemIds;
  }
}
