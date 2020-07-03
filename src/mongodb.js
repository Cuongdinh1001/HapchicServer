// let mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/HapChicDB', {useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
//     if (err) throw err;
//     console.log('Connect to database successfully');
// });

let mongoose = require('mongoose');
const uri = "mongodb+srv://cuongdinh1001:KaitoKid1001@hapchicdatabase.kuwtf.azure.mongodb.net/HapChicDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) throw err;
    console.log('Connect to database successfully');
});

var accountScheme = mongoose.Schema(
    {
        username: String,
        password: String,
        fullname: String,
        gender: String,
        email: String,
        phone: String,
        date_joined: Date,
        permission: String,
        type_account: String
    },
    {
        collection: 'account'
    }
)

exports.accountModel = mongoose.model("account", accountScheme);

var humiditySchema = mongoose.Schema({
    _id: String,
    device_name: String,
    device_dateRegistration: Date
    },
    {
        collection: 'devices'
    }
)

exports.humidityModel = mongoose.model('humidityModel', humiditySchema);

var ventilatorSchema = mongoose.Schema({
    _id: String,
    device_name: String,
    device_dateRegistration: Date,
    trigger_threshold: Number,
    insensity: Number,
    status: Number
    },
    {
        collection: 'devices'
    }
)

exports.ventilatorModel = mongoose.model('ventilatorModel', ventilatorSchema);

var humidityDataSchema = mongoose.Schema({
    _id: String,
    data: [
        {
            time: Date,
            values: JSON
        }
    ]
    },
    {
        collection: 'data'
    }
)

exports.humidityDataModel = mongoose.model('data', humidityDataSchema);

