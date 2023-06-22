import {
    ResourceItem,
    Scrollable,
    ResourceList,
    Filters,
    Spinner,
  } from "@shopify/polaris";

import { useState, useCallback, useEffect, useRef } from "react";
import CustomerSearchItem from "./CustomerSearchItem";


export default function({customers, setSelectedCustomer, loadIntial}) {

    // const testCustomers = [
    //     {
    //         name:'Michael Thomson',
    //         id:'1', 
    //         subscriptions: [
    //             {
    //                 id:68452,
    //                 lineItems: [
    //                     {
    //                         title: 'Gold Membership'
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         name:'John Smith',
    //         id:'2', 
    //         subscriptions: [
    //             {
    //                 id:78695,
    //                 lineItems: [
    //                     {
    //                         title: 'Gold Membership'
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         name:'Melissa Davis',
    //         id:'3', 
    //         subscriptions: [
    //             {
    //                 id:98752,
    //                 lineItems: [
    //                     {
    //                         title: 'Gold Membership'
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // ]

    const [queryValue, setQueryValue] = useState("");


    const handleQueryValueRemove = useCallback(() => {
        setQueryValue("");
        [...document.querySelectorAll('.searchItem')].forEach(p=>p.style.display='block')
    }, []);

    const search = (val) => {
        setQueryValue(val);
        [...document.querySelectorAll('.searchItem')].forEach(design=>{
        if(design.dataset.name.toLowerCase().includes(val.toLowerCase())||val===""){
            design.style.display='block';
        }
        else{
            design.style.display='none';
        }
        })
    };

    const resourceName = {
        singular: 'customer',
        plural: 'customers',
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

    function renderItem(customer) {
        return (
        <div class="searchItem" data-name={`${customer.firstName} ${customer.lastName} ${customer.id}`} style={{borderBottom:'1px solid #e1e3e5'}}>
            <ResourceItem id={customer.id}>       
                <CustomerSearchItem loadIntial={loadIntial} customer={customer} setSelectedCustomer={setSelectedCustomer}></CustomerSearchItem>      
            </ResourceItem>
        </div>
        );
    }

    return (
        <>
        {console.log('customers:', customers)}
        <br/>
        <Scrollable style={{height: '600px'}}> 
            {!customers?
            <div  style={{width:'min-content', margin:'auto'}}>
            <Spinner/>
            </div>:
            <ResourceList 
            resourceName={resourceName}
            items={customers}
            renderItem={renderItem}
            filterControl={filterControl}
            />
            }
        </Scrollable>
    </>
);
}
