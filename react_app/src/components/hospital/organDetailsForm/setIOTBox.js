import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Row, Col, Divider, Button, Modal, Spin, message, Select } from 'antd';
import { useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospitalConstants';
import axios from 'axios';

const { HOSPITAL_LOGIN_PAGE, FREE_IOTBOX, UPDATE_PATIENTID_IOTBOX, GET_IOT_PATIENT_LIST } = HOSPITAL_CONSTANT
const { Content } = Layout;
const { Option } = Select;

const format = 'HH:mm';

const SetIOTBOX = () => {
  // const { requestId, patientId } = useParams();
  const navigate = useNavigate();
  const [loginUserID, setLoginUserId] = useState(null);
  const [disable, setDisabled] = useState(false)

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [shippingDate, setShippingDate] = useState('');
  const [shippingTime, setShippingTime] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [patientList, setPatientList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [requestId, setRequestID] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false)
  const [updateDisableSubmit, setUpdateDisableSubmit] = useState(false)

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
          let URL = `${GET_IOT_PATIENT_LIST}=${decoded.sub}`
          const response = await axios.get(URL);
          const { data } = response.data;
          const { requestList, iotStatus } = data
          console.log("data:", data);
          if (requestList.length == 0) { 
            setDisableSubmit(true) 
            setUpdateDisableSubmit(true)
          }
          else {
            if (iotStatus.data == false) {
              setDisableSubmit(false) 
              setUpdateDisableSubmit(true)
            }
            else {
              setDisableSubmit(true) 
              setUpdateDisableSubmit(false)
            }
          }
          setPatientList(requestList);
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

      try {
        let id = `${selectedPatientId},${requestId}`
        console.log(" request made iot id:", id);
        let URL = `${UPDATE_PATIENTID_IOTBOX}=${id}`
        const response = await axios.post(URL)
        console.log("Response:", response);
        let { status } = response.data
        if (status == 200) {
          message.success('Initialized IOT BOX with patientId');
          setTimeout(async () => {
            window.location.reload()
          }, 500)
        } else {
          message.error('Something went wrong while creating record. Try Later!!');
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

  const freeIOTBox = (values) => {
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      try {
        let id = `${selectedPatientId},${requestId}`
        console.log(" request made iot id:", id);
        let URL = `${FREE_IOTBOX}=${id}`
        const response = await axios.post(URL)
        console.log("Response:", response);
        let { status } = response.data
        if (status == 200) {
          message.success('IOT BOX is free now');
          setTimeout(async () => {
            window.location.reload()
          }, 500)
        } else {
          message.error('Something went wrong while creating record. Try Later!!');
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

  const handlePatientIdChange = (value) => {
    setSelectedPatientId(value);
    const selectedData = patientList.find((item) => item.patientId === value);
    console.log("selectedData", selectedData);
    setPatientName(selectedData?.patientName || '');
    setRequestID(selectedData?.requestId)
    // setPatientId(selectedData?.userId || '');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HospitalSideNav selectedKey={'7'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '400px', }}>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              layout="vertical"
              style={{ marginLeft: '20px' }}
              onFinish={handleSubmit}>

              <h2>IOT BOX Details</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Patient ID" name="Patient ID" rules={[{ required: true }]}>
                    <Select placeholder="Select Patient ID" style={{ width: "100%" }} onChange={handlePatientIdChange} value={selectedPatientId}>
                      {patientList.map((item) => (
                        <Option key={item.patientId} value={item.patientId}>
                          {item.patientId}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Patient Name" >
                    <Input value={patientName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Request ID" >
                    <Input value={requestId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={23}>
                  <Form.Item style={{ float: "right", marginRight: "120px", marginTop: "20px" }}>
                    <Button type="primary" htmlType="submit" disabled={disableSubmit}>
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

            </Form>

            <Button type="primary" onClick={freeIOTBox} disabled={updateDisableSubmit}>
              FREE IOT BOX
            </Button>

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

export default SetIOTBOX;
