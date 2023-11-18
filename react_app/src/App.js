import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import PatientHomePage from './components/patient/homePage/patientHome';
import MedicalDetails from './components/patient/medicalStatus/medicalDetails';
import PatientRequestList from './components/patient/requestStatus/requestList';
import PatientOrganRequestDetail from './components/patient/requestStatus/requestDetail';
import OrganReceivedPatient from './components/patient/organDetails/organReceived';
import OrganRemovedPatient from './components/patient/organDetails/organRemoved';
import OrganTransplantPatient from './components/patient/organDetails/organTransplant';
import OrganTransportPatient from './components/patient/organDetails/organTransport';

import NewOrganRequest from './components/hospital/patient/newOrganRequest';
import DoctorsList from './components/hospital/doctor/doctorList';
import DoctorProfileView from './components/hospital/doctor/doctorProfileView';
import PatientListHospital from './components/hospital/patient/patientList';
import PatientDetails from './components/hospital/patient/patientDetails';
import PatientWaitingList from './components/hospital/patient/waitingList';
import OrganRequestDetail from './components/hospital/patient/organRequestDetail';
import FillMedicalForm from './components/hospital/patient/fillMedicalForm';
import OrganRemovedForm from './components/hospital/organDetailsForm/organRemovedForm';
import OrganTransportForm from './components/hospital/organDetailsForm/organTransportForm';
import OrganReceivedForm from './components/hospital/organDetailsForm/organReceivedForm';
import OrganTransplantForm from './components/hospital/organDetailsForm/organTransplantForm';
import OrganRemovedFormView from './components/hospital/organDetailsFormView/organRemovedFormView';
import OrganTransportFormView from './components/hospital/organDetailsFormView/organTransportFormView';
import OrganTransplantFormView from './components/hospital/organDetailsFormView/organTransplantFormView';
import OrganReceivedFormView from './components/hospital/organDetailsFormView/organReceivedFormView';

import DoctorHomePage from './components/doctor/homePage/doctorHome';
import PatientList from './components/doctor/patientDetails/patientList';
import PatientDetailPage from './components/doctor/patientDetails/patientDetails';
import OrganRequestList from './components/doctor/requestStatus/requestList';
import RequestDetails from './components/doctor/requestStatus/requestDetails';

import RegisterHospital from './components/register_hospital';
import CommonLogin from './components/loginPage';
import CommonRegister from './components/registerPage';

import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import detectEthereumProvider from '@metamask/detect-provider';
import {initalizeContractsMetamask} from './user_register_web3'
import AdminPanel from './components/admin';
import NotificationPage from './components/patient/notification';
import SetIOTBOX from './components/hospital/organDetailsForm/setIOTBox';

const checkJwtToken = () => {
  const token = localStorage.getItem('jwt');
  if (token) {
    return true;
  }
  return false; // Convert to boolean
};

