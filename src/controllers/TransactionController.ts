import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Controller } from './Controller';
const transactionFilePath = path.join(__dirname, `../../${process.env.TRANSACTION_FILE as string}`);


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
   * @description                       [Function that returns all the transactions which are part of transactionId and its children in flatten array]
   * @param transactions {any[]}        [Contains the flatten array for transaction and its children]
   * @param transactionIDs {any[]}      [Contains the transactionIds arrays for given transactionsIDs and its children id ]
   * @param tnxData {any}               [Contains a transactions to filter transactionIDs data]
   * @returns {[result,transactionIDs]} [all flatten transactions and list of all children transactionIDs]
   */
  private getTransactions = (transactions: any[], transactionIDs: any[], tnxData: any): any => {
    // if we reach the end of transaction tree returns the transactions
    if (tnxData == null) {
      return [transactions, transactionIDs];
    } else {
      if (Array.isArray(tnxData)) {
        tnxData.forEach((tnx: any) => {
          // if tnx.id is matched to requested transactionId then add data to transactions and add all children id to transactionIDs array so we can loop over
          if (transactionIDs.indexOf(tnx.id) !== -1) {
            transactions.push({ [tnx.id]: tnx });
            tnx.children && tnx.children.map((t: any) => transactionIDs.push(t.id));
          }
          if (Array.isArray(tnx.children)) {
            return transactions.concat(this.getTransactions(transactions, transactionIDs, tnx.children));
          }
        });
      }
      return [transactions, transactionIDs];
    }
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
      if (!transactionId) throw new Error('transactionId is required query parameter');
      if (!confLevel) throw new Error('confidenceLevel is required query parameter');
      if (Array.isArray(transactionId)) throw new Error('Multiple transactionId are found in query parameters');
      if (Array.isArray(confLevel)) throw new Error('Multiple confidenceLevel are found in query parameters');
      const confidenceLevel = parseFloat(confLevel as string);
      if (isNaN(confidenceLevel)) throw new Error('confidenceLevel must be a number');

      let tnxData = fs.readFileSync(transactionFilePath, 'utf8');
      tnxData = JSON.parse(tnxData.toString());
      let [transactions, transactionIDs] = this.getTransactions([], [transactionId], tnxData);
      // converent array of transactions into object of transactions so we don't have to use filter for each transaction
      transactions = Object.assign({}, ...transactions);
      let data: any[] = [];
      if (Object.keys(transactions).length) {
        transactionIDs = transactionIDs as any[];
        transactionIDs.forEach((tnxId: any) => {
          const transaction = transactions[tnxId];
          // remove connectionInfo from transaction with transactionId(parent/root)
          // Note: Here we are follow top to bottom approach so we can add combinedConnectionInfo from parent to its child
          if (transactionId === tnxId) {
            delete transaction.connectionInfo;
            // for root's first level child, combinedConnectionInfo value is same as connectionInfo except types is [type]
            transaction.children && transaction.children.map((tnx: any) => {
              const tnxChild = transactions[tnx.id];
              tnxChild.combinedConnectionInfo = {
                types: [tnxChild.connectionInfo.type],
                confidence: tnxChild.connectionInfo.confidence
              };
            });
          } else {
            // get current connectionInfo confidence
            const confidence = transaction.connectionInfo.confidence;
            // if current connectionInfo confidence is less than confidenceLevel then update to -1
            if (confidence < confidenceLevel) {
              transaction.connectionInfo.confidence = -1;
            }
            // set combinedConnectionInfo for its child
            transaction.children && transaction.children.map((tnx: any) => {
              const tnxChild = transactions[tnx.id];
              tnxChild.combinedConnectionInfo = {
                types: [...new Set([...transaction.combinedConnectionInfo.types, tnxChild.connectionInfo.type])],
                confidence: parseFloat((confidence * tnxChild.connectionInfo.confidence).toFixed(2))
              };
              // if parent connectionInfo confidence is less than confidenceLevel then update child connectionInfo confidence to -1
              if (confidence < confidenceLevel) {
                tnxChild.connectionInfo.confidence = -1;
              }
            });
          }
          // remove children from all transaction
          delete transaction.children;
          data.push(transaction);
        });
      }
      // check if transactionId is root element or transaction connectionInfo confidence >= confidenceLevel
      data = data.filter((i) => i.id === transactionId || i.connectionInfo && i.connectionInfo.confidence >= confidenceLevel);
      return response.status(200).json(data);
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
}
