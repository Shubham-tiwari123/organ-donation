import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Button, Row, Col, Divider, Table, Modal, Spin, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospital/hospitalConstants';
import axios from 'axios';
const { HOSPITAL_LOGIN_PAGE, GET_REQUEST_DETAILS_API, FIND_MATCH_API, TAKE_DOCTOR_APPROVAL_API,
  TAKE_PATIENT_CONSENT_API, INFORM_DONOR_API } = HOSPITAL_CONSTANT

const { Content } = Layout;

const PatientRequestDetail = () => {

  const { requestId, patientId } = useParams();
  const navigate = useNavigate();
  const [donorHospitalId, setDonorHospitalId] = useState('');
  const [patientHospitalId, setPatientHospitalId] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [organRequest, setOrganRequest] = useState('');
  const [priority, setPriority] = useState('');
  const [donorId, setDonorId] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [bmi, setBMI] = useState('');
  const [createdBy, setCreatedBy] = useState(null);
  const [tableDetails, setTableDetails] = useState([]);
  const [loginUserID, setLoginUserId] = useState(null);

  const [showMessage, setShowMessage] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationModelVisible, setNotificationModelVisible] = useState(false);
  const [currentStageId, setCurrentStageId] = useState(0);

  const [requestStageDetails, setRequestStageDetails] = useState([])

  const [isLoading, setIsLoading] = useState(false);

  const handelNotificationOk = async () => {
    // setDisableFindMatch(true)
    console.log("Current Stage id:", currentStageId);
    console.log("Table 222:", tableDetails[1]);
    if (currentStageId === 1) {
      tableDetails[1].currentStatus = "Done"
      tableDetails[1].actionBtn = <Button type="primary" disabled >FIND MATCH</Button>;
      tableDetails[2].actionBtn = <Button type="primary" style={{ width: "100px" }} onClick={() => takeDoctorApproval({ createdBy })}>SEND</Button>;
      setTableDetails(tableDetails);
    } else if (currentStageId === 2) {
      tableDetails[2].currentStatus = "Done"
      tableDetails[2].actionBtn = <Button type="primary" style={{ width: "100px" }} disabled >SEND</Button>;
      tableDetails[3].actionBtn = <Button type="primary" style={{ width: "100px" }} onClick={() => takePatientConsent({ createdBy })}>SEND</Button>;
      setTableDetails(tableDetails);
    }
    else if (currentStageId === 3) {
      tableDetails[3].currentStatus = "Done"
      tableDetails[3].actionBtn = <Button type="primary" style={{ width: "100px" }} disabled >SEND</Button>;
      tableDetails[4].actionBtn = <Button type="primary" style={{ width: "100px" }} onClick={() => infromDonor({ createdBy })}>SEND</Button>;
      setTableDetails(tableDetails);
    }
    else if (currentStageId === 4) {
      tableDetails[4].currentStatus = "Done"
      tableDetails[4].actionBtn = <Button type="primary" style={{ width: "100px" }} disabled >SEND</Button>;
      setTableDetails(tableDetails);
    }

    setNotificationModelVisible(false)
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
        if (decoded && decoded.loginId) {
          console.log("jwt:", decoded.loginId);
          setLoginUserId(decoded.loginId);

          let URL = `${GET_REQUEST_DETAILS_API}=${requestId}`

          const response = await fetch(URL);
          const { requestDetails, requestStage } = await response.json();

          console.log("request:", requestStage);
          setBloodGroup(requestDetails.bloodGroup);
          setOrganRequest(requestDetails.organRequest);
          setDoctorName(requestDetails.doctorName);
          setBMI(requestDetails.bmi);
          setPriority(requestDetails.priority);
          setDonorId(requestDetails.donorId);
          setCreationDate(requestDetails.creationDate);
          setDoctorId(requestDetails.doctorId);
          setDonorHospitalId(requestDetails.donorHospitalId)
          setCreatedBy(requestDetails.createdBy)

          let loginHospitalId = decoded.loginId

          // random hospital id
          // let loginHospitalId = "5b44ca72-23ec-11ee-be56-0242ac120002"
          console.log("requestStage:", requestStage[5]);
          const tableActionBtns = requestStage.map((item) => {
            let actionBtn = null;

            // find match stage 
            if (item.id === 2 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.patientHospitalId)) {
              actionBtn = <Button type="primary" onClick={() => handleFindMatch({
                item,
                createdBy: requestDetails.createdBy
              })} >FIND MATCH</Button>;
            } else if (item.id === 2 && item.currentStatus === "Done") {
              actionBtn = <Button type="primary">VIEW MATCH</Button>;
            } else if (item.id === 2 && item.currentStatus === "Pending") {
              actionBtn = <Button type="primary" disabled>VIEW MATCH</Button>;
            }

            // Doctor apporoval stage
            if (item.id === 3 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.patientHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>SEND</Button>;
            } else if (item.id === 3 && item.currentStatus === "Done" && (loginHospitalId === requestDetails.patientHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>SEND</Button>;
            }

            //patient consent stage
            if (item.id === 4 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.patientHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>SEND</Button>;
            } else if (item.id === 4 && item.currentStatus === "Done" && (loginHospitalId === requestDetails.patientHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>SEND</Button>;
            }

            //donor inform stage
            if (item.id === 5 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.patientHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>SEND</Button>;
            } else if (item.id === 5 && item.currentStatus === "Done" && (loginHospitalId === requestDetails.patientHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>SEND</Button>;
            }

            // Organ removed
            if (item.id === 6 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.donorHospitalId)) {
              console.log("requestStage:", requestStage);
              if (requestStage[4].currentStatus === "Done") {
                actionBtn =
                  <Link to={`/hospital/organ/update/${requestDetails.doctorId}/${requestDetails.doctorName}/${requestDetails.bloodGroup}/${requestDetails.organRequest}/${requestDetails.donorId}/${requestDetails.patientId}/${requestId}`}>
                    <Button type="primary" style={{ width: "100px" }}>UPDATE</Button>
                  </Link>
              } else {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>UPDATE</Button>
              }
            } else if (item.id === 6 && item.currentStatus === "Pending" && (loginHospitalId !== requestDetails.donorHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>VIEW</Button>
            } else if (item.id === 6 && item.currentStatus === "Done") {
              actionBtn =
                <Link to={`/hospital/organ/detail/${requestDetails.requestId}/${requestDetails.patientId}`}>
                  <Button type="primary" style={{ width: "100px" }} >VIEW</Button>
                </Link>
            }

            // Organ transported
            if (item.id === 7 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.donorHospitalId)) {
              if (requestStage[5].currentStatus === "Done") {
                actionBtn =
                  <Link to={`/hospital/organ/transport/${requestDetails.requestId}`}>
                    <Button type="primary" style={{ width: "100px" }}>UPDATE</Button>
                  </Link>
              } else {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>UPDATE</Button>
              }
            } else if (item.id === 7 && item.currentStatus === "Pending" && (loginHospitalId !== requestDetails.donorHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>VIEW</Button>;
            } else if (item.id === 7 && item.currentStatus === "Done") {
              actionBtn =
                <Link to={`/hospital/organ/transport/detail/${requestDetails.requestId}/${requestDetails.patientId}`}>
                  <Button type="primary" style={{ width: "100px" }} >VIEW</Button>
                </Link>
            }

            // organ received
            if (item.id === 8 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.patientHospitalId)) {
              if (requestStage[5].currentStatus === "Done" && requestStage[6].currentStatus === "Done") {
                actionBtn =
                  <Link to={`/hospital/organ/received/${requestDetails.requestId}`}>
                    <Button type="primary" style={{ width: "100px" }}>UPDATE</Button>
                  </Link>
              } else {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled >UPDATE</Button>
              }
            } else if (item.id === 8 && item.currentStatus === "Pending" && (loginHospitalId !== requestDetails.patientHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>VIEW</Button>;
            } else if (item.id === 8 && item.currentStatus === "Done") {
              actionBtn =
                <Link to={`/hospital/organ/received/detail/${requestDetails.requestId}/${requestDetails.patientId}`}>
                  <Button type="primary" style={{ width: "100px" }} >VIEW</Button>
                </Link>
            }

            // Organ transplant
            if (item.id === 9 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.patientHospitalId)) {
              if (requestStage[6].currentStatus === "Done" && requestStage[7].currentStatus === "Done") {
                actionBtn =
                  <Link to={`/hospital/organ/transplant/${requestDetails.requestId}`}>
                    <Button type="primary" style={{ width: "100px" }}>UPDATE</Button>
                  </Link>
              } else {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled >UPDATE</Button>
              }
            } else if (item.id === 9 && item.currentStatus === "Pending" && (loginHospitalId !== requestDetails.patientHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>VIEW</Button>;
            } else if (item.id === 9 && item.currentStatus === "Done") {
              actionBtn =
                <Link to={`/hospital/organ/transplant/detail/${requestDetails.requestId}/${requestDetails.patientId}`}>
                  <Button type="primary" style={{ width: "100px" }} >VIEW</Button>
                </Link>
            }

            return {
              id: item.id,
              currentStage: item.currentStage,
              currentStatus: item.currentStatus,
              actionBtn: actionBtn
            };
          });
          setTableDetails(tableActionBtns);

        } else {
          navigate(HOSPITAL_LOGIN_PAGE);
        }
      } else {
        navigate(HOSPITAL_LOGIN_PAGE);
      }
    };

    fetchData();
  }, []);

  const handleFindMatch = ({ item, createdBy }) => {
    setShowMessage("Finding match")
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let data = {
        requestId: requestId,
        patientId: patientId,
        bloodGroup: bloodGroup,
        organRequest: organRequest,
        createdBy: createdBy,
        createdDate: new Date()
      }

      try {
        const response = await axios.post(FIND_MATCH_API, data)
        console.log("Response:", response);
        setCurrentStageId(1)
        setIsLoading(false);
        setIsModalVisible(false);
        setDonorId(response.data.donorId)
        setNotificationMessage(`Match Found with donor: Name: ${response.data.donorName}, ID: ${response.data.donorId}`)
        setNotificationModelVisible(true)
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  }

  const takeDoctorApproval = ({ item, createdBy }) => {

    console.log("createdBy:", createdBy);
    setShowMessage("Making request for approval:")
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let data = {
        requestId: requestId,
        patientId: patientId,
        bloodGroup: bloodGroup,
        organRequest: organRequest,
        createdBy: createdBy,
        doctorId: doctorId,
        createdDate: new Date()
      }

      try {
        const response = await axios.post(TAKE_DOCTOR_APPROVAL_API, data)
        console.log("Response:", response);
        setCurrentStageId(2)
        setIsLoading(false);
        setIsModalVisible(false);
        setNotificationMessage('Please wait while doctor conforms')
        setNotificationModelVisible(true)
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  }

  const takePatientConsent = ({ item, createdBy }) => {
    setShowMessage("Making request for patient consent")
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let data = {
        requestId: requestId,
        patientId: patientId,
        bloodGroup: bloodGroup,
        organRequest: organRequest,
        createdBy: createdBy,
        doctorId: doctorId,
        createdDate: new Date()
      }

      try {
        const response = await axios.post(TAKE_PATIENT_CONSENT_API, data)
        console.log("Response:", response);
        setCurrentStageId(3)
        setIsLoading(false);
        setIsModalVisible(false);
        setNotificationMessage('Please wait while patient conforms')
        setNotificationModelVisible(true)
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  }

  const infromDonor = ({ item, createdBy }) => {
    setShowMessage("Informing Donor")
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let data = {
        requestId: requestId,
        patientId: patientId,
        bloodGroup: bloodGroup,
        organRequest: organRequest,
        createdBy: createdBy,
        doctorId: doctorId,
        donorId: donorId,
        createdDate: new Date()
      }

      try {
        const response = await axios.post(INFORM_DONOR_API, data)
        console.log("Response:", response);
        setCurrentStageId(4)
        setIsLoading(false);
        setIsModalVisible(false);
        setNotificationMessage('Donor is informed')
        setNotificationModelVisible(true)
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  }

  const columns = [
    { title: 'Request Stage', dataIndex: 'currentStage', key: 'currentStage', align: 'center' },
    { title: 'Current Status', dataIndex: 'currentStatus', key: 'currentStatus', align: 'center' },
    { title: 'Action', dataIndex: 'actionBtn', key: 'actionBtn', align: 'center' },
  ];

  const modalFooter = (
    <div>
      <Button key="submit" type="primary" onClick={handelNotificationOk}>
        OK
      </Button>
    </div>
  );

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
              style={{ marginLeft: '20px' }}>

              <h2>REQUEST DETAILS</h2>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <Row>
                <Col span={12}>
                  <Form.Item label="Doctor Id">
                    <Input value={doctorId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Doctor Name">
                    <Input value={doctorName} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Blood Group" >
                    <Input value={bloodGroup} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="BMI">
                    <Input value={bmi} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Organ Request">
                    <Input value={organRequest} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Priority">
                    <Input value={priority} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="Donor Id" >
                    <Input value={donorId} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Date">
                    <Input value={creationDate} disabled style={inputBoxStyle} />
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <h2>Request Stage</h2>

              <div className="table-container">
                <Table dataSource={tableDetails} columns={columns} pagination={false} />
              </div>
            </Form>

            <Modal
              visible={isModalVisible}
              footer={null}
              closeIcon={null}
            >
              {isLoading ? (
                <Spin tip="Loading...">
                  <p>{showMessage}...</p>
                </Spin>
              ) : null}
            </Modal>

            <Modal
              visible={notificationModelVisible}
              onOk={handelNotificationOk}
              footer={modalFooter}
            >
              <p>{notificationMessage}...</p>
            </Modal>

          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientRequestDetail;
