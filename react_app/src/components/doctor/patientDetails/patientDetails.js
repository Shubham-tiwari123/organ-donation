import React, { useEffect, useState } from 'react';
import '../style/doctorStyle.css'
import { Layout, Form, Input, Row, Col, Select, Divider, Checkbox } from 'antd';
import DoctorSideNav from '../doctorSidenav';
import { useParams } from 'react-router-dom';
import { DOCTOR_CONSTANT } from '../../../constants/doctorConstants';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
const { GET_DONOR_INFO, LOGIN_NAVIGATE_URL } = DOCTOR_CONSTANT
const { Content } = Layout;

const PatientDetailPage = () => {

  const { patientId, organType } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [donorName, setDonorName] = useState('');
  const [organDonateStatus, setOrganDonateStatus] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [donorTrue, setDonorTrue] = useState(false);
  const [donorFalse, setDonorFalse] = useState(false);
  const [donorStatus, setDonorStatus] = useState(false);
  const [selectedOrgans, setSelectedOrgans] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black"
  }

  const inputBoxStyle2 = {
    fontSize: "16px",
    backgroundColor: '#55e955',
    color: '#383838',
    fontWeight: "bold"
  }

  const inputBoxStyle3 = {
    fontSize: "16px",
    backgroundColor: 'red',
    color: '#ffffff',
    fontWeight: "bold"
  }

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

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {
          let URL = `${GET_DONOR_INFO}patientId=${patientId}&organType=${organType}`
          console.log("Url:", URL);
          const response = await axios.get(URL);
          const { data } = response.data

          console.log("Data:", data);
          setDonorName(data.firstName.toUpperCase() + " " + data.secondName.toUpperCase());
          setOrganDonateStatus(data.organStatus.toUpperCase());
          setEmail(data.email);
          setPhoneNumber(data.phoneNumber);
          setDob(data.dob);
          setGender(data.gender);
          setBloodGroup(data.bloodGroup);
          setBmi(data.bmi);
          setHeight(data.height);
          setWeight(data.weight);
          setDonorStatus(data.donorStatus);
          if (data.donorStatus) {
            setDonorTrue(true)
            setDonorFalse(false)
            setSelectedOrgans(data.organName);
          } else {
            setDonorTrue(false)
            setDonorFalse(true)
          }

        } else {
          navigate(LOGIN_NAVIGATE_URL);
        }

      } else {
        navigate(LOGIN_NAVIGATE_URL);
      }

    };

    fetchData();
  }, []);

  const handleCheckboxClick = e => {
    e.preventDefault(); // Prevent the default click behavior
  };

  const handleCheckboxChange = checkedValues => {
    setSelectedOptions(checkedValues);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DoctorSideNav selectedKey={'3'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px' }}>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              layout="vertical"
              form={form}
              style={{ marginLeft: '20px' }}>

              <h2>DONOR DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Donor Name" >
                    <Input placeholder="Donor Name" value={donorName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {
                    organDonateStatus.toLowerCase() == "not donated" ?
                      <>
                        <Form.Item label="Organ Donate Status">
                          <Input placeholder="Organ Donate Status" value={organDonateStatus} disabled style={inputBoxStyle2} />
                        </Form.Item>
                      </>
                      :
                      <>
                        <Form.Item label="Organ Donate Status">
                          <Input placeholder="Organ Donate Status" value={organDonateStatus} disabled style={inputBoxStyle3} />
                        </Form.Item>
                      </>
                  }

                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="DOB">
                    <Input value={dob} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Gender">
                    <Input placeholder="Gender" value={gender} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Email">
                    <Input placeholder="Email" value={email} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone Number">
                    <Input placeholder="Phone Number" value={phoneNumber} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <h2>Medical Details</h2>
              <Row>
                <Col span={12}>
                  <Form.Item label="Blood Group">
                    <Input placeholder="Blood-Group" value={bloodGroup} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Height">
                    <Input placeholder="Height" value={height} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Weight">
                    <Input placeholder="Weight" value={weight} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="BMI">
                    <Input placeholder="BMI" value={bmi} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="DONOR" style={inputBoxStyle}>
                    <Checkbox checked={donorTrue} onClick={handleCheckboxClick} >
                      YES
                    </Checkbox>
                    <Checkbox checked={donorFalse} onClick={handleCheckboxClick} style={{ marginLeft: "90px" }}>
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
                  onChange={handleCheckboxChange}
                  style={inputBoxStyle}
                >
                  {organsList.map((option) => (
                    <Checkbox key={option} value={option} onClick={handleCheckboxClick}>
                      {option}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Col>
            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientDetailPage;
