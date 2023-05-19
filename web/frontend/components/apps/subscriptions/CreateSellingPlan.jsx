import { Button, TextField, Stack, Select } from "@shopify/polaris";
import { useState } from "react";


export default function(){

    const [name, setName] = useState(null);
    const [interval, setInterval] = useState(null);
    const [unit, setUnit] = useState('day');

    const options = [
        {label: 'Day', value: 'day'},
        {label: 'Month', value: 'month'},
    ];

    return(
    <>
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
        <br></br>
        <Button primary disabled={!name || !interval}>Create Plan</Button>
    </>
    )
}