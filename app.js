const express = require('express');
const path = require('path');
const sql = require('mssql');
const app = express();
const port = process.env.PORT || 3000;


const dbConfig = {
    user: 'bootcamp',
  password: 'Pass@123',
  server: 'bootcampaug5server.database.windows.net',
  database: 'bootcampaug5db',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index');
});


app.get('/task2', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .query('SELECT TOP 20 * FROM [SalesLT].[Customer]');
        
        // Log result for debugging
        console.log(result.recordset.length);
        
        res.render('task2', { customers: result.recordset });
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error retrieving data');
    }
});





app.get('/task3', async (req, res) => {
    console.log("task 3 route accessed");//debug line
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .query(`
                SELECT p.Name AS ProductName, p.Color, p.Size, p.Weight
                FROM [SalesLT].[Product] p
                JOIN [SalesLT].[ProductCategory] pc ON p.ProductCategoryID = pc.ProductCategoryID
            `);

        res.render('task3', { products: result.recordset });
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error retrieving data');
    }
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
