import { Button, TextField, Stack, Select } from "@shopify/polaris";
import { useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";
import MyModal from "../../MyModal";



export default function(){

    const fetch = useAuthenticatedFetch();

    const [name, setName] = useState(null);
    const [url, setUrl] = useState(null);
    const [status,setStatus] = useState(null);
    const [createTierModalActive,setCreateTierModalActive] = useState(false);

    const StatusContent = () => {  
        return(
            <div style={{width:'100%', margin:'auto'}}>
            {status==='success'?<h1>Success</h1>:status==='error'?status==='loading':<h1>Error</h1>?<Spinner/>:''}
            </div>
        )
    }

    const createTier = async () => {

        setStatus('loading');
        
        const createTierRes = await fetch('/api/subscriptions/tiers', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                name,
                url
            })
        })

        createTierRes.status === 200 ? setStatus('success') : setStatus('error');
        
        return
    }

    const toggleCreateTierModal = () => {
        setCreateTierModalActive(!createTierModalActive);
        setStatus(null);
        setName(null);
        setUrl(null);
    }

    const CreateTierModalContent = () => {
        return ( 
        <Stack>
            <TextField
                label="Tier Name"
                value={name}
                onChange={setName}
                autoComplete="off"
            />
            <TextField
                label="Restricted Url"
                value={url}
                onChange={setUrl}
                autoComplete="off"
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
        <Button primary onClick={toggleCreateTierModal}>Create New Tier</Button>

        <MyModal
            primaryAction={createTier}
            content={<CreateTierModalContent/>}
            title={"Create New Tier"}
            modalActive={createTierModalActive}
            primaryText="Create Tier"
            status={status}
            closeModal={toggleCreateTierModal}
        />
    </>
    )
}

// import { Button, TextField, Stack, Select } from "@shopify/polaris";
// import { useState } from "react";


// export default function(){

//     const [name, setName] = useState(null);
//     const [url, setUrl] = useState(null);

//     return(
//     <>
//         <Stack>
//         <TextField
//             label="Tier Name"
//             value={name}
//             onChange={setName}
//             autoComplete="off"
//         />
//         <TextField
//             label="Restricted URL"
//             value={url}
//             onChange={setUrl}
//             autoComplete="off"
//         />
//         </Stack>
//         <br></br>
//         <Button primary disabled={!name || !url}>Create Tier</Button>
//     </>
//     )
// }