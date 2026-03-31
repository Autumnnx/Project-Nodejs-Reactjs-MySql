//Conexión a mysql
const mysql = require('mysql2');

//Se accede a las credenciales creadas en .env
require('dotenv').config();

//Método para conectarme a la base de datos
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Método para saber si hay un error
connection.connect((err) => {
    if(err){
        console.error('Error al conectar la base de datos', err);
        return;
    }
    
    console.log('Conexión exitosa a MySQL');
});

//Exporta la conexión realizada
module.exports = connection;