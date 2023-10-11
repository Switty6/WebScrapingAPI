import { FastifyInstance, FastifyRequest } from "fastify";
import { ScrapeWebsite } from "../Functions/scrapeFunc";

export const ScrapeAPI = (serverAPI: FastifyInstance) => {
    serverAPI.get('/scrape', async (request: FastifyRequest<{ Querystring: { url: string } }>, reply) => {
        const siteURL = request.query.url;
        const result = await ScrapeWebsite(siteURL);
        if (result.error) {
            reply.status(500).send({ status: 'failed', error: result.error }); // in mod normal as pune "Internal Server Error" in loc de eroare din motive de securitate
        } else {
            reply.send({ result });
        }
    });
}
