
import { TextStyle, Button, Stack,Heading, Spinner  } from "@shopify/polaris";
import MyModal from "../../MyModal";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";


export default function({subscription, loadIntial}){

    const fetch = useAuthenticatedFetch();

    const [editModalActive, setEditModalActive] = useState(false);
    const [cancelModalActive, setCancelModalActive] = useState(false);
    const [activateModalActive, setActivateModalActive] = useState(false);
    const [status,setStatus] = useState(null);
    const [testState,setTestState] = useState(false);

    useEffect(()=>{
        return
    },[testState]);

    const toggleCancelModal = () => {
        setStatus(null);
        setCancelModalActive(!cancelModalActive);
    }

    const toggleActivateModal = () => {
        setStatus(null);
        setActivateModalActive(!activateModalActive);
    }

    const toggleEditModal = () => {
        setStatus(null);
        setEditModalActive(!editModalActive);
    }

    const editSubscription = () => {
        return
    }

    const cancelSubscription = async() => {
        setStatus('loading');
        const cancelSubscriptionsRes = await fetch('/api/subscriptions', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                contractId: subscription.contractId,
                updates: {
                    status: "CANCELLED"
                }
            })
        });
        if(cancelSubscriptionsRes.status === 200){
            setStatus('success');
            subscription.status = "CANCELLED";
        }
        else{
            setStatus('error');
        }
        // loadIntial();
        setTestState(!testState);
        return
    }

    const activateSubscription = async() => {
        setStatus('loading');
        const activateSubscriptionsRes = await fetch('/api/subscriptions', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                contractId: subscription.contractId,
                updates: {
                    status: "ACTIVE"
                }
            })
        });
        if(activateSubscriptionsRes.status === 200){
            setStatus('success');
            subscription.status = "ACTIVE";
        }
        else{
            setStatus('error');
        }        
        // loadIntial();
        setTestState(!testState);
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

    const StatusContent = () => {  
        return(
            <div style={{width:'100%', margin:'auto'}}>
            {status==='success'?<h1>Success</h1>:status==='error'?<h1>Error</h1>:<Spinner/>}
            </div>
        )
    }

    const CancelSubModalContent = () => {  
        return(
            <>
            {status?<StatusContent/>:
            <h1>
                Ready To Cancel?
            </h1>
            }
            </>
        )
    }

    const ActivateSubModalContent = () => {  
        return(
            <>
            {status?<StatusContent/>:
            <h1>
                Ready To Re-Activate?
            </h1>
            }
            </>
        )
    }

    return(
    <>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'space-between', border:'1px solid #e1e3e5', padding:'10px', margin:'10px'}} data-id={subscription.id}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
                <Stack vertical>
                    <h3><TextStyle variation="strong">Subscription:</TextStyle> {subscription.contractId.split('SubscriptionContract/')[1]}</h3>
                    <h3><TextStyle variation="strong">Created At:</TextStyle> {new Date(subscription.createdAt).toLocaleDateString()}</h3>
                    <h3><TextStyle variation="strong">Next Billing Date:</TextStyle> {new Date(subscription.nextBillingDate).toLocaleDateString()}</h3>
                    <h3><TextStyle variation="strong">Items:</TextStyle> {subscription.lineItems.map(l=>l.title).join(', ')}</h3>
                    <h3><TextStyle variation="strong">Total:</TextStyle> ${subscription.deliveryPrice.amount}</h3>
                    <h3><TextStyle variation="strong">Status:</TextStyle> {subscription.status}</h3>
                </Stack>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
                <Button onClick={toggleEditModal}>Edit</Button>
                <div style={{width:'20px'}}></div>
                {subscription.status==="ACTIVE"?
                <Button  destructive onClick={toggleCancelModal}>Cancel</Button>
                :
                <Button  primary onClick={toggleActivateModal}>Re-Activate</Button>
                }
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

        <MyModal
            primaryAction={cancelSubscription}
            content={<CancelSubModalContent/>}
            title={"Cancel Subscription "+subscription.contractId.split('SubscriptionContract/')[1]}
            modalActive={cancelModalActive}
            primaryText="Cancel Subscription"
            status={status}
            closeModal={toggleCancelModal}
        />

        <MyModal
            primaryAction={activateSubscription}
            content={<ActivateSubModalContent/>}
            title={"Re-Activate Subscription "+subscription.contractId.split('SubscriptionContract/')[1]}
            modalActive={activateModalActive}
            primaryText="Re-Activate Subscription"
            status={status}
            closeModal={toggleActivateModal}
        />
    </>
    )
}