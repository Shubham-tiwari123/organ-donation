import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Row, Col, Divider, DatePicker, TimePicker, Button, Modal, Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import { v4 as uuidv4 } from 'uuid';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospital/hospitalConstants';
import axios from 'axios';
const { HOSPITAL_LOGIN_PAGE, SAVE_ORGAN_REMOVED_API } = HOSPITAL_CONSTANT
const format = 'HH:mm';
const { Content } = Layout;


const OrganRemovedForm = () => {
  const { doctorId, doctorName, bloodGroup, organRequest, donorId, patientId, requestId  } = useParams();
  const navigate = useNavigate();
  const [loginUserID, setLoginUserId] = useState(null);
  const [operationTime, setOperationTime] = useState('');
  const [operationDate, setOperationDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisabled] = useState(false)

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black"
  }

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.loginId) {
          setLoginUserId(decoded.loginId);
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
        operationTime: operationTime,
        operationDate: operationDate,
        requestId: requestId,
        doctorName: doctorName,
        doctorId: doctorId,
        bloodGroup:bloodGroup,
        organRequest:organRequest,
        donorId:donorId,
        patientId: patientId,
        createdAt: new Date(),
        createdBy: loginUserID
      }

      try {
        const response = await axios.post(SAVE_ORGAN_REMOVED_API, data)
        console.log("Response:", response);
        message.success('Record Saved successful!!');
        setDisabled(true)
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
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              layout="vertical"
              style={{ marginLeft: '20px' }}
              onFinish={handleSubmit}>

              <h2>ORGAN DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Request Id">
                    <Input value={requestId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Doctor Name">
                    <Input value={doctorName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Patient Id">
                    <Input value={patientId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Blood Group" >
                    <Input value={bloodGroup} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>

              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Organ Type">
                    <Input value={organRequest} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Donor ID">
                    <Input value={donorId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Operation Date" name="Operation Date"  rules={[{ required: true }]}>
                    <DatePicker value={operationDate} style={{width : "100%"}} onChange={(value, dateString)=>setOperationDate(dateString)} disabled={disable}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Operation Time" name="Operation Time"  rules={[{ required: true }]}>
                    <TimePicker format={format} style={{width : "100%"}} onChange={(value, timeString)=>setOperationTime(timeString)} disabled={disable}/>
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

export default OrganRemovedForm;
