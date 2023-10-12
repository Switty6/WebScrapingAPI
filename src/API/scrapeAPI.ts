import { FastifyInstance, FastifyRequest } from "fastify";
import { ScrapeWebsite } from "../Functions/scrapeFunc";

const errorCodes:any = {
    11: "Invalid URL. Please check the URL and try again.",
    12: "You're not using the correct link. It must be https://wsa-test.vercel.app/",
    13: "Some elements on the website. We're working on it. Please try again later.",

}
const TIMEOUT_DURATION = 10000; // 10 seconds

export const ScrapeAPI = (serverAPI: FastifyInstance) => {
    serverAPI.get('/scrape', async (request: FastifyRequest<{ Querystring: { url: string } }>, reply) => {
        const siteURL = request.query.url;
        
        let result: any;

        try {
            result = await Promise.race([
                ScrapeWebsite(siteURL),
                timeout(TIMEOUT_DURATION, 'Scraping took too long! Please try again later.')
            ]);
        } catch (err:any) {
            reply.status(500).send({ status: 'failed', msg: err.message || 'Unknown error during scraping' });
            return;
        }

        if (result.error) {
            reply.status(500).send({ status: 'failed', msg: errorCodes[result.code] });
        } else {
            reply.send({ result });
        }
    });
}

function timeout(ms: number, errorMessage = 'Operation timed out'): Promise<void> {
    return new Promise((_, reject) => setTimeout(() => reject(new Error(errorMessage)), ms));
}

