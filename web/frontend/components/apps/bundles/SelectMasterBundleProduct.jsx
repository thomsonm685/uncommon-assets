
import { Button, TextField, Stack, DisplayText } from "@shopify/polaris"
import { useState } from "react"
import MyModal from "../../MyModal";
import SelectProducts from './SelectProducts'


export default function({product, setProduct, products, bundleProduct, setBundleProduct}){

    // const [qty,setQty] = useState(null)
    const [open,setOpen] = useState(false);
    const [status,setStatus] = useState(null);
    
    // const [selectedProduct,setSelectedProduct] = useState(null);

    const ModalContent = () => {  
        return(
        <>
            <DisplayText>
                <b>Select Product</b>
            </DisplayText>
            <SelectProducts toggleModal={toggleModal} selectedProduct={bundleProduct} setSelectedProduct={setBundleProduct} products={products}></SelectProducts>
            <Button disabled={!bundleProduct} onClick={()=>setModalStep(2)}>Next</Button>
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

    
    const toggleModal = () => {
        setStatus(null);
        setOpen(!open);
    }


    return(
        <>
    <div style={{padding:'10px'}} >
        {!bundleProduct?'':
        <div className="productLineItem" style={{marginBottom:'15px'}}>
            <h2>Selected Product: <b>{bundleProduct.title}</b></h2>
        </div>
        }
        <Stack>
            <Button onClick={toggleModal}>Select Product</Button>
            {/* <Button destructive>Remove Product</Button> */}
            {/* {!product?
            <div style={{width:'50px', marginTop:'-23px'}}>
                <TextField
                    type="number"
                    label="Qty"
                    value={qty}
                    onChange={setQty}
                    autoComplete="off"
                    align="right"
                />
            </div>
            :''} */}
        </Stack>
    </div>
    <MyModal
            content={<ModalContent/>}
            title={`Select Master Bundle Product`}
            modalActive={open}
            primaryText="Select Product"
            status={status}
            closeModal={toggleModal}
        />
        </>
    )
}