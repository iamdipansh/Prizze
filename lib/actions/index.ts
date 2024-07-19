import { scrapeProduct } from '@/lib/scrapper';

export async function scrapeAndStoreProduct(productUrl: string) {
    if(!productUrl) return;
  
    try {
      const product = await scrapeProduct(productUrl);
    } catch (error: any) {
      throw new Error(`Failed to create/update product: ${error.message}`)
    }
  }