import express from 'express';
import { Controller, TransactionController } from '../controllers';

/**
 * @author [AxayJaviya]
 * @version [1.0.0]
 * @description [REST APIs endpoint for /transactions]
 */
export class TransactionRoutes {
  private path: string;
  private router: express.Router;
  private controller: Controller;

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @constructor
   * @description [create controller for /transaction routes/endpoints]
   */
  constructor(path: string) {
    this.path = path;
    this.router = express.Router();
    this.controller = new TransactionController();
    this.initRoutes();
  }

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @private
   * @description [method that maps route/endpoint to contoller method]
   */
  private initRoutes() {
    this.router.get(`${this.path}/`, this.controller.getData);
  }
}
