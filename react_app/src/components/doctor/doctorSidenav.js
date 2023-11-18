import React from 'react';
import './style/doctorStyle.css'
import { Layout, Menu } from 'antd';
import hospitalLogo from '../../images/hospital_logo.png'
import { Link } from 'react-router-dom';
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';

const web3 = new Web3(window.ethereum);

const { Sider } = Layout;


const DoctorSideNav = ({ selectedKey }) => {

  const logOutUser = async () => {
    try {
      localStorage.clear()
      const provider = await detectEthereumProvider();
      await provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
    } catch (error) {
      console.log("Side nave error:",error);
    }
  }

  return (
    <Sider width={200} theme="light" height={'100vh'} style={{ position: "fixed" }}>
      <div className='logo' style={{ paddingBottom: "20px", paddingTop: "30px" }}>
        <img src={hospitalLogo} alt="Logo" className="logo-image" />
      </div>
      <div className='centered-div'>
        {localStorage.getItem("doctorName")}
      </div>
      <Menu theme='dark' mode="inline" defaultSelectedKeys={selectedKey} style={{ minHeight: '100vh', borderRight: 0 }}>
        <Menu.Item key="1">
          <Link to="/doctor/home">HOME</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/doctor/request/status">REQUEST STATUS</Link>
        </Menu.Item>
        {/* <Menu.Item key="3">
          <Link to="/doctor/patient/list">DONOR DETAILS</Link>
        </Menu.Item> */}
        <Menu.Item key="4">
          <Link to="/login" onClick={logOutUser}>LOGOUT</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default DoctorSideNav;