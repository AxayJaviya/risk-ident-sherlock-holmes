import express from 'express';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';


/**
 * @author [AxayJaviya]
 * @version [1.0.0]
 * @description [Class for express application to configure middlewares and routes]
 */
class App {
  private app: Application;
  private port: number;

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @constructor
   * @param appInit [{ port, middleWares,routes }] [port on which express app is listing, integrate middlewares, routes for express applications]
   */
  constructor(appInit: { port: number; middleWares: any; routes: any; }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.routes(appInit.routes);
  }

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @private
   * @param middleWares {Array} [middlewares used by express app]
   */
  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare);
    })
  }

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @param routes {Array} [REST APIs endpoints/routes]
   */
  private routes(routes: { forEach: (arg0: (route: any) => void) => void; }) {
    routes.forEach(route => {
      this.app.use('/api', route.router);
    });
    this.app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  /**
   * @author [AxayJaviya]
   * @version [1.0.0]
   * @public
   * @description [start express aop and listing request on port]
   */
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the PORT:${this.port}`);
    })
  }
}

export default App;