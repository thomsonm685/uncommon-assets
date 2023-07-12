// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
// import MongoStore from "connect-mongo";
import bodyParser from "body-parser";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import shopInDb from "./helpers/shopInDb.js";
import { attachSellingPlan, cancelSubscription, createSellingPlan, createSubscription, detachSellingPlan, listCustomerSubscriptions, manageCustomerTag } from "./controllers/subscriptions.js";
import { createBundle, createBundleDraftOrder, deleteBundle, updateBundle } from "./controllers/bundles.js";
import subscriptionRoutes from './routes/api/Subscriptions.js';
import productRoutes from './routes/api/Products.js';
import customerRoutes from './routes/api/Customers.js';
import bundlesRoutes from './routes/api/Bundles.js';

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
); 

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Connect to MongoDB instance
mongoose
	.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log('[INFO] Successfully connected to MongoDB instance!'))
	.catch(err => {
		console.log(`[ERROR] ${err}`);
		process.abort(); 
	});

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin()); 
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js
app.use(express.json());

// app.use("/api/tiers", shopify.validateAuthenticatedSession(), async (req,res,next) => await shopInDb(req,res,next), [subscriptionRoutes, productRoutes,customerRoutes]);

// app.use("/api/*", shopify.validateAuthenticatedSession(), async (req,res,next) => await shopInDb(req,res,next));
app.use("/api", shopify.validateAuthenticatedSession(), async (req,res,next) => await shopInDb(req,res,next), [subscriptionRoutes, productRoutes,customerRoutes, bundlesRoutes]);



// app.get("/api/products/count", async (_req, res) => {
//   const countData = await shopify.api.rest.Product.count({
//     session: res.locals.shopify.session,
//   });
//   res.status(200).send(countData);
// });

// app.get("/api/products/create", async (_req, res) => {
//   let status = 200;
//   let error = null;

//   try {
//     await productCreator(res.locals.shopify.session); 
//   } catch (e) {
//     console.log(`Failed to process products/create: ${e.message}`);
//     status = 500;
//     error = e.message; 
//   }
//   res.status(status).send({ success: status === 200, error });
// });
 
app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));
 
// createSubscription();
// cancelSubscription('gid://shopify/SubscriptionContract/11032101171'); 


// cancelSubscription('gid://shopify/SubscriptionContract/11028070707')
// cancelSubscription('gid://shopify/SubscriptionContract/11028103475')
// cancelSubscription('gid://shopify/SubscriptionContract/11028136243')
// cancelSubscription('gid://shopify/SubscriptionContract/11028169011')
// cancelSubscription('gid://shopify/SubscriptionContract/11028201779')
// cancelSubscription('gid://shopify/SubscriptionContract/11029807411')
// cancelSubscription('gid://shopify/SubscriptionContract/11029840179')
// cancelSubscription('gid://shopify/SubscriptionContract/11029905715')
// cancelSubscription('gid://shopify/SubscriptionContract/11029938483')
// cancelSubscription('gid://shopify/SubscriptionContract/11030004019')
// cancelSubscription('gid://shopify/SubscriptionContract/11030036787')
// cancelSubscription('gid://shopify/SubscriptionContract/11030069555')
// cancelSubscription('gid://shopify/SubscriptionContract/11030102323')
// cancelSubscription('gid://shopify/SubscriptionContract/11030135091')
// cancelSubscription('gid://shopify/SubscriptionContract/11030200627')
// cancelSubscription('gid://shopify/SubscriptionContract/11030233395')
// cancelSubscription('gid://shopify/SubscriptionContract/11030266163')

//   masterVariantId: 45406402707763,
//   bundleProducts: [{variantId:45392269279539, quantity:1}, {variantId:45324020711731, quantity:1}],
//   title: "Hair Bundle!",
//   aggregateInventory: true
// })
// updateBundle({
//   masterVariantId: 45406402707763,
//   bundleProducts: [{variantId:45392269279539, quantity:1}],
//   title: "NOT a hair bundle!",
//   aggregateInventory: true
// })
// deleteBundle({masterVariantId: 45406402707763});
// createBundle({
//   masterVariantId: 45406402707763,
//   bundleProducts: [{variantId:45392269279539, quantity:1}, {variantId:45324020711731, quantity:1}],
//   title: "Hair Bundle!",
//   aggregateInventory: true
// })

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
