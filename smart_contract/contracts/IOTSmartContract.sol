// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./IOrganDonationRequest.sol";
//** IOT smart contract, this smart contract accepts requestID and updates sensor data */
contract IOTData{
    IOrganDonation organDonation;
    constructor(address organDonationContract){
        organDonation = IOrganDonation(organDonationContract);
    }

    struct SensorData{
        uint temprature;
        uint pressure;
        uint humidity;
        uint gps;
    }

    mapping(uint=>SensorData) requestTosensorData;

    //** Function to set sensor data for specific request ID */
    function setSensorData(uint requestID,uint _temprature,uint _pressure, uint _humidity,uint _gps)external{
        require(organDonation.isValidRequestID(requestID) && organDonation.getRequestStatus(requestID) == IOrganDonation.Status.DONOR_ORGAN_SHIPPED,"Invalid update request");
        requestTosensorData[requestID]=SensorData(
            _temprature,
            _pressure,
            _humidity,
            _gps
        );
    }


    //** function to get sensor data corresponding to specific requestID */
    function getSensorData(uint requestID) external view returns(SensorData memory){
        return requestTosensorData[requestID];
    }
    
}