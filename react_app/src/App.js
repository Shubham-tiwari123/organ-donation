import './App.css';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Routes for hospital
import LoginHospitalForm from './components/hospital/login/loginHospital';
import RaiseNewRequest from './components/hospital/patient/raiseNewRequest';
import DoctorsList from './components/hospital/doctor/doctorList';
import DoctorProfileView from './components/hospital/doctor/doctorProfileView';
import DonorList from './components/hospital/donor/donorList';
import DonorDetails from './components/hospital/donor/donorDetail';
import PatientWaitingList from './components/hospital/patient/patientWaitingList';
import PatientRequestDetail from './components/hospital/patient/patientRequestDetail';
import RegisterDonor from './components/hospital/donor/registerDonor';

// Routes for organ details 
import OrganRemovedForm from './components/hospital/organDetailsForm/organRemovedForm';
import OrganTransportForm from './components/hospital/organDetailsForm/organTransportForm';
import OrganReceivedForm from './components/hospital/organDetailsForm/organReceivedForm';
import OrganTransplantForm from './components/hospital/organDetailsForm/organTransplantForm';

import OrganRemovedFormView from './components/hospital/organDetailsFormView/organRemovedFormView';
import OrganTransportFormView from './components/hospital/organDetailsFormView/organTransportFormView';
import OrganTransplantFormView from './components/hospital/organDetailsFormView/organTransplantFormView';
import OrganReceivedFormView from './components/hospital/organDetailsFormView/organReceivedFormView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hospital/login" Component={LoginHospitalForm} />
        <Route path="/hospital/create/medicalrecord" Component={RegisterDonor} />
        <Route path="/hospital/create/request" Component={RaiseNewRequest} />
        <Route path="/hospital/donors" Component={DonorList} />
        <Route path="/hospital/doctors" Component={DoctorsList} />
        <Route path="/hospital/request/status" Component={PatientWaitingList} />

        <Route path="/hospital/doctors/:doctorId" Component={DoctorProfileView} />
        <Route path="/hospital/donors/:id" Component={DonorDetails} />
        <Route path="/hospital/request/:requestId/:patientId" Component={PatientRequestDetail} />

        {/* Hospital organ-details form route */}
        <Route path="/hospital/organ/update/:doctorId/:doctorName/:bloodGroup/:organRequest/:donorId/:patientId/:requestId" Component={OrganRemovedForm} />
        <Route path="/hospital/organ/transport/:requestId" Component={OrganTransportForm} />
        <Route path="/hospital/organ/received/:requestId" Component={OrganReceivedForm} />
        <Route path="/hospital/organ/transplant/:requestId" Component={OrganTransplantForm} />

         {/* Hospital organ-details form view route */}
         <Route path="/hospital/organ/detail/:requestId/:patientId" Component={OrganRemovedFormView} />
         <Route path="/hospital/organ/transport/detail/:requestId/:patientId" Component={OrganTransportFormView} />
         <Route path="/hospital/organ/transplant/detail/:requestId/:patientId" Component={OrganTransplantFormView} />
         <Route path="/hospital/organ/received/detail/:requestId/:patientId" Component={OrganReceivedFormView} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
