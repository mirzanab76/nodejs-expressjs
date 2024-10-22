npx sequelize-cli db:migrate -> untuk melakukan migration
npx sequelize-cli db:seed:all -> untuk melakukan seeder
npx sequelize-cli seed:generate --name demo-category -> membuat seeder
npx sequelize-cli model:generate --name Role --attributes role_name:string -> membuat tabel baru
npx sequelize-cli model:generate --name Product --attributes product_name:string,description:string,price:integer,category_id:integer -> membuat tabel dengan attributes lebih dari 1
npx sequelize-cli db:seed --seed 20241021150530-demo-roles.js -> menjalan seed