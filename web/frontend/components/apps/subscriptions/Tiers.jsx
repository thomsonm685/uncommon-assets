import { Card, Page, Layout, TextContainer, Text, Spinner } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import EditTier from "./EditTier";
import CreateTier from "./CreateTier";
import { useAuthenticatedFetch } from "../../../hooks";
import { useEffect, useState } from "react";

export default function Tiers() {

  const fetch = useAuthenticatedFetch();

  const [tiers,setTiers] = useState(null);
  const [products,setProducts] = useState(null);

  useEffect(()=>{
    loadIntial();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const productsRes = await (await fetch('/api/products')).json();
    console.log('productsRes:', productsRes.data.products);

    setProducts(productsRes.data.products);

    return
  }

  const loadIntial = async () => {
    const tiersRes = await (await fetch('/api/subscriptions/tiers')).json();
    // console.log('tiersRes:', tiersRes.data);
    setTiers(tiersRes.data.tiers)

  }

  // const testTiers = [
  //   {name: 'Gold', url: '/gold', id:1},
  //   {name: 'Silver', url: '/silver', id:2},
  //   {name: 'Bronze', url: '/bronze', id:3},
  // ]

  return (
    <Page fullWidth>
        <Text variant="heading4xl" as="p">Tiers 🏆</Text>
        <br></br>
        <Layout>
            <Layout.Section>
            <Card sectioned>
              <Card.Section title="Create Tier">
                <CreateTier></CreateTier>
              </Card.Section>
              <Card.Section title="Edit Tiers">
                {tiers?
                  tiers.map(tier=>(
                    <EditTier tier={tier} products={products}></EditTier>
                  )) : 
                  <Spinner></Spinner>
                }
              </Card.Section>
            </Card>
            </Layout.Section>
        </Layout>
    </Page>
  );
}
