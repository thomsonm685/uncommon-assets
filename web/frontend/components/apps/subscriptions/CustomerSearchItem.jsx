
import { TextStyle, Icon, Button, ButtonGroup, Stack, Collapsible } from "@shopify/polaris";
import { useState } from "react";
import SubscriptionItem from "./SubscriptionItem";

export default function({customer, selectedCustomer, setSelectedCustomer}){

    const [open,setOpen] = useState(false);

    const {id, name} = customer;

    return(
        <>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} data-id={id}>
                <div style={{width:'50%'}}>
                
                    <Stack vertical>
                        <h3><TextStyle variation="strong">Name:</TextStyle> {name}</h3>
                        <h3><TextStyle variation="strong">ID:</TextStyle> {id}</h3>
                        <h3><TextStyle variation="strong">Items:</TextStyle> {customer.subscriptions.map(sub=>sub.lineItems.map(l=>l.title).join(', ')).join()}</h3>
                    </Stack>
                </div>
                <div style={{width:'50%', display:'flex', justifyContent:'flex-end'}}>
                        {/* <Button  primary onClick={()=>setSelectedCustomer(customer)} disabled={selectedCustomer===customer?true:false}>Manage</Button> */}
                        <Button  primary onClick={()=>setOpen(!open)}>Manage</Button>
                </div>
            </div>
            <Collapsible
                    open={open}
                    id="basic-collapsible"
                    transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                    expandOnPrint
                >            
                {customer.subscriptions.map(subscription=>(
                    <SubscriptionItem subscription={subscription}></SubscriptionItem>
                ))}
                <br></br>
                <Button  primary>Create Subscription</Button>
            </Collapsible>
        </>
    )
}