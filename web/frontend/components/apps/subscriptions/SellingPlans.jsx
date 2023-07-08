import { Card, Page, Layout, TextContainer, Text, Spinner } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import CreateSellingPlan from "./CreateSellingPlan";
import EditSellingPlan from "./EditSellingPlan";
import { useAuthenticatedFetch } from "../../../hooks";
import { useEffect, useState } from "react";

export default function SellingPlans() {

  const fetch = useAuthenticatedFetch();

  const [sellingPlans,setSellingPlans] = useState(null);
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
    const sellingPlanRes = await (await fetch('/api/subscriptions/sellingplans')).json();
    console.log('sellingPlanRes:', sellingPlanRes);
    setSellingPlans(sellingPlanRes.data.sellingPlans)

  }

  // const testPlans = [
  //   {name: 'Every Week', interval: 7, unit: 'day', id:1, products: ['Gold Membership']},
  //   {name: 'Every Month', interval: 1, unit: 'month', id:2, products: ['Gold Membership']},
  //   {name: 'Annual', interval: 12, unit: 'month', id:3, products: ['Gold Membership']},
  // ]

  return (
    <Page fullWidth>
        <Text variant="heading4xl" as="p">Selling Plans 📅</Text>
        <br></br>
        <Layout>
        {sellingPlans?
        <>          
        <Layout.Section>
        <Card sectioned>
          <Card.Section title="Create Selling Plan">
            <CreateSellingPlan></CreateSellingPlan>
          </Card.Section>
          <Card.Section title="Edit Selling Plans">
            {sellingPlans.map(plan=>(
              <EditSellingPlan plan={plan} products={products}></EditSellingPlan>
            ))}
          </Card.Section>
        </Card>
        </Layout.Section>
        </>
        :<Spinner></Spinner>}
        </Layout>
    </Page>
  );
}
