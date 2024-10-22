How to set up :
1. Launch npm install
2. create .env file
3. do configuration on database, this repo using postgresql
4. Launch npx sequelize-cli db:migrate (For Migration Table)
5. Launch npx sequelize-cli db:seed:all (For generate data dummy)

This is few command for create new table and create seeder :
1. npx sequelize-cli model:generate --name Role --attributes role_name:string (Create new table)
2. npx sequelize-cli model:generate --name Product --attributes product_name:string,description:string,price:integer,category_id:integer (Also Create new table, for attributes more than 1)
3. npx sequelize-cli seed:generate --name demo-category (Create new Seeder)
4. npx sequelize-cli db:seed --seed <seeder file name> (Running seeder for one file)
5. npx sequelize-cli db:seed:all (Running seeder for all file)

How to create an Endpoint or API:
1. Create a new file in the services folder, create a new function as you wish.
   In this services folder, the functions used are CRUD and some filters such as searching for data based on id, etc.
2. Create a new file in the controllers folder, import the file from the services folder.
  Create parameters, logic or a condition in this controllers folder. create response code such as statusCode, message, success (true or false). create debugging if the code is not as desired or if there is an error using try and catch.
3. create a new file in the routes folder, import the file from the controllers folder.
  create the router according to the function created. for example if the function in the service file is findAll, it means that in the routes the function used is get. if create then post, if update then put and if delete then delete.
4. Last register the routes in the server.js file


