import React, { useState } from "react";
import { Form, Input, Button, Modal, Spin, message } from 'antd';
import LoginImage from "../../../images/hospital_login.png";
import "./loginStyle.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from "../../../constants/hospital/hospitalConstants";

const { CHECK_LOGIN_DETAILS_API, LOGIN_JWT, LOGIN_NAVIGATE_URL } = HOSPITAL_CONSTANT

const LoginHospitalForm = () => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("vertical");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    console.log('Received values of form:', email, password);
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let data = {
        email: email,
        password: password
      }

      try {
        const response = await axios.post(CHECK_LOGIN_DETAILS_API, data)
        console.log("Response:", response);
        if (!response.data.status) {
          // localStorage.setItem('jwt', response.data.token);
          localStorage.setItem('jwt', LOGIN_JWT);
          navigate(LOGIN_NAVIGATE_URL);
        } else {
          message.error('Invalid credentials');
        }
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Something went wrong. Try Latter...');
      } finally {
        setIsLoading(false);
        setIsModalVisible(false);
      }
    }, 1000)

  };

  const formItemLayout =
    formLayout === "vertical"
      ? {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 14,
        },
      }
      : null;

  return (
    <div className="login-container">
      <div className="image-container">
        <img src={LoginImage} alt="Login" />
      </div>
      <div className="form-container">
        <h2>Hospital Login</h2>
        <Form
          name="login-form"
          {...formItemLayout}
          layout={formLayout}
          form={form}
          style={{
            maxWidth: formLayout === "inline" ? "none" : 900,
          }}
          onFinish={handleSubmit}
        >
          <div className="form-item">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email!',
                },
              ]}
            >
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
          </div>
          <div className="form-item">
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your password!',
                },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
          </div>
          <div className="form-item">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </div>
        </Form>
        <Modal
          visible={isModalVisible}
          footer={null}
          closeIcon={null}
        // centered
        >
          {isLoading ? (
            <Spin tip="Loading..." size="large">
              <p>Logging you in....Please wait</p>
            </Spin>
          ) : 
            null
          }
        </Modal>
      </div>
    </div>
  );
};

export default LoginHospitalForm;
