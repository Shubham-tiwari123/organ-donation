// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IOrganDonationRequest.sol";

//** IOT smart contract, this smart contract accepts requestID and updates sensor data */
contract IOTData {
    IOrganDonation organDonation;

    constructor(address organDonationContract) {
        organDonation = IOrganDonation(organDonationContract);
    }

    struct SensorData {
        string vibration;
        string orientation;
        string temprature;
        string intensity;
        string humidity;
        bool opencloserstate;
    }

    mapping(uint => SensorData) requestTosensorData;

    event IOTDataSaved(uint requestId, string message);

    //** Function to set sensor data for specific request ID */
    function setSensorData(
        uint requestID,
        string memory _vibration,
        string memory _orientation,
        string memory _temprature,
        string memory _intensity,
        string memory _humidity,
        bool _opencloserstate
    ) external {
        requestTosensorData[requestID] = SensorData(
            _vibration,
            _orientation,
            _temprature,
            _intensity,
            _humidity,
            _opencloserstate
        );

        emit IOTDataSaved(requestID, "IOT Data saved in contract");
    }

    //** function to get sensor data corresponding to specific requestID */
    function getSensorData(
        uint requestID
    ) external view returns (SensorData memory) {
        return requestTosensorData[requestID];
    }
}
