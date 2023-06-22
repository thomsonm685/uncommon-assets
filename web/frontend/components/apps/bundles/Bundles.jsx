import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import CreateBundle from "./CreateBundle";
import EditBundle from "./EditBundle";

export default function Bundles() {

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
              <CreateBundle></CreateBundle>
            </Card>
              {testBundles.map(bundle=>(
                <EditBundle bundle={bundle}></EditBundle>
              ))}
            </Layout.Section>
        </Layout>
    </Page>
  );
}
