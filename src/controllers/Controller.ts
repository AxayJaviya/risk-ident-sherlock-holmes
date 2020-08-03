import { Request, Response } from 'express';

/**
 * @author [AxayJaviya]
 * @version [1.0.0]
 * @description [Inteface that contains methods to handle get,post,put and delete for REST APIs endpoints]
 */
export interface Controller {
  getData(request: Request, response: Response): Response;
}
