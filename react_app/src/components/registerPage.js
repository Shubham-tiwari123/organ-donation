import React, { useState } from "react";
import { Form, Input, Button, Modal, Spin, message, Checkbox } from 'antd';
import DoctorLoginImage from "../images/doctor_login.png";
import "./style.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CommonConstant } from "../constants/commonConstant";

const {PATIENT_HOME_PAGE, DOCTOR_HOME_PAGE, SAVE_REGISTER_DETAILS} = CommonConstant

const CommonRegister = ({account, provider}) => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("vertical");
  const [email, setEmail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctor, setDoctor] = useState(false);
  const [patient, setPatient] = useState(false);
  const [userType, setUserType] = useState();

  const handleDoctor = (e) => {
    const checked = e.target.checked;
    setDoctor(checked);
    setUserType("doctor")
    if (checked) {
      setPatient(false);
    }
  };

  const handlePatient = (e) => {
    const checked = e.target.checked;
    setPatient(checked);
    setUserType("patient")
    if (checked) {
      setDoctor(false);
    }
  };

  const handleSubmit = async (values) => {

    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let registerData = {
        email: email.toLowerCase(),
        userType: userType.toLowerCase(),
        account: account.toLowerCase()
      }

      try {
        const response = await axios.post(SAVE_REGISTER_DETAILS, registerData)
        let {status, data, error} = response.data
        if (status === 200) {
          localStorage.setItem('jwt', data.jwt);
          if(userType.toLowerCase() === "patient"){
            navigate(PATIENT_HOME_PAGE)
          }else{
            navigate(DOCTOR_HOME_PAGE)
          }
        } else {
          message.error('Something went wrong. Try Latter...');
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
        <img src={DoctorLoginImage} alt="Login" />
      </div>
      <div className="form-container">
        <h2>Register</h2>
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
            <Form.Item label="User Type" name="user_type">
              <Checkbox checked={doctor} onChange={handleDoctor}>
                DOCTOR
              </Checkbox>
              <Checkbox checked={patient} onChange={handlePatient} style={{ marginLeft: "90px" }}>
                PATIENT
              </Checkbox>
            </Form.Item>
          </div>

          <div className="form-item">
            <Button type="primary" htmlType="submit" disabled={provider==null}>
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

export default CommonRegister;
