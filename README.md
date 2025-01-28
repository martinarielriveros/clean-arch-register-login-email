## Email verification

Clean Arquitecture files layout

## Instalation

1. Clone **.env.template** to a previously created **.env** file and configure the proper variables.
2. Run `npm install` to install dependencies.
3. Configure **docker-compose.yml** and run `docker-compose up -d` to get the Mongo DB instance running.
4. Run `npm run dev` to start the project in development mode.
5. To public try, replace with a tunnel connection in `http://localhost:3000/api` (or the port stated on `PORT` in `.env`). You can use **PORTS** tab in **VSC** or **NGROK**. Place the public url into `.env`'s `WEBSERVICE_URL` property (remember to include **/api**)
