import Web3 from "web3";
import UserRegistry from './contracts/UserRegistry.json'
import OrganDonation from './contracts/OrganDonation.json'
import IOTData from './contracts/IOTData.json'

const web3 = new Web3(window.ethereum);

async function initalizeContractsMetamask(provider) {
  const web3 = new Web3(provider);
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  const networkId = await web3.eth.net.getId();

  let deployedNetwork = await UserRegistry.networks[networkId];
  const userRegistryInstance = new web3.eth.Contract(
    UserRegistry.abi,
    deployedNetwork.address
  );

  deployedNetwork = await OrganDonation.networks[networkId];
  const organDonationInstance = new web3.eth.Contract(
    OrganDonation.abi,
    deployedNetwork.address
  );

  deployedNetwork = await IOTData.networks[networkId];
  const IOTDataInstance = new web3.eth.Contract(
    IOTData.abi,
    deployedNetwork.address
  );

  return { accounts, userRegistryInstance, organDonationInstance, IOTDataInstance }
}

async function registerHospital(hospitalAddress, hospitalName, contract) {
  try {
    console.log("registerHospital:", contract._address);
    let contract_address = contract._address
    let from_address = await web3.eth.getAccounts();
    from_address = from_address[0]

    const nonce = await web3.eth.getTransactionCount(from_address);
    const gasPrice = await web3.eth.getGasPrice();

    const txData = contract.methods
      .registerHospital(hospitalAddress, hospitalName)
      .encodeABI();

    const txObject = {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: web3.utils.toHex(3000000),
      to: contract_address,
      data: txData,
    };

    const txReceipt = await web3.eth.sendTransaction({
      from: from_address,
      ...txObject
    });

    const events = await contract.getPastEvents('allEvents', {
      fromBlock: txReceipt.blockNumber,
      toBlock: txReceipt.blockNumber,
    });

    console.log('Emitted Events:', events);
    console.log('Transaction Hash:', txReceipt);

    return { error: false, message: events[0].event }
  } catch (error) {
    console.error('Error222 :', JSON.stringify(error.message));
    return { error: true, message: error.message }
  }
}

async function registerUser(userAddress, bloodType, bmi, userType, organTypes, contract) {
  try {
    console.log("registerUser:", contract._address);
    let contract_address = contract._address
    let from_address = await web3.eth.getAccounts();
    from_address = from_address[0]

    const nonce = await web3.eth.getTransactionCount(contract_address);
    const gasPrice = await web3.eth.getGasPrice();
    console.log("Gas price:", gasPrice);
    const txnData = await contract.methods
      .registerUser(userAddress, bloodType, bmi, userType, organTypes)
      .encodeABI();

    const txnObject = {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: web3.utils.toHex(5000000),
      to: contract_address,
      data: txnData,
    };

    const txReceipt = await web3.eth.sendTransaction({
      from: from_address,
      ...txnObject
    });

    const events = await contract.getPastEvents('allEvents', {
      fromBlock: txReceipt.blockNumber,
      toBlock: txReceipt.blockNumber,
    });

    console.log('Emitted Events:', events);
    console.log('Transaction Hash:', txReceipt);

    return { error: false }
  } catch (error) {
    console.log('Error: ', error);
    return { error: true, message: error.message }
  }
}

async function raiseOrganRequest(patientAddr, urgencyLevel, organType, patientSurgeon, contract, hospitalAddr) {
  try {
    console.log("raiseOrganRequest:", contract._address);
    let contract_address = contract._address
    let from_address = await web3.eth.getAccounts();
    from_address = from_address[0]

    const nonce = await web3.eth.getTransactionCount(hospitalAddr);
    const gasPrice = await web3.eth.getGasPrice();

    const txnData = contract.methods.registerOrganRequest(patientAddr, urgencyLevel, organType, patientSurgeon).encodeABI();

    const txnObject = {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: web3.utils.toHex(3000000),
      to: contract_address, // Use the contract address instead of 'contract'
      data: txnData,
    };

    const txReceipt = await web3.eth.sendTransaction({
      from: from_address,
      ...txnObject
    });

    const events = await contract.getPastEvents('allEvents', {
      fromBlock: txReceipt.blockNumber,
      toBlock: txReceipt.blockNumber,
    });

    console.log('Request Id', events);
    // console.log('Request Id', web3.utils.hexToNumber(events[0].data));
    console.log('Transaction Hash:', txReceipt.logsBloom);
    console.log('web3:', web3.utils);
    console.log('Transaction Hash2:', web3.utils.toBigInt(txReceipt.logsBloom).toString());

    return { error: false, requestId: web3.utils.hexToNumber(events[0].data) }
  } catch (error) {
    console.log('Error: ', error);
    return { error: true, message: error.message }
  }
}

async function getUserDetails(address, contract) {
  try {
    const user = await contract.methods.getUser(address).call();
    console.log('User: ', user);
  } catch (error) {
    console.log('Error: ', error);
  }
}

async function checkOrganAvailability(address, organ_enum, contract) {
  try {
    const data = await contract.methods.checkOrganAvaiablity(address, organ_enum).call();
    console.log("Data: ", Number(data));
  }
  catch (error) {
    console.log("Error: ", error)
  }
}

async function isHospitalRegistered(hospitalAddr, contract) {
  try {
    const result = await contract.methods.isHospitalRegistered(hospitalAddr).call();
    console.log(result);
    console.log("result:", result);
    return { error: false, message: result }
  }
  catch (error) {
    console.log("Error: ", error);
    return { error: false, message: error }
  }
}

