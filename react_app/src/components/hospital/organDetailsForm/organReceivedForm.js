import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Row, Col, Divider, DatePicker, TimePicker, Button, Select, Modal, Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospital/hospitalConstants';
import axios from 'axios';
const { HOSPITAL_LOGIN_PAGE, GET_DOCTOR_LIST_API, SAVE_ORGAN_RECEIVED_API } = HOSPITAL_CONSTANT
const { Content } = Layout;
const { Option } = Select;
const format = 'HH:mm';

const OrganReceivedForm = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [loginUserID, setLoginUserId] = useState(null);
  const [receivingDate, setReceivingDate] = useState('');
  const [receivingTime, setReceivingTime] = useState('');
  const [selectedDoctortId, setSelectedDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorList, setDoctorList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisabled] = useState(false);

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
      // Assuming the data is fetched from an API or some other source
      // Api should fetch details of the doctors registerd with particular hospital: pass hospital id in the request
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

  const handleSubmit = (values) => {
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let data = {
        receivingTime: receivingTime,
        receivingDate: receivingDate,
        requestId: requestId,
        doctorName: doctorName,
        doctorId: selectedDoctortId,
        createdAt: new Date(),
        createdBy: loginUserID
      }

      try {
        const response = await axios.post(SAVE_ORGAN_RECEIVED_API, data)
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
          <div style={{ padding: 10, background: '#fff', minHeight: '380px', }}>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              layout="vertical"
              style={{ marginLeft: '20px' }}
              onFinish={handleSubmit}>

              <h2>ORGAN RECEIVED DETAILS</h2>
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
                  <Form.Item label="Receiving Date" name="Receiving Date" rules={[{ required: true }]}>
                    <DatePicker value={receivingDate} style={{ width: "100%" }} onChange={(value, dateString) => setReceivingDate(dateString)} disabled={disable}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Receiving Time" name="Receiving Time" rules={[{ required: true }]}>
                    <TimePicker format={format} style={{ width: "100%" }} onChange={(value, timeString) => setReceivingTime(timeString)} disabled={disable}/>
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

export default OrganReceivedForm;
