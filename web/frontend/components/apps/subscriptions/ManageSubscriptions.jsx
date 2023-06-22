import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import CustomerSearch from "./CustomerSearch";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";

export default function ManageSubscriptions() {

  const fetch = useAuthenticatedFetch();

  const [customers,setCustomers] = useState(null);

  useEffect(()=>{
    // get store subscriptions
    loadIntial();
  }, []);

  const loadIntial = async () => {
    const subscriptionsRes = await (await fetch('/api/subscriptions')).json();
    console.log('subscriptionsRes:', subscriptionsRes);

    const tempCustomers = [];

    subscriptionsRes.data.subscriptions.forEach(sub=>{
      if(tempCustomers.filter(c=>c.id===sub.customer.id.split('Customer/')[1])[0]){
        tempCustomers.filter(c=>c.id===sub.customer.id.split('Customer/')[1])[0].subscriptions.push(sub);
      }
      else{
        tempCustomers.push({
          id: sub.customer.id.split('Customer/')[1],
          firstName: sub.customer.firstName,
          lastName: sub.customer.lastName,
          subscriptions: [sub]
        })
      }
    })

    setCustomers(tempCustomers);
  }

  return (
    <Page fullWidth>
        <Text variant="heading4xl" as="p">Manage Subscriptions 🗒️</Text>
        <br></br>
        <Layout>
            <Layout.Section>
            <Card sectioned>
              <Text variant="headingMd" as="h2">Search Customers</Text>
              <CustomerSearch loadIntial={loadIntial} customers={customers}></CustomerSearch>
            </Card>
            </Layout.Section>
        </Layout>
    </Page>
  );
}
