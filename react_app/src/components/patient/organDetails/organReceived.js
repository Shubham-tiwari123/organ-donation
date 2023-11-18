import React, { useState, useEffect } from 'react';
import '../style/patientStyle.css'
import { Layout, Form, Input, Row, Col, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import SideNav from '../sidenav';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { PATIENT_CONSTANT } from '../../../constants/patientConstants';
import DoctorSideNav from '../../doctor/doctorSidenav';
import axios from 'axios';

const { LOGIN_NAVIGATE_URL, GET_TRANSPLANT_DETAILS } = PATIENT_CONSTANT
const { Content } = Layout;

const OrganReceivedPatient = ({from}) => {
  const { requestId, patientId } = useParams();
  const navigate = useNavigate();

  const [loginUserID, setLoginUserId] = useState(null);
  const [receivingDoctorId, setReceivingDoctorId] = useState('');
  const [receivingDoctorName, setReceivingDoctorName] = useState('');
  const [receivingDate, setReceivingDate] = useState('');
  const [receivingTime, setReceivingTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Assuming the data is fetched from an API or some other source
      // Pass requestId in the request to fetch data
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {

          setLoginUserId(decoded.sub);
          let URL = `${GET_TRANSPLANT_DETAILS}=${requestId}&userId=${patientId}`

          const response = await axios.get(URL);
          const { data } = response.data;
          const { receivingDetails } = data;

          setReceivingDoctorId(receivingDetails.receiverDoctorId);
          setReceivingDoctorName(receivingDetails.receiverDoctorName);
          setReceivingDate(receivingDetails.receivingDate);
          setReceivingTime(receivingDetails.receivingTime);
        } else {
          navigate(LOGIN_NAVIGATE_URL);
        }

      } else {
        navigate(LOGIN_NAVIGATE_URL);
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
      {
        from == "doctor" ?
        <DoctorSideNav selectedKey={'2'} />
        :<SideNav selectedKey={'2'} />
      }
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

export default OrganReceivedPatient;
