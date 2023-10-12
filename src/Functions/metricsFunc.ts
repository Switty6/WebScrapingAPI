import { ScrapeWebsite } from "./scrapeFunc";
import { tokenize } from "./sentiment";

type Sentiment = "positive" | "neutral" | "negative";

export async function AnalyzeContentMetrics(url: string): Promise<any> {
  const scrapedData = await ScrapeWebsite(url);
  
  if (scrapedData.error) {
    return scrapedData;
  }
  
  let metrics = {
    averagePostLength: 0,
    shortestPost: Number.POSITIVE_INFINITY,
    longestPost: 0,
    topTerms: {} as Record<string, number>,
    mostFrequentTerms: [] as string[],
    sentimentDistribution: {
      positive: 0,
      neutral: 0,
      negative: 0
    },
    averageImagesPerPost: 0,
    authorContribution: {} as Record<string, number>
  };

  let totalWords = 0;
  let totalImages = 0;

  for (const entry of scrapedData) {
    totalWords += entry.words || 0;
    totalImages += (entry.image ? 1 : 0);

    metrics.shortestPost = Math.min(metrics.shortestPost, entry.words || 0);
    metrics.longestPost = Math.max(metrics.longestPost, entry.words || 0);
    
    const sentiment: Sentiment = entry.sentiment as Sentiment;
    metrics.sentimentDistribution[sentiment] += 1;

    const tokens = tokenize(entry.post_content || "");
    for (const token of tokens) {
      metrics.topTerms[token] = (metrics.topTerms[token] || 0) + 1;
    }

    metrics.authorContribution[entry.author || "Unknown"] = (metrics.authorContribution[entry.author || "Unknown"] || 0) + 1;
  }

  metrics.averagePostLength = totalWords / scrapedData.length;
  metrics.averageImagesPerPost = totalImages / scrapedData.length;

  const sortedTerms = Object.entries(metrics.topTerms).sort((a, b) => b[1] - a[1]);
  metrics.mostFrequentTerms = sortedTerms.slice(0, 3).map(entry => entry[0]);

  return metrics;
}
