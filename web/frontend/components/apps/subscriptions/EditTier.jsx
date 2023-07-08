import { Button, TextField, Stack, Collapsible,TextStyle, Select, Link, ButtonGroup, DisplayText, Form } from "@shopify/polaris";
import { useState } from "react";
import MyModal from "../../MyModal";
import { useAuthenticatedFetch } from "../../../hooks";
import SelectProducts from "./SelectProducts";
import SellingPlanSelectProducts from "./SellingPlanSelectProducts";


export default function({tier, products}){

    const fetch = useAuthenticatedFetch()

    const [name, setName] = useState(tier.name);
    const [url, setUrl] = useState(tier.url);
    const [status,setStatus] = useState(null);
    const [editTierModalActive,setEditTierModalActive] = useState(false);
    const [deleteTierModalActive,setDeleteTierModalActive] = useState(false);
    const [modalStep,setModalStep] = useState(1);
    const [selectedProducts,setSelectedProducts] = useState([]); 

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

    const toggleEditTierModal = () => {
        setStatus(null);
        setSelectedProducts([]);
        setEditTierModalActive(!editTierModalActive);
        setModalStep(1);
    }

    const toggleDeleteTierModal = () => {
        setStatus(null);
        setDeleteTierModalActive(!deleteTierModalActive);
    }

    const editTier = async () => {

        setStatus('loading');
        
        const editTierRes = await fetch('/api/subscriptions/tiers/'+tier._id, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id: tier._id,
                name,
                url,
                connectedProducts: selectedProducts,
            })
        })

        editTierRes.status === 200 ? setStatus('success') : setStatus('error');
        
        return
    }

    const deleteTier = async () => {

        setStatus('loading');
        
        const deleteTierRes = await fetch('/api/subscriptions/tiers/'+tier._id, {
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id: tier._id,
                name,
                url,
                connectedProducts: selectedProducts,
            })
        })

        deleteTierRes.status === 200 ? setStatus('success') : setStatus('error');
        
        return
    }

    const EditTierModalContent = () => {  
        return(
            <>
            {status?<StatusContent/>:
            modalStep<2?
            <>
            <DisplayText>
                <b>Select Product</b>
            </DisplayText>
            <SellingPlanSelectProducts selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} products={products}></SellingPlanSelectProducts>
            <Button disabled={!name||!url} onClick={()=>setModalStep(2)}>Next</Button>
            </>
            :
            <>
            <DisplayText>
                <b>Tier Options</b>
            </DisplayText>
            <Form>
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
            </Form>
            <br />
            <ButtonGroup>
                <Button onClick={()=>setModalStep(1)}>Back</Button>
                <Button primary onClick={editTier}>Update Tier</Button>
            </ButtonGroup>
            </>
            }
            </>
        )
    }


    const DeleteTierModalContent= () => {  
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
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} data-id={tier.id}>
            <h2>Tier Name: <TextStyle variation="strong">{tier.name}</TextStyle></h2>
            <h2>Restricted Url: <TextStyle variation="strong">{tier.url}</TextStyle></h2>
            <h2>Connected Products: <TextStyle variation="strong">{tier.connectedProducts.length}</TextStyle></h2>
            <div style={{width:'50%', display:'flex', justifyContent:'flex-end'}}>
                    {/* <Button  primary onClick={()=>setSelectedCustomer(customer)} disabled={selectedCustomer===customer?true:false}>Manage</Button> */}
                <ButtonGroup>
                    <Button  primary onClick={toggleEditTierModal}>Edit</Button>
                    <Button  destructive onClick={toggleDeleteTierModal}>Delete</Button>
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
            content={<EditTierModalContent/>}
            title={"Edit Tier "+ tier.name}
            modalActive={editTierModalActive}
            status={status}
            closeModal={toggleEditTierModal}
    /> 
    <MyModal
            primaryAction={deleteTier}
            content={<DeleteTierModalContent/>}
            title={"Delete Tier "+ tier.name}
            modalActive={deleteTierModalActive}
            primaryText="Delete Tier"
            status={status}
            closeModal={toggleDeleteTierModal}
    />
    </>
    )
}

// import { Button, TextField, Stack, Collapsible,TextStyle, Select, Link } from "@shopify/polaris";
// import { useState } from "react";


// export default function({tier}){
    
//     const [open, setOpen] = useState(false);
//     const [name, setName] = useState(tier.name);
//     const [url, setUrl] = useState(tier.url);

//     const options = [
//         {label: 'Day', value: 'day'},
//         {label: 'Month', value: 'month'},
//     ];

//     return(
//     <div style={{margin:'10px',border:'1px solid #e1e3e5', padding:'10px'}}>
//         <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} data-id={tier.id}>
//             <h2>Tier: <TextStyle variation="strong">{tier.name}</TextStyle></h2>
//             <div style={{width:'50%', display:'flex', justifyContent:'flex-end'}}>
//                     {/* <Button  primary onClick={()=>setSelectedCustomer(customer)} disabled={selectedCustomer===customer?true:false}>Manage</Button> */}
//                     <Button  primary onClick={()=>setOpen(!open)}>Manage</Button>
//             </div>
//         </div>
//         <Collapsible
//             open={open}
//             id="basic-collapsible"
//             transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
//             expandOnPrint
//         >               
//             <Stack>
//                 <TextField
//                     label="Tier Name"
//                     value={name}
//                     onChange={setName}
//                     autoComplete="off"
//                 />
//                 <TextField
//                     label="Restricted URL"
//                     value={url}
//                     onChange={setUrl}
//                     autoComplete="off"
//                 />
//             </Stack>
//             <div style={{padding:'10px'}}>
//                 <Link>Connected Products</Link>
//             </div>
//             <Stack>
//             <Button >Update</Button>
//             <Button  destructive>Delete</Button>
//             </Stack>
//         </Collapsible>
//     </div>
//     )
// }