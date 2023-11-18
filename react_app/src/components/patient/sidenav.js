import React, { useEffect, useState } from 'react';
import './style/patientStyle.css'
import { Layout, Menu } from 'antd';
import hospitalLogo from '../../images/hospital_logo.png'
import { Link } from 'react-router-dom';
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';

const web3 = new Web3(window.ethereum);

const { Sider } = Layout;

const SideNav = ({ selectedKey }) => {

  const [patientType, setPatientType] = useState(null);

  const logOutUser = async () => {
    try {
      localStorage.clear()
      const provider = await detectEthereumProvider();
      await provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
    } catch (error) {
      console.log("Side nave error:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setPatientType(localStorage.getItem("patientType"))
    }
    fetchData()
  }, [])

  return (
    <Sider width={200} theme="light" height={'100vh'} style={{ position: "fixed" }}>
      <div className='logo' style={{ paddingBottom: "20px", paddingTop: "30px" }}>
        <img src={hospitalLogo} alt="Logo" className="logo-image" />
      </div>
      <div className='centered-div'>
        {localStorage.getItem("userName")}
      </div>
      <Menu theme='dark' mode="inline" defaultSelectedKeys={selectedKey} style={{ minHeight: '100vh', borderRight: 0 }}>
        <Menu.Item key="1">
          <Link to="/patient/home">HOME</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/patient/request/status">REQUEST STATUS</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/patient/medical/details">MEDICAL DETAILS</Link>
        </Menu.Item>
        {
          patientType == 'donor' ?
            <Menu.Item key="5">
              <Link to="/patient/notification" >NOTIFICATION</Link>
            </Menu.Item> :
          null
        }

        <Menu.Item key="4">
          <Link to="/login" onClick={logOutUser}>LOGOUT</Link>
        </Menu.Item>

      </Menu>
    </Sider>
  );
};

export default SideNav;
