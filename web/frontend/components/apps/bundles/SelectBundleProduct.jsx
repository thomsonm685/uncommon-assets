
import { Button, TextField, Stack, DisplayText } from "@shopify/polaris"
import { useState } from "react"
import MyModal from "../../MyModal";
import SelectProducts from './SelectProducts'
import AddProducts from "./AddProducts";

export default function({product, setProduct, products, subProducts, setSubProducts}){

    const [qty,setQty] = useState(null)
    const [open,setOpen] = useState(false);
    const [status,setStatus] = useState(null);

    console.log('subProducts:', subProducts);

    const ModalContent = () => {  
        return(
        <>
            <DisplayText>
                <b>Add Product To Bundle</b>
            </DisplayText>
            <AddProducts toggleModal={toggleModal} setSubProducts={setSubProducts} subProducts={subProducts} products={products}></AddProducts>
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
        // setSelectedProducts([]);
        // setSelectedProduct(null);
        setOpen(!open);
    }


    return(
        <>
    <div style={{padding:'10px'}} >
        {/* {!product?'':
        <>
            <h2>Selected Product: <b>{product.title}</b></h2>
            <br></br>
        </>
        } */}
        <Stack>
            {/* <Button>Select Product</Button>
            <Button destructive>Remove Product</Button>
            {!product?
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
            <Button onClick={toggleModal}>Add Bundle Product</Button>
        </Stack>
    </div>
    <MyModal
            content={<ModalContent/>}
            title={`Add Bundle Product`}
            modalActive={open}
            primaryText="Select Product"
            status={status}
            closeModal={toggleModal}
        />
        </>
    )
}