import React, { useEffect, useState } from 'react';
import '../style/doctorStyle.css'
import { Layout, Form, Input, Button, Row, Col, DatePicker, Select, InputNumber, Divider, Modal, Spin, message } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import DoctorSideNav from '../doctorSidenav';
import axios from 'axios';
import { DOCTOR_CONSTANT } from '../../../constants/doctorConstants';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const { SAVE_DOCTOR_PERSONAL_INFO, GET_DOCTOR_PERSONAL_INFO, LOGIN_NAVIGATE_URL } = DOCTOR_CONSTANT
const { Content } = Layout;
const { Option } = Select;


const DoctorHomePage = ({account, provider}) => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
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
  const [cards, setCards] = useState([{ cardType: '', cardNumber: '' }]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisabled] = useState(false);
  const [userInfo, setUserInfo] = useState(null)
  const [totalNotification, setTotalNotification] = useState(0);
  const [hospitalList, setHospital] = useState([])
  const [hospitalName, setHospitalName] = useState([])
  const [hospitalId, setHospitalId] = useState([])


  const renderCards = () => {
    return cards.map((card, index) => (
      <Row key={index}>
        <Col span={8}>
          <Form.Item
            label="Card Type"
            name={['cards', index, 'cardType']}
            rules={[{ required: true, message: 'Please select a card type' }]}
          >
            <Select placeholder="Select card type">
              <Option value="aadharcard">Aadhar Card</Option>
              <Option value="pancard">Pan Card</Option>
              <Option value="driving">Driving Lincence</Option>
              <Option value="passport">Passport</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            label="Card Number"
            name={['cards', index, 'cardNumber']}
            rules={[{ required: true, message: 'Please enter a card number' }]}
          >
            <Input placeholder="Enter card number" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        {index > 0 && (
          <Col span={16}>
            <Button type="link" onClick={() => handleRemoveCard(index)} icon={<MinusOutlined />}>
              Remove
            </Button>
          </Col>
        )}
      </Row>
    ));
  };

  const handleAddCard = () => {
    setCards([...cards, { cardType: '', cardNumber: '' }]);
  };

  const handleRemoveCard = (index) => {
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);
    setCards(updatedCards);
  };

  const handleSubmit = (values) => {

    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let personalInfo = {
        email: email,
        dob: dob.dateString,
        firstName: firstName,
        secondName: secondName,
        phoneNumber: phoneNumber,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        country: country,
        state: state,
        gender: gender,
        pincode: pincode,
        cardDetails: values["cards"],
        createdAt: new Date().toISOString()
      }

      let data = {
        userId: account.toLowerCase(),
        hospitalId: hospitalId.toLowerCase(),
        hospitalName: hospitalName,
        personalInfo: personalInfo
      }
      console.log("Data to submit:", data);

      try {
        const response = await axios.post(SAVE_DOCTOR_PERSONAL_INFO, data)
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
          localStorage.setItem('loginUserId', decoded.sub);
          let URL = `${GET_DOCTOR_PERSONAL_INFO}=${decoded.sub}`
          console.log("url:",URL);
          const response = await axios.get(URL);
          let { status, data } = response.data

          console.log("Data doctor:",data);
          setHospital(data.hospitalList);
          setEmail(data.personalInfo.email);

          if (status==200) {
            //disable editing and set the values for each 
            setUserInfo(data.personalInfo)
            setFirstName(data.personalInfo.firstName);
            setSecondName(data.personalInfo.secondName);
            setPhoneNumber(data.personalInfo.phoneNumber);
            setDob(data.personalInfo.dob);
            setGender(data.personalInfo.gender);
            setAddressFirstLine(data.personalInfo.addressLine1);
            setAddressSecondtLine(data.personalInfo.addressLine2);
            setCountry(data.personalInfo.country);
            setCity(data.personalInfo.city);
            setState(data.personalInfo.state);
            setPincode(data.personalInfo.pincode);
            setHospitalName(data.personalInfo.hospitalName);
            localStorage.setItem('hospitalIdDoctor', data.personalInfo.hospitalId);
            localStorage.setItem("doctorName", data.personalInfo.firstName + " " + data.personalInfo.secondName)

            const renderCardDetails = () => {
              return data.personalInfo.cardDetails.map((card, index) => (
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
            setCards(renderCardDetails);

            if(data.personalInfo.notifications > 0){
              setTotalNotification(data.personalInfo.notifications);
              setIsNotificationVisible(true);
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

  const handleHospitalChange = (value) => {
    setHospitalName(value);
    const selectedData = hospitalList.find((item) => item.hospitalName === value);
    setHospitalId(selectedData?.hospitalId || '');
    setHospitalName(selectedData?.hospitalName || '')
  };

  const handleOk = () => setIsNotificationVisible(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DoctorSideNav selectedKey={'1'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>

            {
              userInfo == null ?
                <Form
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 20 }}
                  layout="vertical"
                  form={form}
                  style={{ marginLeft: '20px' }}
                  onFinish={handleSubmit}>

                  <h2>HOME</h2>
                  <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
                  <Row>
                    <Col span={12}>
                      <Form.Item label="First Name" name="First Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter First Name" value={firstName} onChange={(value) => setFirstName(value.target.value)} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Second Name" name="Second Name">
                        <Input placeholder="Enter Second Name" value={secondName} onChange={(value) => setSecondName(value.target.value)} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label="DOB" name="Date of Birth" rules={[{ required: true }]}>
                        <DatePicker style={{ width: "100%" }} value={dob} onChange={(value, dateString) => setDob({ value, dateString })} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Gender" name="Gender" rules={[{ required: true }]}>
                        <Select
                          placeholder="Select Gender"
                          value={gender}
                          onChange={(value) => setGender(value)}
                          options={[
                            {
                              value: "male",
                              label: "Male"
                            },
                            {
                              value: "female",
                              label: "Female"
                            }
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label="Email" >
                        <Input placeholder="Enter Email" value={email} disabled style={{ color: "#000000"}} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Phone Number" name="Phone Number" rules={[{ required: true, type: 'number' }]}>
                        <InputNumber placeholder="Enter Phone Number" style={{ width: "100%" }} value={phoneNumber} onChange={(value) => setPhoneNumber(value)} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label="Hospital you work" name="Hospital Name" rules={[{ required: true }]}>
                        <Select placeholder="Select Hospital Name" style={{ width: "100%" }} onChange={handleHospitalChange} value={hospitalName}>
                          {hospitalList.map((item) => (
                            <Option key={item.hospitalId} value={item.hospitalName}>
                              {item.hospitalName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
                  <h2>Address</h2>

                  <Row>
                    <Col span={12}>
                      <Form.Item label="Address 1" name="Address1" rules={[{ required: true, max: '100' }]}>
                        <Input placeholder="Enter Address" value={addressLine1} onChange={(value) => setAddressFirstLine(value.target.value)} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Address 2" name="Address2">
                        <Input placeholder="Enter Address" value={addressLine2} onChange={(value) => setAddressSecondtLine(value.target.value)} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label="City" name="City" rules={[{ required: true }]}>
                        <Input placeholder="Enter City" value={city} onChange={(value) => setCity(value.target.value)} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="State" name="State" rules={[{ required: true }]}>
                        <Input placeholder="Enter State" value={state} onChange={(value) => setState(value.target.value)} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label="Country" name="Country" rules={[{ required: true }]}>
                        <Input placeholder="Enter Country" value={country} onChange={(value) => setCountry(value.target.value)} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Pincode" name="Pincode" rules={[{ required: true }]}>
                        <InputNumber placeholder="Enter Pincode" style={{ width: "100%" }} value={pincode} onChange={(value) => setPincode(value)} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
                  <h2>Identity Card</h2>
                  {renderCards()}
                  <Row>
                    <Col span={12}>
                      <Button type="link" onClick={handleAddCard} icon={<PlusOutlined />}>
                        Add Card
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Form.Item style={{ float: "right", marginRight: "100px" }}>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>

                </Form>
                :
                <Form
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 20 }}
                  layout="vertical"
                  style={{ marginLeft: '20px' }}>

                  <h2>HOME</h2>
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
                  <Row>
                    <Col span={12}>
                      <Form.Item label="Hospital you work" >
                        <Input placeholder="Hospital Name" value={hospitalName} disabled style={inputBoxStyle} />
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
                  {cards}

                </Form>
            }

            <Modal
              title="Notification"
              visible={isNotificationVisible}
              onOk={handleOk}
              onCancel={() => handleOk()}
              footer={[
                <Button key="submit" type="primary" onClick={handleOk}>
                  OK
                </Button>,
              ]}
            >
              You have got {totalNotification} notifications. Check Request Status Tab !

            </Modal>

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

export default DoctorHomePage;
