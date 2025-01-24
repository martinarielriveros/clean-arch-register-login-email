import express, { Express, Router } from "express";
import path from "path";

export interface ServerOptions {
  port: number;
  routes: Router;
  publicPath?: string;
}

export class Server {
  #app: Express;
  #routes: Router;

  #port: number;
  #publicPath: string;
  #serverListener?: ReturnType<Express["listen"]>;

  constructor({ port, routes, publicPath = "public" }: ServerOptions) {
    this.#app = express();
    this.#port = port;
    this.#publicPath = publicPath;
    this.#routes = routes;

    this.#initializeMiddleware();
    this.#initializeRoutes();
  }

  #initializeMiddleware(): void {
    this.#app.use(express.json());
    this.#app.use(express.static(this.#publicPath));
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(this.#routes);
  }

  #initializeRoutes(): void {
    this.#app.use("*", (req, res) => {
      const indexPath = path.join(
        __dirname + `../../../${this.#publicPath}/index.html`
      );
      res.sendFile(indexPath);
    });
  }

  public start(): void {
    if (!this.#serverListener) {
      this.#serverListener = this.#app.listen(this.#port, () => {
        console.log(`Server is running on http://localhost:${this.#port}`);
      });
    } else {
      console.error("Server is already running.");
    }
  }

  public stop(): void {
    if (this.#serverListener) {
      this.#serverListener.close(() => {
        console.log("Server has been stopped.");
        this.#serverListener = undefined;
      });
    } else {
      console.error("Server is not running.");
    }
  }
}
