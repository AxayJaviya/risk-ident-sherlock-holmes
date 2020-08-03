import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Controller } from './Controller';
import { isArray } from 'util';
const transactionFilePath = path.join(__dirname, '../../test-data_072020.json');


/**
 * @author [AxayJaviya]
 * @version [1.0.0]
 * @description [Class to operate on transaction details and implement Controller interface]
 */
export class TransactionController implements Controller {

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @private
   * @description          [Function that convenrts array of objects to single object with given key]
   * @param array {any[]}  [Array that need to convert into object]
   * @param key {any}      [key/field based on which array is converted into object]
   * @returns {object}     [array to object based on given key]
   */
  private convertArrayToObject = (array: any[], key: string) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @private
   * @description          [Function that convenrts nested array of objects into flat array]
   * @param pId {string}   [parentId for nested element to set]
   * @param array {array}  [input array which need to be flat]
   * @returns {array}      [flat array all child elements are added as a seperate element into array]
   */
  private flat = (pId: string, array: any[]): any => {
    let result: any[] = [];
    array.forEach((tnx: any) => {
      tnx.pId = pId;
      result.push(tnx);
      if (Array.isArray(tnx.children)) {
        result = result.concat(this.flat(tnx.id, tnx.children));
      }
    });
    return result;
  }

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @private
   * @description                   [Function that returns transaction which mappned to transactionId]
   * @param transactions {any[]}    [array to stored mapped transaction record]
   * @param transactionID {string}  [transactionId to filtered mapped transaction]
   * @param tnxData {any}           [transaction data]
   * @returns {transactions}        [returns mapped transaction object if found else returns a empty array]
   */
  private getTransactions = (transactions: any[], transactionID: string, tnxData: any): any => {
    // if we reach the end of transaction tree returns the transactions
    if (isArray(tnxData) === false || tnxData.length === 0) {
      return transactions;
    } else {
      if (Array.isArray(tnxData)) {
        tnxData.forEach((tnx: any) => {
          // if tnx.id is matched to requested transactionId then add data to transactions and returns
          if (transactionID === tnx.id) {
            transactions.push(tnx);
            return transactions;
          }
          return this.getTransactions(transactions, transactionID, tnx.children);
        });
      }
      return transactions;
    }
  }

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @private
   * @description                   [Function that check transactionId and confidenceLevel are valid parameters]
   * @param transactionId {any}     [transactionId to fetch transactions data]
   * @param confidenceLevel {any}   [confidenceLevel to fetch only those transactions which confidence is grater or equal to confidence]
   * @returns {boolean}             [returns true if request parameters are valid else throw an error]
   */
  private isValidParams = (transactionId: any, confidenceLevel: any) => {
    if (!transactionId) throw new Error('transactionId is required query parameter');
    if (!confidenceLevel) throw new Error('confidenceLevel is required query parameter');
    if (Array.isArray(transactionId)) throw new Error('Multiple transactionId are found in query parameters');
    if (Array.isArray(confidenceLevel)) throw new Error('Multiple confidenceLevel are found in query parameters');
    confidenceLevel = parseFloat(confidenceLevel as string);
    if (isNaN(confidenceLevel)) throw new Error('confidenceLevel must be a number');
    return true;
  }

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @description               [implementation of Contoller ineteface method]
   * @param request {Request}   [http request]
   * @param response {response} [http response]
   * @returns {response}        [returns all transactions if records are found else returns []]
   */
  getData = (request: Request, response: Response): Response => {
    const transactionId = request.query.transactionId;
    const confLevel = request.query.confidenceLevel;
    try {
      this.isValidParams(transactionId, confLevel);
      const confidenceLevel = parseFloat(confLevel as string);
      let tnxData = fs.readFileSync(transactionFilePath, 'utf8');
      tnxData = JSON.parse(tnxData.toString());
      let transactions = this.getTransactions([], transactionId as string, tnxData);
      transactions = this.flat(transactionId as string, transactions);
      transactions = this.convertArrayToObject(transactions, 'id');
      let data: any[] = [];
      if (Object.keys(transactions).length) {
        for (const tnx in transactions) {
          if (!transactions.hasOwnProperty(tnx)) continue;
          const transaction = transactions[tnx];
          if (transaction.pId === transaction.id) {
            delete transaction.connectionInfo;
          } else {
            const parent = transactions[transaction.pId];
            const pConfidence = parent.connectionInfo ? parent.connectionInfo.confidence : 1;
            const pConTypes = parent.combinedConnectionInfo ? parent.combinedConnectionInfo.types : [];
            const confidence = transaction.connectionInfo.confidence;
            // if current or parent connectionInfo confidence is less than confidenceLevel then set value to -1
            if (confidence < confidenceLevel || pConfidence < confidenceLevel) {
              transaction.connectionInfo.confidence = -1;
            }
            transaction.combinedConnectionInfo = {
              types: [...new Set([...pConTypes, transaction.connectionInfo.type])],
              confidence: parseFloat((pConfidence * confidence).toFixed(2))
            };
          }
          delete transaction.pId;
          delete transaction.children;
          data.push(transaction);
        }
      }
      // check if transactionId is root element or transaction connectionInfo confidence >= confidenceLevel
      data = data.filter((tnx) => {
        return tnx.id === transactionId || tnx.connectionInfo.confidence >= confidenceLevel;
      });
      return response.status(200).json(data);
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
}
