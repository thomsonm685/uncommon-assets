import { Button, TextField, Stack, Select } from "@shopify/polaris";
import { useState } from "react";


export default function(){

    const [name, setName] = useState(null);
    const [url, setUrl] = useState(null);

    return(
    <>
        <Stack>
        <TextField
            label="Tier Name"
            value={name}
            onChange={setName}
            autoComplete="off"
        />
        <TextField
            label="Restricted URL"
            value={url}
            onChange={setUrl}
            autoComplete="off"
        />
        </Stack>
        <br></br>
        <Button primary disabled={!name || !url}>Create Tier</Button>
    </>
    )
}