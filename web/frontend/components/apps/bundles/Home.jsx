import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function Home() {
  return (
    <Page>
      <Text variant="heading4xl" as="p">Welcome! 🎉</Text>
      <br></br>
      <Layout>
        <Layout.Section>
          <Card sectioned title="Welcome">
            <Text as="p">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat officiis, explicabo expedita repellendus dolore, assumenda perspiciatis culpa fugiat molestias aliquam asperiores magnam odio voluptate architecto illum sapiente ea optio blanditiis!
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro id nemo totam debitis odit suscipit et, architecto eveniet non? Blanditiis consequuntur tempore nulla aperiam hic dignissimos ducimus, aliquam placeat sit? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit aspernatur excepturi quod earum iure quia dicta? Asperiores, corrupti aliquid numquam ipsum sit ea vero ad, quidem quaerat, nesciunt similique sunt!
            </Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
