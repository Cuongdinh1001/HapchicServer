// var express = require('express');
// var app = express();
// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);
// var mongodb = require('./mongodb');
// var mqtt = require('./mqtt')

// server.listen(process.env.PORT || 3000);


// io.sockets.on('connection', function(socket) {
//     console.log("co ket noi");

//     module.exports.socket = socket

//     //User login
//     socket.on('user-login', function(data) {
       
//         mongodb.accountModel.findOne({username: data.username}, function(err, res) {
//             if (err) {
//                 console.log(err);
//             }
//             else if (res) {
//                 if (res.password == data.password) {
//                     socket.username = res.username;
//                     socket.emit('login-successfully');
//                 }
//                 else {
//                     socket.emit('login-failure');
//                 }
//             }
//             else {
//                 // cant find
//                 socket.emit('login-failure');
//             }
//         });
//     })

//     socket.on('view-info', function() {
//         mongodb.accountModel.findOne({username: socket.username}, function(err, res) {
//             if (err) {
//                 console.log(err);
//             }
//             else if (res) {
//                 var info = {
//                     fullname: res.fullname,
//                     gender: res.gender,
//                     email: res.email,
//                     phone: res.phone,
//                     date_joined: res.date_joined,
//                     permission: res.permission,
//                     type_account: res.type_account
//                 }
//                 socket.emit('server-send-info-account', info);
//             }
//         });
//     });

//     socket.on('add-new-device', function(data) {

//         mongodb.devideModel.save(data, function(err) {
//             if (!err) {
//                 console.log('device ' + data.device_name + ' added')
//             }
//         })
//     })

//     socket.on('humidityInfo', function(deviceId) {
//         mongodb.humidityModel.findOne({_id: deviceId}, function(err, res) {
//             if (err) console.log(err)
//             else if (res) {
//                 var timeData = res.device_dateRegistration
//                 var dateRegistration = timeData.getHours()+'h'+timeData.getMinutes()+'m'+timeData.getSeconds()+'s'+ ' ' + timeData.getDate()+'/'+(timeData.getMonth()+1)+'/'+timeData.getFullYear()
//                 socket.emit("server-send-humidity-info", [res.device_name, dateRegistration])
//             }
//         })
//     });

//     socket.on('ventilatorInfo', function(deviceId) {
//         mongodb.ventilatorModel.findOne({_id: deviceId}, function(err, res) {
//             if (err) console.log(err)
//             else if (res) {
//                 var timeData = res.device_dateRegistration
//                 var dateRegistration = timeData.getHours()+'h'+timeData.getMinutes()+'m'+timeData.getSeconds()+'s'+ ' ' + timeData.getDate()+'/'+(timeData.getMonth()+1)+'/'+timeData.getFullYear()
                
//                 socket.emit("server-send-ventilator-info", [res.device_name, dateRegistration, (res.trigger_threshold).toString(), (res.insensity).toString(), (res.status).toString()])
//             }
//         })
//     })

//     socket.on('update-data-configuration', function(deviceId, triggerThreshold, insensity) {
//         mongodb.ventilatorModel.updateOne({_id: deviceId}, {$set: {trigger_threshold: triggerThreshold, insensity: insensity}}, function(err, suc) {
//             if (err) console.log(err)
//             else {
//                 console.log(suc)
//                 socket.emit('update-data-configuration-successfully')
//             }
//         })
//     })

//     socket.on('view-data', function(deviceID, mode, Start_End_Day) {
//         mongodb.humidityDataModel.findOne({_id: deviceID}, function(err, res) {
//             if (err) console.log(err)
//             else if (res) {
//                 var startIndex = 0
//                 var startDay
//                 if (Start_End_Day.Start != '-') {
//                     startDay = new Date(Start_End_Day.Start[2], Start_End_Day.Start[1], Start_End_Day.Start[0])
                    
//                     while (startIndex < res.data.length) {
//                         if (res.data[startIndex].time < startDay) startIndex = startIndex + 1
//                         else break
//                     }
//                 }
//                 var endIndex = startIndex
//                 var resData = []
//                 var endDay
//                 var check = false
//                 if (Start_End_Day.End != '-') {
//                     endDay = new Date(Start_End_Day.End[2], Start_End_Day.End[1], Start_End_Day.End[0])
//                     endDay.setHours(23, 59,59,59)
//                     if (endDay < startDay) {
//                         socket.emit('startday_bigger_endday')
//                         return
//                     }
//                 }
//                 else {
//                     check = true
//                 }

//                 if (mode == 'Graph') {
//                     while (endIndex < res.data.length) {
//                         if (check || res.data[endIndex].time < endDay) {
//                             var timeData = res.data[endIndex].time
//                             resData.push([timeData.valueOf()/1000000000000, res.data[endIndex].values[1]])
//                             endIndex = endIndex + 1
//                         }
//                         else break
//                     }
//                     socket.emit('server-send-data-of-humisensor_for_graph', resData)
//                 }
//                 else {
//                     while (endIndex < res.data.length) {
//                         if (check || res.data[endIndex].time.valueOf(0) < endDay.valueOf()) {
//                             var timeData = res.data[endIndex].time
//                             resData.push({
//                                 time: [timeData.getHours()+'h'+timeData.getMinutes()+'m'+timeData.getSeconds()+'s', timeData.getDate()+'/'+(timeData.getMonth()+1)+'/'+timeData.getFullYear()],
//                                 values: res.data[endIndex].values[1]
//                             })
//                             endIndex = endIndex + 1
//                         }
//                         else break
//                     }
//                     socket.emit('server-send-data-of-humisensor_for_table', resData)
//                 }
                
//             }
//         });
//     })
// })

const http = require('http')
const port = process.env.PORT | 3000

const server = http.createServer((request, response) => {
  console.log(request.url)
  response.end('Hello from ToiDiCodeDao')
})

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`Server is listening on ${port}`)
})
