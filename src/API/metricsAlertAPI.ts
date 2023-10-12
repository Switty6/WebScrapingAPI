import { FastifyInstance, FastifyRequest } from "fastify";
import { AnalyzeContentMetrics } from "../Functions/metricsFunc";

export const MetricsAPI = (serverAPI: FastifyInstance) => {
    serverAPI.get('/metrics', async (request: FastifyRequest<{ Querystring: { url: string } }>, reply) => {
        const siteURL = request.query.url;
        
        let result: any;

        try{
            result = await AnalyzeContentMetrics(siteURL);
            reply.status(200).send({result});

        }catch(err:any){
            reply.status(500).send({status: 'failed', msg: 'Unknown error during metrics analysis'});
            return;
        }
    });
}