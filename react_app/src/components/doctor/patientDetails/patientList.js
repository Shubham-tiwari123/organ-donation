import React, { useState, useEffect } from 'react';
import '../style/doctorStyle.css'
import { Layout, Divider, Card } from 'antd';
import medicalReportLogo from '../../../images/report.png';
import { Link } from 'react-router-dom';
import DoctorSideNav from '../doctorSidenav';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { DOCTOR_CONSTANT } from '../../../constants/doctorConstants';
import axios from 'axios';
const { LOGIN_NAVIGATE_URL, GET_DONOR_LIST } = DOCTOR_CONSTANT

const { Content } = Layout;
const { Meta } = Card;

const PatientList = () => {

  const navigate = useNavigate();
  const [loginUserID, setLoginUserId] = useState(null);
  const [patientList, setPatientList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.sub) {

          setLoginUserId(decoded.sub);
          let hospitalId = localStorage.getItem('hospitalIdDoctor');
          console.log("HospitalId:", hospitalId);
          let URL = `${GET_DONOR_LIST}=${hospitalId}`

          const response = await axios.get(URL);
          const { data } = response.data
          console.log("data:", data);
          setPatientList(data.donorList);
        } else {
          navigate(LOGIN_NAVIGATE_URL);
        }

      } else {
        navigate(LOGIN_NAVIGATE_URL);
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
    objectFit: 'cover',
    height: '200px',
    border: '2px solid #e8e8e8',
    borderRadius: '0px',
    marginTop: '10px',
    borderTop: 'none',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DoctorSideNav selectedKey={'3'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>

            <h2 style={{ marginLeft: "20px" }}>DONOR LIST</h2>
            <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>

              {
                patientList.length == 0 ?
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

                    {patientList.map((value) => (
                      <Link to={`/doctor/patient/${value.id}/${value.organType}`} key={value.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card
                          key={value.id}
                          hoverable
                          style={{ ...cardStyle, width: 250 }}
                          cover={<img alt="Example" src={medicalReportLogo} style={imageStyle} />}
                        >
                          <p style={{ font: "caption" }}>Name: {value.donorName}</p>
                          <p style={{ font: "caption" }}>Organ: {value.organType.toUpperCase()}</p>
                          <p style={{ font: "caption" }}>Status: {value.status.toUpperCase()}</p>
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

export default PatientList;
