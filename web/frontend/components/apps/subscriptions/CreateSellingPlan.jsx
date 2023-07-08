import { Button, TextField, Stack, Select } from "@shopify/polaris";
import { useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";
import MyModal from "../../MyModal";



export default function(){

    const fetch = useAuthenticatedFetch();

    const [name, setName] = useState(null);
    const [billingInterval, setBillingInterval] = useState(null);
    const [billingIntervalCount, setBillingIntervalCount] = useState(null);
    const [deliveryInterval, setDeliveryInterval] = useState(null);
    const [deliveryIntervalCount, setDeliveryIntervalCount] = useState(null);
    const [status,setStatus] = useState(null);
    const [createSellingPlanModalActive,setCreateSellingPlanModalActive] = useState(false);

    const options = [
        {label: '', value: null},
        {label: 'Day', value: 'day'},
        {label: 'Month', value: 'month'},
    ];

    const StatusContent = () => {  
        return(
            <div style={{width:'100%', margin:'auto'}}>
            {status==='success'?<h1>Success</h1>:status==='error'?status==='loading':<h1>Error</h1>?<Spinner/>:''}
            </div>
        )
    }

    const createSellingPlan = async () => {

        setStatus('loading');
        
        const createSellingPlanRes = await fetch('/api/subscriptions/sellingplans', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                name,
                billingInterval,
                billingIntervalCount,
                deliveryInterval,
                deliveryIntervalCount
            })
        })

        createSellingPlanRes.status === 200 ? setStatus('success') : setStatus('error');
        
        return
    }

    const toggleCreateSellingPlanModal = () => {
        setName(null);
        setBillingInterval(null);
        setDeliveryIntervalCount(null);
        setDeliveryInterval(null);
        setDeliveryIntervalCount(null);
        setStatus(null);
        setCreateSellingPlanModalActive(!createSellingPlanModalActive);
    }

    const CreatePlanModalContent = () => {
        return ( 
            <Stack>
        <TextField
            label="Plan Name"
            value={name}
            onChange={setName}
            autoComplete="off"
        />
        <TextField
            type="number"
            label="Billing Interval"
            value={billingIntervalCount}
            onChange={setBillingIntervalCount}
            autoComplete="off"
        />
        <Select
            label="Billing Interval unit"
            options={options}
            onChange={setBillingInterval}
            value={billingInterval}
        />
        <TextField
            type="number"
            label="Delivery Interval"
            value={deliveryIntervalCount}
            onChange={setDeliveryIntervalCount}
            autoComplete="off"
        />
        <Select
            label="Delivery Interval unit"
            options={options}
            onChange={setDeliveryInterval}
            value={deliveryInterval}
        />
        </Stack>
        )
    }

    return(
    <>
        {/* <Stack>
        <TextField
            label="Plan Name"
            value={name}
            onChange={setName}
            autoComplete="off"
        />
        <TextField
            type="number"
            label="Billing Interval"
            value={billingIntervalCount}
            onChange={setBillingIntervalCount}
            autoComplete="off"
        />
        <Select
            label="Billing Interval unit"
            options={options}
            onChange={setBillingInterval}
            value={billingInterval}
        />
        <TextField
            type="number"
            label="Delivery Interval"
            value={deliveryIntervalCount}
            onChange={setDeliveryIntervalCount}
            autoComplete="off"
        />
        <Select
            label="Delivery Interval unit"
            options={options}
            onChange={setDeliveryInterval}
            value={deliveryInterval}
        />
        </Stack> */}
        <br></br>
        {/* <Button primary disabled={!name || !billingInterval || !billingIntervalCount || !deliveryInterval || !deliveryIntervalCount}>Create Plan</Button> */}
        <Button primary onClick={toggleCreateSellingPlanModal}>Create New Selling Plan</Button>

        <MyModal
            primaryAction={createSellingPlan}
            content={<CreatePlanModalContent/>}
            title={"Create Selling New Plan"}
            modalActive={createSellingPlanModalActive}
            primaryText="Create Plan"
            status={status}
            closeModal={toggleCreateSellingPlanModal}
        />
    </>
    )
}