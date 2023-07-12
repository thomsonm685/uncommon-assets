import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import CreateBundle from "./CreateBundle"; 
import EditBundle from "./EditBundle";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";

export default function Bundles() {

  const fetch = useAuthenticatedFetch();

  const [products,setProducts] = useState(null);
  const [bundles, setBundles] = useState(null);
     
  useEffect(()=>{
      // get store subscriptions 
      loadIntial();
      loadProducts();
  }, []);

  const loadIntial = async () => {
    const bundlesRes = await (await fetch('/api/bundles')).json();
    console.log('bundlesRes:', bundlesRes);
  
    setBundles(bundlesRes.data.bundles);

  }
  
  const loadProducts = async () => {
    const productsRes = await (await fetch('/api/products')).json();
    console.log('productsRes:', productsRes.data.products);

    setProducts(productsRes.data.products);

    return
  }
  

  const testBundles = [
    { 
      product: {
        id:9781248,
        title: 'Game Box'
      }, 
      connectedProducts: [
        {
          product:{
            id:35465,
            title: 'Shirt'
          },
          qty: 1
        },
        {
          product:{
            id:59842,
            title: 'Trading Card'
          },
          qty: 2
        },
        {
          product:{
            id:264541,
            title: 'Water Bottle'
          },
          qty: 1
        }
      ]
    },
  ]

  return (
    <Page fullWidth>
        <Text variant="heading4xl" as="p">Bundles 🎁</Text>
        <br></br>
        <Layout>
            <Layout.Section>
            <Card sectioned title="Create New Bundle">
              <CreateBundle products={products} bundles={bundles}></CreateBundle>
            </Card>
            {
            bundles?
              bundles.map(bundle=>(
                <EditBundle bundle={bundle}></EditBundle>
              ))
              :''
            }
            </Layout.Section>
        </Layout>
    </Page>
  );
}
