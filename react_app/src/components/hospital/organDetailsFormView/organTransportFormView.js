import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Row, Col, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospitalConstants';
import axios from 'axios';

const { HOSPITAL_LOGIN_PAGE, GET_TRANSPLANT_DETAILS } = HOSPITAL_CONSTANT
const { Content } = Layout;

const OrganTransportFormView = () => {
  const { patientId, requestId } = useParams();
  const navigate = useNavigate();

  const [loginUserID, setLoginUserId] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [shippingDate, setShippingDate] = useState('');
  const [shippingTime, setShippingTime] = useState('');


  const inputBoxStyle = {
    fontSize: "16px",
    color: "black"
  }

  useEffect(() => {
    const fetchData = async () => {
      // Assuming the data is fetched from an API or some other source
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {

          setLoginUserId(decoded.sub);
          let URL = `${GET_TRANSPLANT_DETAILS}=${requestId}&userId=${patientId}`

          const response = await axios.get(URL);
          const { data } = response.data;
          const { transportationDetails } = data;
          setVehicleNumber(transportationDetails.vehicleNumber);
          setShippingDate(transportationDetails.shippingDate);
          setShippingTime(transportationDetails.shippingTime);
        } else {
          navigate(HOSPITAL_LOGIN_PAGE);
        }

      } else {
        navigate(HOSPITAL_LOGIN_PAGE);
      }

    };

    fetchData();
  }, []);

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

              <h2>TRANSPORTATION DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Vehicle Number">
                    <Input value={vehicleNumber} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Request ID">
                    <Input value={requestId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Shipping Date">
                    <Input value={shippingDate} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Shipping Time">
                    <Input value={shippingTime} disabled style={inputBoxStyle} />
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

export default OrganTransportFormView;
