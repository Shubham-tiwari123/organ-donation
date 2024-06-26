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

const OrganReceivedFormView = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [loginUserID, setLoginUserId] = useState(null);
  const [receivingDoctorId, setReceivingDoctorId] = useState('');
  const [receivingDoctorName, setReceivingDoctorName] = useState('');
  const [receivingDate, setReceivingDate] = useState('');
  const [receivingTime, setReceivingTime] = useState('');
  const [receivingHospitalId, setReceivingHospitalId] = useState('');
  const [receivingHospitalName, setReceivingHospitalName] = useState('');

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
          const { receivingDetails } = await response.json();;

          setReceivingDoctorId(receivingDetails.receivingDoctorId);
          setReceivingDoctorName(receivingDetails.receivingDoctorName);
          setReceivingDate(receivingDetails.receivingDate);
          setReceivingTime(receivingDetails.receivingTime);
          // setReceivingHospitalId(receivingDetails.receivingHospitalId);
          // setReceivingHospitalName(receivingDetails.receivingHospitalName);
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
          <div style={{ padding: 10, background: '#fff', minHeight: '350px', }}>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              layout="vertical"
              style={{ marginLeft: '20px' }}>

              <h2>ORGAN RECEIVED DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Receiving Doctor Name">
                    <Input value={receivingDoctorName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Receiving Doctor ID">
                    <Input value={receivingDoctorId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Receiving  date">
                    <Input value={receivingDate} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Receiving Time" >
                    <Input value={receivingTime} disabled style={inputBoxStyle} />
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

export default OrganReceivedFormView;
