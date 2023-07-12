
import { Button, TextField, Stack } from "@shopify/polaris"
import { useState } from "react"

export default function({product, masterProduct=false}){

    const [qty,setQty] = useState(null)

    return(
        <>
    <div style={{padding:'10px'}} >
        {!product?'':
        <>
            <h2>Selected Product: <b>{product.title}</b></h2>
            <br></br>
        </>
        }
        <Stack>
            <Button onClick={}>Select Product</Button>
            <Button destructive>Remove Product</Button>
            {!masterProduct?
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
            :''}
        </Stack>
    </div>
    </>
    )
}