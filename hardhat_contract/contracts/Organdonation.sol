// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IUserRegistry.sol";

contract OrganDonation {
    address owner;
    IUserRegistry userRegistry;

    constructor(address userRegistryAddress) {
        owner = msg.sender;
        userRegistry = IUserRegistry(userRegistryAddress);
        organRequests.push();
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // TODO: create Hospital Mapping, and allow registered hospitals for updating states.
    modifier onlyHospital() {
        require(
            userRegistry.isHospitalRegistered(msg.sender),
            "Only registered hospitals can call this function"
        );
        _;
    }

    uint requestCount = 0;

    enum Status {
        PENDING, //0
        MATCHED, //1
        DONOR_REJECTED, //2
        DONOR_PROCEDURE_COMPLETE, //3
        DONOR_ORGAN_SHIPPED, //4
        ORGAN_RECEIVED, //5
        COMPLETED //6
    }

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

    struct organMatchSummary {
        uint BMIDifference;
        bool bloodGroupMatch;
        bool organMatch;
        IUserRegistry.UrgencyType urgencyLevel;
        uint compatibilityScore;
    }

    OrganRequest[] organRequests;

    mapping(uint => organMatchSummary) public matchSummary;

    event OrganRequestRegistered(
        uint256 requestID,
        address indexed patientAddress,
        string message
    );
    event requestStateChanged(uint256 requestID, string message);
    event doctorsConsent(
        bool consent,
        address indexed donor,
        uint256 indexed requestId
    );
    event patientConsent(
        bool consent,
        address indexed patient,
        uint256 indexed requestId
    );
    event matchStatusSuccess(uint requestID, address indexed donor, string message);
    event matchStatusFailed(uint requestID, address indexed donor, string message);


    function registerDoctorApproval(bool consent, uint256 requestID) external {
        require(
            organRequests[requestID].status == Status.MATCHED,
            "invalid consent request"
        );
        require(
            msg.sender == organRequests[requestID].patientSurgeon,
            "invalid donor"
        );
        if (consent == true) {
            organRequests[requestID].doctorApproval = true;
            emit doctorsConsent(consent, msg.sender, requestID);
        } else if (consent == false) {
            organRequests[requestID].doctorApproval = false;
            emit doctorsConsent(consent, msg.sender, requestID);
        }
    }

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
            emit patientConsent(consent, msg.sender, requestID);
        } else if (consent == false) {
            userRegistry.addRefusal(msg.sender, requestID);
            organRequests[requestID].status = Status.DONOR_REJECTED;
        }
        emit patientConsent(consent, msg.sender, requestID);
    }

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

        emit OrganRequestRegistered(
            requestCount,
            _patient,
            "patient organ request registered"
        );
        return requestCount;
    }

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

        uint256 waitingTime = block.timestamp - requestRegistrationDate; // change to registration date
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
            emit matchStatusFailed(requestId, _donor, "Organs Do not match");
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
                emit matchStatusSuccess(
                    requestId,
                    _donor,
                    "Match Completed Sucessfully"
                );
                return true;
            }
        }
        emit matchStatusFailed(
            requestId,
            _donor,
            "Compatibility Score did not match"
        );
        return false;
    }

    function markDonorProcedureSucessfull(uint _requestID) public onlyHospital {
        OrganRequest memory organRequest = organRequests[_requestID];
        userRegistry.markOrganDonated(
            organRequest.donor,
            uint256(organRequest.organType)
        );
        organRequests[_requestID].status = Status.DONOR_PROCEDURE_COMPLETE;
        emit requestStateChanged(_requestID, "Donor organ removed");
    }

    function initiateTransport(uint _requestID) public onlyHospital {
        require(
            organRequests[_requestID].status == Status.DONOR_PROCEDURE_COMPLETE,
            "Donor process not complete"
        );
        organRequests[_requestID].status = Status.DONOR_ORGAN_SHIPPED;
        emit requestStateChanged(_requestID, "Organ is transported");
    }

    function organReceived(uint _requestID) public onlyHospital {
        require(organRequests[_requestID].status == Status.DONOR_ORGAN_SHIPPED);
        organRequests[_requestID].status = Status.ORGAN_RECEIVED;
        emit requestStateChanged(_requestID, "Organ received");
    }

    function completeTransplant(uint _requestID) public onlyHospital {
        require(
            organRequests[_requestID].status ==
                Status.ORGAN_RECEIVED
        );
        organRequests[_requestID].status = Status.COMPLETED;
        emit requestStateChanged(_requestID, "Organ transplanted sucessdully");
    }

    function getRequest(
        uint _requestID
    ) external view returns (OrganRequest memory) {
        return organRequests[_requestID];
    }

    function getRequestStatus(uint _requestID) external view returns (Status) {
        return organRequests[_requestID].status;
    }

    function getOrganMatchSummary(
        uint requestId
    ) external view returns (organMatchSummary memory) {
        return matchSummary[requestId];
    }

    function isValidRequestID(uint256 requestID) public view returns (bool) {
        // Check if the requestID is within the valid range of the organRequests array
        return (requestID > 0 && requestID <= organRequests.length);
    }

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
