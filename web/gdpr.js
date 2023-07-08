import { DeliveryMethod } from "@shopify/shopify-api";
import { bundleOrderWebhookHandler } from "./controllers/bundles.js";
import { sellingPlanGroupCreateWebhookHandler, sellingPlanGroupDeleteWebhookHandler, sellingPlanGroupUpdateWebhookHandler, subscriptionCreateWebhookHandler, subscriptionUpdateWebhookHandler } from "./controllers/subscriptions.js";

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "orders_requested": [
      //     299938,
      //     280263,
      //     220458
      //   ],
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "data_request": {
      //     "id": 9999
      //   }
      // }
    },
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }
    },
  },

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com"
      // }
    },
  },
  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('[APP INFO] /api/webhook (order/create) HIT')
      const payload = JSON.parse(body);
      console.log('ORDER/CREATE DATA:', payload);
      await bundleOrderWebhookHandler(payload);
    },
  },
  SUBSCRIPTION_CONTRACTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('[APP INFO] /api/webhook (subscription/create) HIT')
      const payload = JSON.parse(body);
      console.log('SUBSCRIPTION/CREATE DATA:', payload);
      await subscriptionCreateWebhookHandler(payload);
    },
  },
  SUBSCRIPTION_CONTRACTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('[APP INFO] /api/webhook (subscription/update) HIT')
      const payload = JSON.parse(body);
      console.log('SUBSCRIPTION/UPDATE DATA:', payload);
      await subscriptionUpdateWebhookHandler(payload);
    },
  },
  SELLING_PLAN_GROUPS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('[APP INFO] /api/webhook SELLING_PLAN_GROUPS_UPDATE HIT')
      const payload = JSON.parse(body);
      console.log('SELLING_PLAN_GROUPS_UPDATE DATA:', payload);
      await sellingPlanGroupUpdateWebhookHandler(payload);
    },
  },
  SELLING_PLAN_GROUPS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('[APP INFO] /api/webhook SELLING_PLAN_GROUPS_CREATE HIT')
      const payload = JSON.parse(body);
      console.log('SELLING_PLAN_GROUPS_CREATE DATA:', payload);
      await sellingPlanGroupCreateWebhookHandler(payload);
    },
  },
  SELLING_PLAN_GROUPS_DELETE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('[APP INFO] /api/webhook SELLING_PLAN_GROUPS_DELETE) HIT')
      const payload = JSON.parse(body);
      console.log('SELLING_PLAN_GROUPS_DELETE DATA:', payload);
      await sellingPlanGroupDeleteWebhookHandler(payload);
    },
  }
};
