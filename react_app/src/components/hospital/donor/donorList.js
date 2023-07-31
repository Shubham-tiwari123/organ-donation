import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Divider, Card } from 'antd';
import medicalReportLogo from '../../../images/report.png';
import { Link } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospital/hospitalConstants';
const { HOSPITAL_LOGIN_PAGE, GET_DONORS_API } = HOSPITAL_CONSTANT

const { Content } = Layout;
const { Meta } = Card;

const DonorList = () => {
  const navigate = useNavigate();
  const [loginUserID, setLoginUserId] = useState(null);
  const [doctorList, setDoctorList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.loginId) {
          
          setLoginUserId(decoded.loginId);
          let URL = `${GET_DONORS_API}=${decoded.loginId}`

          const response = await fetch(URL);
          const { doctorList } = await response.json();
          console.log("data2:", doctorList);
          setDoctorList(doctorList);
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

            <h2 style={{ marginLeft: "20px" }}>DONOR LIST</h2>
            <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {doctorList.map((value) => (
                <Link to={`/hospital/donors/${value.id}`} key={value.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card
                    key={value.id}
                    hoverable
                    style={{ ...cardStyle, width: 250 }}
                    cover={<img alt="Example" src={medicalReportLogo} style={imageStyle} />}
                  >
                    <Meta title={value.doctorName} description={value.id} />
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

export default DonorList;
