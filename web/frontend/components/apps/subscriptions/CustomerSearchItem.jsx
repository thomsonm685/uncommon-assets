
import { TextStyle, Icon, Button, ButtonGroup, Stack, Collapsible, Modal, DisplayText, Form, Text, TextField, DatePicker, Select, Spinner } from "@shopify/polaris";
import { useCallback, useState } from "react";
import SubscriptionItem from "./SubscriptionItem";
import MyModal from "../../MyModal";
import SelectProducts from "./SelectProducts";
import { useAuthenticatedFetch } from "../../../hooks";

export default function({customer, selectedCustomer, setSelectedCustomer, loadIntial, products}){

    const fetch = useAuthenticatedFetch();

    const [open,setOpen] = useState(false);
    const [createModalActive, setCreateModalActive] = useState(false);
    const [status,setStatus] = useState(null);
    const [modalStep,setModalStep] = useState(1);
    const [selectedProducts,setSelectedProducts] = useState([]); // {id:123, qty: 1}
    const [selectedProduct,setSelectedProduct] = useState(null); // {id:123, qty: 1}
    const [chargeInterval,setChargeInterval] = useState('month');
    const [chargeIntervalCount,setChargeIntervalCount] = useState(1);
    const [deliveryInterval,setDeliveryInterval] = useState('month');
    const [deliveryIntervalCount,setDeliveryIntervalCount] = useState(1);
    const [price,setPrice] = useState(null);
    // const [nextCharge,setNextCharge] = useState(null);
    const [paymentMethodId,setPaymentMethodId] = useState(null);
    const [addressId,setAddressId] = useState(null);
    const [extraCustomerDetails,setExtraCustomerDetails] = useState(null);

    const {id, firstName, lastName} = customer;

    const [{month, year}, setDate] = useState({month: new Date().getMonth(), year: new Date().getFullYear()});
    const [selectedDates, setSelectedDates] = useState({
    //   start: new Date().setDate(new Date().getDate() + 1),
    //   end: new Date().setDate(new Date().getDate() + 1),
    start: new Date(),
    end: new Date(),
    });
  
    const handleMonthChange = useCallback(
      (month,year) => setDate({month, year}),
      [],
    );

    const intervalOptions = [
        {label: 'Month', value: 'month'},
        {label: 'Day', value: 'day'}
    ];
    
    const createSubscription = async() => {
        setStatus('loading');
        const createSubscriptionRes = await fetch('/api/subscriptions', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subscription: {
                    price, 
                    selectedProduct,
                    customer,
                    nextBillingDate: selectedDates.start.toISOString().split('T')[0],
                    deliveryInterval,
                    deliveryIntervalCount,
                    chargeInterval,
                    chargeIntervalCount, 
                    paymentMethodId,
                    address: extraCustomerDetails.addresses.filter(a=>a.id===addressId)[0],
                }
            })
        });
        if(createSubscriptionRes.status === 200){
            setStatus('success');
        }
        else{
            setStatus('error');
        }        
        // loadIntial();
        // setTestState(!testState);
        return
    }

    const toggleCreateModal = () => {
        setStatus(null);
        setModalStep(1);
        setSelectedProducts([]);
        setSelectedProduct(null);
        setCreateModalActive(!createModalActive);
        getCustomerSpecific();
    }

    const getCustomerSpecific = async () => {
        const customerRes = await (await fetch('/api/customers/'+customer.id)).json();
        console.log('customerRes:', customerRes.data.customer);
        setExtraCustomerDetails(customerRes.data.customer);
    }


    const StatusContent = () => {  
        return(
            <div style={{width:'100%', margin:'auto'}}>
            {status==='success'?<h1>Success</h1>:status==='error'?<h1>Error</h1>:<Spinner/>}
            </div>
        )
    }

    

    const CreateSubModalContent = () => {  
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

    return(
        <>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} data-id={id}>
                <div style={{width:'50%'}}>
                
                    <Stack vertical>
                        <h3><TextStyle variation="strong">Name:</TextStyle> {firstName} {lastName}</h3>
                        <h3><TextStyle variation="strong">ID:</TextStyle> {id}</h3>
                        <h3><TextStyle variation="strong">Items:</TextStyle> {customer.subscriptions.map(sub=>sub.lineItems.map(l=>l.title)).join(', ')}</h3>
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
                    <SubscriptionItem subscription={subscription} loadIntial={loadIntial}></SubscriptionItem>
                ))}
                <br></br>
                <Button onClick={toggleCreateModal}  primary>Create Subscription</Button>
            </Collapsible>

            <MyModal
            content={<CreateSubModalContent/>}
            title={`Create New Subscription For ${customer?.firstName} ${customer?.lastName}`}
            modalActive={createModalActive}
            primaryText="Create Subscription"
            status={status}
            closeModal={toggleCreateModal}
            />
        </>
    )
}