// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IUserRegistry.sol";

contract OrganDonation {
    address owner;
    IUserRegistry userRegistry;

    // Constructor initializes contract deployer as owner of this smart contract
    constructor(address userRegistryAddress) {
        owner = msg.sender;
        userRegistry = IUserRegistry(userRegistryAddress);
        organRequests.push();
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // This modifier allows onlyRegistered Hospitals to access specific functionalities
    modifier onlyHospital() {
        require(
            userRegistry.isHospitalRegistered(msg.sender),
            "Only registered hospitals can call this function"
        );
        _;
    }

    uint requestCount = 0;

    // Enum to maintain status of organ request
    enum Status {
        PENDING, //0
        MATCHED, //1
        DONOR_REJECTED, //2
        DONOR_PROCEDURE_INPROGRESS, //3
        DONOR_PROCEDURE_COMPLETE, //4
        DONOR_ORGAN_SHIPPED, //5
        ORGAN_RECEIVED, //6
        PATIENT_PROCEDURE_INPROGRESS, // 7
        COMPLETED //7
    }

    // User defined Organ Request Data type to keep track of organ request related activities
    struct OrganRequest {
        uint256 requestID;
        IUserRegistry.OrganType organType;
        address donor;
        address patient;
        address donorSurgeon;
        address patientSurgeon;
        bool doctorApproval;
        bool patientConsent;
        uint patientConsentDate;
        uint donorConsentDate;
        uint requestRegistrationDate;
        IUserRegistry.UrgencyType urgencyLevel;
        Status status;
    }
    // This data structure allows to lookup to historic data of patient-donor organ match validation summary
    struct organMatchSummary {
        uint BMIDifference;
        bool bloodGroupMatch;
        bool organMatch;
        IUserRegistry.UrgencyType urgencyLevel;
        uint compatibilityScore;
    }

    // Maintaining this array to store overall requests.
    OrganRequest[] organRequests;

    // This mapping maps patients organ request to it`s donors organ match summary
    mapping(uint => organMatchSummary) public matchSummary;

    // This are set of events that will be emitted
    event OrganRequestRegistered(address indexed _patient, uint256 requestID);
    event doctorsApproval(
        bool consent,
        address indexed donor,
        uint256 indexed requestId
    );
    event patientConsent(
        bool consent,
        address indexed patient,
        uint256 indexed requestId
    );
    event matchStatus(uint requestID, string message);

    // This functionality allows patients surgeon only to approve the match organ.
    function registerDoctorApproval(bool consent, uint256 requestID) external {
        require(
            organRequests[requestID].status == Status.MATCHED,
            "invalid consent request"
        );
        require(
            msg.sender == organRequests[requestID].patientSurgeon,
            "invalid donor"
        );
        organRequests[requestID].doctorApproval = true;
        emit doctorsApproval(consent, msg.sender, requestID);
    }

    // This function allows patient to give their consent, and prove their acceptance of organ that is matched with donor.
    // Incase, if patient does not wants to accept the organ from the donor, matched patient can pass thier consent as false.
    // So, that particular organ request is registered in thier refusal list.
    function registerPatientConsent(bool consent, uint256 requestID) external {
        require(
            organRequests[requestID].status == Status.MATCHED,
            "invalid consent request"
        );
        require(
            msg.sender == organRequests[requestID].patient,
            "invalid patient"
        );
        if (consent == true) {
            organRequests[requestID].patientConsentDate = block.timestamp;
            organRequests[requestID].patientConsent = consent;
        } else if (consent == false) {
            userRegistry.addRefusal(msg.sender, requestID);
            organRequests[requestID].status = Status.DONOR_REJECTED;
        }
        emit patientConsent(consent, msg.sender, requestID);
    }

    // This function is invoked from patients hospital, to raise request for organ required by the patient
    // This function takes input of patients organ required and his/her urgencylevel
    // This function will accumlate required details for organ required by patient and will give out requestId.
    // The requestId will be further used every where as reference to complete following procedures.
    function registerOrganRequest(
        address _patient,
        IUserRegistry.UrgencyType _urgencyLevel,
        IUserRegistry.OrganType _organType,
        address _patientSurgeon
    ) external onlyHospital returns (uint256) {
        require(_patient != address(0), "Invalid donor or patient address");
        IUserRegistry.User memory patientDetails = userRegistry.getUser(
            _patient
        );
        require(
            patientDetails.userType == IUserRegistry.UserRole.Patient,
            "invalid patient"
        );

        requestCount++;
        organRequests.push(
            OrganRequest(
                requestCount,
                _organType,
                address(0), //donor address is 0 initially in organ request
                _patient,
                address(0), // donor surgeon is also 0 address initially in organ request
                _patientSurgeon,
                false, // donor consent set to false initially
                false, //patient consent is set false initially
                0, // consent date for patient is initially zero
                0, // consent date for donor is initially zero
                block.timestamp, // request registration date
                _urgencyLevel,
                Status.PENDING
            )
        );

        emit OrganRequestRegistered(_patient, requestCount);
        return requestCount;
    }

    // This function designed to implement blood group compatibility validation
    // If the donor`s blood group matches patients blood group this function returns a boolean value
    function isBloodGroupMatch(
        address _donor,
        address _patient
    ) internal view returns (bool) {
        IUserRegistry.User memory donorDetails = userRegistry.getUser(_donor);
        IUserRegistry.User memory patientDetails = userRegistry.getUser(
            _patient
        );
        if (
            (donorDetails.bloodGroup == IUserRegistry.Bloodtype.A_positive ||
                donorDetails.bloodGroup ==
                IUserRegistry.Bloodtype.A_negative) &&
            (patientDetails.bloodGroup == IUserRegistry.Bloodtype.A_positive ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.A_negative ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.AB_positive ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.AB_negative)
        ) {
            return true;
        } else if (
            (donorDetails.bloodGroup == IUserRegistry.Bloodtype.B_positive ||
                donorDetails.bloodGroup ==
                IUserRegistry.Bloodtype.B_negative) &&
            (patientDetails.bloodGroup == IUserRegistry.Bloodtype.B_positive ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.B_negative ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.AB_positive ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.AB_negative)
        ) {
            return true;
        } else if (
            (donorDetails.bloodGroup == IUserRegistry.Bloodtype.AB_positive ||
                donorDetails.bloodGroup ==
                IUserRegistry.Bloodtype.AB_negative) &&
            (patientDetails.bloodGroup == IUserRegistry.Bloodtype.AB_positive ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.AB_negative)
        ) {
            return true;
        } else if (
            (donorDetails.bloodGroup == IUserRegistry.Bloodtype.O_positive ||
                donorDetails.bloodGroup ==
                IUserRegistry.Bloodtype.O_negative) &&
            (patientDetails.bloodGroup == IUserRegistry.Bloodtype.A_positive ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.A_negative ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.B_positive ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.B_negative ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.AB_positive ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.AB_negative ||
                patientDetails.bloodGroup ==
                IUserRegistry.Bloodtype.O_positive ||
                patientDetails.bloodGroup == IUserRegistry.Bloodtype.O_negative)
        ) {
            return true;
        } else {
            return false;
        }
    }

    // This function checks and validates all the parameters of patient and donor, and calculate a score
    // This score is stored in organMatchSummary data structure declared above, so patients doctor and patient can take a sound decesion of giving thier consent accordingly.
    function calculateCompatibilityScore(
        address _patient,
        address _donor,
        uint requestId
    ) internal view returns (organMatchSummary memory) {
        organMatchSummary memory summary;

        IUserRegistry.User memory donorDetails = userRegistry.getUser(_donor);
        IUserRegistry.User memory patientDetails = userRegistry.getUser(
            _patient
        );

        uint _compatibilityScore = 0;

        uint256 donorBMI = donorDetails.BMI;
        uint256 patientBMI = patientDetails.BMI;
        uint256 BMIDifference = patientBMI > donorBMI
            ? patientBMI - donorBMI
            : donorBMI - patientBMI;
        IUserRegistry.UrgencyType patientUrgency = organRequests[requestId]
            .urgencyLevel;
        uint requestRegistrationDate = organRequests[requestId]
            .requestRegistrationDate;

        if (BMIDifference <= 1) {
            _compatibilityScore += 3;
            summary.BMIDifference = 3;
        } else if (BMIDifference <= 3) {
            _compatibilityScore += 2;
            summary.BMIDifference = 2;
        } else if (BMIDifference <= 5) {
            _compatibilityScore += 1;
            summary.BMIDifference = 1;
        }

        summary.urgencyLevel = patientUrgency;

        if (patientUrgency == IUserRegistry.UrgencyType.High) {
            _compatibilityScore += 3;
        } else if (patientUrgency == IUserRegistry.UrgencyType.Medium) {
            _compatibilityScore += 2;
        } else if (patientUrgency == IUserRegistry.UrgencyType.Low) {
            _compatibilityScore += 1;
        }

        uint256 waitingTime = block.timestamp - requestRegistrationDate;
        uint256 waitingDays = waitingTime / (1 days);

        if (waitingDays >= 0 && waitingDays <= 30) {
            _compatibilityScore += 1;
        } else if (waitingDays > 30 && waitingDays <= 90) {
            _compatibilityScore += 2;
        } else if (waitingDays > 90 && waitingDays <= 180) {
            _compatibilityScore += 3;
        }
        summary.compatibilityScore = _compatibilityScore;
        return summary;
    }

    // As finding patient-donor mathch is crucial and important aspect of this application, it is computaion intensive
    // So, we have implemented it in hybrid fashion, finding out suitable donor, is delegated to backend system
    // But the suitable donor selected by system will be required to be validated on smart contract.
    // Therefore this function takes care of validating the donor match found by our backend system.
    function validateOrganMatch(
        uint256 _compatibilityScore,
        address _donor,
        uint256 requestId
    ) external returns (bool) {
        address _patient = organRequests[requestId].patient;
        IUserRegistry.OrganType requiredOrgan = organRequests[requestId]
            .organType;
        IUserRegistry.OrganStatus organStatus = userRegistry
            .checkOrganAvaiablity(_donor, uint256(requiredOrgan));
        if (organStatus != IUserRegistry.OrganStatus.Available) {
            emit matchStatus(requestId, "Organs Do not match");
            return false;
        }
        organMatchSummary memory summary = calculateCompatibilityScore(
            _patient,
            _donor,
            uint256(requestId)
        );
        if (summary.compatibilityScore >= _compatibilityScore) {
            if (isBloodGroupMatch(_donor, _patient)) {
                matchSummary[requestId] = summary;
                matchSummary[requestId].organMatch = true;
                matchSummary[requestId].bloodGroupMatch = true;
                organRequests[requestId].donor = _donor;
                organRequests[requestId].status = Status.MATCHED;
                emit matchStatus(requestId, "Match Completed Sucessfully");
                return true;
            }
        }

        return false;
    }

    // This functionality checks whethere patients doctor has approved the organ from donor, and patient has given out their consent.
    function initiateOrganRemoval(uint _requestID) public onlyHospital {
        require(
            organRequests[_requestID].status == Status.MATCHED &&
                organRequests[_requestID].doctorApproval &&
                organRequests[_requestID].patientConsent,
            "Not matched"
        );
        organRequests[_requestID].status = Status.DONOR_PROCEDURE_INPROGRESS;
    }

    // This functionality allows donors hospital to mark donors organ removal procedure to sucessfull.
    // Also, marks the particular organ from donor has been donated, and that particular organ from donor will not be further available.
    function markDonorProcedureSucessfull(uint _requestID) public onlyHospital {
        require(
            organRequests[_requestID].status ==
                Status.DONOR_PROCEDURE_INPROGRESS,
            "invalid request"
        );
        OrganRequest memory organRequest = organRequests[_requestID];
        userRegistry.markOrganDonated(
            organRequest.donor,
            uint256(organRequest.organType)
        );
        organRequests[_requestID].status = Status.DONOR_PROCEDURE_COMPLETE;
    }

    // This function allows donors hospital to initiate transport procedure once donor`s procedure is completed 
    function initiateTransport(uint _requestID) public onlyHospital {
        require(
            organRequests[_requestID].status == Status.DONOR_PROCEDURE_COMPLETE,
            "Donor process not complete"
        );
        organRequests[_requestID].status = Status.DONOR_ORGAN_SHIPPED;
    }

    // Patients Hospital can access this functionality to mark that they have received organ sucessfully
    function organReceived(uint requestID) public onlyHospital {
        require(organRequests[requestID].status == Status.DONOR_ORGAN_SHIPPED);
        organRequests[requestID].status = Status.ORGAN_RECEIVED;
    }

    // Patients hospital can utilize this functionality to mark that patients procedure has been initiated for that request id.
    function organTransplantInitiated(uint requestID) public onlyHospital {
        require(organRequests[requestID].status == Status.ORGAN_RECEIVED);
        organRequests[requestID].status = Status.PATIENT_PROCEDURE_INPROGRESS;
    }

    // This functionality allows patient hospital to mark that they have completed patient side procedure successfuly
    function completeTransplant(uint requestID) public onlyHospital {
        require(
            organRequests[requestID].status ==
                Status.PATIENT_PROCEDURE_INPROGRESS
        );
        organRequests[requestID].status = Status.COMPLETED;
    }

    //Getter function to get or look up to particular request
    function getRequest(
        uint _requestID
    ) external view returns (OrganRequest memory) {
        return organRequests[_requestID];
    }

    //Getter function to get or look up to particular organ match summary
    function getOrganMatchSummary(
        uint requestId
    ) external view returns (organMatchSummary memory) {
        return matchSummary[requestId];
    }

    // Getter function to get or lookup to particular user details
    function getUserDetails(
        address _userAddress
    ) public view returns (IUserRegistry.User memory) {
        // Call the getUser function of the UserRegistry contract
        IUserRegistry.User memory userDetails = userRegistry.getUser(
            _userAddress
        );
        return userDetails;
    }
}
