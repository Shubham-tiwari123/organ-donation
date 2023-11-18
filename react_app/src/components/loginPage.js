import React, { useState } from "react";
import { Form, Input, Button, Modal, Spin, message, Row, Col } from 'antd';
import LoginImage from "../images/organ_donation.jpeg";
import "./login_style.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CommonConstant } from "../constants/commonConstant";

const {PATIENT_HOME_PAGE, DOCTOR_HOME_PAGE, REGISTER_PAGE, CHECK_LOGIN_CREDENTIALS, HOSPITAL_HOME_PAGE} = CommonConstant
const CommonLogin = ({ account, provider }) => {

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pushMessage, setPusMessage] = useState('')

  const handleMetamaskLogin = async () => {
    setPusMessage("Checking login credentials....Pls wait!!")
    setIsModalVisible(true);
    setIsLoading(true);

    setTimeout(async () => {
      try {
        console.log("Login Account:",account);
        let url = `${CHECK_LOGIN_CREDENTIALS}=${account.toLowerCase()}`
        console.log("uRL:", url);
        let response = await axios.get(url)
        let {status, data} = response.data

        console.log("Response login:", data);
        if (status == 200) {
          if(data.hospitalName != null) localStorage.setItem("hospitalName", data.hospitalName)
          localStorage.setItem('jwt', data.jwt);
          if (data.userType.toLowerCase() == "patient" || data.userType.toLowerCase() == "donor") {
            localStorage.setItem("patientType", data.userType.toLowerCase())
            navigate(PATIENT_HOME_PAGE)
          } else if (data.userType.toLowerCase() == "doctor") {
            navigate(DOCTOR_HOME_PAGE)
          } else {
            navigate(HOSPITAL_HOME_PAGE)
          }
        } else {
          message.error({ content: "User not found. Register first!!", duration: 1.5 })
          navigate(REGISTER_PAGE);
        }
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Something went wrong. Try Latter...');
      } finally {
        setIsLoading(false);
        setIsModalVisible(false);
      }
    }, 1000)

  }

  return (
    <div className="container2">
      <Row justify="center" align="middle" className="content2">
        <Col span={12} className="image-col2">
          <img
            src={LoginImage}
            alt="Sample"
            className="image2"
          />
        </Col>
        <Col span={12} className="text-col2">
          <div className="text2">
            <h1>ORGAN DONATION</h1>
            <p>
              Organ donation is a powerful act of compassion that saves lives. By choosing to donate your organs, you can
              provide hope to those in need of a second chance. Your selfless gift can bridge the gap between life and death,
              offering renewed hope and healing to individuals and their families. Join the movement, make a difference,
              and be a hero by giving the gift of life through organ donation.
            </p>
            <Button type="primary" onClick={handleMetamaskLogin} disabled={provider==null}>Login With Metamask</Button>
          </div>
        </Col>
      </Row>
      <Modal
          visible={isModalVisible}
          footer={null}
          closeIcon={null}
        // centered
        >
          {isLoading ? (
            <Spin tip="Loading..." size="large">
              <p>{pushMessage}</p>
            </Spin>
          ) :
            null
          }
        </Modal>
    </div>
  );
};

export default CommonLogin;
