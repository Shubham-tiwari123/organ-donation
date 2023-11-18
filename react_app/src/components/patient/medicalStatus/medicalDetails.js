import React, { useEffect, useState } from 'react';
import '../style/patientStyle.css'
import { Layout, Form, Input, Row, Col, Divider, Checkbox, Card } from 'antd';
import SideNav from '../sidenav';
import { PATIENT_CONSTANT } from '../../../constants/patientConstants';
import axios from 'axios';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const { GET_PATIENT_MEDICAL_INFO, LOGIN_NAVIGATE_URL } = PATIENT_CONSTANT
const { Content } = Layout;


const MedicalDetails = ({ loginUserID, account, provider }) => {
  
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState('');

  const [donorTrue, setDonorTrue] = useState(false);
  const [donorFalse, setDonorFalse] = useState(false);
  const [selectedOrgans, setSelectedOrgans] = useState([]);
  const [donorStatus, setDonorStatus] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [medicalInfoFound, setMedicalInfo] = useState(false);

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
      // Assuming the data is fetched from an API or some other source
      // API should send the list of donors whose record is not created yet
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {
          // let loginAddress = localStorage.getItem('loginUserId');
          let URL = `${GET_PATIENT_MEDICAL_INFO}=${decoded.sub}`

          const response = await axios.get(URL);
          const { status, data } = response.data;
          console.log("patient details:", response.data);
          if (status == 200) {
            setMedicalInfo(true);
            setBloodGroup(data.bloodGroup);
            setBMI(data.bmi);
            setHeight(data.height);
            setWeight(data.weight);
            setDonorStatus(data.donorStatus);
            if (data.donorStatus) {
              setDonorTrue(true)
              setDonorFalse(false)
              setSelectedOrgans(data.organToDonate);
            } else {
              setDonorTrue(false)
              setDonorFalse(true)
            }
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

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black",
    width: "100%"
  }

  const handleCheckboxClick = e => {
    e.preventDefault(); // Prevent the default click behavior
  };

  const handleCheckboxChange = checkedValues => {
    setSelectedOptions(checkedValues);
  };

  const cardStyle = {
    border: '2px solid #e8e8e8',
    borderRadius: '4px',
    marginLeft: "30px",
    marginTop: "15px"
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideNav selectedKey={'3'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>
            <h2 style={{ marginLeft: "20px" }}>MEDICAL DETAILS</h2>
            <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />

            {!medicalInfoFound ?
              <>
                <Card
                  key={123}
                  hoverable
                  style={{ ...cardStyle, width: 250 }}
                >
                  <Meta title='No medical record found' />
                </Card>
              </>
              :
              <>
                <Form
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 20 }}
                  layout="vertical"
                  form={form}
                  style={{ marginLeft: '20px' }}>


                  <Row>
                    <Col span={12}>
                      <Form.Item label="Blood Group" >
                        <Input placeholder="Blood Group" value={bloodGroup} disabled style={inputBoxStyle} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Height" >
                        <Input placeholder="Height" value={height} disabled style={inputBoxStyle} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label="Weight" >
                        <Input placeholder="Weight" value={weight} disabled style={inputBoxStyle} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="BMI" >
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
              </>
            }

          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MedicalDetails;
