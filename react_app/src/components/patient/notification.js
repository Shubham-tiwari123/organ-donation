import React, { useState, useEffect } from 'react';
import './style/patientStyle.css'
import { Layout, Form, Input, Row, Col, Divider, Typography, Card, Button } from 'antd';
import { useParams } from 'react-router-dom';
import SideNav from './sidenav';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { PATIENT_CONSTANT } from './../../constants/patientConstants';
import DoctorSideNav from './../doctor/doctorSidenav';
import axios from 'axios';

const { LOGIN_NAVIGATE_URL, GET_NOTIFICATION } = PATIENT_CONSTANT
const { Text } = Typography;

const { Content } = Layout;

const NotificationPage = ({ from }) => {
	const { requestId, patientId } = useParams();
	const navigate = useNavigate();

	const [loginUserID, setLoginUserId] = useState(null);
	const [notificationList, setNotificationList] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			// Assuming the data is fetched from an API or some other source
			// Pass requestId in the request to fetch data
			const jwtToken = localStorage.getItem('jwt');
			if (jwtToken) {
				const decoded = jwtDecode(jwtToken);
				if (decoded && decoded.sub) {

					setLoginUserId(decoded.sub);
					let URL = `${GET_NOTIFICATION}=${decoded.sub.toLowerCase()}`
					console.log("url:", URL);
					const response = await axios.get(URL);
					const { data } = response.data;
					const { notificationList } = data;
					console.log("notification count:", notificationList);
					setNotificationList(notificationList)

				} else {
					navigate(LOGIN_NAVIGATE_URL);
				}

			} else {
				navigate(LOGIN_NAVIGATE_URL);
			}
		};

		fetchData();
	}, []);

	const handleButtonClick = (item) => {
    // Do something with the clicked item
    console.log(item);
  };

	return (
		<Layout style={{ minHeight: '100vh' }}>
			{
				from == "doctor" ?
					<DoctorSideNav selectedKey={'2'} />
					: <SideNav selectedKey={'5'} />
			}
			<Layout style={{ height: '100vh', marginLeft: "200px", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
				<Content style={{ margin: '24px 16px 0', height: '100vh' }}>
					<div style={{ padding: 10, background: '#fff', minHeight: '350px', }}>

						<h2>NOTIFICATION PAGE</h2>
						<Divider style={{ backgroundColor: 'rgb(168 165 165 / 60%)' }} />

						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
							{notificationList.map((item, index) => (
								!item.read && (
								<Card
									key={index}
									title={`Notification ${index + 1}`}
									style={{
										width: '100%',
										marginBottom: '20px',
										borderRadius: '10px',
										border: '1px solid #e8e8e8',
										boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
									}}
								>
									<p>{item.message}</p>
									{/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button type='primary' onClick={() => handleButtonClick(item)}>READ</Button>
									</div> */}
								</Card>
								)
							))}
						</div>
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};

export default NotificationPage;
