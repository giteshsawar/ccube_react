import React from 'react';

import { Upload, Button } from 'antd';

function FileUpload(props) {

    const { fileUploaded, selectedModel } = props;
    const uploadProps = {
        name: selectedModel.replace(/ /g,"_").toLowerCase(),
        onChange: info => {
            const myFile = new File([info.file], `${selectedModel.replace(/ /g,"_").toLowerCase()}.png`);
            fileUploaded(myFile);
        }
    };

    return (
        <Upload
            name="file" 
            beforeUpload={() => false} 
            accept=".png, .gif, .jpg, .jpeg" 
            {...uploadProps}
        >
            <Button disabled={!selectedModel.length}>Click to Upload</Button>
        </Upload>
    )
}

export default FileUpload;