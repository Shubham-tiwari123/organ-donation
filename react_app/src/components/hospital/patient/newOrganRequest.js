import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Button, Row, Col, InputNumber, Divider, Select, message, Modal, Spin } from 'antd';
import HospitalSideNav from '../sideNav'
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from "../../../constants/hospitalConstants";
import { raiseOrganRequest, registerOrganRequest } from '../../../user_register_web3'
const { HOSPITAL_LOGIN_PAGE, GET_DOCTOR_PATIENT_LIST, SAVE_NEW_REQUEST_API } = HOSPITAL_CONSTANT

const { Content } = Layout;
const { Option } = Select;

const NewOrganRequest = ({ account, provider, contractInstance }) => {
  // patientHospitalId : store the hospitalId to record which hospital created the record
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [bloodGroup, setBloodGroup] = useState('');
  const [organSelected, setOrganSelected] = useState('');
  const [prioritySelected, setPrioritySelected] = useState('');
  const [bmi, setBMI] = useState('');
  const [todayDate, setTodayDay] = useState(new Date());
  const [hospitalId, setHospitalId] = useState('');
  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [loginUserID, setLoginUserId] = useState(null);

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [selectedDoctortId, setSelectedDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false)

  const organsList = [
    'Cornea',
    'Kidneys',
    'Heart',
    'Liver',
    'Lungs',
    'Pancreas',
    'Small Intestine',
    'Skin',
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const priority = ['HIGH', 'MEDIUM', 'LOW'];

  useEffect(() => {
    const fetchData = async () => {

      // Api should fetch details of the doctors registerd with particular hospital and all the 
      // patient whose request is not created: pass hospital id in the request

      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {
          setLoginUserId(decoded.sub);
          setHospitalId(decoded.sub)
          let URL = `${GET_DOCTOR_PATIENT_LIST}=${decoded.sub}`

          const response = await axios.get(URL);
          const { data } = response.data;
          const { patientList, doctorList } = data;
          console.log("data:", patientList);
          console.log("data2:", doctorList);
          if (doctorList.length == 0 || patientList.length == 0) setDisableSubmit(true)

          setPatientList(patientList);
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

  const handlePatientChange = (value) => {
    // setSelectedPatientId(value);
    setPatientName(value)
    const selectedData = patientList.find((item) => item.name === value);
    console.log("Selected data:", selectedData);
    setPatientName(selectedData?.name || '');
    setBMI(selectedData.bmi)
    setBloodGroup(selectedData.bloodGroup)
    setSelectedPatientId(selectedData?.id || '');
  };

  const handleDoctorChange = (value) => {
    setDoctorName(value);
    const selectedData = doctorList.find((item) => item.doctorName === value);
    setSelectedDoctorId(selectedData?.id || '');
    setDoctorName(selectedData?.doctorName || '')
  };

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black",
    width: "100%"
  }

  const enumOrganType = {
    Cornea: 0,
    Kidneys: 1,
    Heart: 2,
    Liver: 3,
    Lungs: 4,
    Pancreas: 5,
    SmallIntestine: 6,
    Skin: 7
  }

  const handleSubmit = (values) => {
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {
      let requestID=null;
      try {
        console.log("Prioriy:",prioritySelected);
        const urgencyLevel = prioritySelected.toLowerCase() === 'low' ? 0 : prioritySelected.toLowerCase() === 'medium' ? 1 : 2;
        const chainResponse = await registerOrganRequest(selectedPatientId, urgencyLevel, enumOrganType[organSelected], selectedDoctortId, 
          contractInstance, hospitalId )
        console.log("chainResponse:", chainResponse);
        requestID = chainResponse.requestID;

        if (chainResponse.error === true) {
          message.error('Something went wrong. Try Latter...');
        } else {
          let data = {
            requestId: requestID,
            patientId: selectedPatientId,
            patientName: patientName,
            doctorId: selectedDoctortId,
            doctorName: doctorName,
            bloodGroup: bloodGroup,
            bmi: bmi,
            priority: prioritySelected,
            organRequired: organSelected,
            createdAt: todayDate.toDateString(),
            createdBy: hospitalId
          }
          console.log("Data to store:",data);

          const response = await axios.post(SAVE_NEW_REQUEST_API, data)
          console.log("Response:", response);
          message.success('Record Saved successful!!');

          setTimeout(async () => {
            window.location.reload()
          }, 500)
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
      <HospitalSideNav selectedKey={'4'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              layout="vertical"
              form={form}
              style={{ marginLeft: '20px' }}
              onFinish={handleSubmit}>

              <h2>CREATE NEW REQUEST</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Patient Name" name="Patient Name" rules={[{ required: true }]}>
                    <Select placeholder="Select Patient Name" style={{ width: "100%" }} onChange={handlePatientChange} value={selectedPatientId}>
                      {patientList.map((item) => (
                        <Option key={item.name} value={item.name}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Patient ID" >
                    <Input value={selectedPatientId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Doctor Name" name="Doctor Name" rules={[{ required: true }]}>
                    <Select placeholder="Select Doctor Name" style={{ width: "100%" }} onChange={handleDoctorChange} value={doctorName}>
                      {doctorList.map((item) => (
                        <Option key={item.id} value={item.doctorName}>
                          {item.doctorName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Blood Group">
                    <Input value={bloodGroup} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="BMI" >
                    <Input value={bmi} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Organ Required" name="Organ Required" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select organ required"
                      style={{ width: "100%" }}
                      value={organSelected}
                      onChange={(value) => setOrganSelected(value)}
                    >
                      {organsList.map((organ) => (
                        <Option key={organ} value={organ}>
                          {organ}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Priority" name="Priority" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select priority"
                      style={{ width: "100%" }}
                      value={prioritySelected}
                      onChange={(value) => setPrioritySelected(value)}
                    >
                      {priority.map((priority) => (
                        <Option key={priority} value={priority}>
                          {priority}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Today date">
                    <Input style={inputBoxStyle} value={todayDate.toDateString()} disabled />
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

export default NewOrganRequest;
