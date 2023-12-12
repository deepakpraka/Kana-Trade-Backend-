import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { EconiaMarkets, EconiaTrade, ENVIRONMENT,TradeTable } from '@kanalabs/trade';
import dotenv from 'dotenv';
import { AptosClient } from 'aptos';

dotenv.config();

export default async function getAllTrades(fastify: FastifyInstance) {
    fastify.get(
      '/',
      async function (
        request: FastifyRequest<{
          Querystring: {
            environment: ENVIRONMENT;
          };
        }>,
        reply: FastifyReply
      ) {
        try {
          const environment = request.query.environment;
  
        
          if (!environment) {
            return reply.code(400).send({
              status: 400,
              error: 'Missing Querystring',
            });
          }
  
          const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
          const econia = new EconiaTrade(client as any);
          const registeredMarkets = await econia.fetchRegisteredMarkets(environment);
    const marketData: EconiaMarkets = await econia.markets(
      registeredMarkets.filter((market) => market.marketId == 3)[0],
     environment
    );
          const getAllTrades = await marketData.getAllTrades(true, {
            offset: 0,
            limit: 10,
            order: 'desc',
          }) as TradeTable[];
    
          reply.code(200).send({
            status: 200,
            message: 'Fetch all trades successfully',
            getAllTrades,
          });
        } catch (error: any) {
          reply.code(500).send({
            status: 500,
            error: error.message,
          });
        }
      });
}