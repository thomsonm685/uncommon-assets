import { Button, TextField, Stack, Select } from "@shopify/polaris";
import SelectProduct from "./SelectMasterBundleProduct";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";
import SelectMasterBundleProduct from "./SelectMasterBundleProduct";
import SelectBundleProduct from "./SelectBundleProduct";
import BundleItem from "./BundleItem";

export default function({products}){

    const [bundleProduct, setBundleProduct] = useState(null);
    const [subProducts, setSubProducts] = useState([]);
    const [subQtys, setSubQtys] = useState([]);


    // const [products,setProducts] = useState(null);
    
    // useEffect(()=>{
    //     // get store subscriptions
    //     loadIntial();
    //     loadProducts();
    // }, []);

    // const loadIntial = async () => {
    //     const subscriptionsRes = await (await fetch('/api/subscriptions')).json();
    //     console.log('subscriptionsRes:', subscriptionsRes);
    
    //     const tempCustomers = [];
    
    //     subscriptionsRes.data.subscriptions.forEach(sub=>{
    //       if(tempCustomers.filter(c=>c.id===sub.customer.id.split('Customer/')[1])[0]){
    //         tempCustomers.filter(c=>c.id===sub.customer.id.split('Customer/')[1])[0].subscriptions.push(sub);
    //       }
    //       else{
    //         tempCustomers.push({
    //           id: sub.customer.id.split('Customer/')[1],
    //           firstName: sub.customer.firstName,
    //           lastName: sub.customer.lastName,
    //           subscriptions: [sub]
    //         })
    //       }
    //     })
    
    //     setCustomers(tempCustomers);
    
    //     // const productsRes = await (await fetch('/api/products')).json();
    //     // console.log('productsRes:', productsRes.data.products);
    
    //     // setProducts(productsRes.data.products);
    
    //   }
    
    //   // const loadProducts = async () => {
    //     const productsRes = await (await fetch('/api/products')).json();
    //     console.log('productsRes:', productsRes.data.products);
    
    //     setProducts(productsRes.data.products);
    
    //     return
    //   }
    

    const addProductToBundle = (product) => {
        setSubProducts([...subProducts, product])
    }

    const newSubProduct = () => {
        setSubProducts([...subProducts, null])
    }

    console.log('subQtys:', subQtys);

    return(
    <>
        <Stack vertical>
            <i>Select Bundle Product</i>
            <SelectMasterBundleProduct subQtys={subQtys} setSubQtys={setSubQtys} setBundleProduct={setBundleProduct} products={products} bundleProduct={bundleProduct} setProduct={setBundleProduct}></SelectMasterBundleProduct>
        <br></br>
            <i>Select Sub Products</i>
            {subProducts.map((subP, i)=>(
                <BundleItem subP={subP} subQtys={subQtys} setSubQtys={setSubQtys}></BundleItem>
            ))}
            <SelectBundleProduct subProducts={subProducts} setSubProducts={setSubProducts} products={products} setProduct={addProductToBundle}></SelectBundleProduct>

        
        {/* <Button onClick={()=>newSubProduct}>Add Sub Product</Button> */}
        <br></br>
        <Button primary disabled={!bundleProduct || !subProducts.length}>Create Bundle</Button>
        </Stack>
    </>
    )
}