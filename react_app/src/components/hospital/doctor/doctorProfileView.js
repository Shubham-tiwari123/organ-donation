import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Row, Col, Divider } from 'antd';
import HospitalSideNav from '../sideNav'
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospital/hospitalConstants';
const { HOSPITAL_LOGIN_PAGE, GET_DOCTOR_PROFILE_DETAILS } = HOSPITAL_CONSTANT
const { Content } = Layout;

const DoctorProfileView = () => {

  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [loginUserID, setLoginUserId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine1, setAddressFirstLine] = useState('');
  const [addressLine2, setAddressSecondtLine] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [idCards, setIdCards] = useState([]);

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black"
  }

  useEffect(() => {
    const fetchData = async () => {
      // Assuming the data is fetched from an API or some other source
      // Api should fetch details of the doctors registerd with particular hospital: pass doctor-id in the request

      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.loginId) {
          setLoginUserId(decoded.loginId);

          let URL = `${GET_DOCTOR_PROFILE_DETAILS}=${doctorId}`

          const response = await fetch(URL);
          const { doctorProfile } = await response.json();
          console.log("data2:", doctorProfile);
          setFirstName(doctorProfile.firstName);
          setSecondName(doctorProfile.secondName);
          setEmail(doctorProfile.email);
          setPhoneNumber(doctorProfile.phoneNumber);
          setDob(doctorProfile.dob);
          setGender(doctorProfile.gender);
          setAddressFirstLine(doctorProfile.addressLine1);
          setAddressSecondtLine(doctorProfile.addressLine2);
          setCountry(doctorProfile.country);
          setCity(doctorProfile.city);
          setState(doctorProfile.state);
          setPincode(doctorProfile.pincode);

          const renderCardDetails = () => {
            return doctorProfile.idCard.map((card, index) => (
              console.log("card details:", card),
              <Row key={index}>
                <Col span={8}>
                  <Form.Item label="Card Type">
                    <Input value={card.cardType} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item label="Card Number"  >
                    <Input value={card.cardNumber} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
            ));
          };
          setIdCards(renderCardDetails);
        } else {
          navigate(HOSPITAL_LOGIN_PAGE);
        }

      } else {
        navigate(HOSPITAL_LOGIN_PAGE);
      }


    };

    fetchData();
  }, []);



  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HospitalSideNav selectedKey={'3'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>

            <Form
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
              layout="vertical"
              style={{ marginLeft: '20px' }}>

              <h2>DOCTOR PERSONAL INFO</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="First Name" >
                    <Input placeholder="First Name" value={firstName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Second Name">
                    <Input placeholder="Second Name" value={secondName} disabled style={inputBoxStyle} />
                  </Form.Item>
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
              <h2>Address</h2>

              <Row>
                <Col span={12}>
                  <Form.Item label="Address 1">
                    <Input placeholder="Address" value={addressLine1} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Address 2">
                    <Input placeholder="Address" value={addressLine2} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="City">
                    <Input placeholder="City" value={city} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="State">
                    <Input placeholder="State" value={state} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Country">
                    <Input placeholder="Country" value={country} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Pincode">
                    <Input placeholder="Pincode" value={pincode} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <h2>Identity Card</h2>
              {idCards}

            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorProfileView;
