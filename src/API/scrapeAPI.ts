import { FastifyInstance, FastifyRequest } from "fastify";
import { ScrapeWebsite } from "../Functions/scrapeFunc";

export const ScrapeAPI = (serverAPI: FastifyInstance) => {
    serverAPI.get('/scrape', async (request: FastifyRequest<{ Querystring: { url: string } }>, reply) => {
        const siteURL = request.query.url;
        console.log(siteURL);

        try {
            const scrapedData = await ScrapeWebsite(siteURL);
            reply.send({ title: scrapedData });
        } catch (error:any) {
            reply.status(500).send({ status: 'failed', error: error.message });
        }
    });
}
