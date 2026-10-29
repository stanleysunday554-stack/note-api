const mongoose = require('mongoose');
 const ConnectDB =  async () => {
await mongoose.connect(process.env.MONGODB_URI)
console.log("Database connected successfully")
}


module.exports = ConnectDB;