const express = require('express');
const PORT  = process.env.PORT || 8000;

const app = express();

app.use(express.json()) // parsing json object
app.use(express.urlencoded()); // handling encoded request body



app.listen(PORT, function(err) {
    if(err){
        console.log(`ERROR: ${err}`);
        return;
    }

    console.log(`Server is up and running at port ${PORT}`);
})