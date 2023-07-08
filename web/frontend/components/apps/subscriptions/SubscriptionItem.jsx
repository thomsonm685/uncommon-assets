
import { TextStyle, Button, Stack,Heading, Spinner  } from "@shopify/polaris";
import MyModal from "../../MyModal";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";


export default function({subscription, loadIntial}){

    console.log('subscriuption:', subscription);

    const fetch = useAuthenticatedFetch();

    const [editModalActive, setEditModalActive] = useState(false);
    const [cancelModalActive, setCancelModalActive] = useState(false);
    const [activateModalActive, setActivateModalActive] = useState(false);
    const [status,setStatus] = useState(null);
    const [testState,setTestState] = useState(false);

    // const [chargeInterval,setChargeInterval] = useState('month');
    // const [chargeIntervalCount,setChargeIntervalCount] = useState(1);
    // const [deliveryInterval,setDeliveryInterval] = useState('month');
    // const [deliveryIntervalCount,setDeliveryIntervalCount] = useState(1);
    // // const [price,setPrice] = useState(null);
    // // const [nextCharge,setNextCharge] = useState(null);
    // const [paymentMethodId,setPaymentMethodId] = useState(null);
    // const [addressId,setAddressId] = useState(null);
    // const [extraCustomerDetails,setExtraCustomerDetails] = useState(null);

    // const {id, firstName, lastName} = customer;

    // const [{month, year}, setDate] = useState({month: new Date().getMonth(), year: new Date().getFullYear()});
    // const [selectedDates, setSelectedDates] = useState({
    //     //   start: new Date().setDate(new Date().getDate() + 1),
    //     //   end: new Date().setDate(new Date().getDate() + 1),
    //     start: new Date(subscription.nextBillingDate),
    //     end: new Date(subscription.nextBillingDate),
    // });
  
    // const handleMonthChange = useCallback(
    //   (month,year) => setDate({month, year}),
    //   [],
    // );

    // const intervalOptions = [
    //     {label: 'Month', value: 'month'},
    //     {label: 'Day', value: 'day'}
    // ];
    
    // const updateSubscription = async() => {
    //     setStatus('loading');
    //     const updateSubscriptionRes = await fetch('/api/subscriptions', {
    //         method: 'POST',
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             subscription: {
    //                 customer:subscription.customer,
    //                 nextBillingDate: selectedDates.start.toISOString().split('T')[0],
    //                 deliveryInterval,
    //                 deliveryIntervalCount,
    //                 chargeInterval,
    //                 chargeIntervalCount, 
    //                 paymentMethodId,
    //                 address: extraCustomerDetails.addresses.filter(a=>a.id===addressId)[0],
    //                 contractId: subscription.contractId
    //             }
    //         })
    //     });
    //     if(updateSubscriptionRes.status === 200){
    //         setStatus('success');
    //     }
    //     else{
    //         setStatus('error');
    //     }        
    //     return
    // }

    // const getCustomerSpecific = async () => {
    //     const customerRes = await (await fetch('/api/customers/'+customer.id)).json();
    //     console.log('customerRes:', customerRes.data.customer);
    //     setExtraCustomerDetails(customerRes.data.customer);
    // }




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
        setModalStep(1);
        setSelectedProducts([]);
        setSelectedProduct(null);
        getCustomerSpecific();
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
            {status?<StatusContent/>:
            modalStep<2?
            <>
            <DisplayText>
                <b>Select Product</b>
            </DisplayText>
            <SelectProducts setPrice={setPrice} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} products={products}></SelectProducts>
            <Button disabled={!selectedProduct} onClick={()=>setModalStep(2)}>Next</Button>
            </>
            :!extraCustomerDetails?<Spinner/>
            :
            <>
            <DisplayText>
                <b>Subscription Options</b>
            </DisplayText>
            <Form>
                <b>Price</b>
                <TextField
                    value={price}
                    onChange={setPrice}
                    autoComplete="off"
                    type="number"
                /> 
                <b>Delivery Interval</b>
                <Select
                    label="Interval Unit"
                    options={intervalOptions}
                    onChange={setDeliveryInterval}
                    value={deliveryInterval}
                />
                <TextField
                    label="Inverval Count"
                    value={deliveryIntervalCount}
                    onChange={setDeliveryIntervalCount}
                    autoComplete="off"
                    type="number"
                /> 
                <b>Order Interval</b>
                <Select
                    label="Interval Unit"
                    options={intervalOptions}
                    onChange={setChargeInterval}
                    value={chargeInterval}
                />
                <TextField
                    label="Inverval Count"
                    value={chargeIntervalCount}
                    onChange={setChargeIntervalCount}
                    autoComplete="off"
                    type="number"
                /> 
                <b>Address</b>
                <Select
                    options={extraCustomerDetails.addresses.map(a=>({label:`${a.address1}, ${a.city} ${a.provinceCode}`,value:a.id}))}
                    onChange={setAddressId}
                    value={addressId}
                />
                <b>Payment Method</b>
                <Select
                    options={extraCustomerDetails.paymentMethods.map(pm=>({label:`${pm.brand}, ${pm.lastDigits}`,value:pm.id}))}
                    onChange={setPaymentMethodId}
                    value={paymentMethodId}
                />
                <b>Subscription Start Date</b>
                <DatePicker
                    month={month}
                    year={year}
                    onChange={setSelectedDates}
                    onMonthChange={handleMonthChange}
                    selected={selectedDates}
                    allowRange={false}
                    disableDatesBefore={new Date()}
                />

            </Form>
            <br />
            <ButtonGroup>
                <Button onClick={()=>setModalStep(1)}>Back</Button>
                <Button primary onClick={createSubscription}>Publish Subscription</Button>
            </ButtonGroup>
            </>
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
                {/* <Button onClick={toggleEditModal}>Edit</Button> */}
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