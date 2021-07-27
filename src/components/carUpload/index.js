import React from 'react';
import S3 from 'react-aws-s3';
import { Form, Select, Button, notification } from 'antd';
import FileUpload from './upload';

import PulseLoading from '../../assets/Pulse-1s.svg';

import "antd/dist/antd.css";
import './style.css';

const { Option } = Select;

class CarUpload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            image: null,
            brands: [],
            models: [],
            inputModels: [],
            selectedBrand: '',
            selectedModel: ''
        };

        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.fetchAllCarModels();
    }

    fetchAllCarModels = () => {
        this.setState({ loading: true }, () => {
            fetch('http://13.235.9.231:3000/api/v1/carModel/get_all_cars')
            .then(response => response.json())
            .then(data => {

                const brands = [];
                const models = [];

                data.data.map(carData => {
                    const brandEx = brands.find(b => b === carData.brand);
                    if (!brandEx) {
                        brands.push(carData.brand);
                    }

                    const modelEx = models.find(m => m === carData.model);
                    if (!modelEx) {
                        models.push({ brand: carData.brand, model: carData.model, image: carData.image });
                    }
                });

                this.setState({ brands: brands.sort((a, b) => a-b), models, loading: false });
            });
        });
    }

    brandSelected = (value) => {
        const { models } = this.state;
        const inputModels = [];

        models.map(item => {
            if (item.brand === value && !item.image) {
                inputModels.push(item.model);
            }
        });

        this.setState({ selectedBrand: value, inputModels }, () => { this.formRef.current.resetFields(['model', 'image']); });
    };

    modelSelected = value => {
        this.setState({ selectedModel: value });
    };

    fileUploaded = image => {
        const { selectedBrand, selectedModel } = this.state;

        this.setState({ loading: true }, async () => {
            const config = await this.getSignedUrl();
    
            if (config.config) {
                config.config.dirName = `images/car-models/${selectedBrand.toLowerCase()}`
            }
            
            const ReactS3Client = new S3(config.config);
    
            ReactS3Client
            .uploadFile(image,  `${selectedModel.replace(/ /g,"_").toLowerCase()}.png`)
            .then(data => {
                // console.log("image saved", data);
                this.saveImageToDB(`https://dimqa6sffarw4.cloudfront.net/${data.key}`);
            })
            .catch(err => {
                // console.error("got errror", err);
                this.setState({ loading: false });
                this.showNotification('error', err);
            })
        });
    };

    saveImageToDB = (imagePath) => {
        const { selectedBrand, selectedModel, models, inputModels } = this.state;

        fetch("http://13.235.9.231:3000/api/v1/carModel/save_carmodel_image", {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                brand: selectedBrand,
                model : selectedModel,
                image: imagePath
            })
        }).then(response => response.json())
            .then(data => {
                // console.log("data saved in db", data);
                const modelEx = models.findIndex(m => m === selectedModel);
                const iModelEx = inputModels.findIndex(m => m === selectedModel);

                models.splice(modelEx, 1);
                inputModels.splice(iModelEx, 1);

                this.setState({ loading: false, models, inputModels, selectedModel: '' }, () => {
                    this.formRef.current.resetFields(['model', 'image']);
                    window.open(data.data.image,'_blank');
                });
            }).catch(err => {
                console.error("got errror", err);
                this.setState({ loading: false });
                this.showNotification('error', err);
            });
    }

    getSignedUrl = () => { 
        const { selectedBrand } = this.state;

        return new Promise((resolve, reject) => {
            fetch("http://13.235.9.231:3000/api/v1/utils/get-aws-config", {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    fileName: selectedBrand
                })
            }).then(response => response.json())
                .then(data => {
                    resolve(data);
                });
        });
    };

    showNotification = (type, message) => {
        notification[type]({
            message: message,
            description: '',
          });
    }

    render() {
        const { loading, brands, inputModels, selectedModel } = this.state;

        return (
            <div className="form">
                <Form name="carImgUpload" onFinish={this.onFormFinish} ref={this.formRef}>
                    <div className="loginForm">
                        <div className="inputField">
                            <Form.Item 
                                className="textLabel" 
                                label="Brand" 
                                name="brand"
                                rules={[
                                        {
                                            required : true,
                                            message : 'Please select a brand'
                                        }
                                ]}>
                                    
                                <Select showSearch={true} defaultValue="" style={{ width: 250 }} onChange={this.brandSelected}>
                                    {brands.length ? brands.map(item => <Option value={item} key={item}>{item}</Option>) : <Option value="">Loading brands</Option>}
                                </Select>
                                
                            </Form.Item>
                        </div>

                        <div className="inputField">
                            <Form.Item 
                                className="textLabel" 
                                label="Model" 
                                name="model"
                                rules={[
                                    {
                                        required : true,
                                        message : 'Please select a model'
                                    }
                                ]}
                            >    

                                <Select defaultValue="" style={{ width: 250 }} onChange={this.modelSelected}>
                                    {inputModels.length ? inputModels.map(item => <Option value={item} key={item}>{item}</Option>) : <Option value="">Select brand</Option>}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="inputField">
                            <Form.Item 
                                className="textLabel" 
                                label="Image" 
                                name="image"
                                disabled={!selectedModel.length}
                            >  
                                <FileUpload selectedModel={selectedModel} fileUploaded={this.fileUploaded} />
                            </Form.Item>

                        </div>

                        <div className="submitBtn">
                            <Button htmlType="submit" disabled={loading}>Upload</Button>
                            {loading ? <img src={PulseLoading} alt="loading" width="50px" /> : null}
                        </div>
                    </div>  
                </Form>
            </div>
        );
    }
}

export default CarUpload;