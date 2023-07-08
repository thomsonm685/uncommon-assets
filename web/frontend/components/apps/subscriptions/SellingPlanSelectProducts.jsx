import { Filters, ResourceItem, ResourceList, Scrollable, Spinner } from "@shopify/polaris";
import ProductSearchItem from "./ProductSearchItem";
import { useEffect, useState, useCallback} from "react";
import SellingPlanProductSearchItem from "./SellingPlanProductSearchItem";


const SellingPlanSelectProducts =  ({products, selectedProducts, setSelectedProducts}) => {

    const [queryValue, setQueryValue] = useState("");

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
                <SellingPlanProductSearchItem product={product} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts}></SellingPlanProductSearchItem>      
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
                items={products}
                renderItem={renderItem}
                filterControl={filterControl}
                />
                }
            </Scrollable>
        </>
    )
}

export default SellingPlanSelectProducts;