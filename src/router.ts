import { FastifyInstance } from "fastify";
// import userController from "./controller/userController";
import getRegisteredMarkets from "./controller/getRegisteredMarkets";
import getAvailableMarkets from "./controller/getAvailableMarkets";
import getTradePairInfo from "./controller/getTradePairInfo";
import getAllTrades from "./controller/getAllTrades";
import getOrderBook from "./controller/getOrderBook";
import depositBaseCoinPayload from "./controller/depositBaseCoinPayload";
import depositQuoteCoinPayload from "./controller/depositQuoteCoinPayload";
import getUserMarketAccount from "./controller/userMarketData";
import placeMarketBuyOrder from "./controller/placeMarketBuyOrder";
import placeLimitBuyOrder from "./controller/placeLimitBuyOrder";
import placeLimitSellOrder from "./controller/placeLimitSellOrder";
import userOrderHistory from "./controller/userOrderHistory";
import cancelOrder from "./controller/cancelOrder";
import limitOrderHistory from "./controller/limitOrderHistory";
import editOrderSize from "./controller/editOrderSize";
import cancelAllOrders from "./controller/cancellAllOrders";
import marketOrderHistory from "./controller/marketOrderHistory";
import getCandleStickData from "./controller/getCandleStickData";

export default async function router(fastify: FastifyInstance) {
 
  fastify.register(getRegisteredMarkets,{ prefix: "/getRegisteredMarkets" });
  fastify.register(getAvailableMarkets,{ prefix: "/getAvailableMarkets" });
  fastify.register(getTradePairInfo,{ prefix: "/getTradePairInfo" });
  fastify.register(getAllTrades,{ prefix: "/getAllTrades" });
  fastify.register(getOrderBook,{ prefix: "/getOrderBook" });
  fastify.register(depositBaseCoinPayload,{ prefix: "/depositBaseCoin" });
  fastify.register(depositQuoteCoinPayload,{ prefix: "/depositQuoteCoin" });
  fastify.register(getUserMarketAccount,{ prefix: "/getUserMarketAccount" });
  fastify.register(placeMarketBuyOrder,{ prefix: "/placeMarketBuyOrder" });
  fastify.register(placeLimitBuyOrder,{ prefix: "/placeLimitBuyOrder" });
  fastify.register(placeLimitSellOrder,{ prefix: "/placeLimitSellOrder" });
  fastify.register(userOrderHistory,{ prefix: "/userOrderHistory" });
  fastify.register(cancelOrder,{ prefix: "/cancelOrder" });
  fastify.register(limitOrderHistory,{ prefix: "/limitOrderHistory" });
  fastify.register(editOrderSize,{ prefix: "/editOrderSize" });
  fastify.register(cancelAllOrders,{ prefix: "/cancelAllOrders" });
  fastify.register(marketOrderHistory,{ prefix: "/marketOrderHistory" });
  fastify.register(getCandleStickData,{ prefix: "/getCandleStickData" });

}
