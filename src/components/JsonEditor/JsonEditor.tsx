import React, { useEffect, useState } from "react";
import JSONInput from 'react-json-editor-ajrm';

    
type Props = {

};

export const JsonEditor = (props: Props) => {
    return (<JSONInput
        id          = 'a_unique_id'
        placeholder = { "" }
        colors      = { "" }
        height      = '550px'
    />);
};