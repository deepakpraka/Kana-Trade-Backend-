import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { EconiaTrade, ENVIRONMENT } from '@kanalabs/trade';
import dotenv from 'dotenv';
import { AptosClient } from 'aptos';

dotenv.config();

export default async function getAvailableMarkets(fastify: FastifyInstance) {
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
          const availableMarkets = await econia.getAvailableMarkets(registeredMarkets);
    
          reply.code(200).send({
            status: 200,
            message: 'Fetch available markets successfully',
            availableMarkets,
          });
        } catch (error: any) {
          reply.code(500).send({
            status: 500,
            error: error.message,
          });
        }
      });
    }