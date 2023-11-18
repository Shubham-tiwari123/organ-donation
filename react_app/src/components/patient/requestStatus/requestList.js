import React, { useEffect, useState } from 'react';
import '../style/patientStyle.css'
import { Layout, Divider, Card } from 'antd';
import medicalReportLogo from '../../../images/report.png';
import { Link } from 'react-router-dom';
import SideNav from '../sidenav';
import { PATIENT_CONSTANT } from '../../../constants/patientConstants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const { GET_PATIENT_ORGAN_REQUEST_LIST, LOGIN_NAVIGATE_URL } = PATIENT_CONSTANT

const { Content } = Layout;
const { Meta } = Card;

const PatientRequestList = ({ loginUserID, account, provider }) => {

  const navigate = useNavigate();
  const [requestList, setRequestList] = useState([]);

  const cardStyle = {
    border: '2px solid #e8e8e8',
    borderRadius: '4px',
    marginLeft: "30px",
    marginTop: "15px"
  };

  const imageStyle = {
    objectFit: 'cover',
    height: '200px',
    border: '2px solid #e8e8e8',
    borderRadius: '0px',
    marginTop: '10px',
    borderTop: 'none',
  };

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {

          let URL = `${GET_PATIENT_ORGAN_REQUEST_LIST}=${decoded.sub}`
          console.log("URL:", URL);
          const response = await axios.get(URL)
          const { data } = response.data;
          console.log("data2:", data.requestList);
          setRequestList(data.requestList);

        } else {
          navigate(LOGIN_NAVIGATE_URL);
        }
      } else {
        navigate(LOGIN_NAVIGATE_URL);
      }
    };

    fetchData();
  }, []);


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideNav selectedKey={'2'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>

            <h2 style={{ marginLeft: "20px" }}>REQUESTS RAISED</h2>
            <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {
                requestList.length == 0 ?
                  <>
                    <Card
                      key={123}
                      hoverable
                      style={{ ...cardStyle, width: 250 }}
                    >
                      <Meta title='NO record found' />
                    </Card>
                  </>
                  :
                  <>
                    {requestList.map((card) => (
                      <Link to={`/patient/request/${card.requestId}/${card.patientId}`} key={card.requestId} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card
                          key={card.requestId}
                          hoverable
                          style={{ ...cardStyle, width: 250 }}
                          cover={<img alt="Example" src={medicalReportLogo} style={imageStyle} />}
                        >
                          <p style={{ paddingLeft: "10px", font: "caption" }}>Name: {card.patientName}</p>
                          <p style={{ paddingLeft: "10px", font: "caption" }}>Priority: {card.priority.toUpperCase()}</p>
                        </Card>
                      </Link>
                    ))}
                  </>
              }

            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientRequestList;
