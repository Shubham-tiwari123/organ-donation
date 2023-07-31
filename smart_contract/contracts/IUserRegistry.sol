// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IUserRegistry {
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

    enum UrgencyType {
        Low,
        Medium,
        High
    }

    enum OrganStatus {
        NotListed,
        Available,
        Donated
    }

    enum UserRole {
        Doctor,
        Donor,
        Patient
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

    event DonorRegistered(uint256 donorID, address indexed donorAddress);
    event PatientRegistered(uint256 patientID, address indexed patientAddress);
    event HospitalRegistered(uint256 hospitalID, address indexed hospitalAddress);

    function registerUser(
        address _userAddress,
        Bloodtype _bloodtype,
        uint256 _bmi,
        UserRole _userType,
        OrganType[] memory organs
    ) external;

    function registerHospital(address hospitalAddress, string memory _name) external;

    function getUser(address _userAddress) external view returns (User memory);

    function getHosptial(address _hospitalAddress) external view returns (Hospital memory);

    function checkOrganAvaiablity(address _donorAddress, uint256 _organType) external view returns (OrganStatus);

    function markOrganDonated(address _donorAddress, uint _organType) external returns (bool);

    function addRefusal(address patientAddress, uint256 requestID) external;

    function isHospitalRegistered(address _hospitalAddress) external view returns (bool);
}
