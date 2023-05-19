

import { 
    Collapsible, 
    Card,
    Heading,
    Button,
    Stack,
    TextContainer,
    Icon
} from "@shopify/polaris"


import {useState, useCallback} from 'react';


export default function DropDown({children, title}) {

    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
        <div className="dropDown">
        <Card sectioned>
            <div onClick={handleToggle} className="hoverCard">
                <Stack alignment="center">
                    {/* <Stack.Item>
                        <Icon source={icon}></Icon>
                    </Stack.Item> */}
                    <Stack.Item>
                        <Heading>{title}</Heading>
                    </Stack.Item>
                </Stack>
            </div>
            <Collapsible
                open={open}
                id="basic-collapsible"
                transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                expandOnPrint
            >            
                <TextContainer>
                    <br></br>
                    {children}
                </TextContainer>
            </Collapsible>
        </Card>
        </div>
    )
}