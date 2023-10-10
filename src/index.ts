import fastify, {FastifyInstance} from 'fastify';
import { ScrapeAPI } from './API/scrapeAPI';

export const serverAPI: FastifyInstance = fastify();

function start(){
    console.log('🤖 Registering APIs...');

    // Registering APIs
    ScrapeAPI(serverAPI);

    console.log('✅ Done');

    // Starting server
    serverAPI.listen({port:3000}, async (err, address) => {
        if(err){
            console.log(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
}

start();