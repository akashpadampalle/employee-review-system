const express = require('express');
const PORT = process.env.PORT || 8000;


const app = express();




app.listen(PORT, (err) => {
    if (err) {
        console.log('Error while starting server: ', err);
    } else {
        console.log(`server is up and running at port ${PORT}`);
    }
})