import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Form, Input, Button, Row, Col, Divider, Table, Modal, Spin, message, Alert } from 'antd';
import { Link, useParams } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospitalConstants';
import axios from 'axios';
import { validateOrganMatch } from '../../../user_register_web3'

const { HOSPITAL_LOGIN_PAGE, GET_REQUEST_DETAILS_API, FIND_MATCH_API, TAKE_DOCTOR_APPROVAL_API,
  TAKE_PATIENT_CONSENT_API, INFORM_DONOR_API, CONFIRM_MATCH, UPDATE_PATIENTID_IOTBOX } = HOSPITAL_CONSTANT

const { Content } = Layout;

const OrganRequestDetail = ({ contractInstance }) => {

  const { requestId, patientId } = useParams();

  const TEMPRATURE_THRESHOLD_MAX = parseInt(HOSPITAL_CONSTANT.TEMPRATURE_THRESHOLD_MAX)
  const TEMPRATURE_THRESHOLD_MIN = parseInt(HOSPITAL_CONSTANT.TEMPRATURE_THRESHOLD_MIN)

  const VIBRATION_THRESHOLD_MAX = parseInt(HOSPITAL_CONSTANT.VIBRATION_THRESHOLD_MAX)
  const VIBRATION_THRESHOLD_MIN = parseInt(HOSPITAL_CONSTANT.VIBRATION_THRESHOLD_MIN)

  const HUMIDITY_THRESHOLD_MAX = parseInt(HOSPITAL_CONSTANT.HUMIDITY_THRESHOLD_MAX)
  const HUMIDITY_THRESHOLD_MIN = parseInt(HOSPITAL_CONSTANT.HUMIDITY_THRESHOLD_MIN)

  const ORIENTATION_THRESHOLD_MAX = parseInt(HOSPITAL_CONSTANT.ORIENTATION_THRESHOLD_MAX)
  const ORIENTATION_THRESHOLD_MIN = parseInt(HOSPITAL_CONSTANT.ORIENTATION_THRESHOLD_MIN)

  const INTENSITY_THRESHOLD_MAX = parseInt(HOSPITAL_CONSTANT.INTENSITY_THRESHOLD_MAX)
  const INTENSITY_THRESHOLD_MIN = parseInt(HOSPITAL_CONSTANT.INTENSITY_THRESHOLD_MIN)
  
  const navigate = useNavigate();
  const [donorHospitalId, setDonorHospitalId] = useState('');
  const [bloodGroup, setBloodGroup] = useState();
  const [doctorName, setDoctorName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [organRequest, setOrganRequest] = useState();
  const [priority, setPriority] = useState('');
  const [donorId, setDonorId] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [bmi, setBMI] = useState('');
  const [createdBy, setCreatedBy] = useState(null);
  const [tableDetails, setTableDetails] = useState([]);
  const [loginUserID, setLoginUserId] = useState(null);
  const [patientName, setPatientName] = useState(null);

  const [temprature, setTemprature] = useState();
  const [vibration, setVibration] = useState();
  const [humidity, setHumidity] = useState();
  const [orientation, setOrientation] = useState();
  const [intensity, setIntensity] = useState();
  const [opencloserstate, setOpencloserstate] = useState();

  const [tempratureAlert, setTempratureAlert] = useState(false);
  const [vibrationAlert, setVibrationAlert] = useState(false);
  const [humidityAlert, setHumidityAlert] = useState(false);
  const [orientationAlert, setOrientationAlert] = useState();
  const [intensityAlert, setIntensityAlert] = useState(false);
  const [opencloserstateAlert, setOpencloserstateAlert] = useState(false);

  const [showMessage, setShowMessage] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationModelVisible, setNotificationModelVisible] = useState(false);
  const [notificationModelVisible2, setNotificationModelVisible2] = useState(false);
  const [currentStageId, setCurrentStageId] = useState(0);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let bloodGroup2;
  let organRequired2;
  let donorDetails;

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

  const verifyBlockchain = async () => {
    setShowMessage("Verifying on chain")
    setNotificationModelVisible(false)
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {
      console.log("donor:", requestId);
      console.log("result:", result.donor);
      try {
        // make web3 call 
        // function:  validateOrganMatch()
        const chainResponse = await validateOrganMatch(result.compatibilityScore, donorId, requestId, contractInstance)
        console.log("chainResponse:", chainResponse);
        if (chainResponse.error == false) {
          let confirmMatch = {
            requestId: requestId,
            patientId: patientId,
            donorId: result.donor,
            bloodGroup: bloodGroup.toLowerCase(),
            organRequest: organRequest.toLowerCase()
          }

          console.log("ConfirmMatch:", confirmMatch);

          const response = await axios.post(CONFIRM_MATCH, confirmMatch)
          console.log("Response:", response.data);
          let { data, status } = response.data;
          if (status == 200) {
            // refresh page 
            setTimeout(async () => {
              window.location.reload()
            }, 500)

          } else {
            console.log("else part");
            setIsLoading(false);
            setIsModalVisible(false);
            setNotificationMessage(`Something went wrong. Try again latter !!`)
            setNotificationModelVisible2(true)
          }

        } else {
          let message = (chainResponse.message == null || chainResponse.message === undefined) ?
            'Smart contract verification failed. Try again latter !!' : `${chainResponse.message}. Try again latter!!`
          setIsLoading(false);
          setIsModalVisible(false);
          setNotificationMessage(message)
          setNotificationModelVisible2(true)
        }
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Find Match rquest failed. Try Later');
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  }

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
          console.log("jwt:", decoded.sub);
          setLoginUserId(decoded.sub);

          let URL = `${GET_REQUEST_DETAILS_API}requestId=${requestId}&userId=${patientId}`

          const response = await axios.get(URL);
          const { data } = response.data
          const { requestDetails, requestStage, iotResponse } = data;

          console.log("request:", requestDetails);
          setBloodGroup(requestDetails.bloodGroup);
          bloodGroup2 = requestDetails.bloodGroup;
          organRequired2 = requestDetails.organRequired;

          setOrganRequest(requestDetails.organRequired.toUpperCase());
          setDoctorName(requestDetails.doctorName);
          setBMI(requestDetails.bmi);
          setPriority(requestDetails.priority);
          setDonorId(requestDetails.donorId);
          setCreationDate(requestDetails.createdAt);
          setDoctorId(requestDetails.doctorId);
          setDonorHospitalId(requestDetails.donorHospitalId)
          setCreatedBy(requestDetails.createdBy)
          setPatientName(requestDetails.patientName)

          let loginHospitalId = decoded.sub
          console.log("loginHospitalId:", loginHospitalId);
          console.log("donor:", requestDetails.donorHospitalId);
          if (iotResponse != null) {
            if (iotResponse.status == 200) {
              let iotData = iotResponse.data;
              setTemprature(iotData.temprature)
              setVibration(iotData.vibration)
              setOrientation(iotData.orientation)
              setIntensity(iotData.light_intensity)
              setOpencloserstate(iotData.open_close_detector)
              setHumidity(iotData.humidity)
              
              if(parseInt(iotData.temprature) < parseInt(TEMPRATURE_THRESHOLD_MIN) || parseInt(iotData.temprature) > parseInt(TEMPRATURE_THRESHOLD_MAX)) setTempratureAlert(true) 
              else setTempratureAlert(false)

              if(parseInt(iotData.vibration) < parseInt(VIBRATION_THRESHOLD_MIN) || parseInt(iotData.vibration) > parseInt(VIBRATION_THRESHOLD_MAX)) setVibrationAlert(true)
              else setVibrationAlert(false)

              if(parseInt(iotData.orientation) < parseInt(ORIENTATION_THRESHOLD_MIN) || parseInt(iotData.orientation) > parseInt(ORIENTATION_THRESHOLD_MAX)) setOrientationAlert(true)
              else setOrientationAlert(false)

              if(parseInt(iotData.light_intensity) < parseInt(INTENSITY_THRESHOLD_MIN) || parseInt(iotData.light_intensity) > parseInt(ORIENTATION_THRESHOLD_MAX)) setIntensityAlert(true)
              else setIntensityAlert(false)

              if(parseInt(iotData.humidity) < parseInt(HUMIDITY_THRESHOLD_MIN) || parseInt(iotData.humidity) > parseInt(HUMIDITY_THRESHOLD_MAX)) setHumidityAlert(true)
              else setHumidityAlert(false)

              setOpencloserstate(iotData.open_close_detector)
            }
          }

          const tableActionBtns = requestStage.map((item) => {
            let actionBtn = null;

            // find match stage 
            if (item.id === 2 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.createdBy)) {
              actionBtn = <Button type="primary" onClick={() => handleFindMatch({
                item,
                createdBy: requestDetails.createdBy
              })} >FIND MATCH</Button>;
            } else if (item.id === 2 && item.currentStatus === "Done") {
              actionBtn = <Button type="primary" disabled>VIEW MATCH</Button>;
            } else if (item.id === 2 && item.currentStatus === "Pending") {
              actionBtn = <Button type="primary" disabled>VIEW MATCH</Button>;
            }

            // Doctor apporoval stage
            if (item.id === 3 && requestStage[1].currentStatus === "Done" && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.createdBy)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }}
                onClick={() => takeDoctorApproval({ createdBy: requestDetails.createdBy, requestDetails })}>SEND</Button>;
            } else if (item.id === 3 && (loginHospitalId === requestDetails.createdBy)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>SEND</Button>;
            }

            //patient consent stage
            if (item.id === 4 && requestStage[2].currentStatus === "Done" && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.createdBy)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }}
                onClick={() => takePatientConsent({ createdBy: requestDetails.createdBy, requestDetails })}>SEND</Button>;
            } else if (item.id === 4 && (loginHospitalId === requestDetails.createdBy)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>SEND</Button>;
            }

            //donor inform stage
            if (item.id === 5 && requestStage[3].currentStatus === "Done" && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.createdBy)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }}
                onClick={() => infromDonor({ createdBy: requestDetails.createdBy, requestDetails })}>SEND</Button>;
            } else if (item.id === 5 && (loginHospitalId === requestDetails.createdBy)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>SEND</Button>;
            }

            // Organ removed
            if (item.id === 6 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.donorHospitalId)) {
              if (requestStage[4].currentStatus === "Informed") {
                console.log("request details ssss:", requestDetails);
                actionBtn =
                  <Link to={`/hospital/organ/update/${JSON.stringify(requestDetails)}/${requestId}/${patientId}`}>
                    <Button type="primary" style={{ width: "100px" }}>UPDATE</Button>
                  </Link>
              } else {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>UPDATE</Button>
              }
            } else if (item.id === 6 && item.currentStatus === "Pending" && (loginHospitalId !== requestDetails.donorHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>VIEW</Button>
            } else if (item.id === 6 && item.currentStatus === "Done") {
              actionBtn =
                <Link to={`/hospital/organ/detail/${requestId}/${patientId}`}>
                  <Button type="primary" style={{ width: "100px" }} >VIEW</Button>
                </Link>
            }

            // Organ transported
            if (item.id === 7 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.donorHospitalId)) {
              if (requestStage[5].currentStatus === "Done") {
                actionBtn =
                  <Link to={`/hospital/organ/transport/${requestId}/${patientId}`}>
                    <Button type="primary" style={{ width: "100px" }}>UPDATE</Button>
                  </Link>
              } else {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>UPDATE</Button>
              }
            } else if (item.id === 7 && item.currentStatus === "Pending" && (loginHospitalId !== requestDetails.donorHospitalId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>VIEW</Button>;
            } else if (item.id === 7 && item.currentStatus === "Done") {
              actionBtn =
                <Link to={`/hospital/organ/transport/detail/${requestId}/${patientId}`}>
                  <Button type="primary" style={{ width: "100px" }} >VIEW</Button>
                </Link>
            }

            // organ received
            if (item.id === 8 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.createdBy)) {
              if (requestStage[5].currentStatus === "Done" && requestStage[6].currentStatus === "Done") {
                actionBtn =
                  <Link to={`/hospital/organ/received/${requestId}/${patientId}`}>
                    <Button type="primary" style={{ width: "100px" }}>UPDATE</Button>
                  </Link>
              } else {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled >UPDATE</Button>
              }
            } else if (item.id === 8 && item.currentStatus === "Pending" && (loginHospitalId !== requestDetails.createdBy)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>VIEW</Button>;
            } else if (item.id === 8 && item.currentStatus === "Done") {
              actionBtn =
                <Link to={`/hospital/organ/received/detail/${requestId}/${patientId}`}>
                  <Button type="primary" style={{ width: "100px" }} >VIEW</Button>
                </Link>
            }

            // Organ transplant
            if (item.id === 9 && item.currentStatus === "Pending" && (loginHospitalId === requestDetails.createdBy)) {
              if (requestStage[6].currentStatus === "Done" && requestStage[7].currentStatus === "Done") {
                actionBtn =
                  <Link to={`/hospital/organ/transplant/${requestId}/${patientId}`}>
                    <Button type="primary" style={{ width: "100px" }}>UPDATE</Button>
                  </Link>
              } else {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled >UPDATE</Button>
              }
            } else if (item.id === 9 && item.currentStatus === "Pending" && (loginHospitalId !== requestDetails.createdBy)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>VIEW</Button>;
            } else if (item.id === 9 && item.currentStatus === "Done") {
              actionBtn =
                <Link to={`/hospital/organ/transplant/detail/${requestId}/${patientId}`}>
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

      let findMatchData = {
        requestId: requestId,
        patientId: patientId,
        bloodGroup: bloodGroup2,
        organRequest: organRequired2,
        createdBy: createdBy,
        createdDate: new Date().toISOString()
      }
      console.log("data:", findMatchData);

      try {
        const response = await axios.post(FIND_MATCH_API, findMatchData)
        console.log("Response:", response.data);
        let { data, status } = response.data;

        if (status == 400) {
          setIsLoading(false);
          setIsModalVisible(false);
          setNotificationMessage(`${data.message == null ? "Match not found" : data.message}. Try again latter !!`)
          setNotificationModelVisible2(true)
        } else {
          setCurrentStageId(1)
          setIsLoading(false);
          setIsModalVisible(false);
          setDonorId(data.result.donor)
          setResult(data.result);
          donorDetails = data.result
          setNotificationMessage(`Match Found with donor. Name: ${data.result.donorName}`)
          setNotificationModelVisible(true)
        }
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  }

  const takeDoctorApproval = ({ createdBy, requestDetails }) => {

    console.log("createdBy:", createdBy);
    setShowMessage("Making request for approval:")
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let takeApprovalReq = {
        requestId: requestId,
        patientId: patientId,
        bloodGroup: requestDetails.bloodGroup,
        organRequest: requestDetails.organRequired,
        createdBy: createdBy,
        doctorId: requestDetails.doctorId,
        createdDate: new Date().toISOString()
      }

      console.log("takeApprovalReq:", takeApprovalReq);
      try {
        const response = await axios.post(TAKE_DOCTOR_APPROVAL_API, takeApprovalReq)
        console.log("Response:", response.data);
        let { status, data } = response.data;
        if (status == 200) {
          setIsLoading(false)
          setIsModalVisible(false)
          message.success('Requested for approval');
          setTimeout(async () => {
            window.location.reload()
          }, 500)
          // refresh 
        } else {
          message.error('Request Failed. Try Later');
          setIsLoading(false);
          setIsModalVisible(false);
        }
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  }

  const takePatientConsent = ({ createdBy, requestDetails }) => {
    setShowMessage("Making request for patient consent")
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let takeApprovalReq = {
        requestId: requestId,
        patientId: patientId,
        bloodGroup: requestDetails.bloodGroup,
        organRequest: requestDetails.organRequired,
        createdBy: createdBy,
        doctorId: requestDetails.doctorId,
        createdDate: new Date().toISOString()
      }

      try {
        const response = await axios.post(TAKE_PATIENT_CONSENT_API, takeApprovalReq)
        console.log("Response:", response.data);
        let { status, data } = response.data;
        if (status == 200) {
          setIsLoading(false)
          setIsModalVisible(false)
          message.success('Requested for approval');
          setTimeout(async () => {
            window.location.reload()
          }, 500)
          // refresh 
        } else {
          message.error('Request Failed. Try Later');
          setIsLoading(false);
          setIsModalVisible(false);
        }
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  }

  const infromDonor = ({ createdBy, requestDetails }) => {
    setShowMessage("Informing Donor")
    setIsModalVisible(true);
    setIsLoading(true);
    setTimeout(async () => {

      let informDonorObj = {
        requestId: requestId,
        patientId: patientId,
        createdBy: createdBy,
        doctorId: requestDetails.doctorId,
        donorId: requestDetails.donorId,
        createdDate: new Date()
      }

      console.log("INform donor:", informDonorObj);
      try {
        const response = await axios.post(INFORM_DONOR_API, informDonorObj)
        console.log("Response:", response.data);
        let { status, data } = response.data;
        if (status == 200) {
          setIsLoading(false)
          setIsModalVisible(false)
          message.success('Requested for approval');
          setTimeout(async () => {
            window.location.reload()
          }, 500)
          // refresh 
        } else {
          message.error('Request Failed. Try Later');
          setIsLoading(false);
          setIsModalVisible(false);
        }
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

  const handleOk = () => {
    setDonorId(null);
    setNotificationModelVisible2(false)
  };

  const modalFooter = (
    <div>
      <Button key="submit" type="primary" onClick={verifyBlockchain}>
        Verify Blockchain
      </Button>
    </div>
  );

  const modalFooter2 = (
    <div>
      <Button key="submit" type="primary" onClick={handleOk}>
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
                  <Form.Item label="Patient Name">
                    <Input value={patientName} disabled style={inputBoxStyle} />
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
                    <Input value={bloodGroup} disabled style={inputBoxStyle} onChange={(e) => setBloodGroup(e.target.value)} />
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

              <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
              <h2>IOT Data</h2>

              <Row>
                <Col span={12}>
                  <Form.Item label="Temprature">
                    <Input value={temprature} disabled style={inputBoxStyle} />
                    {
                      tempratureAlert === true ?
                      <>
                        
                        <Alert message="Temperature exceeds the threshold value." type="warning" showIcon closable style={{ marginTop: '10px' }} />
                      </>  
                        : null
                    }

                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Orientation">
                    <Input value={orientation} disabled style={inputBoxStyle} />
                    {
                      orientationAlert ?
                        <Alert message="Orientation exceeds the threshold value." type="warning" showIcon closable style={{ marginTop: '10px' }} />
                        : null
                    }
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Form.Item label="Humidity">
                    <Input value={humidity} disabled style={inputBoxStyle} />
                    {
                      humidityAlert ?
                        <Alert message="Humidity exceeds the threshold value." type="warning" showIcon closable style={{ marginTop: '10px' }} />
                        : null
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Vibration">
                    <Input value={vibration} disabled style={inputBoxStyle} />
                    {
                      vibrationAlert ?
                        <Alert message="Vibration exceeds the threshold value." type="warning" showIcon closable style={{ marginTop: '10px' }} />
                        : null
                    }
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Form.Item label="Light Intensity">
                    <Input value={intensity} disabled style={inputBoxStyle} />
                    {
                      intensityAlert ?
                        <Alert message="Intensity exceeds the threshold value." type="warning" showIcon closable style={{ marginTop: '10px' }} />
                        : null
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Open Close Detector">
                    <Input value={opencloserstate} disabled style={inputBoxStyle} />
                    {
                      opencloserstateAlert == true ?
                        <Alert message="IOT Box is opened" type="warning" showIcon closable style={{ marginTop: '10px' }} />
                        : null
                    }
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
                  <p>{showMessage}...</p>
                </Spin>
              ) : null}
            </Modal>

            <Modal
              visible={notificationModelVisible}
              onOk={handelNotificationOk}
              footer={modalFooter}
            >
              <p>{notificationMessage}</p>
            </Modal>

            <Modal
              visible={notificationModelVisible2}
              onOk={handleOk}
              footer={modalFooter2}
            >
              <p>{notificationMessage}</p>
            </Modal>

          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default OrganRequestDetail;
