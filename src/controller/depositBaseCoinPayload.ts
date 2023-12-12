import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AptosAccount, AptosClient } from 'aptos';
import { EconiaMarkets, EconiaTrade, ENVIRONMENT } from '@kanalabs/trade';
import dotenv from 'dotenv';

dotenv.config();

export default async function depositBaseCoinPayload(fastify: FastifyInstance) {
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
        const depositPayload = marketData.depositBaseCoinPayload('100000');
        const depositTransaction = await client.generateTransaction(account.address(), depositPayload);
        const depositSign = await client.signTransaction(account, depositTransaction);
        console.log("deposit", depositSign)
        const depositSubmit = await client.submitTransaction(depositSign);
        console.log("deposit", depositSubmit)

        await client.waitForTransaction(depositSubmit.hash);

        reply.code(200).send({
          status: 200,
          message: 'Deposit base coin payload submitted successfully',
          depositPayload,
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
