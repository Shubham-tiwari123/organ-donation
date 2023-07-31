import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Row, Col, Divider, DatePicker, TimePicker, Button, Select, Modal, Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospital/hospitalConstants';
import axios from 'axios';
const { HOSPITAL_LOGIN_PAGE, GET_DOCTOR_LIST_API, SAVE_ORGAN_TRANSPLANT_API } = HOSPITAL_CONSTANT
const { Content } = Layout;
const { Option } = Select;
const format = 'HH:mm';

const OrganTransplantForm = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [loginUserID, setLoginUserId] = useState(null);

  const [operationDate, setOperationDate] = useState('');
  const [operationTime, setOperationTime] = useState('');
  const [selectedDoctortId, setSelectedDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorList, setDoctorList] = useState([]);
  const [operationStatus, setOperationStatus] = useState([]);
  const status = ['SUCCESS', 'FAILED'];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisabled] = useState(false)

  // fetch doctor list here first

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.loginId) {
          
          setLoginUserId(decoded.loginId);
          let URL = `${GET_DOCTOR_LIST_API}=${decoded.loginId}`

          const response = await fetch(URL);
          const { doctorList } = await response.json();
          console.log("data2:", doctorList);
          setDoctorList(doctorList);
        } else {
          navigate(HOSPITAL_LOGIN_PAGE);
        }
      } else {
        navigate(HOSPITAL_LOGIN_PAGE);
      }
    };

    fetchData();
  }, []);

  const handleDoctorChange = (value) => {
    setDoctorName(value);
    const selectedData = doctorList.find((item) => item.doctorName === value);
    setSelectedDoctorId(selectedData?.id || '');
  };

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black"
  }

  const handleSubmit2 = (values) => {
    // store hospital id also to indicate request is created by 
    console.log("Operation Time:", operationTime);
    console.log("Operation Date:", operationDate);
    console.log("Request Id:", requestId);
    console.log("doctor name:", doctorName);
    console.log("doctor Id:", selectedDoctortId);
    console.log("operation status:", operationStatus);
  };

  const handleSubmit = (values) => {
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let data = {
        operationTime: operationTime,
        operationDate: operationDate,
        requestId: requestId,
        doctorName: doctorName,
        doctorId: selectedDoctortId,
        operationStatus: operationStatus,
        createdAt: new Date(),
        createdBy: loginUserID
      }

      try {
        const response = await axios.post(SAVE_ORGAN_TRANSPLANT_API, data)
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
          <div style={{ padding: 10, background: '#fff', minHeight: '400px', }}>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              layout="vertical"
              style={{ marginLeft: '20px' }}
              onFinish={handleSubmit}>

              <h2>ORGAN TRANSPLANT DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Doctor Name" name="Doctor Name" rules={[{ required: true }]}>
                    <Select placeholder="Select Doctor Name" style={{ width: "100%" }} onChange={handleDoctorChange} value={doctorName} disabled={disable}>
                      {doctorList.map((item) => (
                        <Option key={item.id} value={item.doctorName}>
                          {item.doctorName}
                        </Option>
                      ))}
                    </Select>
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
                  <Form.Item label="Operation Date" name="Operation Date" rules={[{ required: true }]}>
                    <DatePicker value={operationDate} style={{ width: "100%" }} onChange={(value, dateString) => setOperationDate(dateString)} disabled={disable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Operation Time" name="Operation Time" rules={[{ required: true }]}>
                    <TimePicker format={format} style={{ width: "100%" }} onChange={(value, timeString) => setOperationTime(timeString)} disabled={disable} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Operation Status" name="Operation Status" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select operation Status"
                      style={{ width: "100%" }}
                      value={operationStatus}
                      onChange={(value) => setOperationStatus(value)}
                      disabled={disable}
                    >
                      {status.map((status) => (
                        <Option key={status} value={status}>
                          {status}
                        </Option>
                      ))}
                    </Select>
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

export default OrganTransplantForm;
