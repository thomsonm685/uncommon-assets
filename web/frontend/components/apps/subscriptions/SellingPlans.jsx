import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import CreateSellingPlan from "./CreateSellingPlan";
import EditSellingPlan from "./EditSellingPlan";

export default function SellingPLans() {

  const testPlans = [
    {name: 'Every Week', interval: 7, unit: 'day', id:1, products: ['Gold Membership']},
    {name: 'Every Month', interval: 1, unit: 'month', id:2, products: ['Gold Membership']},
    {name: 'Annual', interval: 12, unit: 'month', id:3, products: ['Gold Membership']},
  ]

  return (
    <Page fullWidth>
        <Text variant="heading4xl" as="p">Selling Plans 📅</Text>
        <br></br>
        <Layout>
            <Layout.Section>
            <Card sectioned>
              <Card.Section title="Create Selling Plan">
                <CreateSellingPlan></CreateSellingPlan>
              </Card.Section>
              <Card.Section title="Edit Selling Plans">
                {testPlans.map(plan=>(
                  <EditSellingPlan plan={plan}></EditSellingPlan>
                ))}
              </Card.Section>
            </Card>
            </Layout.Section>
        </Layout>
    </Page>
  );
}
