import React from 'react';
import './style.css'
import { Layout, Menu } from 'antd';
import hospitalLogo from '../../images/hospital_logo.png'
import { Link } from 'react-router-dom';

const { Sider } = Layout;


const HospitalSideNav = ({ selectedKey }) => {

  return (
    <Sider width={200} theme="light" height={'100vh'} style={{ position: "fixed" }}>
      <div className='logo' style={{ paddingBottom: "30px", paddingTop: "30px" }}>
        <img src={hospitalLogo} alt="Logo" className="logo-image" />
      </div>
      <Menu theme='dark' mode="inline" defaultSelectedKeys={selectedKey} style={{ minHeight: '100vh', borderRight: 0 }}>
        <Menu.Item key="1">
          <Link to="/hospital/donors">DONOR LIST</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/hospital/request/status">WAITING LIST</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/hospital/doctors">DOCTOR LIST</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/hospital/create/request">RAISE NEW REQUEST</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/hospital/create/medicalrecord">REGISTER DONOR</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default HospitalSideNav;
