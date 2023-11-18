import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Divider, Card } from 'antd';
import medicalReportLogo from '../../../images/report.png';
import { Link } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospitalConstants';
import axios from 'axios';
const { HOSPITAL_LOGIN_PAGE, GET_PATIENT_LIST_API } = HOSPITAL_CONSTANT

const { Content } = Layout;
const { Meta } = Card;

const PatientListHospital = () => {
  const navigate = useNavigate();
  const [loginUserID, setLoginUserId] = useState(null);
  const [doctorList, setDoctorList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        console.log("decoded:",decoded);
        if (decoded && decoded.sub) {
          
          setLoginUserId(decoded.sub);
          let URL = `${GET_PATIENT_LIST_API}=${decoded.sub}`
          console.log("URL:",URL);
          const response = await axios.get(URL);
          const { data } = response.data;
          const { donorList } = data;
          console.log("data2:", data);
          setDoctorList(donorList);
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
    objectFit: 'cover',
    height: '200px',
    border: '2px solid #e8e8e8',
    borderRadius: '0px',
    marginTop: '10px',
    borderTop: 'none',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HospitalSideNav selectedKey={'1'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>

            <h2 style={{ marginLeft: "20px" }}>PATIENT LIST</h2>
            <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {doctorList.map((value) => (
                <Link to={`/hospital/patient/${value.id}`} key={value.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card
                    key={value.id}
                    hoverable
                    style={{ ...cardStyle, width: 250 }}
                    cover={<img alt="Example" src={medicalReportLogo} style={imageStyle} />}
                  >
                    {/* <Meta title="Id" description={value.id} />
                    <Meta title="Name" description={value.donorName} />
                    <Meta title="Organ" description={value.organType} /> */}
                    <p style={{font: "caption" }}>Name: {value.donorName}</p>
                    <p style={{font: "caption" }}>Type: {value.patientType.toUpperCase()}</p>
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

export default PatientListHospital;
