import fastify, {FastifyInstance} from 'fastify';
import { ScrapeAPI } from './API/scrapeAPI';
import { cacheNegativeWords, cachePositiveWords } from './Functions/sentiment';

export const serverAPI: FastifyInstance = fastify();

function start(){

    // Cache words
    console.log('🤖 Caching words lists...');
    cacheNegativeWords();
    cachePositiveWords();
    console.log('✅ Done');
    console.log('🤖 Registering APIs...');

    // Registering APIs
    ScrapeAPI(serverAPI);

    console.log('✅ Done');


    // Starting server
    serverAPI.listen({port:3000}, async (err, address) => {
        if(err){
            console.error(`Error starting the server: ${err.message}`);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
}

start();