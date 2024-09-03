require('dotenv').config();
const app = require('./App');

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`server is running on - http://localhost:${PORT}`);
});