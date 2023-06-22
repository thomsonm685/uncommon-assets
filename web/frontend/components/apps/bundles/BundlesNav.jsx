
import {Text, Tabs } from "@shopify/polaris"
import {useState, useCallback} from 'react';
import Home from "./Home";
import Bundles from "./Bundles";
 
export default function BundlesNav(){

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
          id: 'manage-bundles',
          content: 'Manage Bundles',
          accessibilityLabel: 'Manage Bundles',
          element: <Bundles></Bundles>
        },
      ];

    return(
      <>
        <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center', borderBottom:'1px solid #dde0e4'}}>
            <div style={{width:'20px'}}></div>
            <Text variant="headingLg" as="p">Bundles</Text>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}> </Tabs>
        </div>
        <br></br>
        {tabs[selected].element}
      </>
    )
}