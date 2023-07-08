import { Button, TextField, Stack, Collapsible,TextStyle, Select, Link, ButtonGroup, DisplayText, Form } from "@shopify/polaris";
import { useState } from "react";
import MyModal from "../../MyModal";
import { useAuthenticatedFetch } from "../../../hooks";
import SelectProducts from "./SelectProducts";
import SellingPlanSelectProducts from "./SellingPlanSelectProducts";


export default function({plan, products}){

    const fetch = useAuthenticatedFetch()

    const [name, setName] = useState(plan.name);
    const [billingInterval, setBillingInterval] = useState(plan.billingInterval);
    const [billingIntervalCount, setBillingIntervalCount] = useState(plan.billingIntervalCount);
    const [deliveryInterval, setDeliveryInterval] = useState(plan.deliveryIntervalull);
    const [deliveryIntervalCount, setDeliveryIntervalCount] = useState(plan.deliveryIntervalCount);
    const [connectedProducts, setConnectedProducts] = useState(plan.connectedProducts)
    const [status,setStatus] = useState(null);
    const [editSellingPlanModalActive,setEditSellingPlanModalActive] = useState(false);
    const [deleteSellingPlanModalActive,setDeleteSellingPlanModalActive] = useState(false);
    const [modalStep,setModalStep] = useState(1);
    const [selectedProducts,setSelectedProducts] = useState(plan.connectedProducts); 

    const options = [
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

    const toggleEditSellingPlanModal = () => {
        setStatus(null);
        setSelectedProducts([]);
        setEditSellingPlanModalActive(!editSellingPlanModalActive);
        setModalStep(1);
    }

    const toggleDeleteSellingPlanModal = () => {
        setStatus(null);
        setDeleteSellingPlanModalActive(!deleteSellingPlanModalActive);
    }

    const editSellingPlan = async () => {

        setStatus('loading');
        
        const editSellingPlanRes = await fetch('/api/subscriptions/sellingplans/'+plan._id, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id: plan._id,
                sellingPlanGroupId: plan.sellingPlanGroupId,
                name,
                billingInterval,
                billingIntervalCount,
                deliveryInterval,
                deliveryIntervalCount,
                connectedProducts: selectedProducts,
                addedProducts: selectedProducts.filter(pid=>!connectedProducts.includes(pid)),
                removedProducts: connectedProducts.filter(pid=>!selectedProducts.includes(pid)),
            })
        })

        editSellingPlanRes.status === 200 ? setStatus('success') : setStatus('error');
        
        return
    }

    const deleteSellingPlan = async () => {

        setStatus('loading');

        console.log('plan.sellingPlanGroupId:',plan.sellingPlanGroupId);
        
        const deleteSellingPlanRes = await fetch('/api/subscriptions/sellingplans/'+plan._id, {
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id: plan._id,
                sellingPlanGroupId: plan.sellingPlanGroupId,
                name,
                billingInterval,
                billingIntervalCount,
                deliveryInterval,
                deliveryIntervalCount,
                connectedProducts
            })
        })

        deleteSellingPlanRes.status === 200 ? setStatus('success') : setStatus('error');
        
        return
    }

    const EditSellingPlanModalContent = () => {  
        return(
            <>
            {status?<StatusContent/>:
            modalStep<2?
            <>
            <DisplayText>
                <b>Select Product</b>
            </DisplayText>
            <SellingPlanSelectProducts selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} products={products}></SellingPlanSelectProducts>
            <Button disabled={!name||!billingIntervalCount>0||!deliveryIntervalCount>0} onClick={()=>setModalStep(2)}>Next</Button>
            </>
            :
            <>
            <DisplayText>
                <b>Subscription Options</b>
            </DisplayText>
            <Form>
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
            </Form>
            <br />
            <ButtonGroup>
                <Button onClick={()=>setModalStep(1)}>Back</Button>
                <Button primary onClick={editSellingPlan}>Update Selling Plan</Button>
            </ButtonGroup>
            </>
            }
            </>
        )
    }


    // const EditSellingPlanModalContent = () => {
    //     return ( 
    //     <>
    //     <Stack>
    //             <TextField
    //                 label="Plan Name"
    //                 value={name}
    //                 onChange={setName}
    //                 autoComplete="off"
    //             />
    //             <TextField
    //                 type="number"
    //                 label="Billing Interval"
    //                 value={billingIntervalCount}
    //                 onChange={setBillingIntervalCount}
    //                 autoComplete="off"
    //             />
    //             <Select
    //                 label="Billing Interval unit"
    //                 options={options}
    //                 onChange={setBillingInterval}
    //                 value={billingInterval}
    //             />
    //             <TextField
    //                 type="number"
    //                 label="Delivery Interval"
    //                 value={deliveryIntervalCount}
    //                 onChange={setDeliveryIntervalCount}
    //                 autoComplete="off"
    //             />
    //             <Select
    //                 label="Delivery Interval unit"
    //                 options={options}
    //                 onChange={setDeliveryInterval}
    //                 value={deliveryInterval}
    //             />
    //         </Stack>
    //         <div style={{padding:'10px'}}>
    //             <Link>Connected Products</Link>
    //         </div>
    //         <Stack>
    //     </>
    //     )
    // }

    const DeleteSellingPlanModalContent= () => {  
        return(
            <>
            {status?<StatusContent/>:
            <h1>
                Delete Selling Plan?
            </h1>
            }
            </>
        )
    }

    return(
    <>
    <div style={{margin:'10px',border:'1px solid #e1e3e5', padding:'10px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} data-id={plan.id}>
            <h2>Plan: <TextStyle variation="strong">{plan.name}</TextStyle></h2>
            <h2>Delivery Every: <TextStyle variation="strong">{plan.deliveryIntervalCount} {plan.deliveryInterval}(s)</TextStyle></h2>
            <h2>Billing Every: <TextStyle variation="strong">{plan.billingIntervalCount} {plan.billingInterval}(s)</TextStyle></h2>
            <div style={{width:'50%', display:'flex', justifyContent:'flex-end'}}>
                    {/* <Button  primary onClick={()=>setSelectedCustomer(customer)} disabled={selectedCustomer===customer?true:false}>Manage</Button> */}
                <ButtonGroup>
                    <Button  primary onClick={toggleEditSellingPlanModal}>Edit</Button>
                    <Button  destructive onClick={toggleDeleteSellingPlanModal}>Delete</Button>
                </ButtonGroup>
            </div>
        </div>
        {/* <Collapsible
            open={open}
            id="basic-collapsible"
            transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
            expandOnPrint
        >               
            
        </Collapsible> */}
    </div>

    <MyModal
            content={<EditSellingPlanModalContent/>}
            title={"Edit Selling Plan "+ plan.name}
            modalActive={editSellingPlanModalActive}
            status={status}
            closeModal={toggleEditSellingPlanModal}
    /> 
    <MyModal
            primaryAction={deleteSellingPlan}
            content={<DeleteSellingPlanModalContent/>}
            title={"Delete Selling Plan "+ plan.name}
            modalActive={deleteSellingPlanModalActive}
            primaryText="Delete Plan"
            status={status}
            closeModal={toggleDeleteSellingPlanModal}
    />
    </>
    )
}