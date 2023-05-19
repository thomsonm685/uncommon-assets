import { Button, TextField, Stack, Select } from "@shopify/polaris";
import { useState } from "react";
import SelectProduct from "./SelectProduct";


export default function(){

    const [bundleProduct, setBundleProduct] = useState(null);
    const [subProducts, setSubProducts] = useState([]);

    const addProductToBundle = (product) => {
        setSubProducts([...subProducts, product])
    }

    const newSubProduct = () => {
        setSubProducts([...subProducts, null])
    }

    return(
    <>
        <Stack vertical>
            <i>Select Bundle Product</i>
            <SelectProduct product={bundleProduct} setProduct={setBundleProduct} masterProduct={true}></SelectProduct>
        <br></br>
            <i>Select Sub Products</i>
            {subProducts.map((subP, i)=>(
                <SelectProduct product={subProducts[i]} setProduct={addProductToBundle} i={i}></SelectProduct>
            ))}
        
        <Button onClick={()=>newSubProduct}>Add Sub Product</Button>
        <br></br>
        <Button primary disabled={!bundleProduct || !subProducts.length}>Create Bundle</Button>
        </Stack>
    </>
    )
}