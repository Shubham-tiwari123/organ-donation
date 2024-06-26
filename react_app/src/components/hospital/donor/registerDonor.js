import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Button, Row, Col, InputNumber, Divider, Checkbox, Select, message, Modal, Spin } from 'antd';
import HospitalSideNav from '../sideNav'
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from "../../../constants/hospital/hospitalConstants";
const { HOSPITAL_LOGIN_PAGE, SAVE_MEDICAL_RECORD, GET_PATIENTS_API } = HOSPITAL_CONSTANT
const { Content } = Layout;
const { Option } = Select;


const RegisterDonor = () => {
  // donorHospitalId : store the hospitalId to record which hospital created the record

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState('');
  const [hospitalId, setHospitalId] = useState();
  const [loginUserID, setLoginUserId] = useState(null);

  const [patientList, setPatientList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [donorStatus, setDonorStatus] = useState();

  const [donorTrue, setDonorTrue] = useState(false);
  const [donorFalse, setDonorFalse] = useState(false);
  const [disableCheckBox, setDisableCheckBox] = useState(true);
  const [selectedOrgans, setSelectedOrgans] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDonorTure = (e) => {
    const checked = e.target.checked;
    setDonorTrue(checked);
    setDonorStatus(true)
    setDisableCheckBox(false)
    if (checked) {
      setDonorFalse(false);
    }
  };

  const handleDonorFalse = (e) => {
    const checked = e.target.checked;
    setDonorFalse(checked);
    setDonorStatus(false)
    setSelectedOrgans([]);
    setDisableCheckBox(true)
    if (checked) {
      setDonorTrue(false);
    }
  };

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

  const handleSubmit = (values) => {
    setIsModalVisible(true);
    setIsLoading(true);

    setTimeout(async () => {
      // Make the POST request here
      let data = {
        patientId: patientId,
        bloodGroup: bloodGroup,
        weight: weight,
        patientName: patientName,
        height: height,
        bmi: bmi,
        donorStatus: donorStatus,
        organsList: selectedOrgans,
        createdAt: new Date(),
        createdBy: hospitalId
      }

      try {
        const response = await axios.post(SAVE_MEDICAL_RECORD, data)
        console.log("Response:", response);
        message.success('Record Saved successful!!');

        setTimeout(async () => {
          window.location.reload()
        }, 500)
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
      } finally {
        setIsLoading(false);
        setIsModalVisible(false);
      }
    }, 1000)
  };

  useEffect(() => {
    const fetchData = async () => {
      // fetch the list of patients whose record is not created 

      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.loginId) {
          setLoginUserId(decoded.loginId);
          setHospitalId(decoded.loginId);

          const response = await fetch(GET_PATIENTS_API);
          const { patientList } = await response.json();
          console.log("data:", patientList);
          setPatientList(patientList);
        } else {
          navigate(HOSPITAL_LOGIN_PAGE);
        }
      } else {
        navigate(HOSPITAL_LOGIN_PAGE);
      }

    };

    fetchData();
  }, []);

  const handlePatientIdChange = (value) => {
    setSelectedPatientId(value);
    const selectedData = patientList.find((item) => item.id === value);
    console.log("selectedData", selectedData);
    setPatientName(selectedData?.patientName || '');
    setPatientId(selectedData?.id || '');
  };

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black",
    width: "100%"
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HospitalSideNav selectedKey={'5'} />
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

              <h2>FILL MEDICAL DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Patient ID" name="Patient ID" rules={[{ required: true }]}>
                    <Select placeholder="Select Patient ID" style={{ width: "100%" }} onChange={handlePatientIdChange} value={selectedPatientId}>
                      {patientList.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
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
                  <Form.Item label="Blood Group" name="Blood Group" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select blood group"
                      style={{ width: "100%" }}
                      value={bloodGroup}
                      onChange={(value) => setBloodGroup(value)}
                    >
                      {bloodGroups.map((bloodGroup) => (
                        <Option key={bloodGroup} value={bloodGroup}>
                          {bloodGroup}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Height" name="Height" rules={[{ required: true }]}>
                    <InputNumber placeholder="Enter Height" style={{ width: "100%" }} value={height} onChange={(value) => setHeight(value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Weight" name="Weight" rules={[{ required: true }]}>
                    <InputNumber placeholder="Enter Weight" style={{ width: "100%" }} value={weight} onChange={(value) => setWeight(value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="BMI" name="BMI" rules={[{ required: true }]}>
                    <InputNumber placeholder="Enter BMI" style={{ width: "100%" }} value={bmi} onChange={(value) => setBMI(value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="DONOR" name="Donor">
                    <Checkbox checked={donorTrue} onChange={handleDonorTure}>
                      YES
                    </Checkbox>
                    <Checkbox checked={donorFalse} onChange={handleDonorFalse} style={{ marginLeft: "90px" }}>
                      NO
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <h2>Organ To Donate</h2>
              <Col span={60}>
                <Checkbox.Group
                  options={organsList}
                  value={selectedOrgans}
                  onChange={(value) => setSelectedOrgans(value)}
                  disabled={disableCheckBox}
                >
                  {organsList.map((option) => (
                    <Checkbox key={option} value={option}>
                      {option}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Col>

              <Row>
                <Col span={23}>
                  <Form.Item style={{ float: "right", marginRight: "120px", marginTop: "20px" }}>
                    <Button type="primary" htmlType="submit">
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

export default RegisterDonor;
