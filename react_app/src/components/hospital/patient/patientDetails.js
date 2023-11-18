import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Button, Row, Col, InputNumber, Divider, Checkbox, Select, message, Modal, Spin } from 'antd';
import HospitalSideNav from '../sideNav'
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospitalConstants';
import axios from 'axios';
import { switchDonorToPatient, switchPatientToDonor } from '../../../user_register_web3'

const { HOSPITAL_LOGIN_PAGE, GET_PATIENT_DETAIL_API, UPDATE_DONOR_DETAIL_API } = HOSPITAL_CONSTANT

const { Content } = Layout;
const { Option } = Select;

const PatientDetails = ({ account, provider, contractInstance }) => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState('');
  const [editForm, setEditForm] = useState(false)
  const [editCheckBox, setEditCheckBox] = useState(true)
  const [donorName, setDonorName] = useState('')
  const [loginUserID, setLoginUserId] = useState(null);
  const [donorStatus, setDonorStatus] = useState();

  const [donorTrue, setDonorTrue] = useState(false);
  const [donorFalse, setDonorFalse] = useState(false);
  const [selectedOrgans, setSelectedOrgans] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDonorTure = (e) => {
    const checked = e.target.checked;
    setDonorTrue(checked);
    setDonorStatus(true)
    if (checked) {
      setEditCheckBox(false);
      setDonorFalse(false);
    }
  };

  const handleEditForm = (e) => {
    setEditForm(true)
    if (donorTrue) {
      setEditCheckBox(false);
      setDonorFalse(false);
    }
  }

  const handleDonorFalse = (e) => {
    const checked = e.target.checked;
    setDonorFalse(checked);
    setDonorStatus(false)
    setSelectedOrgans([]);
    if (checked) {
      setDonorTrue(false);
      setEditCheckBox(true);
      setSelectedOrgans([]);
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

  const enumBloodtype = {
    'A+': 0,
    'A-': 1,
    'B+': 2,
    'B-': 3,
    'O+': 4,
    'O-': 5,
    'AB+': 6,
    'AB-': 7
  }

  useEffect(() => {
    const fetchData = async () => {
      // Assuming the data is fetched from an API or some other source
      // API should send the list of donors whose record is not created yet

      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {
          setLoginUserId(decoded.sub);
          let URL = `${GET_PATIENT_DETAIL_API}=${id}`

          const response = await axios.get(URL);
          const { data } = response.data;
          const { donorDetails, organToDonate } = data;
          console.log("donor details:", data);
          console.log("userId:", id);
          setBloodGroup(donorDetails.bloodGroup);
          setBMI(donorDetails.bmi);
          setHeight(donorDetails.height);
          setWeight(donorDetails.weight);
          setDonorName(donorDetails.name)
          setDonorStatus(donorDetails.donorStatus)

          if (donorDetails.donorStatus) {
            setDonorTrue(true)
            setDonorFalse(false)
            setSelectedOrgans(organToDonate.map((value) => {
              return value.organ
            }));
          } else {
            setDonorTrue(false)
            setDonorFalse(true)
          }
        } else {
          navigate(HOSPITAL_LOGIN_PAGE);
        }

      } else {
        navigate(HOSPITAL_LOGIN_PAGE);
      }

    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setIsModalVisible(true);
    setIsLoading(true);
    let hospitalId = localStorage.getItem('loginUserId');
    setTimeout(async () => {

      let data = {
        patientId: id,
        patientName: donorName,
        bloodGroup: bloodGroup,
        weight: weight,
        height: height,
        bmi: bmi,
        donorStatus: donorStatus,
        organList: selectedOrgans,
        createdAt: new Date().toISOString(),
        createdBy: hospitalId
      }

      console.log("Data to submit:", data);

      try {
        // if donar == true then call switchPatientToDonor else  call switchDonorToPatient
        let chainResponse;
        if (donorStatus) {
          console.log("inside if");
          let enumSelectedOrgans = [];
          let enumBloodGroup = enumBloodtype[bloodGroup]
          selectedOrgans.forEach(organ => enumSelectedOrgans.push(enumOrganType[organ]))
          console.log("enumOrgan:", enumSelectedOrgans, enumBloodGroup);
          chainResponse = await switchPatientToDonor(id, enumSelectedOrgans, bmi, enumBloodGroup, contractInstance)
        } else {
          console.log("inside else");
          let enumBloodGroup = enumBloodtype[bloodGroup]
          chainResponse = await switchDonorToPatient(id,bmi, enumBloodGroup, contractInstance)
        }
        
        console.log("chainresponse:",chainResponse);
        if (chainResponse.error === true) {
          message.error('Contract interaction failed. Try Latter...');
        } else {
          const response = await axios.post(UPDATE_DONOR_DETAIL_API, data)
          console.log("Response:", response);
          if (response.data.status== 200) {
            message.success('Donor details updated');
          } else {
            message.error('Something went wrong. Try Latter...');
          }
        }
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Something went wrong. Try Latter...');
      } finally {
        setIsLoading(false);
        setIsModalVisible(false);
        setEditForm(false)
        setEditCheckBox(true);
      }
    }, 1000)


  };

  const inputBoxStyle = {
    fontSize: "16px",
    color: "black",
    width: "100%"
  }


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HospitalSideNav selectedKey={'1'} />
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

              <h2>PATIENT MEDICAL DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="User ID" >
                    <Input value={id} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Name" >
                    <Input value={donorName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Form.Item label="Blood Group" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select blood group"
                      style={inputBoxStyle}
                      value={bloodGroup}
                      onChange={(value) => setBloodGroup(value)}
                      disabled={!editForm}
                    >
                      {bloodGroups.map((bloodGroup) => (
                        <Option key={bloodGroup} value={bloodGroup} style={inputBoxStyle}>
                          {bloodGroup}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Height" rules={[{ required: true }]}>
                    <InputNumber disabled={!editForm} placeholder="Enter Height" style={inputBoxStyle} value={height} onChange={(value) => setHeight(value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Weight" rules={[{ required: true }]}>
                    <InputNumber disabled={!editForm} placeholder="Enter Weight" style={inputBoxStyle} value={weight} onChange={(value) => setWeight(value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="BMI" rules={[{ required: true }]}>
                    <InputNumber disabled={!editForm} placeholder="Enter BMI" style={inputBoxStyle} value={bmi} onChange={(value) => setBMI(value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="DONOR" name="Donor">
                    <Checkbox checked={donorTrue} onChange={handleDonorTure}
                      disabled={!editForm}
                    >
                      YES
                    </Checkbox>
                    <Checkbox checked={donorFalse} onChange={handleDonorFalse} style={{ marginLeft: "90px" }}
                      disabled={!editForm}
                    >
                      NO
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <h2>Organ To Donate</h2>

              {donorFalse ?
                <Col span={60}>
                  <Checkbox.Group
                    options={organsList}
                    value={selectedOrgans}
                    onChange={(value) => setSelectedOrgans(value)}
                    disabled={editCheckBox}
                  >
                    {organsList.map((option) => (
                      <Checkbox key={option} value={option}>
                        {option}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Col> :
                <Col span={60}>
                  <Checkbox.Group
                    options={organsList}
                    value={selectedOrgans}
                    onChange={(value) => setSelectedOrgans(value)}
                    disabled={editCheckBox}
                  >
                    {organsList.map((option) => (
                      <Checkbox key={option} value={option}>
                        {option}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Col>
              }

              <Row>
                <Col span={23}>

                  {
                    !editForm ?
                      <Button type="primary" onClick={handleEditForm} style={{ float: "right", marginRight: "120px", marginTop: "20px" }}>
                        Edit
                      </Button>
                      :
                      <Form.Item style={{ float: "right", marginRight: "120px", marginTop: "20px" }}>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                  }

                </Col>
              </Row>

            </Form>

            <Modal
              visible={isModalVisible}
              footer={null}
              closeIcon={null}
            // centered
            >
              {isLoading ? (
                <Spin tip="Loading..." size="large">
                  <p>Updating record....Please wait</p>
                </Spin>
              ) :
                null
              }
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientDetails;
