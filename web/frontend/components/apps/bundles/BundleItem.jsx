import { TextField } from "@shopify/polaris";
import { useState } from "react";


const BundleItem = ({subP, subQtys, setSubQtys}) => {

    const [qty,setQty] = useState(1);

    console.log('subQtys ASD:',subQtys);

    const updateQty = (value) => {
        alert('value:',value);
        if(value<1)return;
        setQty(value);
        const qtysCopy = subQtys;
        qtysCopy.filter(q=>q.id===subP.id)[0].qty = value;
        setSubQtys(qtysCopy);
    }

    return(
    <div className="productLineItem">
        <h2>Product: <b>{subP.title}</b></h2>
        {/* <TextField 
            type="number"
            value={subQtys.filter(q=>q.id===subP.id)[0].qty}
            onChange={updateQty}
            label="Qty"
        ></TextField> */}
    </div>
    )
}

export default BundleItem;