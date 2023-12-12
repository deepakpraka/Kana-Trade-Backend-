
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AptosAccount, AptosClient } from 'aptos';
import { BUY, EconiaMarkets, EconiaTrade, ENVIRONMENT } from '@kanalabs/trade';
import dotenv from 'dotenv';

dotenv.config();

export default async function cancelAllOrders(fastify: FastifyInstance) {
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
    const editOrderSize = marketData.cancelAllOrders(BUY,)
    const transaction = await client.generateTransaction(account.address(), editOrderSize);
    const sign = await client.signTransaction(account, transaction);
    const submit = await client.submitTransaction(sign);
    await client.waitForTransaction(submit.hash)
    console.log('🚀 ~ file: limitOrder.test.ts:50 ~ it.only ~ submit:', submit);
    const openOrders = await marketData.getOpenOrders(account.address().toString(), 'open');
    console.log('🚀 ~ file: limitOrder.test.ts:54 ~ it.only ~ openOrders:', openOrders);
    const order = openOrders.bids[0];
    reply.code(200).send({
        status: 200,
        message: 'Fetch Cancel All Orders successfully',
        editOrderSize,
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