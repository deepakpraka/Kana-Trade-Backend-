// getRegisteredMarkets.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AptosAccount, AptosClient } from 'aptos';
import { EconiaMarkets, EconiaTrade, ENVIRONMENT } from '@kanalabs/trade';
import dotenv from 'dotenv';

dotenv.config();

export default async function depositQuoteCoinPayload(fastify: FastifyInstance) {
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
        const marketData: EconiaMarkets = await econia.markets(
            registeredMarkets.filter((market) => market.marketId == 3)[0],
          environment
          );
        const quoteCoinDepositPayload = marketData.depositQuoteCoinPayload('100000000');
        const quoteCoinTransaction = await client.generateTransaction(account.address(), quoteCoinDepositPayload);
        const quoteCoinSign = await client.signTransaction(account, quoteCoinTransaction);
        const quoteCoinSubmit = await client.submitTransaction(quoteCoinSign);
        console.log("quoteCoinSubmit",quoteCoinSubmit)
        await client.waitForTransaction(quoteCoinSubmit.hash);
        reply.code(200).send({
            status: 200,
            message: 'Deposit Quote coin payload submitted successfully',
            quoteCoinDepositPayload, 
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