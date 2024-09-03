const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'fullcycle'
};

const connection = mysql.createConnection(config);

app.get('/', (req, res) => {
    const sql = `INSERT INTO people(name) VALUES('Full Cycle Rocks!')`;
    connection.query(sql, (err, result) => {
        if (err) throw err;

        connection.query('SELECT name FROM people', (err, rows) => {
            if (err) throw err;

            let response = '<h1>Full Cycle Rocks!</h1><ul>';
            rows.forEach(row => {
                response += `<li>${row.name}</li>`;
            });
            response += '</ul>';

            res.send(response);
        });
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
