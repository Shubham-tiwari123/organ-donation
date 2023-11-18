import React, { useState } from "react";
import { Form, Input, Button, Modal, Spin, message, Row, Col, Divider } from 'antd';
import LoginImage from "../images/organ_donation.jpeg";
import "./login_style.css";
import axios from 'axios';
import { isHospitalRegistered, getUser, getRequest, checkOrganAvailability } from '../user_register_web3'

const AdminPanel = ({ account, provider, userRegisterInstance, organDonationInstance, iotInstance }) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pushMessage, setPusMessage] = useState('')
  const [hospitalAddress, setHospitalAddress] = useState()
  const [constractResponse, setResponse] = useState(null)
  const [userAddress, setUserAddress] = useState(null)
  const [requestID, seRequestId] = useState(null)

  const checkHospital = async () => {
    console.log("hospital:", hospitalAddress);
    const response = await isHospitalRegistered(hospitalAddress, userRegisterInstance)
    console.log("Response:", response);
    setResponse(response.toString())
  }

  const getUserDetails = async () => {
    console.log("user:", userAddress);
    const response = await getUser(userAddress, userRegisterInstance)
    console.log("Response:", response);
    setResponse(response.toString())
  }

  const getRequestDetails = async () => {
    console.log("requestId:", requestID);
    const response = await getRequest(requestID, organDonationInstance)
    console.log("Response:", response);
    setResponse(response.toString())
  }

  const checkOrgan = async () => {
    console.log("requestId:", requestID);
    const response = await checkOrganAvailability("0x425a6b5e6926a2c8254da2df93ee297da82bef4b", 1, userRegisterInstance)
    console.log("Response:", response);
    setResponse(response.toString())
  }


  return (
    <div style={{ margin: "30px" }}>
      ADMIN PANEL
      <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
      CHECK IF HOSPITAL REGISTERED: <br /><br />
      <Input onChange={(e) => setHospitalAddress(e.target.value)} value={hospitalAddress} style={{ width: "400px" }} /><br /><br />
      <Button type="primary" onClick={checkHospital}>Check</Button>
      <p>Response: {constractResponse}</p>
      
      <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
      GET USER DETAILS <br /><br />
      <Input onChange={(e) => setUserAddress(e.target.value)} value={userAddress} style={{ width: "400px" }} /><br /><br />
      <Button type="primary" onClick={getUserDetails}>Check</Button>
      <p>Response: {constractResponse}</p>

      <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
      GET Request <br /><br />
      <Input onChange={(e) => seRequestId(e.target.value)} value={requestID} style={{ width: "400px" }} /><br /><br />
      <Button type="primary" onClick={getRequestDetails}>Check</Button>
      <p>Response: {constractResponse}</p>

      <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
      Check organ <br /><br />
      <Input onChange={(e) => seRequestId(e.target.value)} value={requestID} style={{ width: "400px" }} /><br /><br />
      <Button type="primary" onClick={checkOrgan}>Check</Button>
      <p>Response: {constractResponse}</p>
    </div>
  );
};

export default AdminPanel;
