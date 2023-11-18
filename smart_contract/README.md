# Organ Donation Smart Contracts



## Table of Contents

- [Introduction](#introduction)
- [Smart Contracts Overview](#smart-contracts-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Deploy Smart Contracts](#deploy-smart-contracts)
  - [Running Tests](#running-tests)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

The Organ Donation Smart Contracts is a decentralized application (DApp) that aims to facilitate and streamline the organ donation and transplantation process using blockchain technology. The project leverages the Ethereum blockchain to ensure transparency, security, and immutability in organ donation procedures.

## Smart Contracts Overview

### UserRegistry

The `UserRegistry` contract manages user details, hospital registrations, and organ donation-related information. It stores user information, including doctors, donors, and patients, and facilitates the registration of hospitals. Additionally, it maintains the status of organs donated by donors and refusal requests from patients.

#### Functions

- `registerUser`: Allows hospitals to register new users as doctors, donors, or patients.
- `registerHospital`: Enables the contract owner to register new hospitals.
- `switchDonorToPatient`: Allows hospitals to switch a donor to a patient role.
- `switchPatientToDonor`: Allows hospitals to switch a patient to a donor role with a list of available organs.
- `getUser`: Retrieves user details by providing the user's address.
- `getHospital`: Retrieves hospital details by providing the hospital's address.
- `checkOrganAvaiablity`: Checks the availability status of an organ for a donor.
- `markOrganDonated`: Marks an organ as donated by a donor.
- `addRefusal`: Adds a refusal request by a patient for an organ transplant.
- `isHospitalRegistered`: Checks if a hospital is registered.

### OrganDonation

The `OrganDonation` contract handles the process of organ donation and transplantation. It facilitates patient-donor matching, doctor and patient consent, and tracks the status of the organ donation process.

#### Functions

- `registerDoctorApproval`: Allows patients' surgeons to approve the matched organ.
- `registerPatientConsent`: Allows patients to give consent for the matched organ or add a refusal request.
- `registerOrganRequest`: Allows hospitals to raise an organ request for a patient.
- `validateOrganMatch`: Validates the organ match found by the backend system.
- `initiateOrganRemoval`: Initiates the organ removal process for a matched request.
- `markDonorProcedureSucessfull`: Marks the donor's procedure as successful.
- `initiateTransport`: Initiates the organ transport procedure.
- `organReceived`: Marks that the organ has been received by the patient's hospital.
- `organTransplantInitiated`: Marks that the patient's procedure has been initiated.
- `completeTransplant`: Marks that the patient's procedure has been completed successfully.
- `getRequest`: Retrieves details of a specific organ request.
- `getOrganMatchSummary`: Retrieves the organ match summary for a specific organ request.

### IOTData

The `IOTData` contract is responsible for storing sensor data related to organ transportation. It interacts with the `OrganDonation` contract to ensure that only valid requests are updated.

#### Functions

- `setSensorData`: Allows updating sensor data for a valid organ transportation request.
- `getSensorData`: Retrieves the sensor data for a specific organ transportation request.

## Getting Started

### Prerequisites

- [Truffle](https://www.trufflesuite.com/truffle) - Development framework for Ethereum
- [Ganache](https://www.trufflesuite.com/ganache) - Local Ethereum blockchain for development and testing


## Run Locally

1. Clone the project

```bash
  git clone https://github.com/Shubham-tiwari123/organ-donation.git
```

2. Go to the project directory

```bash
  cd smart_contract
```

3. Change git branch

```bash
  git checkout second-part
```

4. Install dependencies

```bash
  npm install truffle
```

5. Start local blockchain using ganache

6. Compile all smart contracts
```bash
 trufle compile
 ```

7. Migrate smart contracts to local blockchain
```bash
  truffle migrate
  ```







## How To Run on Remix
1. Clone the project

```bash
  git clone https://github.com/Shubham-tiwari123/medical-freelance
```

2. Go to the project directory

```bash
  cd smart_contract
```

3. Open Remix IDE in browser
  ```
  https://remix.ethereum.org/
  ```

4. In file explorer chose option to upload folder

5. Upload smart_contract/contracts from cloned repository.

6. Compile smart contracts

7. Deploy them using Remix VM

8. Deploy the smart contracts in following sequence:
  ```
   1. UserRegistry.sol
   2. OrganDonation.sol
   3. IOTSmartContract.sol
   ```
   
