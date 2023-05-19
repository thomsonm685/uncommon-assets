import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import CustomerSearch from "./CustomerSearch";

export default function ManageSubscriptions() {
  return (
    <Page fullWidth>
        <Text variant="heading4xl" as="p">Manage Subscriptions 🗒️</Text>
        <br></br>
        <Layout>
            <Layout.Section>
            <Card sectioned>
              <Text variant="headingMd" as="h2">Search Customers</Text>
              <CustomerSearch></CustomerSearch>
            </Card>
            </Layout.Section>
        </Layout>
    </Page>
  );
}
