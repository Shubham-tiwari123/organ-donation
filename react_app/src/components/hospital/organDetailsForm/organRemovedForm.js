import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Row, Col, Divider, DatePicker, TimePicker, Button, Modal, Spin, message, Select } from 'antd';
import { useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospitalConstants';
import axios from 'axios';
import { Option } from 'antd/es/mentions';
import { markDonorProcedureSuccessful } from '../../../user_register_web3'

const { HOSPITAL_LOGIN_PAGE, SAVE_ORGAN_REMOVED_API, GET_DOCTOR_PATIENT_LIST, HOSPITAL_REACT_BASE_URL } = HOSPITAL_CONSTANT
const format = 'HH:mm';
const { Content } = Layout;


const OrganRemovedForm = ({ contractInstance }) => {
  const { requestDetails, requestId, patientId } = useParams();
  const navigate = useNavigate();
  const [loginUserID, setLoginUserId] = useState(null);
  const [operationTime, setOperationTime] = useState('');
  const [operationDate, setOperationDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisabled] = useState(false)
  const [patientName, setPatientName] = useState();
  const [donorName, setDonorName] = useState()
  const [doctorName, setDoctorName] = useState();
  const [organRequest, setOrganRequest] = useState()
  const [bloodGroup, setBloodGroup] = useState()
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctortId, setSelectedDoctorId] = useState('');
  const [selectedDoctortName, setSelectedDoctorName] = useState('');
  // const [requestId, setRequestId] = useState()

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black"
  }

  const handleDoctorChange = (value) => {
    setSelectedDoctorName(value);
    const selectedData = doctorList.find((item) => item.doctorName === value);
    setSelectedDoctorId(selectedData?.id || '');
    setSelectedDoctorName(selectedData?.doctorName || '')
  };

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {
          let URL = `${GET_DOCTOR_PATIENT_LIST}=${decoded.sub}`

          const response = await axios.get(URL);
          const { data } = response.data
          const { patientList, doctorList } = data;
          console.log("doctorList:", doctorList);

          let jsonData = JSON.parse(requestDetails)
          setLoginUserId(decoded.sub);
          setPatientName(jsonData.patientName)
          setDonorName(jsonData.donorName)
          setDoctorName(jsonData.doctorName)
          setOrganRequest(jsonData.organRequired)
          setBloodGroup(jsonData.bloodGroup);
          setDoctorList(doctorList);
          // setRequestId(jsonData.requestId)
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
      let jsonData = JSON.parse(requestDetails)
      console.log("JsonData:", jsonData);

      let data = {
        operationTime: operationTime,
        operationDate: operationDate,
        requestId: requestId,
        doctorName: doctorName,
        doctorId: selectedDoctortId,
        bloodGroup: bloodGroup,
        organRequest: organRequest,
        donorId: jsonData.donorId,
        patientId: patientId,
        createdAt: new Date().toISOString(),
        createdBy: loginUserID
      }

      try {
        // make web3 call 
        // function:  markDonorProcedureSucessfull()
        const chainResponse = await markDonorProcedureSuccessful(parseInt(requestId), contractInstance)
        console.log("chainResponse:", chainResponse);
        if (chainResponse.error === true) {
          message.error('Something went wrong. Try Latter...');
        } else {
          const response = await axios.post(SAVE_ORGAN_REMOVED_API, data)
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
                {/* <Col span={12}>
                  <Form.Item label="Doctor Name">
                    <Input value={doctorName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col> */}
                <Col span={12}>
                  <Form.Item label="Donor Doctor Name" name="Doctor Name" rules={[{ required: true }]}>
                    <Select placeholder="Select Doctor Name" style={{ width: "100%" }} onChange={handleDoctorChange} value={selectedDoctortName}>
                      {doctorList.map((item) => (
                        <Option key={item.id} value={item.doctorName}>
                          {item.doctorName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Patient Name">
                    <Input value={patientName} disabled style={inputBoxStyle} />
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
                  <Form.Item label="Donor Name">
                    <Input value={donorName} disabled style={inputBoxStyle} />
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
