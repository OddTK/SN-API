const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require(routes));

mongoose.connect('mongod://localhost:27017/SocialNetworkAPI')
    .then(async () => {
        console.log('Successfully conected to MongoDB');
    })
    .catch(err => console.error(err));

    app.listen(PORT, () => console.log('Server is running'));
