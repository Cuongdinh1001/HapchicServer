var mqtt = require('mqtt');
const mongodb = require('./mongodb');
var server = require('./server');

// var options = {
//   username: "BKvm2",
//   password: "Hcmut_cse_2020",
//   port: 1883
// };
// var client  = mqtt.connect('tcp://13.76.250.158', options);
var client  = mqtt.connect('tcp://40.114.123.246', {port: 1883});

client.on('connect', function () {
  console.log("Connect to mqtt server successfully");

  client.subscribe('Topic/TempHumi');
  client.subscribe('Topic/Speaker');

  client.on('message', function (topic, message) {
    if (topic == 'Topic/TempHumi') {
      messageJson = JSON.parse(message.toString())
      let newValue = {
        time: Date.now(),
        values: messageJson[0].values
      }
      var data = {
        _id: messageJson[0].device_id,
        data: [
          newValue
        ]
      }
      mongodb.humidityDataModel.updateOne({ _id: messageJson[0].device_id }, { $push: { data: newValue } }, function (err) {
        if (err) mongodb.dataModel.create(data)
        else console.log('update humidity data successfully')
      })

      dataProcessing(messageJson[0].values[1])
      if (server.socket) updateData(newValue)
    }
    else if (topic == 'Topic/Speaker') {
      messageJson = JSON.parse(message.toString())
      var deviceId = messageJson[0].device_id
      var status = messageJson[0].values[0]
      var insensity = messageJson[0].values[1]
      mongodb.ventilatorModel.updateOne({ _id: deviceId }, { $set: { status: status } }, function (err) {
        if (err) console.log(err)
        else console.log('update ventilator successfully')
      })
    }
  })
})


let updateData = function(newValue) {
  //graph
  var graphData = [newValue.time.valueOf()/1000000000000, newValue.values[1]]
  var time = new Date(newValue.time)
  var tableData = {
    time: [time.getHours()+'h'+time.getMinutes()+'m'+time.getSeconds()+'s', time.getDate()+'/'+(time.getMonth()+1)+'/'+time.getFullYear()],
    values: newValue.values[1]
  }
  server.socket.emit('server-update-data', [graphData, tableData])
}

async function getThreshold(deviceId) {
  var threshold
  var insensity
  var status
  await mongodb.ventilatorModel.findOne({ _id: deviceId }, function (err, res) {
    if (err) console.log(err)
    else {
      threshold = res.trigger_threshold
      insensity = res.insensity
      status = res.status
    }
  })
  return [threshold, insensity, status] 
}

let dataProcessing = async function (humidity) {
  
  var retData = await getThreshold("Speaker")
  var threshold = retData[0]
  var insensity = retData[1]
  var status = retData[2]

  if (humidity >= threshold) {
    if (status == 0) {
      var data = '[{"device_id": "Speaker", "values": ["1", "' + insensity + '"]}]'
      client.publish("Topic/Speaker", data)
      console.log("Bat quat")
      server.socket.emit('server-notifi-ventilator-active')
    }
  }
  else {
    if (status == 1) {
      var data = '[{"device_id": "Speaker", "values": ["0", "0"]}]'
      client.publish("Topic/Speaker", data)
      console.log('Tat quat')
      server.socket.emit('server-notifi-ventilator-inactive')
    }
  }
}