async function registerDoctorApproval(consent, requestID, contract) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .registerDoctorApproval(consent, requestID)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error('Error while registering doctor approval:', error);
    return { error: true, message: error }
  }
}

async function registerPatientConsent(consent, requestID, contract) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .registerPatientConsent(consent, requestID)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error('Error while registering patient consent:', error);
    return { error: true, message: error }
  }
}

async function registerOrganRequest(patient, urgencyLevel, organType, patientSurgeon, contract) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .registerOrganRequest(patient, urgencyLevel, organType, patientSurgeon)
      .send({ from: accounts[0] });

    console.log("result:", result);

    const events = await contract.getPastEvents('allEvents', {
      fromBlock: result.blockNumber,
      toBlock: result.blockNumber,
    });

    console.log('request Id', events[0].returnValues.requestID, typeof events[0].returnValues.requestID);
    console.log('Event Id', web3.utils.toBigInt(events[0].returnValues.requestID).toString());

    return { error: false, requestID: web3.utils.toBigInt(events[0].returnValues.requestID).toString() }

  } catch (error) {
    console.error("Error while registering organ request:", error);
    return { error: true, message: error }
  }
}

async function validateOrganMatch(compatibilityScore, donor, requestId, contract) {
  try {
    console.log("donor:", donor);
    console.log("requestId:", requestId, typeof requestId);
    console.log("compatibilityScore",compatibilityScore, typeof compatibilityScore);
    const accounts = await web3.eth.getAccounts();
    console.log("accounts:", accounts[0]);
    // console.log("web3 function:", contract.methods);
    const txReceipt = await contract.methods
      .validateOrganMatch(compatibilityScore, donor, parseInt(requestId))
      .send({ from: accounts[0] });

    console.log("passesd validate ");
    const events = await contract.getPastEvents('allEvents', {
      fromBlock: txReceipt.blockNumber,
      toBlock: txReceipt.blockNumber,
    });
    console.log("events:", events);

    let message = events[0].returnValues != null ? events[0].returnValues.message : null

    console.log('Request Id:', message);
    console.log('Transaction txReceipt:', txReceipt);
    if (message !== "Match Completed Sucessfully") {
      return { error: true, message }
    } else {
      // try to get the bool value here 
      return { error: false, message }
    }
    // console.log('Request Id',events[0]);

  } catch (error) {
    console.error("Error while validating organ match:", error);
    return { error: true, message: error }
  }
}

async function initiateOrganRemoval(requestID, contract) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .initiateOrganRemoval(requestID)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error("Error while initiating organ removal:", error);
    return { error: true, message: error }
  }
}

async function markDonorProcedureSuccessful(requestID, contract) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .markDonorProcedureSucessfull(requestID)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error("Error while marking donor procedure successful:", error);
    return { error: true, message: error }
  }
}

async function initiateTransport(requestID, contract) {
  try {
    console.log("typeof:", typeof requestID);
    console.log("contract:", contract.methods);
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .initiateTransport(requestID)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error("Error while initiating organ transport:", error);
    return { error: true, message: error }
  }
}

async function organReceived(requestID, contract) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .organReceived(requestID)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error("Error while marking organ received:", error);
    return { error: true, message: error }
  }
}

async function organTransplantInitiated(requestID, contract) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .organTransplantInitiated(requestID)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error("Error while initiating organ transplant:", error);
    return { error: true, message: error }
  }
}

async function completeTransplant(requestID, contract) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .completeTransplant(requestID)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error("Error while completing organ transplant:", error);
    return { error: true, message: error }
  }
}

async function getRequest(requestID, contract) {
  const accounts = await web3.eth.getAccounts();
  console.log("Organ contract:", contract.methods);
  const result = await contract.methods.getOrganMatchSummary(parseInt(requestID)).call()

  console.log("result:", result);
  return { error: false }
}


async function getRequestStatus(requestID, contract) {
  const result = await contract.methods.getRequestStatus(requestID).call();
  console.log("result:", result);
  return { error: false }
}

async function getOrganMatchSummary(requestId, contract) {
  const result = await contract.methods.getOrganMatchSummary(requestId).call();
  console.log("result:", result);
  return { error: false }
}

async function getUser(_userAddress, contract) {
  try {
    const result = await contract.methods.getUser(_userAddress).call();
    return result;
  } catch (error) {
    console.error('Error while getting user:', error);
    throw error;
  }
}

async function switchDonorToPatient(_userAddress, bmi, bloodGroup, contract) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .switchDonorToPatient(_userAddress, bmi, bloodGroup,)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error('Error while switching user to patient:', error);
    return { error: true, message: error }
  }
}

async function switchPatientToDonor(_userAddress, organList, bmi, bloodGroup, contract) {
  try {
    console.log("Bmi:", bmi, "bloodGroup:", bloodGroup);
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .switchPatientToDonor(_userAddress, organList, bmi, bloodGroup)
      .send({ from: accounts[0] });

    console.log("result:", result);
    return { error: false }
  } catch (error) {
    console.error('Error while switching user to patient:', error);
    return { error: true, message: error }
  }
}

export {
  initalizeContractsMetamask,
  registerHospital,
  registerUser,
  getUserDetails,
  checkOrganAvailability,
  isHospitalRegistered,
  raiseOrganRequest,
  registerDoctorApproval,
  registerOrganRequest,
  registerPatientConsent,
  validateOrganMatch,
  initiateOrganRemoval,
  initiateTransport,
  organTransplantInitiated,
  markDonorProcedureSuccessful,
  getOrganMatchSummary,
  organReceived,
  completeTransplant,
  getRequest,
  getRequestStatus,
  getUser,
  switchDonorToPatient,
  switchPatientToDonor
}