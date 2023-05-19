import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import EditTier from "./EditTier";
import CreateTier from "./CreateTier";

export default function Tiers() {

  const testTiers = [
    {name: 'Gold', url: '/gold', id:1},
    {name: 'Silver', url: '/silver', id:2},
    {name: 'Bronze', url: '/bronze', id:3},
  ]

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
                {testTiers.map(tier=>(
                  <EditTier tier={tier}></EditTier>
                ))}
              </Card.Section>
            </Card>
            </Layout.Section>
        </Layout>
    </Page>
  );
}
