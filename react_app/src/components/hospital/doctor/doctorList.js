import React, { useState, useEffect } from 'react';
import '../style.css'
import { Layout, Divider, Card } from 'antd';
import doctorProfile from '../../../images/doctor_profile.png';
import { Link } from 'react-router-dom';
import HospitalSideNav from '../sideNav'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONSTANT } from '../../../constants/hospital/hospitalConstants';
const { HOSPITAL_LOGIN_PAGE, GET_DOCTOR_LIST_API } = HOSPITAL_CONSTANT

const { Content } = Layout;
const { Meta } = Card;

const DoctorsList = () => {

  const navigate = useNavigate();
  const [doctorList, setDoctorList] = useState([]);
  const [loginUserID, setLoginUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Assuming the data is fetched from an API or some other source
      // Api should fetch details of the doctors registerd with particular hospital: pass hospital id in the request

      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        const decoded = jwtDecode(jwtToken);
        if (decoded && decoded.loginId) {
          
          setLoginUserId(decoded.loginId);
          let URL = `${GET_DOCTOR_LIST_API}=${decoded.loginId}`

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
    objectFit: 'contain',
    height: '200px',
    border: '2px solid #e8e8e8',
    borderRadius: '0px',
    marginTop: '10px',
    borderTop: 'none',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HospitalSideNav selectedKey={'3'} />
      <Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        <Content style={{ margin: '24px 16px 0', height: '100vh' }}>
          <div style={{ padding: 10, background: '#fff', minHeight: '500px', }}>

            <h2 style={{ marginLeft: "20px" }}>DOCTORS LIST</h2>
            <Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {doctorList.map((value) => (
                <Link to={`/hospital/doctors/${value.id}`} key={value.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card
                    key={value.id}
                    hoverable
                    style={{ ...cardStyle, width: 250 }}
                    cover={<img alt="Example" src={doctorProfile} style={imageStyle} />}
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

export default DoctorsList;
