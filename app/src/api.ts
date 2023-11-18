import { VenomController } from './controllers/venom-controller';
import { app } from './app';
import { routers } from './routes';


class Api {
  private port = 3000;

  constructor() {
  }

  startApi() {
    app.listen(this.port, () => {
      console.log(`Servidor está rodando em http://localhost:${this.port}`);
    });
  }
}

const api = new Api();
api.startApi();


