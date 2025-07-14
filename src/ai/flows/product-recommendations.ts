// product-recommendations.ts
'use server';
/**
 * @fileOverview AI-powered product recommendations flow.
 *
 * - getProductRecommendations - A function that returns product recommendations based on a given product description.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  productDescription: z.string().describe('The description of the product for which recommendations are to be generated.'),
  productName: z.string().describe('The name of the product for which recommendations are to be generated.'),
  productCategory: z.string().describe('The category of the product i.e. phone, laptop etc.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('An array of product names that are recommended based on the input product description.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an AI assistant specializing in product recommendations for an e-commerce website.

  Based on the description of the product, provide a list of similar or complementary products that a customer might be interested in.
  The products should belong to the same category of the product, unless there are other complementary products that are relevant even if they belong to a different category.

  Product Name: {{{productName}}}
  Product Category: {{{productCategory}}}
  Product Description: {{{productDescription}}}

  Return a list of product names. Be as concise as possible.
  `,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
