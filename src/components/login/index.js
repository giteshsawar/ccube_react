import React from 'react';
import { withRouter } from 'react-router';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            otpCode: null
        }; 
    }

    loginUser = (employeeId) => {
        const { history } = this.props;
        console.log("login props", this.props);
        const data = {
            employeeId,
            password: 'qwerty12'
        };  

        fetch('http://localhost:4000/api/v1/auth/login_employeeWPassword', {
            method: 'POST', // or 'PUT'
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                localStorage.setItem("userObj", JSON.stringify(data.user));
                localStorage.setItem("userToken", data.token);
                history.push("/home");
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    };

    verifyOTP = () => {
        const { otpCode } = this.state;
        const { history } = this.props;
        console.log("login props", this.props);
        const data = {
            phoneNumber: 965478861,
            otpCode
        };

        fetch('http://localhost:4000/api/v1/auth/login_employeeWOTP', {
            method: 'POST', // or 'PUT'
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.user) {
                    localStorage.setItem("userObj", JSON.stringify(data.user));
                    localStorage.setItem("userToken", data.token);
                    history.push("/home");
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    };

    setOTP = e => {
        this.setState({ otpCode: e.target.value });
    }

    render() {
        const { otpCode } = this.state;
        console.log("login props", this.props);
        return(
            <div style={{ width: '500px', margin: 'auto' }}>
                <h1>Login</h1>
                <button className="login" onClick={() => this.loginUser("AJK2124D")}>Login user</button>
                <button className="login" onClick={() => this.loginUser("AJHJ124D")}>Login user 2</button>
                <br /><br />
                <input type="number" value={otpCode} onChange={this.setOTP} />
                <button onClick={this.verifyOTP}>Verify OTP</button>
            </div>
        );
    }
} 

export default withRouter(Login);