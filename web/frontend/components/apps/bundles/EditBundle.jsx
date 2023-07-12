import { Button, TextField, Stack, Select, Card, ButtonGroup, Collapsible, TextStyle } from "@shopify/polaris";
import { useState } from "react";
import SelectMasterBundleProduct from "./SelectMasterBundleProduct";
import SelectBundleProduct from "./SelectBundleProduct";
// import SelectProduct from "./SelectProduct";


export default function({bundle, products}){

    const [bundleProduct, setBundleProduct] = useState(bundle.masterVariantId);
    const [bundleProductTitle, setBundleProductTitle] = useState(bundle.title);
    const [subProducts, setSubProducts] = useState(bundle.bundleProducts);
    const [open, setOpen] = useState(false);

    console.log('bundle:', bundle);

    const addProductToBundle = (product) => {
        setSubProducts([...subProducts, product])
    }

    const newSubProduct = () => {
        setSubProducts([...subProducts, null])
    }

    const handleCollapsibleClick = (e) => {
        console.log('e.currentTarget.classList:', e?.target?.classList)
        if(e.target?.classList?.contains('collapsible-container')){
            setOpen(!open);
        }
        return
    }

    return(
        <Card sectioned>
            <div style={{display:'flex', justifyContent:'space-between',alignItems:'center'}}>
                <h2><TextStyle variation="strong">{"Edit Bundle For "+bundleProductTitle}</TextStyle></h2>
                <Button onClick={()=>setOpen(!open)}>Edit Bundle</Button>
            </div>
            <Collapsible
                open={open}
                id="basic-collapsible"
                transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                expandOnPrint
            >            
                        <br></br>
                <div style={{padding:'10px',border:'3px solid #e1e3e5', boxShadow:'10px 10px 10px 10px #e1e3e5'}}>
                    <Stack vertical>
                        <i>Select Bundle Product</i>
                        <SelectMasterBundleProduct product={bundleProduct} setProduct={setBundleProduct}  masterProduct={true}></SelectMasterBundleProduct>
                    <br></br>
                        <i>Select Sub Products</i>
                        {bundle.bundleProducts.map((subP, i)=>(
                            <SelectBundleProduct product={subProducts[i]} setProduct={addProductToBundle} i={i}></SelectBundleProduct>
                        ))}
                    
                    {/* <Button onClick={()=>newSubProduct}>Add New</Button> */}
                    <br></br>
                    </Stack>
                </div>
                <br></br>
                <ButtonGroup>
                        <Button primary disabled={!bundleProduct || !subProducts.length}>Update Bundle</Button>
                        <Button destructive>Delete Bundle</Button>
                </ButtonGroup>
            </Collapsible>
        </Card>
    )
}