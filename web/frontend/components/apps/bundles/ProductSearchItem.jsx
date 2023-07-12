
import { TextStyle, Icon, Button, ButtonGroup, Stack, Collapsible, Modal, Image } from "@shopify/polaris";
// import { useState } from "react";
// import MyModal from "../../MyModal";

export default function({product, selectedProduct, setSelectedProduct, products, toggleModal}){

    console.log('product:', product);
    console.log('selectedProduct:', selectedProduct);

    const toggleProduct = () => {
        // if(product===selectedProduct && !selectedProduct===null){
        //     alert('hi')
        // }
        // else{
        //     console.log('product:', product);
            setSelectedProduct(product);
            toggleModal();

        //}
        // if(selectedProducts.filter(pid=>pid===product.id)[0]){
        //     let productsCopy = [...selectedProducts].filter(pid=>pid!==product.id);
        //     setSelectedProducts(productsCopy);
        // }
        // else{
        //     let productsCopy = [...selectedProducts];
        //     productsCopy.push(product.id);
        //     setSelectedProducts(productsCopy);
        // }
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
                            <img  src={product?.image?.src} style={{maxWidth:'60%'}}/>
                        </div>
                    </div>
                </div>
                <div style={{width:'30%', display:'flex', justifyContent:'flex-end'}}>
                        <ButtonGroup>
                            {/* <Button  onClick={()=>incrementProduct(-1)}>-</Button>
                            <h2><b>{selectedProducts.filter(p=>p.id===product.id)[0]?.qty || 0}</b></h2>
                            <Button  onClick={()=>incrementProduct(1)}>+</Button> */}
                            {/* {product===selectedProduct?
                            <Button destructive onClick={toggleProduct}>De-Select</Button>
                            :<Button onClick={toggleProduct}>Select</Button>
                            } */}
                            <Button onClick={toggleProduct}>Select</Button>
                        </ButtonGroup>
                </div>
            </div>
        </>
    )
}