
import { TextStyle, Button, Stack,Heading  } from "@shopify/polaris";
import MyModal from "../../MyModal";
import { useState } from "react";

export default function({subscription}){

    const [editModalActive, setEditModalActive] = useState(false);
    const [status,setStatus] = useState(null);

    const editSubscription = () => {
        return
    }

    const EditSubModalContent = () => {  
        return(
            <>
            {
            }
            </>
        )
    }

    return(
    <>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'space-between', border:'1px solid #e1e3e5', padding:'10px', margin:'10px'}} data-id={subscription.id}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
                <Stack vertical>
                    <h3><TextStyle variation="strong">Subscription:</TextStyle> {subscription.id}</h3>
                    <h3><TextStyle variation="strong">Items:</TextStyle> {subscription.lineItems.map(l=>l.title).join(', ')}</h3>
                </Stack>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
                <Button onClick={()=>setEditModalActive(true)}>Edit</Button>
                <div style={{width:'20px'}}></div>
                <Button  destructive>Delete</Button>
            </div>
        </div>

        <MyModal
            primaryAction={editSubscription}
            content={<EditSubModalContent/>}
            title={"Edit Subscription "+subscription.id}
            modalActive={editModalActive}
            primaryText="Submit Edits"
            status={status}
            closeModal={()=>setEditModalActive(false)}
        />
    </>
    )
}