import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Divider, Card } from 'antd';
import medicalReportLogo from '../../../images/patient.png';
import { Link } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospitalConstants';
const { HOSPITAL_LOGIN_PAGE, GET_WAITING_LIST_API } = HOSPITAL_CONSTANT

const { Content } = Layout;
const { Meta } = Card;

const PatientWaitingList = () => {

  const navigate = useNavigate();
  const [requestList, setRequestList] = useState([]);
  const [loginUserID, setLoginUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Assuming the data is fetched from an API or some other source
      // Api should fetch details of the patients with priority on top

      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {

          setLoginUserId(decoded.sub);
          let URL = `${GET_WAITING_LIST_API}=${decoded.sub}`

          const response = await fetch(URL);
          const { data } = await response.json();
          const { requestList } = data;
          console.log("data2:", requestList);
          setRequestList(requestList);
        } else {
          navigate(HOSPITAL_LOGIN_PAGE);
        }

      } else {
        navigate(HOSPITAL_LOGIN_PAGE);
      }
    };

    fetchData();
  }, []);

  const cardStyle = {
    border: '2px solid #e8e8e8',
    borderRadius: '4px',
    marginLeft: "30px",
    marginTop: "15px"
  };

  const imageStyle = {
    objectFit: 'contain',
    height: '200px',
    border: '2px solid #e8e8e8',
    borderRadius: '0px',
    marginTop: '10px',
    borderTop: 'none',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HospitalSideNav selectedKey={'2'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>

            <h2 style={{ marginLeft: "20px" }}>PATIENT WAITING LIST</h2>
            <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {requestList.map((value) => (
                <Link to={`/hospital/request/${value.requestId}/${value.patientId}`} key={value.requestId} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card
                    key={value.requestId}
                    hoverable
                    style={{ ...cardStyle, width: 250 }}
                    cover={<img alt="Example" src={medicalReportLogo} style={imageStyle} />}
                  >
                    {/* <Meta title={value.patientName} description={value.priority} /> */}
                    <p style={{font: "caption" }}>Name: {value.patientName}</p>
                    <p style={{font: "caption" }}>Priority: {value.priority.toUpperCase()}</p>
                    <p style={{font: "caption" }}>RequestID: {value.requestId}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientWaitingList;
