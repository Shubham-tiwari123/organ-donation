// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// User Registry Contract
contract UserRegistry {
    address owner;

    // Enumeration for Blood Type
    enum Bloodtype {
        A_positive,
        A_negative,
        B_positive,
        B_negative,
        O_positive,
        O_negative,
        AB_positive,
        AB_negative
    }

    // Enumeration for Organ Types
    enum OrganType {
        Cornea,
        Kidneys,
        Heart,
        Liver,
        Lungs,
        Pancreas,
        SmallIntestine,
        Skin
    }

    // Enumeration for Urgency Levels
    enum UrgencyType {
        Low,
        Medium,
        High
    }

    // Enumeration for Organ Status
    enum OrganStatus {
        NotListed,
        Available,
        Donated
    }

    // Enumeration for User Roles
    enum UserRole {
        Doctor,
        Donor,
        Patient
    }

    // Struct for User Details
    struct User {
        uint userID;
        Bloodtype bloodGroup;
        uint256 BMI;
        address hospitalAddress;
        uint256[] organRefusalList;
        UserRole userType;
    }

    // Struct for Hospital Details
    struct Hospital {
        uint256 hospitalID;
        string name;
        address hospitalAddress;
        bool isRegistered;
    }

    mapping(address => Hospital) public hospitals;
    mapping(address => User) public Users;
    mapping(address => mapping(uint => OrganStatus)) organDonatedStatus;

    uint256 userCount;
    uint256 public hospitalsCount;

    event DonorRegistered(uint256 donorID, address indexed donorAddress);
    event PatientRegistered(uint256 patientID, address indexed patientAddress);
    event HospitalRegistered(uint256 hospitalID, address indexed hospitalAddress);

    constructor() {
        userCount = 0;
        hospitalsCount = 0;
        owner = msg.sender;
    }

    // Modifier: Only the contract owner can call this
    modifier ownerOnly {
        require(msg.sender == owner, "Only the contract owner can call this");
        _;
    }

    // Modifier: Only registered hospitals can call this
    modifier hospitalOnly {
        require(hospitals[msg.sender].isRegistered, "Only registered hospitals can call this function");
        _;
    }

    // Function to register a new user (either doctor, donor, or patient)
    function registerUser(
        address _userAddress,
        Bloodtype _bloodtype,
        uint256 _bmi,
        UserRole _userType,
        OrganType[] memory organs
    ) public hospitalOnly {
        userCount++;
        Users[_userAddress] = User(
            userCount,
            _bloodtype,
            _bmi,
            msg.sender,
            new uint256[](0),
            _userType
        );
        // If the user is a donor, set the donated status of organs to Available
        if (_userType == UserRole.Donor) {
            for (uint i = 0; i < organs.length; i++) {
                organDonatedStatus[_userAddress][i] = OrganStatus.Available;
            }
        }
    }

    // Function to register a new hospital
    function registerHospital(address hospitalAddress, string memory _name) external ownerOnly {
        require(hospitals[hospitalAddress].isRegistered == false, "Hospital already registered");
        hospitalsCount++;
        hospitals[hospitalAddress] = Hospital(hospitalsCount, _name, hospitalAddress, true);
        emit HospitalRegistered(hospitalsCount, hospitalAddress);
    }

    // Function to switch a donor to a patient role
    function switchDonorToPatient(address _userAddress) external hospitalOnly {
        Users[_userAddress].userType = UserRole.Patient;
    }

    // Function to switch a patient to a donor role with a list of available organs
    function switchPatientToDonor(address _userAddress, OrganType[] memory organList) external {
        Users[_userAddress].userType = UserRole.Donor;
        for (uint i = 0; i < organList.length; i++) {
            organDonatedStatus[_userAddress][i] = OrganStatus.Available;
        }
    }

    // Function to get user details
    function getUser(address _userAddress) external view returns (User memory) {
        return Users[_userAddress];
    }

    // Function to get hospital details
    function getHosptial(address _hospitalAddress) public view returns (Hospital memory) {
        return hospitals[_hospitalAddress];
    }

    // Function to check the availability status of an organ for a donor
    function checkOrganAvaiablity(address _donorAddress, uint256 _organType) public view returns (OrganStatus) {
        return organDonatedStatus[_donorAddress][_organType];
    }

    // Function to mark an organ as donated by a donor
    function markOrganDonated(address _donorAddress, uint256 _organType) external returns (bool) {
        require(organDonatedStatus[_donorAddress][_organType] == OrganStatus.Available);
        organDonatedStatus[_donorAddress][_organType] = OrganStatus.Donated;
        return true;
    }

    // Function to add a refusal request by a patient for an organ transplant
    function addRefusal(address patientAddress, uint256 requestID) external {
        require(Users[patientAddress].userType == UserRole.Patient);
        Users[patientAddress].organRefusalList.push(requestID);
    }

    // Function to check if a hospital is registered
    function isHospitalRegistered(address _hospitalAddress) public view returns (bool) {
        return hospitals[_hospitalAddress].isRegistered;
    }
}
