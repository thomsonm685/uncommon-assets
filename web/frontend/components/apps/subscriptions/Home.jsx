import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";

export default function Home() {
  const fetch = useAuthenticatedFetch();

  // const fetch = authenticatedFetch();

  fetch('/api/user');

  return (
    <Page>
      <Text variant="heading4xl" as="p">Welcome To Subscriptions! 🎉</Text>
      <br></br>
      <Layout>
        <Layout.Section>
          <Card sectioned title="About This App">
            <Text as="p">
              Here you can create/manage subscription products, manage customer subscriptions, and create tiers.
            </Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
