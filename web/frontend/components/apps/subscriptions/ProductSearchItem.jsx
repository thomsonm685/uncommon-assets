
import { TextStyle, Icon, Button, ButtonGroup, Stack, Collapsible, Modal, Image } from "@shopify/polaris";
import { useState } from "react";
import SubscriptionItem from "./SubscriptionItem";
import MyModal from "../../MyModal";

export default function({product, selectedProducts, setSelectedProducts,setSelectedProduct, selectedProduct}){

    console.log('product:', product);

    const incrementProduct = (i) => {

        if(selectedProducts.filter(p=>p.id===product.id)[0]){
            let productsCopy = [...selectedProducts];
            productsCopy.filter(p=>p.id===product.id)[0].qty += i;
            if(productsCopy.filter(p=>p.id===product.id)[0].qty<1) productsCopy = productsCopy.filter(p=>p.id!==product.id);
            setSelectedProducts(productsCopy);
        }
        else if(i>0){
            let productsCopy = [...selectedProducts];
            productsCopy.push({id:product.id, qty: 1})
            setSelectedProducts(productsCopy);
        }
        return
    }

    return(
        <>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} data-id={product.id}>
                <div style={{width:'70%'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <h3 style={{width:'33%'}}><b>{product.title}</b></h3>
                        <h3 style={{width:'33%'}}>{product.id}</h3>
                        <div style={{width:'33%', display:'flex', justifyContent:'center'}}>
                            <img  src={product.image} style={{maxWidth:'60%'}}/>
                        </div>
                    </div>
                </div>
                <div style={{width:'30%', display:'flex', justifyContent:'flex-end'}}>
                        <ButtonGroup>
                            {/* <Button  onClick={()=>incrementProduct(-1)}>-</Button>
                            <h2><b>{selectedProducts.filter(p=>p.id===product.id)[0]?.qty || 0}</b></h2>
                            <Button  onClick={()=>incrementProduct(1)}>+</Button> */}
                            {selectedProduct?.id===product.id?
                            <Button destructive onClick={()=>setSelectedProduct(null)}>De-Select</Button>
                            :<Button onClick={()=>setSelectedProduct(product)} disabled={selectedProduct}>Select</Button>
                            }
                            {/* <Button onClick={()=>setSelectedProduct(product)}>Select</Button> */}
                        </ButtonGroup>
                </div>
            </div>
        </>
    )
}