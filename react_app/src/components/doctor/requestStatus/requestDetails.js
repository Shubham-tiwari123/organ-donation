import React, { useState, useEffect } from 'react';
import '../style/doctorStyle.css'
import { Layout, Form, Input, Button, Row, Col, Divider, Table, message, Modal, Spin } from 'antd';
import { Link, useParams } from 'react-router-dom';
import DoctorSideNav from '../doctorSidenav';
import { DOCTOR_CONSTANT } from '../../../constants/doctorConstants';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { registerDoctorApproval } from '../../../user_register_web3'

const { GET_PATIENT_ORGAN_REQUEST_DETAIL, GIVE_DOCTOR_APPROVAL, LOGIN_NAVIGATE_URL } = DOCTOR_CONSTANT
const { Content } = Layout;


const RequestDetails = ({ account, provider, contractInstance }) => {

  const navigate = useNavigate();
  const { requestId, patientId } = useParams();
  const [bloodGroup, setBloodGroup] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [organRequest, setOrganRequest] = useState('');
  const [priority, setPriority] = useState('');
  const [donorId, setDonorId] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [bmi, setBMI] = useState('');
  const [organId, setOrganId] = useState(null);
  const [tableDetails, setTableDetails] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loginUser, setLoginUser] = useState(localStorage.getItem('loginUserId'));
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState("")


  const inputBoxStyle = {
    fontSize: "16px",
    color: "black"
  }

  const giveApproval = ({ approvalStatus }) => {
    setShowMessage("Making request for giving approval")
    console.log("ApprovalStatus:", approvalStatus);
    setIsLoading(true);
    setTimeout(async () => {

      let data = {
        requestId: requestId,
        approvalStatus: approvalStatus,
        patientId: patientId,
        organRequest: organRequest,
        createdBy: loginUser,
        donorId: donorId,
        createdDate: new Date()
      }

      try {
        // make web3 call 
        // function:  registerDoctorApproval()
        const chainResponse = await registerDoctorApproval(approvalStatus, requestId, contractInstance)
        console.log("chainResponse:", chainResponse);
        if (chainResponse.error) {
          message.error('Something went wrong. Try Latter...');
        } else {
          const response = await axios.post(GIVE_DOCTOR_APPROVAL, data)
          console.log("Response:", response);
          message.success("Status saved")
          if (approvalStatus) {
            tableDetails[2].currentStatus = "Done"
          } else {
            tableDetails[2].currentStatus = "Rejected"
          }
          tableDetails[2].actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>Approve</Button>;
          setTableDetails(tableDetails);
        }
        // setCurrentStageId(1)
      } catch (error) {
        console.error('POST request error:', error);
        message.error('Request Failed. Try Later');
      } finally {
        setIsLoading(false);
        setIsModalVisible(false);
      }

    }, 1000)
  }

  const showModal = () => setIsModalVisible(true);

  const handleOk = () => giveApproval({ approvalStatus: true })

  const handleCancel = () => giveApproval({ approvalStatus: false })

  useEffect(() => {
    const fetchData = async () => {
      // Assuming the data is fetched from an API or some other source
      // let patientId = localStorage.getItem("loginUserId");
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {
          let URL = `${GET_PATIENT_ORGAN_REQUEST_DETAIL}patientId=${patientId}&requestId=${requestId}`
          const response = await axios.get(URL);
          const { data } = response.data

          const { requestDetails, requestStage, takeDoctorApproval } = data;

          setBloodGroup(requestDetails.bloodGroup);
          setOrganRequest(requestDetails.organRequired.toUpperCase());
          setDoctorName(requestDetails.doctorName);
          setBMI(requestDetails.bmi);
          setPriority(requestDetails.priority.toUpperCase());
          setDonorId(requestDetails.donorId);
          setCreationDate(new Date(requestDetails.createdAt).toDateString());
          setDoctorId(requestDetails.doctorId);
          setOrganId(requestDetails.organId);

          const tableActionBtns = requestStage.map((item) => {
            let actionBtn = null;

            if (item.id === 3 &&  item.currentStatus === "Requested" && loginUser === requestDetails.doctorId) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} onClick={showModal} >Approve</Button>;
            } else if (item.id === 3 && (loginUser === requestDetails.doctorId)) {
              actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>Approve</Button>;
            }

            if (item.id === 6) {
              if (item.currentStatus === "Pending") {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>View</Button>
              } else {
                actionBtn =
                  <Link to={`/doctor/organ/detail/${requestId}/${loginUser}`}>
                    <Button type="primary" style={{ width: "100px" }}>View</Button>
                  </Link>
              }
            }

            if (item.id === 7) {
              if (item.currentStatus === "Pending") {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>View</Button>
              } else {
                actionBtn =
                  <Link to={`/doctor/organ/transport/detail/${requestId}/${loginUser}`}>
                    <Button type="primary" style={{ width: "100px" }}>View</Button>
                  </Link>
              }
            }

            if (item.id === 8) {
              if (item.currentStatus === "Pending") {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>View</Button>
              } else {
                actionBtn =
                  <Link to={`/doctor/organ/received/detail/${requestId}/${loginUser}`}>
                    <Button type="primary" style={{ width: "100px" }}>View</Button>
                  </Link>
              }
            }

            if (item.id === 9) {
              if (item.currentStatus === "Pending") {
                actionBtn = <Button type="primary" style={{ width: "100px" }} disabled>View</Button>
              } else {
                actionBtn =
                  <Link to={`/doctor/organ/transplant/detail/${requestId}/${loginUser}`}>
                    <Button type="primary" style={{ width: "100px" }}>View</Button>
                  </Link>
              }
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
          navigate(LOGIN_NAVIGATE_URL);
        }
      } else {
        navigate(LOGIN_NAVIGATE_URL);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { title: 'Request Stage', dataIndex: 'currentStage', key: 'currentStage', align: 'center' },
    { title: 'Current Status', dataIndex: 'currentStatus', key: 'currentStatus', align: 'center' },
    { title: 'Action', dataIndex: 'actionBtn', key: 'actionBtn', align: 'center' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DoctorSideNav selectedKey={'2'} />
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
              title="Confirmation"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Reject
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  Approve
                </Button>,
              ]}
            >
              {isLoading ? (
                <Spin tip="Loading...">
                  <p>{showMessage}...</p>
                </Spin>
              ) : <p>Are you sure you want to proceed?</p>}

            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RequestDetails;
