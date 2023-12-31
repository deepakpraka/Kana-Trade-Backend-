import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AptosAccount, AptosClient } from 'aptos';
import { EconiaTrade, ENVIRONMENT } from '@kanalabs/trade';
import dotenv from 'dotenv';

dotenv.config();

export default async function getUserMarketAccount(fastify: FastifyInstance) {
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
        // Use AptosAccount.fromAptosAccountObject to create the account
        const account = AptosAccount.fromAptosAccountObject({
          address: process.env.APTOS_ADDRESS,
          publicKeyHex: process.env.APTOS_PUBLICKEY,
          privateKeyHex: process.env.APTOS_PRIVATEKEY as any,
        });

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
        const marketData = await econia.markets(registeredMarkets[1], environment);
        const marketInfo = await marketData.getUserMarketAccount(account.address().toString());
        reply.code(200).send({
            status: 200,
            message: ' Fetch User Account Market Info successfully',
            marketInfo, 
          });
        } catch (error: any) {
          reply.code(500).send({
            status: 500,
            error: error.message,
          });
        }
      }
    );
  }