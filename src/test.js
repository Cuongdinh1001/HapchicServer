var mqtt = require('mqtt');

var client  = mqtt.connect('tcp://40.114.123.246', {port: 1883});

client.on('connect', publish = function(){
    var humi = Math.floor(Math.random() * 15) + 55;
    let message = '[{"device_id": "TempHumi ", "values": ["30", "' + humi + '"]}]'
    //let message = '[{"device_id": "TempHumi ", "values": ["30", "66"]}]'
    console.log(message)
    setTimeout(publish, 300000)
    client.publish('Topic/TempHumi', message)
})


// let mongoose = require('mongoose');

// const uri = "mongodb+srv://cuongdinh1001:KaitoKid1001@hapchicdatabase.kuwtf.azure.mongodb.net/HapChicDatabase?retryWrites=true&w=majority";

// mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
//     if (err) throw err;
//     console.log('Connect to database successfully');
// });
