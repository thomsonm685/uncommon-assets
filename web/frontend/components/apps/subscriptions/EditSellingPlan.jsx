import { Button, TextField, Stack, Collapsible,TextStyle, Select, Link } from "@shopify/polaris";
import { useState } from "react";


export default function({plan}){
    
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(plan.name);
    const [interval, setInterval] = useState(plan.interval);
    const [unit, setUnit] = useState(plan.unit);

    const options = [
        {label: 'Day', value: 'day'},
        {label: 'Month', value: 'month'},
    ];

    return(
    <div style={{margin:'10px',border:'1px solid #e1e3e5', padding:'10px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} data-id={plan.id}>
            <h2>Plan: <TextStyle variation="strong">{plan.name}</TextStyle></h2>
            <div style={{width:'50%', display:'flex', justifyContent:'flex-end'}}>
                    {/* <Button  primary onClick={()=>setSelectedCustomer(customer)} disabled={selectedCustomer===customer?true:false}>Manage</Button> */}
                    <Button  primary onClick={()=>setOpen(!open)}>Manage</Button>
            </div>
        </div>
        <Collapsible
            open={open}
            id="basic-collapsible"
            transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
            expandOnPrint
        >               
            <Stack>
                <TextField
                    label="Plan Name"
                    value={name}
                    onChange={setName}
                    autoComplete="off"
                />
                <TextField
                    type="number"
                    label="Interval"
                    value={interval}
                    onChange={setInterval}
                    autoComplete="off"
                />
                <Select
                    label="Interval unit"
                    options={options}
                    onChange={setUnit}
                    value={unit}
                />
            </Stack>
            <div style={{padding:'10px'}}>
                <Link>Connected Products</Link>
            </div>
            <Stack>
            <Button >Update</Button>
            <Button  destructive>Delete</Button>
            </Stack>
        </Collapsible>
    </div>
    )
}