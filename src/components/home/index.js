import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            locality: "",
            address: ""
        }; 
    }

    checkForPassportUser = () => {
        fetch('http://localhost:4000/api/v1/test', {
            method: 'POST', // or 'PUT'
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({obj: "YAY!!!!"}),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }

    getUserAttendance = () => {
        const userObj = localStorage.getItem("userObj");
        fetch('http://localhost:4000/api/v1/attendant/get_employee_attendance', {
            method: 'POST', // or 'PUT'
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "employee": userObj._id,
                "month": "02"
            }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }

    setInputValue = e => {
        const { name, value } = e.target;
        
        const state = {};
        state[name] = value;

        this.setState(state);
    };

    registerCustomerDetails = () => {
        const user = JSON.parse(localStorage.getItem("userObj"));
        console.log("user in local", user);
        const { name, email, password, locality, address } = this.state;
        const userObj = { phoneNumber: user.phoneNumber, name, email, password, locality: "60d723bf36d7b6856f7345de", address };

        fetch('http://localhost:4000/api/v1/customer/user/register_customer', {
            method: 'POST', // or 'PUT'
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userObj),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }

    saveResidentialSociety = () => {
        const userObj = { name: "RPS", city: "Faridabad", state: "Haryana", zipCode: "121002" };

        fetch('http://localhost:4000/api/v1/operation/residential/create_residential', {
            method: 'POST', // or 'PUT'
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userObj),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    };

    getEmployeeSchedule = () => {
        const userObj = { attendantId: '6039a78a72f97828750f0b0e' };

        fetch('http://localhost:4000/api/v1/operation/schedule/get_schedule', {
            method: 'POST', // or 'PUT'
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userObj),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    };

    render() {
        const { name, password, email, locality, address } = this.state;
        return(
            <div style={{ width: '500px', margin: 'auto' }}>
                <h1>Home page</h1>
                <button onClick={this.checkForPassportUser}>Check it</button>
                <button onClick={this.getUserAttendance}>Get attendance</button>
                <br /><br /><br /><br />
                <div className="form">
                    <input type="text" value={name} onChange={this.setInputValue} name="name" placeholder="name" /><br /><br />
                    <input type="text" value={password} onChange={this.setInputValue} name="password" placeholder="password" /><br /><br />
                    <input type="text" value={email} onChange={this.setInputValue} name="email" placeholder="email" /><br /><br />
                    <input type="text" value={locality} onChange={this.setInputValue} name="locality" placeholder="locality" /><br /><br />
                    <input type="text" value={address} onChange={this.setInputValue} name="address" placeholder="address" /><br /><br />
                    <button onClick={this.registerCustomerDetails}>Register user</button><br /><br />
                </div>
                <div>
                    <button onClick={this.saveResidentialSociety}>Save society</button>
                </div>
                <div><br /><br />
                    <button onClick={this.getEmployeeSchedule}>Get schedule</button>
                </div>
            </div>
        )
    }
} 