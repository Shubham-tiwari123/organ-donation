import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Row, Col, Divider, DatePicker, TimePicker, Button, Modal, Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospitalConstants';
import axios from 'axios';
import { initiateTransport } from '../../../user_register_web3'

const { HOSPITAL_LOGIN_PAGE, SAVE_ORGAN_TRANSPORT_API, HOSPITAL_REACT_BASE_URL } = HOSPITAL_CONSTANT
const { Content } = Layout;
const format = 'HH:mm';

const OrganTransportForm = ({ contractInstance }) => {
  const { requestId, patientId } = useParams();
  const navigate = useNavigate();
  const [loginUserID, setLoginUserId] = useState(null);
  const [disable, setDisabled] = useState(false)

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [shippingDate, setShippingDate] = useState('');
  const [shippingTime, setShippingTime] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black"
  }

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {
          setLoginUserId(decoded.sub);
        } else {
          navigate(HOSPITAL_LOGIN_PAGE);
        }

      } else {
        navigate(HOSPITAL_LOGIN_PAGE);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (values) => {
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let data = {
        shippingTime: shippingTime,
        shippingDate: shippingDate,
        requestId: requestId,
        patientId: patientId,
        vehicleNumber: vehicleNumber,
        createdAt: new Date().toISOString(),
        createdBy: loginUserID
      }

      try {
        // make web3 call 
        // function:  initiateTransport()
        const chainResponse = await initiateTransport(parseInt(requestId), contractInstance)
        console.log("chainResponse:", chainResponse);
        if (chainResponse.error) {
          message.error('Something went wrong. Try Latter...');
        } else {
          const response = await axios.post(SAVE_ORGAN_TRANSPORT_API, data)
          console.log("Response:", response);
          let { status } = response.data
          if (status == 200) {
            message.success('Record Saved successful!!');
            setTimeout(() => {
              let url = `${HOSPITAL_REACT_BASE_URL}/request/${requestId}/${patientId}`
              navigate(url);
            }, 500)

          } else {
            message.error('Something went wrong while creating record. Try Later!!');
          }
        }
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
      } finally {
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  };

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
              style={{ marginLeft: '20px' }}
              onFinish={handleSubmit}>

              <h2>TRANSPORTATION DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Vehicle Number" name="Vehicle Number" rules={[{ required: true }]}>
                    <Input value={vehicleNumber} style={inputBoxStyle} onChange={(e) => setVehicleNumber(e.target.value)} disabled={disable} />
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
                  <Form.Item label="Shipping Date" name="Shipping Date" rules={[{ required: true }]}>
                    <DatePicker value={shippingDate} style={{ width: "100%" }} onChange={(value, dateString) => setShippingDate(dateString)} disabled={disable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Shipping Time" name="Shipping Time" rules={[{ required: true }]}>
                    <TimePicker format={format} style={{ width: "100%" }} onChange={(value, timeString) => setShippingTime(timeString)} disabled={disable} />
                  </Form.Item>
                </Col>

              </Row>
              <Row>
                <Col span={23}>
                  <Form.Item style={{ float: "right", marginRight: "120px", marginTop: "20px" }}>
                    <Button type="primary" htmlType="submit" disabled={disable}>
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

            </Form>

            <Modal
              visible={isModalVisible}
              footer={null}
              closeIcon={null}
            >
              {isLoading ? (
                <Spin tip="Loading...">
                  <p>Saving Record ...</p>
                </Spin>
              ) : null}
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default OrganTransportForm;
