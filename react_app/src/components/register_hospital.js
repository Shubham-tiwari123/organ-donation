import React, { useState } from "react";
import { Form, Input, Button, Modal, Spin, message, Checkbox } from 'antd';
import DoctorLoginImage from "../images/doctor_login.png";
import "./style.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CommonConstant } from "../constants/commonConstant";
import { registerHospital, isHospitalRegistered } from '../user_register_web3'

const { HOSPITAL_HOME_PAGE, REGISTER_HOSPITAL } = CommonConstant

const RegisterHospital = ({ account, provider, contractInstance }) => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("vertical");
  const [email, setEmail] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [hospitalMetamaskAddress, setHospitalMetamaskAddress] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState();


  const handleSubmit = async (values) => {

    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let registerData = {
        email: email.toLowerCase(),
        userType: 'hospital',
        hospitalAddress: hospitalAddress.toLowerCase(),
        hospitalMetamaskAddress: hospitalMetamaskAddress.toLowerCase(),
        hospitalName: hospitalName.toLowerCase(),
        createdBy: account.toLowerCase()
      }

      try {

        // make web3 call 
        const checkHospital = await isHospitalRegistered(hospitalMetamaskAddress.toLocaleLowerCase(), contractInstance)
        if (checkHospital.error === true) {
          message.error("Error from smart contract. Try Latter....")
        } else if (checkHospital.message === true) {
          message.error("Hospital already registered with address")
        } else {
          const chainResponse = await registerHospital(hospitalMetamaskAddress.toLocaleLowerCase(), hospitalName, contractInstance)
          console.log("chainResponse:", chainResponse);
          if (chainResponse.error) {
            message.error('Something went wrong. Try Latter...');
          } else {
            console.log("else");
            const response = await axios.post(REGISTER_HOSPITAL, registerData)
            let { status, data, error } = response.data
            console.log("status:", status);
            if (status === 200) {
              message.success('Hospital Registered');
              // navigate(HOSPITAL_HOME_PAGE)
            } else {
              message.error('Something went wrong. Try Latter...');
            }
          }
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
          span: 8,
        },
        wrapperCol: {
          span: 14,
        },
      }
      : null;

  return (
    <div className="login-container">
      <div className="image-container">
        <img src={DoctorLoginImage} alt="Login" />
      </div>
      <div className="form-container">
        <h2>REGISTER HOSPITAL</h2>
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
              name="hospital name"
              label="Hospital Name"
              rules={[
                {
                  required: true,
                  message: 'Please enter hospital name',
                },
              ]}
            >
              <Input
                placeholder="Enter hospital name"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
              />
            </Form.Item>
          </div>
          <div className="form-item">
            <Form.Item
              name="hospital address"
              label="Hospital Address"
              rules={[
                {
                  required: true,
                  message: 'Please enter hospital address',
                },
              ]}
            >
              <Input
                placeholder="Enter hospital address"
                value={hospitalAddress}
                onChange={(e) => setHospitalAddress(e.target.value)}
              />
            </Form.Item>
          </div>
          <div className="form-item">
            <Form.Item
              name="metamask address"
              label="Metamask Address"
              rules={[
                {
                  required: true,
                  message: 'Please enter metamask address',
                },
              ]}
            >
              <Input
                placeholder="Enter hospital metamask address"
                value={hospitalMetamaskAddress}
                onChange={(e) => setHospitalMetamaskAddress(e.target.value)}
              />
            </Form.Item>
          </div>
          <div className="form-item">
            <Button type="primary" htmlType="submit" disabled={provider == null}>
              Register
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
              <p>Registering user....Please wait</p>
            </Spin>
          ) :
            null
          }
        </Modal>
      </div>
    </div>
  );
};

export default RegisterHospital;
