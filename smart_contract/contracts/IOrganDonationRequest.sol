// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IOrganDonation {
        enum Status{
        PENDING,  //0
        MATCHED,  //1
        DONOR_REJECTED,  //2
        DONOR_PROCEDURE_INPROGRESS, //3
        DONOR_PROCEDURE_COMPLETE, //4
        DONOR_ORGAN_SHIPPED, //5
        ORGAN_RECEIVED, //6
        PATIENT_PROCEDURE_INPROGRESS, // 7
        COMPLETED //7
    }
    
    function isValidRequestID(uint256 requestID) external view returns (bool);
    function getRequestStatus(uint256 requestID) external view returns(Status);
}
