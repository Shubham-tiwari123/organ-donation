import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3'
import * as IOTDATA from './IOTData.json'
import { ApiResponse } from 'src/dto/response.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { SensorDataDTO } from 'src/dto/sensor-data.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IOT, IOTDocument } from 'src/schemas/iot.schema';
import { Model } from 'mongoose';

@Injectable()
export class IotService {
  private readonly alchemyKey: string;
  private readonly web3: any
  private readonly PRIVATE_KEY : string
  private smartContractAddress = "0x712516e61C8B383dF4A63CFe83d7701Bce54B03e"

  constructor(
    @InjectModel(IOT.name) private iotModel: Model<IOTDocument>,
    private configService: ConfigService
  ) {
    this.alchemyKey = this.configService.get<string>('ALCHEMY_KEY');
    let truffleEndpoint = this.configService.get<string>('TRUFFLE_END_POINT');
    this.PRIVATE_KEY = this.configService.get<string>('ADMIN_PRIVATE_KEY');
    
    // this.web3 = new Web3(new Web3.providers.HttpProvider(`https://eth-sepolia.g.alchemy.com/v2/${this.alchemyKey}`));
    this.web3 = new Web3(new Web3.providers.HttpProvider(truffleEndpoint))
  }

  async querySensorData(requestID: number): Promise<ApiResponse<any>> {
    try {
      const address = await this.web3.eth.getAccounts();
      const networkId = await this.web3.eth.net.getId();
      console.log("smart:",this.smartContractAddress);
      
      const IOTDataInstance = new this.web3.eth.Contract(
        IOTDATA.abi,
        this.smartContractAddress
      );
      const sensorData = await IOTDataInstance.methods.getSensorData(requestID).call();
      console.log("sensorData:",sensorData);
      
      let data = {
        temprature: sensorData.temprature,
        vibration: sensorData.vibration,
        orientation: sensorData.orientation,
        light_intensity: sensorData.intensity,
        open_close_detector: sensorData.opencloserstate,
        humidity: sensorData.humidity
      }

      return new ApiResponse(ApiResponseStatus.Success, data);
    }
    catch (error) {
      console.log("Error:", error.message)
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error fetching iot data.');
    }
  }

  async saveSensorData(senserDataDTO: SensorDataDTO): Promise<ApiResponse<any>> {
    try {
      const address = await this.web3.eth.getAccounts();
      const networkId = await this.web3.eth.net.getId();
      const IOTDataInstance = new this.web3.eth.Contract(
        IOTDATA.abi,
        this.smartContractAddress
      );

      const nonce = await this.web3.eth.getTransactionCount(address[0]);
      const gasPrice = await this.web3.eth.getGasPrice();

      const txnData = await IOTDataInstance.methods.setSensorData(
        parseInt(senserDataDTO.requestId),
        senserDataDTO.vibration,
        senserDataDTO.orientation,
        senserDataDTO.temprature,
        senserDataDTO.light_intensity,
        senserDataDTO.humidity,
        senserDataDTO.open_close_detector
      ).encodeABI();

      const txnObject = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: this.web3.utils.toHex(5000000),
        to: this.smartContractAddress,
        data: txnData,
      };

      const signedTx = await this.web3.eth.accounts.signTransaction(txnObject, this.PRIVATE_KEY);
      const txReceipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      const events = await IOTDataInstance.getPastEvents('allEvents', {
        fromBlock: txReceipt.blockNumber,
        toBlock: txReceipt.blockNumber,
      });
      console.log("events:",events);
      
      // return sensorData;
      return new ApiResponse(ApiResponseStatus.Success, { message: "IOT DATA SAV" });
    }
    catch (error) {
      console.log("Error:", error)
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error saving iot data.');
    }
  }

  async updateIOTBox(patientId: string): Promise<ApiResponse<any>> {
    try {
      let iotRecord = await this.iotModel.findOne({ requestId: 123 })
      if (iotRecord == null) {
        let data = {
          requestId: 123,
          initialized: true
        };
        await new this.iotModel(data).save();
      } else {
        let data = {
          initialized: true
        };
        await this.iotModel.findOneAndUpdate({ requestId: 123 }, data)
      }
      return new ApiResponse(ApiResponseStatus.Success, { message: "IOT BOX updated" });
    } catch (error) {
      console.log("Error:", error)
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error saving iot data.');
    }
  }

  async freeIOTBox(patientId: string): Promise<ApiResponse<any>> {
    try {
      console.log("Patient:", patientId);
      let data = {
        initialized: false
      };
      await this.iotModel.findOneAndUpdate({ requestId: 123 }, data)

      return new ApiResponse(ApiResponseStatus.Success, { message: "Updated IOT BOX status" });
    } catch (error) {
      console.log("Error:", error)
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error saving iot data.');
    }
  }

  async getIOTBoxStatus(): Promise<ApiResponse<any>> {
    try {
      let res = await this.iotModel.findOne({ requestId: 123 })
      let result = res == null ? false: res.initialized
      return new ApiResponse(ApiResponseStatus.Success, result);
    } catch (error) {
      console.log("Error:", error)
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error saving iot data.');
    }
  }


  async setSensorData() { }
}
