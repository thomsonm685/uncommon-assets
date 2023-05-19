
import { Link } from "react-router-dom"
import {Text, Tabs } from "@shopify/polaris"
import {useState, useCallback} from 'react';
import Home from "./Home";
import ManageSubscriptions from "./ManageSubscriptions";
import SellingPlans from "./SellingPlans";
import Tiers from "./Tiers";
import Bundles from "./Bundles";

export default function SubscriptionsNav(){

    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
      (selectedTabIndex) => {
        setSelected(selectedTabIndex);
        // document.querySelectorAll('.topNavLink')[selectedTabIndex].click();
      },
      [],
    );

    const tabs = [
        {
          id: 'home',
          content: 'Home',
          accessibilityLabel: 'Home',
          element: <Home></Home>
        },
        {
          id: 'manage-subscriptions',
          content: 'Manage Subscriptions',
          accessibilityLabel: 'Manage Subscriptions',
          element: <ManageSubscriptions></ManageSubscriptions>
        },
        {
          id: 'selling-plans',
          content: 'Selling Plans',
          accessibilityLabel: 'Selling Plans',
          element: <SellingPlans></SellingPlans>
        },
        {
          id: 'tiers',
          content: 'Tiers',
          accessibilityLabel: 'Tiers',
          element: <Tiers></Tiers>
        },
        {
          id: 'bundles',
          content: 'Bundles',
          accessibilityLabel: 'Bundles',
          element: <Bundles></Bundles>
        },
      ];

    return(
      <>
        <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center', borderBottom:'1px solid #dde0e4'}}>
            <div style={{width:'20px'}}></div>
            <Text variant="headingLg" as="p">Subscriptions</Text>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}> </Tabs>
        </div>
        <br></br>
        {tabs[selected].element}
      </>
    )
}