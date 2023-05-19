
import { Link } from "react-router-dom"
import {Text, Tabs } from "@shopify/polaris"
import {useState, useCallback} from 'react';
import Home from "./Home";

export default function EventsNav(){

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
      ];

    return(
      <>
        <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center', borderBottom:'1px solid #dde0e4'}}>
            <div style={{width:'20px'}}></div>
            <Text variant="headingLg" as="p">Events</Text>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}> </Tabs>
        </div>
        <br></br>
        {tabs[selected].element}
      </>
    )
}