const getLoginIdFromJWT = () => {
  let token = jwtDecode(localStorage.getItem('jwt')).sub
  localStorage.setItem('loginUserId', token);
  return jwtDecode(localStorage.getItem('jwt')).sub;
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(checkJwtToken());
  const [loginUserID, setLoginUserId] = useState(checkJwtToken());
  const [accounts, setAccounts] = useState([]);
  const [provider, setProvider] = useState(null);
  const [userRegistryInstance, setUserRegistryInstance] = useState(null)
  const [organDonationInstance, setOrganDonationInstance] = useState(null)
  const [IOTDataInstance, setIOTDataInstance] = useState(null)

  useEffect(() => {
    const fetchMetamaskAddress = async () => {
      const provider = await detectEthereumProvider();
      try {
        if (provider) {
          console.log("Metamask found");
          // const accounts = await provider.request({ method: 'eth_requestAccounts' });
          // console.log("accounts:", accounts);
          const {accounts, userRegistryInstance, organDonationInstance, IOTDataInstance } = await initalizeContractsMetamask(provider)
          console.log("Accounts:",accounts);
          setUserRegistryInstance(userRegistryInstance);
          setOrganDonationInstance(organDonationInstance);
          setIOTDataInstance(IOTDataInstance);
          setAccounts(accounts);
          setProvider(provider)
          let jwtStatus = setIsLoggedIn(checkJwtToken());
          if (jwtStatus) {
            setLoginUserId(getLoginIdFromJWT())
          }
        } else {
          message.error({ content: "Metamask not found. Install metamask!!", duration: 3 })
        }
      } catch (error) {
        console.log("Error:", error);
        if (error.code === 4001) {
          message.error({ content: "Connect with metamask first!!", duration: 2 })
        }
      }

    }
    fetchMetamaskAddress();
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/admin/panel' element={<AdminPanel  account={accounts[0]} userRegisterInstance={userRegistryInstance} 
        organDonationInstance={organDonationInstance} iotInstance={IOTDataInstance} provider/>}/>
        <Route path='/admin/register/hospital' element={<RegisterHospital account={accounts[0]} contractInstance={userRegistryInstance} provider/>} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<CommonLogin account={accounts[0]} provider={provider}/>}/>
        <Route path='/register' element={<CommonRegister account={accounts[0]} provider={provider}/>}/>

        {/* Doctor Routes */}
        <Route path='/doctor/home' element={<DoctorHomePage account={accounts[0]} provider={provider}/>} />
        <Route path='/doctor/patient/list' element={<PatientList account={accounts[0]} provider={provider}/>}/>
        <Route path="/doctor/patient/:patientId/:organType" element={<PatientDetailPage  account={accounts[0]} provider={provider} />}/>
        <Route path="/doctor/request/status" element={<OrganRequestList account={accounts[0]} provider={provider}/>}/>
        <Route path="/doctor/request/:requestId/:patientId" element={<RequestDetails account={accounts[0]} provider={provider} contractInstance={organDonationInstance}/>}/>
        <Route path="/doctor/organ/detail/:requestId/:patientId" element={<OrganRemovedPatient  from={"doctor"} account={accounts[0]} provider={provider}/>}/>
        <Route path="/doctor/organ/transport/detail/:requestId/:patientId" element={<OrganTransportPatient  from={"doctor"} account={accounts[0]} provider={provider}/>}/>
        <Route path="/doctor/organ/received/detail/:requestId/:patientId" element={<OrganReceivedPatient  from={"doctor"} account={accounts[0]} provider={provider}/>}/>
        <Route path="/doctor/organ/transplant/detail/:requestId/:patientId" element={<OrganTransplantPatient  from={"doctor"} account={accounts[0]} provider={provider}/>}/>

        {/* Patient Route */}
        <Route path="/patient/home" element={<PatientHomePage account={accounts[0]} provider={provider}/>} />
        <Route path="/patient/medical/details" element={<MedicalDetails  account={accounts[0]} provider={provider}/>}/>
        <Route path="/patient/request/status" element={<PatientRequestList  account={accounts[0]} provider={provider} />} />
        <Route path="/patient/request/:requestId/:patientId" element={<PatientOrganRequestDetail  account={accounts[0]} provider={provider} contractInstance={organDonationInstance}/>} />
        <Route path="/patient/organ/detail/:requestId/:patientId" element={<OrganRemovedPatient  account={accounts[0]} provider={provider}/>} />
        <Route path="/patient/organ/transport/detail/:requestId/:patientId" element={ <OrganTransportPatient  account={accounts[0]} provider={provider}/>} />
        <Route path="/patient/organ/received/detail/:requestId/:patientId" element={<OrganReceivedPatient  account={accounts[0]} provider={provider}/>} />
        <Route path="/patient/organ/transplant/detail/:requestId/:patientId" element={<OrganTransplantPatient  account={accounts[0]} provider={provider}/>} />
        <Route path='/patient/notification' element={<NotificationPage />} />

        {/* Hospital Route */}
        <Route path="/hospital/create/medicalrecord" element={<FillMedicalForm account={accounts[0]} provider={provider} contractInstance={userRegistryInstance}/>} />
        <Route path="/hospital/create/organ-request" element={<NewOrganRequest account={accounts[0]} provider={provider} contractInstance={organDonationInstance} />} />
        <Route path="/hospital/patient" element={<PatientListHospital account={accounts[0]} provider={provider}/>} />
        <Route path="/hospital/doctors" element={<DoctorsList account={accounts[0]} provider={provider}/>} />
        {/* <Route path='/hospital/iotbox' element= {<SetIOTBOX/>} /> */}
        <Route path="/hospital/request/status" element={<PatientWaitingList account={accounts[0]} provider={provider}/>} />
        <Route path="/hospital/doctors/:doctorId" element={<DoctorProfileView account={accounts[0]} provider={provider}/>} />
        <Route path="/hospital/patient/:id" element={<PatientDetails account={accounts[0]} provider={provider} contractInstance={userRegistryInstance}/>} />
        <Route path="/hospital/request/:requestId/:patientId" element={<OrganRequestDetail account={accounts[0]} provider={provider} contractInstance={organDonationInstance}/>} />

        {/* Hospital organ-details form route */}
        <Route path="/hospital/organ/update/:requestDetails/:requestId/:patientId" element={<OrganRemovedForm account={accounts[0]} provider={provider} contractInstance={organDonationInstance}/>} />
        <Route path="/hospital/organ/transport/:requestId/:patientId" element={<OrganTransportForm account={accounts[0]} provider={provider} contractInstance={organDonationInstance}/>} />
        <Route path="/hospital/organ/received/:requestId/:patientId" element={<OrganReceivedForm account={accounts[0]} provider={provider} contractInstance={organDonationInstance}/>} />
        <Route path="/hospital/organ/transplant/:requestId/:patientId" element={<OrganTransplantForm account={accounts[0]} provider={provider} contractInstance={organDonationInstance}/>} />

        {/* Hospital organ-details form view route */}
        <Route path="/hospital/organ/detail/:requestId/:patientId" element={<OrganRemovedFormView account={accounts[0]} provider={provider}/>} />
        <Route path="/hospital/organ/transport/detail/:requestId/:patientId" element={<OrganTransportFormView account={accounts[0]} provider={provider}/>} />
        <Route path="/hospital/organ/transplant/detail/:requestId/:patientId" element={<OrganTransplantFormView account={accounts[0]} provider={provider}/>} />
        <Route path="/hospital/organ/received/detail/:requestId/:patientId" element={<OrganReceivedFormView account={accounts[0]} provider={provider}/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
