import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Row, Col, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospital/hospitalConstants';
const { HOSPITAL_LOGIN_PAGE, GET_TRANSPLANT_DETAILS } = HOSPITAL_CONSTANT
const { Content } = Layout;

const OrganTransplantFormView = () => {
  const { patientId, requestId } = useParams();
  const navigate = useNavigate();

  const [loginUserID, setLoginUserId] = useState(null);
  const [transplantDoctorName, setTransplantDoctorName] = useState('');
  const [transplantDoctorId, setTransplantDoctorId] = useState('');
  const [donorName, setDonorName] = useState('');
  const [status, setStatus] = useState('');
  const [operationDate, setOperationDate] = useState('');
  const [operationTime, setOperationTime] = useState('');

  // fetch doctor list here first

  useEffect(() => {
    const fetchData = async () => {
      // Assuming the data is fetched from an API or some other source
      // Pass requestId in the request to fetch data

      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.loginId) {

          setLoginUserId(decoded.loginId);
          let URL = `${GET_TRANSPLANT_DETAILS}=${requestId}`

          const response = await fetch(URL);
          const { transplantDetails } = await response.json();
          console.log("data2:", transplantDetails);
          setTransplantDoctorName(transplantDetails.transplantDoctorName);
          setTransplantDoctorId(transplantDetails.transplantDoctorId);
          setDonorName(transplantDetails.donorName);
          setStatus(transplantDetails.status);
          setOperationDate(transplantDetails.operationDate);
          setOperationTime(transplantDetails.operationTime);
        } else {
          navigate(HOSPITAL_LOGIN_PAGE);
        }

      } else {
        navigate(HOSPITAL_LOGIN_PAGE);
      }
    };

    fetchData();
  }, []);

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black"
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HospitalSideNav selectedKey={'2'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '400px', }}>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              layout="vertical"
              style={{ marginLeft: '20px' }}>

              <h2>ORGAN TRANSPLANT DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Transplant Doctor Id">
                    <Input value={transplantDoctorId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Transplant Doctor Name">
                    <Input value={transplantDoctorName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Donor Name">
                    <Input value={donorName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Operation Status" >
                    <Input value={status} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Operation Date">
                    <Input value={operationDate} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Operation Time">
                    <Input value={operationTime} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>

            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default OrganTransplantFormView;
