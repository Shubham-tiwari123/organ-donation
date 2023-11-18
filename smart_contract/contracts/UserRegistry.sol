// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract UserRegistry {
    address owner;

    enum Bloodtype {
        // Same Enum to be maintained on backend system also
        A_positive, // 0
        A_negative, // 1
        B_positive, // 2
        B_negative, // 3
        O_positive, // 4
        O_negative, // 5
        AB_positive, // 6
        AB_negative // 7
    }

    enum OrganType {
        Cornea, //0
        Kidneys, //1
        Heart, //2
        Liver, //3
        Lungs, //4
        Pancreas, //5
        SmallIntestine, //6
        Skin //7
    }

    enum UrgencyType {
        Low, //0
        Medium, //1
        High //2
    }

    enum OrganStatus {
        NotListed, //0
        Available, //1
        Donated //2
    }

    enum UserRole {
        Doctor, //0
        Donor, //1
        Patient //2
    }

    struct User {
        uint userID;
        Bloodtype bloodGroup;
        uint256 BMI;
        address hospitalAddress;
        uint256[] organRefusalList;
        UserRole userType;
    }

    struct Hospital {
        uint256 hospitalID;
        string name;
        address hospitalAddress;
        bool isRegistered;
    }

    mapping(address => Hospital) public hospitals;
    mapping(address => User) public Users;
    mapping(address => mapping(uint => OrganStatus)) organDonatedStatus; //uint will be represented

    uint256 userCount;
    uint256 public hospitalsCount;

    event userRegistered(address indexed userAddress, string message);
    event HospitalRegistered(
        uint256 hospitalID,
        address indexed hospitalAddress,
        string message
    );

    constructor() {
        userCount = 0;
        hospitalsCount = 0;
        owner = msg.sender;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "only owner can call");
        _;
    }

    modifier hospitalOnly() {
        require(
            hospitals[msg.sender].isRegistered,
            "Only registered hospitals can call this function"
        );
        _;
    }

    function registerUser(
        address _userAddress,
        Bloodtype _bloodtype,
        uint256 _bmi,
        UserRole _userType,
        OrganType[] memory organs
    ) public hospitalOnly {
        require(Users[_userAddress].userID == 0, "User is already registered");
        userCount++;
        Users[_userAddress] = User(
            userCount,
            _bloodtype,
            _bmi,
            msg.sender,
            new uint256[](0),
            _userType
        );
        if (_userType == UserRole.Donor) {
            for (uint i = 0; i < organs.length; i++) {
                organDonatedStatus[_userAddress][
                    uint256(organs[i])
                ] = OrganStatus.Available;
            }
            emit userRegistered(_userAddress, "Donor Registered Sucessfully");
        }
        emit userRegistered(_userAddress, "Patient Registered Sucessfully");
    }

    function registerHospital(
        address hospitalAddress,
        string memory _name
    ) external ownerOnly {
        require(
            hospitals[hospitalAddress].isRegistered == false,
            "Hospital already registered"
        );
        hospitalsCount++;
        hospitals[hospitalAddress] = Hospital(
            hospitalsCount,
            _name,
            hospitalAddress,
            true
        );

        emit HospitalRegistered(
            hospitalsCount,
            hospitalAddress,
            "hospital registered"
        );
    }

    function switchDonorToPatient(
        address _userAddress,
        uint256 _bmi,
        Bloodtype _bloodType
    ) external hospitalOnly {
        Users[_userAddress].userType = UserRole.Patient;
        Users[_userAddress].BMI = _bmi;
        Users[_userAddress].bloodGroup = _bloodType;
        for (uint i = 0; i < 8; i++) {
            organDonatedStatus[_userAddress][i] = OrganStatus.NotListed;
        }
    }

    function switchPatientToDonor(
        address _userAddress,
        OrganType[] memory organList,
        uint256 _bmi,
        Bloodtype _bloodType
    ) external hospitalOnly {
        Users[_userAddress].userType = UserRole.Donor;
        Users[_userAddress].BMI = _bmi;
        Users[_userAddress].bloodGroup = _bloodType;
        
        for (uint i = 0; i < 8; i++) {
            organDonatedStatus[_userAddress][i] = OrganStatus.NotListed;
        }

        for (uint i = 0; i < organList.length; i++) {
            organDonatedStatus[_userAddress][
                uint256(organList[i])
            ] = OrganStatus.Available;
        }
    }

    function getUser(
        address _userAddress
    ) external view returns (User memory, OrganStatus[] memory) {
        User memory user = Users[_userAddress];
        OrganStatus[] memory organStatusList = new OrganStatus[](8);

        for (uint i = 0; i < 8; i++) {
            organStatusList[i] = organDonatedStatus[_userAddress][i];
        }
        return (user, organStatusList);
    }

    function getHosptial(
        address _hospitalAddress
    ) public view returns (Hospital memory) {
        return hospitals[_hospitalAddress];
    }

    function checkOrganAvaiablity(
        address _donorAddress,
        uint _organType
    ) public view returns (uint256) {
        return uint256(organDonatedStatus[_donorAddress][_organType]);
    }

    function markOrganDonated(
        address _donorAddress,
        uint256 _organType
    ) external returns (bool) {
        require(
            organDonatedStatus[_donorAddress][_organType] ==
                OrganStatus.Available
        );
        organDonatedStatus[_donorAddress][_organType] = OrganStatus.Donated;
        return true;
    }

    function addRefusal(
        address patientAddress,
        uint256 requestID,
        address _donorAddress,
        uint256 _organType
    ) external {
        require(
            Users[patientAddress].userType == UserRole.Doctor ||
                Users[patientAddress].userType == UserRole.Patient,
            "Only doctors or patients can refuse"
        );
        organDonatedStatus[_donorAddress][_organType] = OrganStatus.Available;
        Users[patientAddress].organRefusalList.push(requestID);
    }

    function isHospitalRegistered(
        address _hospitalAddress
    ) public view returns (bool) {
        return hospitals[_hospitalAddress].isRegistered;
    }
}
