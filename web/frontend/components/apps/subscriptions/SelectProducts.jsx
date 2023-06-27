import { Filters, ResourceItem, ResourceList, Scrollable } from "@shopify/polaris";
import ProductSearchItem from "./ProductSearchItem";
import { useEffect, useState, useCallback} from "react";


const SelectProducts =  ({products, selectedProducts, setSelectedProducts}) => {

    const [queryValue, setQueryValue] = useState("");
    const [variantProducts, setVariantProducts] = useState([]);

    useEffect(()=>{
        const tempVariantProducts = [];
        console.log('products:', products);
        products.forEach(p=>{
            if(p.variants){
                p.variants.forEach(v=>{
                    const img = p.images.filter(image=>image.variant_ids.includes(v.id))[0]?.src;
                    const updatedV = {...v, image:img};
                    console.log('img:', img);
                    tempVariantProducts.push(updatedV);
                })
            }
            else tempVariantProducts.push(p)
        });
        console.log('tempVariantProducts:', tempVariantProducts);
        setVariantProducts(tempVariantProducts);
    }, []);


    const handleQueryValueRemove = useCallback(() => {
        setQueryValue("");
        [...document.querySelectorAll('.productSearchItem')].forEach(p=>p.style.display='block')
    }, []);

    const search = (val) => {
        setQueryValue(val);
        [...document.querySelectorAll('.productSearchItem')].forEach(design=>{
        if(design.dataset.name.toLowerCase().includes(val.toLowerCase())||val===""){
            design.style.display='block';
        }
        else{
            design.style.display='none';
        }
        })
    };

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const filterControl = (
        <Filters
        queryValue={queryValue}
        filters={[]}
        onQueryChange={search}
        onQueryClear={handleQueryValueRemove}
        >
        </Filters>
    );

    function renderItem(product) {
        return (
        <div class="productSearchItem" data-name={`${product.title} ${product.id}`} style={{borderBottom:'1px solid #e1e3e5'}}>
            <ResourceItem id={product.id}>       
                <ProductSearchItem product={product} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts}></ProductSearchItem>      
            </ResourceItem>
        </div>
        );
    }


    return (
        <>
            <br/>
            <Scrollable style={{height: '600px'}}> 
                {!products?
                <div  style={{width:'min-content', margin:'auto'}}>
                <Spinner/>
                </div>:
                <ResourceList 
                resourceName={resourceName}
                items={variantProducts}
                renderItem={renderItem}
                filterControl={filterControl}
                />
                }
            </Scrollable>
        </>
    )
}

export default SelectProducts;