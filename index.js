var http = require('http');
var express = require('express')();
var timeout = require('connect-timeout');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var path = require('path');
var mysql = require('mysql');
var $ = require("jquery");
var cors = require('cors');
var multer = require('multer');
var fs = require('fs');
var dir = path.join(__dirname, 'public');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//var mongoose = require('mongoose');
//var SocketIOFile = require('socket.io-file');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/images');
  },
  filename: function (req, file, callback) {
   // callback(null, file.fieldname + '-' + Date.now());
   callback(null, file.originalname);
   //email = req.body.name;
  }
});
var upload = multer({ storage : storage }).fields([

                                { name: 'imagefile', maxCount: 1 },
                                { name: 'videofile', maxCount: 1 },
                                { name: 'imagefileleft', maxCount: 1 },
                                { name: 'email', maxCount: 1 }

                             ]);
//app.options('*', cors());
/* Started here!!*/
/*var allowCrossDomain = function(req, res, next) {
    
      if('GET' == req.method){ 
     res.header('Access-Control-Allow-Origin', 'http://beloveddais.com');
     //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      }

      if('POST' == req.method){ 
     res.header('Access-Control-Allow-Origin', 'http://beloveddais.com');
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      }
      
      if('OPTIONS' == req.method){ 
       res.header('Access-Control-Allow-Origin', 'http://beloveddias.com');
       res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
       res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
       res.sendStatus(200); 
     }

    next();
};*/

var allowCrossDomain = function(req, res, next) {
    
     if('GET' == req.method){ 
         res.set({
             'Access-Control-Allow-Origin': 'http://127.0.0.1:9000'
         });
     }

     if('POST' == req.method){ 
         res.set({
             'Access-Control-Allow-Origin': 'http://127.0.0.1:9000'
         });
     }
      
     if('OPTIONS' == req.method){ 
         res.set({
             'Access-Control-Allow-Origin': 'http://127.0.0.1:9000',
             'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
             'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
         });
         
         res.sendStatus(200); 
     }

    next();
};
function haltOnTimedout(req, res, next){
   if(!req.timedout) next();
}

app.use(timeout(120000));
app.use(haltOnTimedout);
app.use(allowCrossDomain);
//app.use('*', cors());
/*Ended here*/

var dir = path.join(__dirname, 'public');

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

app.get('*', function (req, res) {
    var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});


//creating mysql connection!!!!
var connection = mysql.createConnection({
      host     : '127.0.0.1',
      user     : 'root',
      password : '',
      database : 'lovedaises'
  });

//Creating UniqueEmail object that will be populated by /Rating route;


app.get('/', function (req, res) {
      res.end('socket io working!!! lets start coding socket.io');
});


app.get('/gettingFriendRequestnow', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
         var personalEmail = req.body.personalEmail;
         var emptyString = "";
         var valueStore = [];
         var FriendEmail;
         var stringObject;
         var anotherStringValue;
         var finalStringValue;
         var sql1;
         var sql2;
             console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
          function addingOnlineStatus(anotherStringValue){

                   sql2 = 'Select OnlineStatus FROM onlineofflinestatustable where Email = ?';
                                  connection.query(sql2, [personalEmail], function(error, results, fields){
                                        if(error)throw error;
                                           finalStringValue = anotherStringValue + " " + results[0].OnlineStatus;
                                              valueStore.push(finalStringValue);

                                              //res.send({'message': valueStore});
                                
                                //the self invoking function is to get the user image from database;
                                    (function(passedFriendEmail){  //self invoking function!
                                             sql1 = 'SELECT Pictures From registrationtable where Email = ?';
                                               var defaultPicture = {'defaultPictureValue': 'man.jpg'};
                                                  connection.query(sql1, [passedFriendEmail], function(error, results, fields){
                                                    if(error)throw error;
                                                      var pictureValue = results[0].pictures;
                                                          if(pictureValue == ''){
                                                               finalStringValue += ' ' + defaultPicture.defaultPictureValue;
                                                                  valueStore.push(finalStringValue);
                                                                      res.send({'message': valueStore});
                                                                          return;
                                                          }

                                                          if(pictureValue != ''){
                                                               finalStringValue += ' ' + pictureValue;
                                                                  valueStore.push(finalStringValue);
                                                                      res.send({'message': valueStore});
                                                                          return;
                                                          }
                                                  })
                                    })();

                                  })

          }

             function addingAlaiseToStringObject(passedFriendEmail){

                       sql1 = "Select Alaise From registrationtable where Email = ?";
                       connection.query(sql1, [passedFriendEmail], function(error, results, fields){
                            if(error)throw error;
                                anotherStringValue += stringObject + " " + results[0].Alaises;
                                
                                 addingOnlineStatus(anotherStringValue);

                                 
                       })

             }

         var sql = 'SELECT FriendFirstname, FriendLastname, FriendEmail FROM friendstable Where Tag = ? AND OwnerEmail = ?'
         connection.query(sql, [emptyString, personalEmail], function (error, results, fields) {
             if(error) throw error;  
                    
                    var gettingLength = results.length;
                 if(gettingLength != 0){
                      for(var i=0; i <= results.length; i++){
                          stringObject = results[i].FriendFirstName + " " + results[i].FriendLastName +
                          " " + results[i].FriendEmail;
                           addingAlaiseToStringObject(result[i].FriendEmail);     
                      } 
                 }
                   
                   
                 if(gettingLength == 0){
                      res.send({'message': 'No Friend Request!'});
                 }
          });
      //res.send({'message': 'It was successfull!!!!'});
});


app.post('/friendslist', /*allowCrossDomain,*/ jsonParser, function(req, res){
     //console.log(res);
     var email = req.body.personalEmail;
     console.log(email);
     var arrayOfFriends = [];
      var sql = 'SELECT * FROM friendstable WHERE OwnerEmail = ?';
          connection.query(sql, [email], function (error, results, fields) {
             if(error) throw error;
               // we would have to loop through the result to get the fields
               console.log(results);
               console.log('thats result above!!!');
               var valueLength = results.length;
               var counter = 0;
               if(valueLength != 0){
                  console.log('this guy ran');
                   for(var i=0; i < results.length; i++){
                        var friendDetails = results[i].FriendFirstName + " " + results[i].FriendLastName + " " + results[i].FriendEmail;
                          arrayOfFriends.push(friendDetails);
                          counter++;
                          if(results.length == counter)
                            res.send({'arrayOfFriends': arrayOfFriends});
                   }
               }

               if(valueLength == 0){
                    
                    res.send({'message': "You Currently have No friends!!!"});
               }
          });
 
})

app.post('/ConfirmingFriendShip', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){   
      var theIdentity = req.body.theIdentity;
      var friendsEmail = theIdentity; // its an email
      var personalEmail = req.body.personalEmail;
      var tagValue = req.body.taggingselectDaises;

      function updatingFunction(){
           var sql = 'INSERT INTO friendstable SET Tag = ?, WHERE OwnerEmail = ? AND FriendEmail = ?';
           connection.query(sql, [tagValue, personalEmail, friendsEmail], function(error, results, fields){
                 if(error) throw error;
           });
          
      }

      updatingFunction();
});

app.post('/connectingWithpeople', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
        var identityRecieved = req.body.postIdentity;
        var personalEmail = req.body.personalEmail;
        var FriendEmail = personalEmail;
        var fullname1; 
        // console.log(personalEmail + '    this is personal Email');
         function getOwnerEmail(email){
              var Friendfirstname = fullname1.split(' ')[0];
                var FriendLastname = fullname1.split(' ')[1];
                  var OwnersEmail = email;
                     var OwnersFirstName;
                       var OwnersLastName;

          console.log('===============================');
                    if(OwnersEmail == FriendEmail){
                        console.log('-----this code block did not execute!')
                        res.send({"message": 'Sorry!....You Cannot Send Friend Request to yourself'});
                    } 

                    if(OwnersEmail != FriendEmail){
                          console.log('this niggers also ran !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                          var sql = 'INSERT INTO friendstable SET Friendfirstname = ?, FriendLastname = ?, FriendEmail = ?, OwnerEmail = ?';   
                   /*connection.query(sql, [Friendfirstname, FriendLastname, FriendEmail, OwnersEmail], function (error, results, fields) {
                     if(error) throw error;
                    });*/
                   var sql2 = "SELECT Tag FROM friendstable WHERE OwnerEmail = ? AND FriendEmail = ?";
                   var Tag = "";
                   
                    connection.query(sql2, [OwnersEmail, FriendEmail], function (error, results, fields) {
                       if(error) throw error;
                            var resultLength = results.length;
                            if(resultLength == 0){
                                connection.query(sql, [Friendfirstname, FriendLastname, FriendEmail, OwnersEmail], function (error, results, fields) {
                                    if(error) throw error;
                                       res.send({"message": "Request Sent Succesfully"});
                                       return;
                                });
                            }
                            
                            if(resultLength != 0){
                                var tagResult = results[0].Tag;
                                 if(tagResult != ''){
                                   var messageValue1 = 'You Guys are Friends already!!';
                                     res.send({'message': messageValue1})
                                   //res.send({'message': 'You guys are friends already!!'});
                             }

                                 if(tagResult == ''){
                                      messageValue1 = 'You Have Sent Request Before';
                                    var sqlQuery = 'SELECT FirstName, LastName FROM registrationtable WHERE Email = ?';
                                    connection.query(sqlQuery, OwnersEmail, function(error, results, fields){
                                          if(error)throw error;
                                                  console.log(OwnersEmail + "   verifying OwnersEmail[[[[[[[[[[[[[[[[[[[[[")
                                              OwnersFirstName = results[0].FirstName;
                                                OwnersLastName = results[0].LastName;
                                                console.log(OwnersFirstName + " " + OwnersLastName + "   that is the value;;;;;;;");
                                                   messageValue1 = 'You have Sent Request Before : has yet to accept your Request!!';
                                                       res.send({'message': messageValue1, "FirstName": OwnersFirstName, "LastName": OwnersLastName});
                                                          return;

                                    });
                                 }
                            }
                    });
                }
                   
         }
          var sqlQuery = 'Select FirstName, LastName, Email From registrationtable Where Email = ?'
          connection.query(sqlQuery, [personalEmail], function (error, results, fields) {
              if(error) throw error;
               //var email = results[0].Email;
                 var firstname = results[0].FirstName;
                   var lastname = results[0].LastName;
                     fullname1 = firstname + " " + lastname; 
                     var sql = 'SELECT Email From daisesposting Where DaisesIdentity = ?';
                     connection.query(sql, [identityRecieved], function(error, results, fields){
                          if(error)throw error;
                           getOwnerEmail(results[0].Email);
                     });
          });
});


app.post('/gettingRatingsOfClosePeople'/*, cors(allowCrossDomain)*/, jsonParser, function(req, res){
          console.log(req.body.sentData + "   this is body");
             
            /*req.on('socket', function (socket) {
                myTimeout = 5000; // millis
                socket.setTimeout(myTimeout);  
                socket.on('timeout', function() {
                    console.log("Timeout, aborting request")
                    req.abort();
                });
          }).on('error', function(e) {
                 console.log("Got error: " + e.message);
                 // error callback will receive a "socket hang up" on timeout
             });*/
          

             // declaration of variables
          var apple = 0, blackCurrant = 0, blueBerry = 0, blackBerry = 0, jujube = 0, lime = 0,jackfruit = 0, longan = 0, kolanut = 0, guava = 0,
                 breadfruit = 0, grape = 0, miracle = 0, huckleBerry = 0, counterloupe = 0, papaya = 0, lemon = 0, wulnut = 0, fig = 0, 
                  pomengranate = 0, orange = 0, cherry = 0, watermellon = 0, tangerine = 0, passionFruit = 0, starfruit = 0, coconut = 0, olive = 0, date = 0, 
                   dragonFruit = 0, damsom = 0, mango = 0, avocado = 0, pineapple = 0, bitter = 0, peach = 0,lychee = 0, tamarind = 0, blackBerry = 0, banana = 0, durian = 0, cucumber = 0,
                    appleCounter = 0, bananaCounter = 0, cucumberCounter = 0, durianCounter = 0, dragonfruitCounter = 0, blackberryCounter = 0, 
                     dateCounter = 0, loquat = 0,pear = 0, cashew = 0, wulnutCounter = 0, figCounter = 0, orangeCounter = 0, cherryCounter = 0, watermellonCounter = 0, pomengranateCounter = 0, 
                      coconutCounter = 0, guavaCounter = 0, oliveCounter = 0, lemonCounter = 0, tangerineCounter = 0, passionFruitCounter = 0, starfruitCounter = 0,
                       kiwiFruitCounter = 0, blackCurrantCounter = 0, jujubeCounter = 0, limeCounter = 0, grapeCounter = 0, miracleCounter = 0, huckleBerryCounter = 0, breadFruitCounter = 0, counterloupeCounter = 0, papayaCounter = 0,
                        pineappleCounter = 0, bitterCounter = 0, peachCounter = 0, lycheeCounter = 0, jackFruitCounter = 0,longanCounter = 0,kolanutCounter = 0, tamarindCounter = 0, blueBerryCounter = 0,
                         damsonCounter = 0, cashewCounter = 0, loquatCounter = 0, mangoCounter = 0, pearCounter = 0, avocadoCounter = 0;
          var rateResult = {}; 
          var peopleRatings = {};
          var firstCounter = 0;
          var arrayCounter = 0;
          var finalLoop;
          var loopingtime;
          var checkIfRating;

          //Its starts here

                        function gettingClosePeople(postersEmail, callBack){
                              var postersEmail = postersEmail;
                              var tag = '';
                              var sql = 'SELECT * FROM friendstable WHERE OwnerEmail = ? AND Tag IS NOT NULL';
                              connection.query(sql, [postersEmail], function(error, results, fields){
                                   if(error)throw error;
                                     var justReturnedResult = results.length;
                                     //////////////////////////
                                     if(justReturnedResult == 0){
                                        res.send({'message':'No Rating Yet!'});
                                        return;
                                     }
                                     /////////////////////////
                                     var arrayData = [];
                                     var lengthCounter = 0;
                                     var lengthCounter2 = 0;
                                     var arrayOfClosePeople = [];
                                     for(x in results){
                                        lengthCounter++;
                                        if(results[x].Tag == 'Friends'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results[x].Tag == 'Love'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results[x].Tag == 'Family'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results[x].Tag == 'Colleague'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results.length == lengthCounter){
                                          for(var i=0; i < arrayData.length; i++){
                                               lengthCounter2++;
                                               arrayOfClosePeople.push(arrayData[i].split('.')[0]);
                                               console.log(arrayOfClosePeople);
                                               console.log('thats array of Close!!!!!!!!!!!');
                                               if(arrayData.length == lengthCounter2){
                                                   
                                                   callBack(arrayOfClosePeople);
                                               }
                                          }
                                        }

                                     }
                              });
                        }
                        
                        function sendingRateResultToClient(rateResult){
                             // console.log('the loop ran up to this level   BINGO...........');
                             var rateResultLength = Object.keys(rateResult).length;
                                
                             if(rateResultLength == 0){
                              res.send({'myName': 'No Rating Yet!!'});
                              console.log('No Rating Yet!!');
                              return;
                             }

                             res.send({'myName': rateResult});
                             console.log(rateResult);
                        }

                        function callingFunctionToGetRatings(arrayOfClosePeople){
                    //console.log('???????????????????????????????////');
                       console.log(peopleRatings);
                             // console.log(peopleRatings);
                              console.log('thats people ratings above.......................');
                              var arrayOfKeys = Object.keys(peopleRatings);
                              var iteratingCounter = 0;
                              var finalCounter = 0;

                        for(x in peopleRatings){
                            //checkIfRating[x]      // returns an object
                           var arrayOfKeys = Object.keys(peopleRatings[x]);   // returns an array of keys
                               console.log(arrayOfKeys + "   this is the array of keys")
                              for(i=0; i < arrayOfKeys.length; i++){
                                 console.time('NAME......................................PPPP');
                                     finalCounter++;
                                    if(arrayOfKeys[i] == 'Apple')
                                       { apple += peopleRatings[x].Apple; appleCounter += 1; 
                                           var appleResult = apple / appleCounter;  // returns a number (percentage Average of ratings)
                                                rateResult.appleResult = appleResult + " Apple(Love).jpg Love";
                                       }
                                     if(arrayOfKeys[i] == 'Banana')
                                        { banana += peopleRatings[x].Banana; bananaCounter += 1; 
                                          var bananaResult = banana / bananaCounter;
                                               rateResult.bananaResult = bananaResult + " Banana(Creativity).jpg Creativity";
                            
                                        }
                                      if(arrayOfKeys[i] == 'Durian')
                                        { durian += peopleRatings[x].Durian; durianCounter += 1; 
                                           var durianResult = durian / durianCounter;
                                                rateResult.durianResult = durianResult + " Durian(Confidence).jpg Confidence";
                              
                                        }
                                       if(arrayOfKeys[i] == 'Cucumber')
                                        { cucumber += peopleRatings[x].Cucumber; cucumberCounter += 1; 
                                            var cucumberResult = cucumber / cucumberCounter;
                                                 rateResult.cucumberResult = cucumberResult + " Cucumber(Caring).jpg Caring";
                               
                                        }
                                        if(arrayOfKeys[i] == 'Date')
                                          { date += peopleRatings[x].Date; dateCounter += 1; 
                                              var dateResult = date / dateCounter;
                                                   rateResult.dateResult = dateResult + " Date(Consistency).jpg Consistency";
                                
                                          }
                                         if(arrayOfKeys[i] == 'DragonFruit')
                                          { dragonFruit += peopleRatings[x].DragonFruit; dragonfruitCounter += 1;
                                             var dragonFruitResult = dragonFruit / dragonfruitCounter;
                                                  rateResult.dragonFruitResult = dragonFruitResult + " DragonFruit(Knowledge).jpg Knowledge";
                                     
                                          }
                                          if(arrayOfKeys[i] == 'BlackBerry')
                                            { blackBerry += peopleRatings[x].BlackBerry; blackberryCounter += 1;
                                                 var blackBerryResult = blackBerry / blackberryCounter;
                                                      rateResult.blackBerryResult = blackBerryResult + " Blackberry(Experience).jpg Experience";
                                   
                                             }
                                           if(arrayOfKeys[i] == 'Olive')
                                             { olive += peopleRatings[x].Olive; oliveCounter += 1;
                                                   var oliveResult = olive / oliveCounter;
                                                        rateResult.oliveResult = oliveResult + " Olive(Faithfulness).jpg Faithfulness";
                                        
                                             }
                                            if(arrayOfKeys[i] == 'Coconut')
                                              { coconut += peopleRatings[x].Coconut; coconutCounter += 1;
                                                    var coconutResult = coconut / coconutCounter;
                                                         rateResult.coconutResult = coconutResult + " Coconut(intelligence).jpg Intelligence";
                                          
                                             }
                                             if(arrayOfKeys[i] == 'Lemon')
                                              { lemon += peopleRatings[x].Lemon; lemonCounter += 1; 
                                                 var lemonResult = lemon / lemonCounter;
                                                      rateResult.lemonResult = lemonResult + " Lemon(Thouroughness).jpg Thouroughness";
                                            
                                              }
                                    if(arrayOfKeys[i] == 'Tangerine')
                                      { tangerine += peopleRatings[x].Tangerine; tangerineCounter += 1; 
                                          var tangerineResult = tangerine / tangerineCounter;
                                                  rateResult.tangerineResult = tangerineResult + " Tangerine(Cooperation).jpg Cooperation";
                                      }
                                     if(arrayOfKeys[i] == 'PassionFruit')
                                       { passionFruit += peopleRatings[x].PassionFruit; passionfruitCounter += 1; 
                                         var passionFruitResult = passionFruit / passionfruitCounter;
                                              rateResult.passionFruitResult = passionFruitResult + " Passionfruit(Passion).jpg Passion";
                         
                                       }
                                      if(arrayOfKeys[i] == 'Starfruit')
                                        { starfruit += peopleRatings[x].Starfruit; starfruitCounter += 1; 
                                            var starfruitResult = starfruit / starfruitCounter;
                                                 rateResult.starfruitResult = starfruitResult + " Starfruit(Leadership).jpg Leadership";
                      
                                        }
                                       if(arrayOfKeys[i] == 'Walnut')
                                        { walnut += peopleRatings[x].Wulnut; wulnutCounter += 1; 
                                           var walnutResult = walnut / walnutCounter;
                                                rateResult.walnutResult = walnutResult + " Wulnut(Humour).jpg Humour";
                          
                                        }
                                        if(arrayOfKeys[i] == 'Fig')
                                          { fig += peopleRatings[x].Fig; figCounter += 1; 
                                              var figResult = fig / figCounter;
                                                   rateResult.figResult = figResult + " Fig(Wisdom).jpg Wisdom";
                           
                                          }
                                         if(arrayOfKeys[i] == 'Pomengranate')
                                          { pomengranate += peopleRatings[x].Pomengranate; pomengranateCounter += 1; 
                                              var pomengranateResult = pomengranate / pomengranateCounter;
                                                   rateResult.pomengranateResult = pomengranateResult + " Pomengranate(Resourcefulness).jpg Resourcefulness";
                              
                                          }
                                          if(arrayOfKeys[i] == 'Orange')
                                            { orange += peopleRatings[x].Orange; orangeCounter += 1;
                                                  var orangeResult = orange / orangeCounter;
                                                       rateResult.orangeResult = orangeResult + " Orange(Insight).jpg Insight";
                                             }
                                           if(arrayOfKeys[i] == 'Cherry')
                                            { cherry += peopleRatings[x].Cherry; cherryCounter += 1; 
                                                 var cherryResult = cherry / cherryCounter;
                                                      rateResult.cherryResult = cherryResult + " Cherry(Holiness).jpg Holiness";
                                 
                                            }
                                            if(arrayOfKeys[i] == 'Watermellon')
                                              { watermellon += peopleRatings[x].Watermellon; watermellonCounter += 1;
                                                      var watermellonResult = watermellon / watermellonCounter;
                                                            rateResult.watermellonResult = watermellonResult + " Watermelon(Generosity).jpg Generosiy";
                                   
                                               }
                                             if(arrayOfKeys[i] == 'Guava')
                                              { guava += peopleRatings[x].Guava; guavaCounter += 1; 
                                                  var guavaResult = guava / guavaCounter;
                                                       rateResult.guavaResult = guavaResult + " Guava(Sincerity).jpg Sincerity";
                                     
                                              }
                                    if(arrayOfKeys[i] == 'KiwiFruit')
                                      { kiwifruit += peopleRatings[x].KiwiFruit; kiwiFruitCounter += 1;
                                         var kiwifruitResult = Kiwifruit / kiwiFruitCounter;
                                              rateResult.kiwifruitResult = kiwifruitResult + " Kiwifruit(Kindness).jpg Kindness";
                                       
                                      }
                                     if(arrayOfKeys[i] == 'BreadFruit')
                                      { breadfruit += peopleRatings[x].BreadFruit; breadFruitCounter += 1;
                                           var breadfruitResult = breadfruit / breadFruitCounter;
                                                rateResult.breadfruitResult = breadfruit / breadFruitCounter + " Breadfruit(Expertise).jpg Expertise";
                                          
                                       }
                                      if(arrayOfKeys[i] == 'Counterloupe')
                                        { counterloupe += peopleRatings[x].Counterloupe; counterloupeCounter += 1; 
                                            var counterloupeResult = counterloupe / counterloupeCounter;
                                                 rateResult.counterloupeResult = counterloupeResult + " Cantaloupe(Humility).jpg Humility";
                                            
                                        }
                                       if(arrayOfKeys[i] == 'Papaya')
                                        { papaya += peopleRatings[x].Papaya; papayaCounter += 1;
                                            var papayaResult = papaya / papayaCounter;
                                                 rateResult.papayaResult = papayaResult + " Papaya(Openness).jpg Openness";
                                             
                                         }
                                        if(arrayOfKeys[i] == 'Grape')
                                          { grape += peopleRatings[x].Grape; grapeCounter += 1; 
                                               var grapeResult = grape / grapeCounter;
                                                    rateResult.grapeResult = grapeResult + " Grape(Innocence).jpg Innocence";
                                             
                                          }
                                         if(arrayOfKeys[i] == 'Miracle')
                                          { miracle += peopleRatings[x].Miracle; miracleCounter += 1; 
                                               var miracleResult = miracle / miracleCounter;
                                                    rateResult.miracleResult = miracleResult + " Miraclefruit(Helpfulness).jpg Helpfulness"; 
                            
                                          }
                                          if(arrayOfKeys[i] == 'HuckleBerry')
                                            { huckleBerry += peopleRatings[x].HuckleBerry; huckleBerryCounter += 1;
                                                 var huckleBerryResult = huckleBerry / huckleBerryCounter;
                                                       rateResult.huckleBerryResult = huckleBerryResult + " Huckleberry(Friendliness).jpg Huckleberry";
                             
                                            }
                                           if(arrayOfKeys[i] == 'Pineapple')
                                            { pineapple += peopleRatings[x].Pineapple; pineappleCounter += 1;
                                                  var pineappleResult = pineapple / pineappleCounter;
                                                        rateResult.pineappleResult = pineappleResult + " Pineapple(Patience).jpg Patience";
                             
                                             }
                                            if(arrayOfKeys[i] == 'Tamarind')
                                              { tamarind += peopleRatings[x].Tamarind; tamarindCounter += 1;
                                                   var tamarindResult = tamarind / tamarindCounter;
                                                         rateResult.tamarindResult = tamarindResult + " Tamarind(Trustworthiness).jpg Trustworthiness";
                                
                                               }
                                             if(arrayOfKeys[i] == 'BlueBerry')
                                              { blueBerry += peopleRatings[x].BlueBerry; blueBerryCounter += 1; 
                                                  var blueBerryResult = blueBerry / blueBerryCounter;
                                                        rateResult.blueBerryResult = blueBerryResult + " Blueberry(Empathy).jpg Empathy";
                                  
                                              }
                                    if(arrayOfKeys[i] == 'BlackCurrant')
                                      { blackCurrant += peopleRatings[x].BlackCurrant; blackCurrantCounter += 1;
                                          var blackCurrantResult = blackCurrant / blackCurrantCounter;
                                                rateResult.blackCurrantResult = blackCurrantResult + " Blackcurrant(Brilliance).jpg Brilliance";
                                   
                                       }
                                     if(arrayOfKeys[i] == 'Jujube')
                                       { jujube += peopleRatings[x].Jujube; jujubeCounter += 1; 
                                            var jujubeResult = jujube / jujubeCounter;
                                                  rateResult.jujubeResult = jujubeResult + " Jujube(Tolerance).jpg Tolorence";
                                       
                                       }
                                      if(arrayOfKeys[i] == 'Lime')
                                        { lime += peopleRatings[x].Lime; limeCounter += 1;
                                            var limeResult = lime / limeCounter;
                                                   rateResult.limeResult = limeResult + " Lime(Frankness).jpg Frankness";
                                         
                                        }
                                       if(arrayOfKeys[i] == 'JackFruit')
                                         { jackfruit += peopleRatings[x].JackFruit; jackFruitCounter += 1;
                                              var jackfruitResult = jackfruit / jackFruitCounter;
                                                    rateResult.jackfruitResult = jackfruitResult + " Jackfruit(Capacity).jpg Capacity";
                                         
                                         }
                                        if(arrayOfKeys[i] == 'Longan')
                                          { longan += peopleRatings[x].Longan; longanCounter += 1;
                                              var longanResult = longan / longanCounter;
                                                    rateResult.longanResult = longanResult + " Longan(Emotional Intelligence).jpg Emotional Intelligence";
                                           
                                          }
                                         if(arrayOfKeys[i] == 'Kolanut')
                                          { kolanut += peopleRatings[x].Kolanut; kolanutCounter += 1; 
                                              var kolanutResult = kolanut / kolanutCounter;
                                                    rateResult.kolanutResult = kolanutResult + " Kolanut(Courtesy).jpg Courtesy";
                                             
                                          }
                                          if(arrayOfKeys[i] == 'Bitter')
                                            { bitter += peopleRatings[x].Bitter; bitterCounter += 1; 
                                                var bitterResult = bitter / bitterCounter;
                                                      rateResult.bitterResult = bitterResult + " Bitter Kola(Honour).jpg Honour";
                                                 
                                            }
                                           if(arrayOfKeys[i] == 'Peach')
                                               { peach += peopleRatings[x].Peach; peachCounter += 1;
                                                   var peachResult = peach / peachCounter;
                                                        rateResult.peachResult = peachResult + " Peach(Excellence).jpg Excellence";
                     
                                                }
                                            if(arrayOfKeys[i] == 'Lychee')
                                              { lychee += peopleRatings[x].Lychee; lycheeCounter += 1; 
                                                    var lycheeResult = lychee / lycheeCounter;
                                                          rateResult.lycheeResult = lycheeResult + " Lychee(Loyalty).jpg Loyalty";
                        
                                              }
                                             if(arrayOfKeys[i] == 'Damson')
                                              { damson += peopleRatings[x].Damson; damsonCounter += 1; 
                                                   var damsonResult = damson / damsonCounter;
                                                         rateResult.damsonResult = damsonResult + " Damson(Honesty).jpg Honesty";
                          
                                              }
                                if(arrayOfKeys[i] == 'Cashew')
                                  { cashew += peopleRatings[x].Cashew; cashewCounter += 1; 
                                      var cashewResult = cashew / cashewCounter;
                                           rateResult.cashewResult = cashewResult + " Cashew(Optimism).jpg Optimism";
                         
                                  }
                                 if(arrayOfKeys[i] == 'Mango')
                                   { mango += peopleRatings[x].Mango; mangoCounter += 1; 
                                        var mangoResult = mango / mangoCounter;
                                              rateResult.mangoResult = mangoResult + " Mango(Fairness).jpg Fairness";
                          
                                   }
                                  if(arrayOfKeys[i] == 'Avocado')
                                    { avocado += peopleRatings[x].Avocado; avocadoCounter += 1;
                                        var avocadoResult = avocado / avocadoCounter;
                                              rateResult.avocadoResult = avocadoResult + " Avocado(Compassion).jpg Compassion";
                                    }
                                   if(arrayOfKeys[i] == 'Pear')
                                    { pear += peopleRatings[x].Pear; pearCounter += 1;
                                        var pearResult = pear / pearCounter;
                                              rateResult.pearResult = pearResult + " Pear(Grace).jpg Grace";
                            
                                     }
                                    if(arrayOfKeys[i] == 'Loquat')
                                      { loquat += peopleRatings[x].Loquat; loquatCounter += 1;
                                             var loquatResult = loquat / loquatCounter;  
                                                   rateResult.loquatResult =loquatResult + " Loquat(Reliability).jpg Reliability";  

                                      }
                                       console.timeEnd('NAME......................................PPPP');
                                 // console.log(rateResult);
                                 // console.log('thats rateResult Value!!!!');
                              }
                          
                        }
                        
                       // console.log(loopingtime + '    thats looping time...................../////')
                        if((loopingtime = 'circle completed!!!')){
                             setTimeout(function(){
                                         console.log(rateResult);
                                         //console.log(loopingtime);
                                         sendingRateResultToClient(rateResult);
                                         console.log('FINAL RateResult  ............................');
                                    }, 0010);
                        }

                    };

                        function firstloopfunction(loopingtime, loopingValue, arrayOfClosePeople, userRating){
                 // console.log(loopingtime);
                 // console.log('something is wrong somewhere!!!!!!!!!!!!!!!!!!!!!!!!');
              
                  for(var i=0; i <= arrayOfClosePeople.length; i++){
                          console.time('BEGINS......................................PPPP');
                           if(loopingValue == arrayOfClosePeople[i]){
                              peopleRatings[loopingValue] = userRating;
                               console.log(peopleRatings);
                               console.log('thats it above,,,,');
                           }
                          console.timeEnd('BEGINS......................................PPPP');
                  }
                   
                   //console.log(peopleRatings);
                  if(loopingtime == 'circle completed!!!'){
                      setTimeout(function(){
                           ///console.log(peopleRatings);
                           //console.log('popopoppopooiiiiiiiiiiiiiiiiuuuuuuuuuu');
                           callingFunctionToGetRatings(arrayOfClosePeople);
                      }, 0010);
                    }
                        }


             function gettingPostersEmail(passedIdentity){
                var sql = 'SELECT Email FROM daisesposting WHERE DaisesIdentity = ?';
                   connection.query(sql, [passedIdentity], function(error, results, fields){
                           if(error)throw error;
                               var postersEmail = results[0].Email;
                               gettingClosePeople(postersEmail, function(arrayOfClosePeople){
                                console.log('this function ran');
                                  if(Object.keys(checkIfRating).length != 0){
                                    //console.log(checkIfRating);
                                         function callingSetTimeFunction(loopingtime, loopingValue, arrayOfClosePeople, userRating){ // called at the last loop
                                               setTimeout(function(){
                                                  loopingtime = 'circle completed!!!';
                                                  firstloopfunction(loopingtime, loopingValue, arrayOfClosePeople, userRating);
                                               }, 0010);
                                         }

                                         var gettingArrayLength = Object.keys(checkIfRating).length;
                                         console.log(checkIfRating);
                                         console.log('people');
                                          for(x in checkIfRating){
                                               var userRating = checkIfRating[x];
                                               var loopingValue = x;
                                               firstCounter++;
                                               loopingtime = 'not finished looping';

                                               if(firstCounter == gettingArrayLength){
                                                  loopingtime = 'finished looping';
                                                  console.log('something is not right2');
                                                  callingSetTimeFunction(loopingtime, loopingValue, arrayOfClosePeople, userRating);
                                                  return;
                                               }

                                               firstloopfunction(loopingtime, loopingValue, arrayOfClosePeople, userRating);
                                               
                                          }

                                          
                                  }  
                              });
                   });          
             }


          mongo.connect(url, function(err, db){
            var cursor = db.collection('daisesratings').find({'name': "Ratings of Daises"}).limit(1);
               cursor.forEach(function(doc, err){
                    if(err) throw err;   
                        checkIfRating = doc.Rating[req.body.sentData];
                        if(Object.keys(checkIfRating).length == 0){
                             res.send({'message': 'No Rating Yet!'});
                             return;
                        }

                        /*function gettingClosePeople(postersEmail, callBack){
                              var postersEmail = postersEmail;
                              var tag = '';
                              var sql = 'SELECT * FROM friendstable WHERE OwnerEmail = ? AND Tag IS NOT NULL';
                              connection.query(sql, [postersEmail], function(error, results, fields){
                                   if(error)throw error;
                                     var arrayData = [];
                                     var lengthCounter = 0;
                                     var lengthCounter2 = 0;
                                     var arrayOfClosePeople = [];
                                     for(x in results){
                                        lengthCounter++;
                                        if(results[x].Tag == 'Friends'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results[x].Tag == 'Love'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results[x].Tag == 'Family'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results[x].Tag == 'Colleague'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results.length == lengthCounter){
                                          for(var i=0; i < arrayData.length; i++){
                                               lengthCounter2++;
                                               arrayOfClosePeople.push(arrayData[i].split('.')[0]);
                                               console.log(arrayOfClosePeople);
                                               console.log('thats array of Close!!!!!!!!!!!');
                                               if(arrayData.length == lengthCounter2){
                                                   
                                                   callBack(arrayOfClosePeople);
                                               }
                                          }
                                        }

                                     }
                              });
                        }
                        
                        function sendingRateResultToClient(rateResult){
                             // console.log('the loop ran up to this level   BINGO...........');
                             var rateResultLength = Object.keys(rateResult).length;
                                
                             if(rateResultLength == 0){
                              res.send({'myName': 'No Rating Yet!!'});
                              return;
                             }

                             res.send({'myName': rateResult});
                        }

                        function callingFunctionToGetRatings(arrayOfClosePeople){
                    //console.log('???????????????????????????????////');
                    console.log(peopleRatings);
                             // console.log(peopleRatings);
                              console.log('thats people ratings above.......................');
                              var arrayOfKeys = Object.keys(peopleRatings);
                              var iteratingCounter = 0;
                              var finalCounter = 0;

                        for(x in peopleRatings){
                            //checkIfRating[x]      // returns an object
                           var arrayOfKeys = Object.keys(peopleRatings[x]);   // returns an array of keys
                               console.log(arrayOfKeys + "   this is the array of keys")
                              for(i=0; i < arrayOfKeys.length; i++){
                                 console.time('NAME......................................PPPP');
                                     finalCounter++;
                                    if(arrayOfKeys[i] == 'Apple')
                                       { apple += peopleRatings[x].Apple; appleCounter += 1; 
                                           var appleResult = apple / appleCounter;  // returns a number (percentage Average of ratings)
                                                rateResult.appleResult = appleResult + " Apple(Love).jpg Love";
                                       }
                                     if(arrayOfKeys[i] == 'Banana')
                                        { banana += peopleRatings[x].Banana; bananaCounter += 1; 
                                          var bananaResult = banana / bananaCounter;
                                               rateResult.bananaResult = bananaResult + " Banana(Creativity).jpg Creativity";
                            
                                        }
                                      if(arrayOfKeys[i] == 'Durian')
                                        { durian += peopleRatings[x].Durian; durianCounter += 1; 
                                           var durianResult = durian / durianCounter;
                                                rateResult.durianResult = durianResult + " Durian(Confidence).jpg Confidence";
                              
                                        }
                                       if(arrayOfKeys[i] == 'Cucumber')
                                        { cucumber += peopleRatings[x].Cucumber; cucumberCounter += 1; 
                                            var cucumberResult = cucumber / cucumberCounter;
                                                 rateResult.cucumberResult = cucumberResult + " Cucumber(Caring).jpg Caring";
                               
                                        }
                                        if(arrayOfKeys[i] == 'Date')
                                          { date += peopleRatings[x].Date; dateCounter += 1; 
                                              var dateResult = date / dateCounter;
                                                   rateResult.dateResult = dateResult + " Date(Consistency).jpg Consistency";
                                
                                          }
                                         if(arrayOfKeys[i] == 'DragonFruit')
                                          { dragonFruit += peopleRatings[x].DragonFruit; dragonfruitCounter += 1;
                                             var dragonFruitResult = dragonFruit / dragonfruitCounter;
                                                  rateResult.dragonFruitResult = dragonFruitResult + " DragonFruit(Knowledge).jpg Knowledge";
                                     
                                          }
                                          if(arrayOfKeys[i] == 'BlackBerry')
                                            { blackBerry += peopleRatings[x].BlackBerry; blackberryCounter += 1;
                                                 var blackBerryResult = blackBerry / blackberryCounter;
                                                      rateResult.blackBerryResult = blackBerryResult + " Blackberry(Experience).jpg Experience";
                                   
                                             }
                                           if(arrayOfKeys[i] == 'Olive')
                                             { olive += peopleRatings[x].Olive; oliveCounter += 1;
                                                   var oliveResult = olive / oliveCounter;
                                                        rateResult.oliveResult = oliveResult + " Olive(Faithfulness).jpg Faithfulness";
                                        
                                             }
                                            if(arrayOfKeys[i] == 'Coconut')
                                              { coconut += peopleRatings[x].Coconut; coconutCounter += 1;
                                                    var coconutResult = coconut / coconutCounter;
                                                         rateResult.coconutResult = coconutResult + " Coconut(intelligence).jpg Intelligence";
                                          
                                             }
                                             if(arrayOfKeys[i] == 'Lemon')
                                              { lemon += peopleRatings[x].Lemon; lemonCounter += 1; 
                                                 var lemonResult = lemon / lemonCounter;
                                                      rateResult.lemonResult = lemonResult + " Lemon(Thouroughness).jpg Thouroughness";
                                            
                                              }
                                    if(arrayOfKeys[i] == 'Tangerine')
                                      { tangerine += peopleRatings[x].Tangerine; tangerineCounter += 1; 
                                          var tangerineResult = tangerine / tangerineCounter;
                                                  rateResult.tangerineResult = tangerineResult + " Tangerine(Cooperation).jpg Cooperation";
                                      }
                                     if(arrayOfKeys[i] == 'PassionFruit')
                                       { passionFruit += peopleRatings[x].PassionFruit; passionfruitCounter += 1; 
                                         var passionFruitResult = passionFruit / passionfruitCounter;
                                              rateResult.passionFruitResult = passionFruitResult + " Passionfruit(Passion).jpg Passion";
                         
                                       }
                                      if(arrayOfKeys[i] == 'Starfruit')
                                        { starfruit += peopleRatings[x].Starfruit; starfruitCounter += 1; 
                                            var starfruitResult = starfruit / starfruitCounter;
                                                 rateResult.starfruitResult = starfruitResult + " Starfruit(Leadership).jpg Leadership";
                      
                                        }
                                       if(arrayOfKeys[i] == 'Walnut')
                                        { walnut += peopleRatings[x].Wulnut; wulnutCounter += 1; 
                                           var walnutResult = walnut / walnutCounter;
                                                rateResult.walnutResult = walnutResult + " Wulnut(Humour).jpg Humour";
                          
                                        }
                                        if(arrayOfKeys[i] == 'Fig')
                                          { fig += peopleRatings[x].Fig; figCounter += 1; 
                                              var figResult = fig / figCounter;
                                                   rateResult.figResult = figResult + " Fig(Wisdom).jpg Wisdom";
                           
                                          }
                                         if(arrayOfKeys[i] == 'Pomengranate')
                                          { pomengranate += peopleRatings[x].Pomengranate; pomengranateCounter += 1; 
                                              var pomengranateResult = pomengranate / pomengranateCounter;
                                                   rateResult.pomengranateResult = pomengranateResult + " Pomengranate(Resourcefulness).jpg Resourcefulness";
                              
                                          }
                                          if(arrayOfKeys[i] == 'Orange')
                                            { orange += peopleRatings[x].Orange; orangeCounter += 1;
                                                  var orangeResult = orange / orangeCounter;
                                                       rateResult.orangeResult = orangeResult + " Orange(Insight).jpg Insight";
                                             }
                                           if(arrayOfKeys[i] == 'Cherry')
                                            { cherry += peopleRatings[x].Cherry; cherryCounter += 1; 
                                                 var cherryResult = cherry / cherryCounter;
                                                      rateResult.cherryResult = cherryResult + " Cherry(Holiness).jpg Holiness";
                                 
                                            }
                                            if(arrayOfKeys[i] == 'Watermellon')
                                              { watermellon += peopleRatings[x].Watermellon; watermellonCounter += 1;
                                                      var watermellonResult = watermellon / watermellonCounter;
                                                            rateResult.watermellonResult = watermellonResult + " Watermelon(Generosity).jpg Generosiy";
                                   
                                               }
                                             if(arrayOfKeys[i] == 'Guava')
                                              { guava += peopleRatings[x].Guava; guavaCounter += 1; 
                                                  var guavaResult = guava / guavaCounter;
                                                       rateResult.guavaResult = guavaResult + " Guava(Sincerity).jpg Sincerity";
                                     
                                              }
                                    if(arrayOfKeys[i] == 'KiwiFruit')
                                      { kiwifruit += peopleRatings[x].KiwiFruit; kiwiFruitCounter += 1;
                                         var kiwifruitResult = Kiwifruit / kiwiFruitCounter;
                                              rateResult.kiwifruitResult = kiwifruitResult + " Kiwifruit(Kindness).jpg Kindness";
                                       
                                      }
                                     if(arrayOfKeys[i] == 'BreadFruit')
                                      { breadfruit += peopleRatings[x].BreadFruit; breadFruitCounter += 1;
                                           var breadfruitResult = breadfruit / breadFruitCounter;
                                                rateResult.breadfruitResult = breadfruit / breadFruitCounter + " Breadfruit(Expertise).jpg Expertise";
                                          
                                       }
                                      if(arrayOfKeys[i] == 'Counterloupe')
                                        { counterloupe += peopleRatings[x].Counterloupe; counterloupeCounter += 1; 
                                            var counterloupeResult = counterloupe / counterloupeCounter;
                                                 rateResult.counterloupeResult = counterloupeResult + " Cantaloupe(Humility).jpg Humility";
                                            
                                        }
                                       if(arrayOfKeys[i] == 'Papaya')
                                        { papaya += peopleRatings[x].Papaya; papayaCounter += 1;
                                            var papayaResult = papaya / papayaCounter;
                                                 rateResult.papayaResult = papayaResult + " Papaya(Openness).jpg Openness";
                                             
                                         }
                                        if(arrayOfKeys[i] == 'Grape')
                                          { grape += peopleRatings[x].Grape; grapeCounter += 1; 
                                               var grapeResult = grape / grapeCounter;
                                                    rateResult.grapeResult = grapeResult + " Grape(Innocence).jpg Innocence";
                                             
                                          }
                                         if(arrayOfKeys[i] == 'Miracle')
                                          { miracle += peopleRatings[x].Miracle; miracleCounter += 1; 
                                               var miracleResult = miracle / miracleCounter;
                                                    rateResult.miracleResult = miracleResult + " Miraclefruit(Helpfulness).jpg Helpfulness"; 
                            
                                          }
                                          if(arrayOfKeys[i] == 'HuckleBerry')
                                            { huckleBerry += peopleRatings[x].HuckleBerry; huckleBerryCounter += 1;
                                                 var huckleBerryResult = huckleBerry / huckleBerryCounter;
                                                       rateResult.huckleBerryResult = huckleBerryResult + " Huckleberry(Friendliness).jpg Huckleberry";
                             
                                            }
                                           if(arrayOfKeys[i] == 'Pineapple')
                                            { pineapple += peopleRatings[x].Pineapple; pineappleCounter += 1;
                                                  var pineappleResult = pineapple / pineappleCounter;
                                                        rateResult.pineappleResult = pineappleResult + " Pineapple(Patience).jpg Patience";
                             
                                             }
                                            if(arrayOfKeys[i] == 'Tamarind')
                                              { tamarind += peopleRatings[x].Tamarind; tamarindCounter += 1;
                                                   var tamarindResult = tamarind / tamarindCounter;
                                                         rateResult.tamarindResult = tamarindResult + " Tamarind(Trustworthiness).jpg Trustworthiness";
                                
                                               }
                                             if(arrayOfKeys[i] == 'BlueBerry')
                                              { blueBerry += peopleRatings[x].BlueBerry; blueBerryCounter += 1; 
                                                  var blueBerryResult = blueBerry / blueBerryCounter;
                                                        rateResult.blueBerryResult = blueBerryResult + " Blueberry(Empathy).jpg Empathy";
                                  
                                              }
                                    if(arrayOfKeys[i] == 'BlackCurrant')
                                      { blackCurrant += peopleRatings[x].BlackCurrant; blackCurrantCounter += 1;
                                          var blackCurrantResult = blackCurrant / blackCurrantCounter;
                                                rateResult.blackCurrantResult = blackCurrantResult + " Blackcurrant(Brilliance).jpg Brilliance";
                                   
                                       }
                                     if(arrayOfKeys[i] == 'Jujube')
                                       { jujube += peopleRatings[x].Jujube; jujubeCounter += 1; 
                                            var jujubeResult = jujube / jujubeCounter;
                                                  rateResult.jujubeResult = jujubeResult + " Jujube(Tolerance).jpg Tolorence";
                                       
                                       }
                                      if(arrayOfKeys[i] == 'Lime')
                                        { lime += peopleRatings[x].Lime; limeCounter += 1;
                                            var limeResult = lime / limeCounter;
                                                   rateResult.limeResult = limeResult + " Lime(Frankness).jpg Frankness";
                                         
                                        }
                                       if(arrayOfKeys[i] == 'JackFruit')
                                         { jackfruit += peopleRatings[x].JackFruit; jackFruitCounter += 1;
                                              var jackfruitResult = jackfruit / jackFruitCounter;
                                                    rateResult.jackfruitResult = jackfruitResult + " Jackfruit(Capacity).jpg Capacity";
                                         
                                         }
                                        if(arrayOfKeys[i] == 'Longan')
                                          { longan += peopleRatings[x].Longan; longanCounter += 1;
                                              var longanResult = longan / longanCounter;
                                                    rateResult.longanResult = longanResult + " Longan(Emotional Intelligence).jpg Emotional Intelligence";
                                           
                                          }
                                         if(arrayOfKeys[i] == 'Kolanut')
                                          { kolanut += peopleRatings[x].Kolanut; kolanutCounter += 1; 
                                              var kolanutResult = kolanut / kolanutCounter;
                                                    rateResult.kolanutResult = kolanutResult + " Kolanut(Courtesy).jpg Courtesy";
                                             
                                          }
                                          if(arrayOfKeys[i] == 'Bitter')
                                            { bitter += peopleRatings[x].Bitter; bitterCounter += 1; 
                                                var bitterResult = bitter / bitterCounter;
                                                      rateResult.bitterResult = bitterResult + " Bitter Kola(Honour).jpg Honour";
                                                 
                                            }
                                           if(arrayOfKeys[i] == 'Peach')
                                               { peach += peopleRatings[x].Peach; peachCounter += 1;
                                                   var peachResult = peach / peachCounter;
                                                        rateResult.peachResult = peachResult + " Peach(Excellence).jpg Excellence";
                     
                                                }
                                            if(arrayOfKeys[i] == 'Lychee')
                                              { lychee += peopleRatings[x].Lychee; lycheeCounter += 1; 
                                                    var lycheeResult = lychee / lycheeCounter;
                                                          rateResult.lycheeResult = lycheeResult + " Lychee(Loyalty).jpg Loyalty";
                        
                                              }
                                             if(arrayOfKeys[i] == 'Damson')
                                              { damson += peopleRatings[x].Damson; damsonCounter += 1; 
                                                   var damsonResult = damson / damsonCounter;
                                                         rateResult.damsonResult = damsonResult + " Damson(Honesty).jpg Honesty";
                          
                                              }
                                if(arrayOfKeys[i] == 'Cashew')
                                  { cashew += peopleRatings[x].Cashew; cashewCounter += 1; 
                                      var cashewResult = cashew / cashewCounter;
                                           rateResult.cashewResult = cashewResult + " Cashew(Optimism).jpg Optimism";
                         
                                  }
                                 if(arrayOfKeys[i] == 'Mango')
                                   { mango += peopleRatings[x].Mango; mangoCounter += 1; 
                                        var mangoResult = mango / mangoCounter;
                                              rateResult.mangoResult = mangoResult + " Mango(Fairness).jpg Fairness";
                          
                                   }
                                  if(arrayOfKeys[i] == 'Avocado')
                                    { avocado += peopleRatings[x].Avocado; avocadoCounter += 1;
                                        var avocadoResult = avocado / avocadoCounter;
                                              rateResult.avocadoResult = avocadoResult + " Avocado(Compassion).jpg Compassion";
                                    }
                                   if(arrayOfKeys[i] == 'Pear')
                                    { pear += peopleRatings[x].Pear; pearCounter += 1;
                                        var pearResult = pear / pearCounter;
                                              rateResult.pearResult = pearResult + " Pear(Grace).jpg Grace";
                            
                                     }
                                    if(arrayOfKeys[i] == 'Loquat')
                                      { loquat += peopleRatings[x].Loquat; loquatCounter += 1;
                                             var loquatResult = loquat / loquatCounter;  
                                                   rateResult.loquatResult =loquatResult + " Loquat(Reliability).jpg Reliability";  

                                      }
                                       console.timeEnd('NAME......................................PPPP');
                                 // console.log(rateResult);
                                 // console.log('thats rateResult Value!!!!');
                              }
                          
                        }
                        
                       // console.log(loopingtime + '    thats looping time...................../////')
                        if((loopingtime = 'circle completed!!!')){
                             setTimeout(function(){
                                         console.log(rateResult);
                                         //console.log(loopingtime);
                                         sendingRateResultToClient(rateResult);
                                         console.log('FINAL RateResult  ............................');
                                    }, 0010);
                        }

                    };

                        function firstloopfunction(loopingtime, loopingValue, arrayOfClosePeople, userRating){
                 // console.log(loopingtime);
                 // console.log('something is wrong somewhere!!!!!!!!!!!!!!!!!!!!!!!!');
              
                  for(var i=0; i <= arrayOfClosePeople.length; i++){
                          console.time('BEGINS......................................PPPP');
                           if(loopingValue == arrayOfClosePeople[i]){
                              peopleRatings[loopingValue] = userRating;
                               console.log(peopleRatings);
                               console.log('thats it above,,,,');
                           }
                          console.timeEnd('BEGINS......................................PPPP');
                  }
                   
                   //console.log(peopleRatings);
                  if(loopingtime == 'circle completed!!!'){
                      setTimeout(function(){
                           ///console.log(peopleRatings);
                           //console.log('popopoppopooiiiiiiiiiiiiiiiiuuuuuuuuuu');
                           callingFunctionToGetRatings(arrayOfClosePeople);
                      }, 0010);
                  }
                        }


                        function gettingPostersEmail(passedIdentity){
                var sql = 'SELECT Email FROM daisesposting WHERE DaisesIdentity = ?';
                   connection.query(sql, [passedIdentity], function(error, results, fields){
                           if(error)throw error;
                               var postersEmail = results[0].Email;
                               gettingClosePeople(postersEmail, function(arrayOfClosePeople){
                                console.log('this function ran');
                                  if(Object.keys(checkIfRating).length != 0){
                                    //console.log(checkIfRating);
                                         function callingSetTimeFunction(loopingtime, loopingValue, arrayOfClosePeople, userRating){ // called at the last loop
                                               setTimeout(function(){
                                                  loopingtime = 'circle completed!!!';
                                                  firstloopfunction(loopingtime, loopingValue, arrayOfClosePeople, userRating);
                                               }, 0010);
                                         }

                                         var gettingArrayLength = Object.keys(checkIfRating).length;
                                         console.log(checkIfRating);
                                         console.log('people');
                                          for(x in checkIfRating){
                                               var userRating = checkIfRating[x];
                                               var loopingValue = x;
                                               firstCounter++;
                                               loopingtime = 'not finished looping';

                                               if(firstCounter == gettingArrayLength){
                                                  loopingtime = 'finished looping';
                                                  console.log('something is not right2');
                                                  callingSetTimeFunction(loopingtime, loopingValue, arrayOfClosePeople, userRating);
                                                  return;
                                               }

                                               firstloopfunction(loopingtime, loopingValue, arrayOfClosePeople, userRating);
                                               
                                          }

                                          
                                  }  
                              });
                   });          
                        }*/

                        var passedIdentity = req.body.sentData;
                        gettingPostersEmail(passedIdentity);
                }, function(){
                  db.close();

            }); //closing of the cursor.forEach!
      });
});


app.post('/gettingRating', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
             console.log(req.body.sentData + "   this is body");
            
             var apple = 0, blueBerry = 0, blackCurrant = 0, kiwifruit = 0, blackBerry = 0, jujube = 0, lime = 0,jackfruit = 0, longan = 0, kolanut = 0, guava = 0,
                 breadfruit = 0, grape = 0, miracle = 0, huckleBerry = 0, counterloupe = 0, papaya = 0, lemon = 0, wulnut = 0, fig = 0, 
                  pomengranate = 0, orange = 0, cherry = 0, watermellon = 0, tangerine = 0, passionFruit = 0, starfruit = 0, coconut = 0, olive = 0, date = 0, 
                   dragonFruit = 0, damsom = 0, mango = 0, avocado = 0, pineapple = 0, bitter = 0, peach = 0,lychee = 0, tamarind = 0, blackBerry = 0, banana = 0, durian = 0, cucumber = 0,
                    appleCounter = 0, bananaCounter = 0, cucumberCounter = 0, durianCounter = 0, dragonfruitCounter = 0, blackberryCounter = 0, 
                     dateCounter = 0, loquat = 0,pear = 0, cashew = 0, wulnutCounter = 0, figCounter = 0, orangeCounter = 0, cherryCounter = 0, watermellonCounter = 0, pomengranateCounter = 0, 
                      coconutCounter = 0, guavaCounter = 0, oliveCounter = 0, lemonCounter = 0, tangerineCounter = 0, passionFruitCounter = 0, starfruitCounter = 0,
                       kiwiFruitCounter = 0, blackCurrantCounter = 0, jujubeCounter = 0, limeCounter = 0, grapeCounter = 0, miracleCounter = 0, huckleBerryCounter = 0, breadFruitCounter = 0, counterloupeCounter = 0, papayaCounter = 0,
                        pineappleCounter = 0, bitterCounter = 0, peachCounter = 0, lycheeCounter = 0, jackFruitCounter = 0,longanCounter = 0,kolanutCounter = 0, tamarindCounter = 0, blueBerryCounter = 0,
                         damsonCounter = 0, cashewCounter = 0, loquatCounter = 0, mangoCounter = 0, pearCounter = 0, avocadoCounter = 0;
             var rateResult = {}; 
          mongo.connect(url, function(err, db){
            var cursor = db.collection('daisesratings').find({'name': "Ratings of Daises"}).limit(1);
                  cursor.forEach(function(doc, err){
                   if(err) throw err;   
                   var checkIfRating = doc.Rating[req.body.sentData]; // returns an object!
                   console.log(checkIfRating);
                   console.log(checkIfRating + "  this is the value from DataBase");

                if(Object.keys(checkIfRating).length != 0)
                    console.log('this code executed');
                        //do something!
                        {
                          for(x in checkIfRating){
                            //checkIfRating[x]      // returns an object
                           var arrayOfKeys = Object.keys(checkIfRating[x]);   // returns an array of keys
                               console.log(arrayOfKeys + "   this is the array of keys")
                              for(i=0; i<=arrayOfKeys.length; i++){
                                    //do something!
                                    if(arrayOfKeys[i] == 'Apple')
                                       { apple += checkIfRating[x].Apple; appleCounter += 1; 
                                           var appleResult = apple / appleCounter;  // returns a number (percentage Average of ratings)
                                                rateResult.appleResult = appleResult + " Apple(Love).jpg Love";
                                       }
                                     if(arrayOfKeys[i] == 'Banana')
                                        { banana += checkIfRating[x].Banana; bananaCounter += 1; 
                                          var bananaResult = banana / bananaCounter;
                                               rateResult.bananaResult = bananaResult + " Banana(Creativity).jpg Creativity";
                            
                                        }
                                      if(arrayOfKeys[i] == 'Durian')
                                        { durian += checkIfRating[x].Durian; durianCounter += 1; 
                                           var durianResult = durian / durianCounter;
                                                rateResult.durianResult = durianResult + " Durian(Confidence).jpg Confidence";
                              
                                        }
                                       if(arrayOfKeys[i] == 'Cucumber')
                                        { cucumber += checkIfRating[x].Cucumber; cucumberCounter += 1; 
                                            var cucumberResult = cucumber / cucumberCounter;
                                                 rateResult.cucumberResult = cucumberResult + " Cucumber(Caring).jpg Caring";
                               
                                        }
                                        if(arrayOfKeys[i] == 'Date')
                                          { date += checkIfRating[x].Date; dateCounter += 1; 
                                              var dateResult = date / dateCounter;
                                                   rateResult.dateResult = dateResult + " Date(Consistency).jpg Consistency";
                                
                                          }
                                         if(arrayOfKeys[i] == 'DragonFruit')
                                          { dragonFruit += checkIfRating[x].DragonFruit; dragonfruitCounter += 1;
                                             var dragonFruitResult = dragonFruit / dragonfruitCounter;
                                                  rateResult.dragonFruitResult = dragonFruitResult + " DragonFruit(Knowledge).jpg Knowledge";
                                     
                                          }
                                          if(arrayOfKeys[i] == 'BlackBerry')
                                            { blackBerry += checkIfRating[x].BlackBerry; blackberryCounter += 1;
                                                 var blackBerryResult = blackBerry / blackberryCounter;
                                                      rateResult.blackBerryResult = blackBerryResult + " Blackberry(Experience).jpg Experience";
                                   
                                             }
                                           if(arrayOfKeys[i] == 'Olive')
                                             { olive += checkIfRating[x].Olive; oliveCounter += 1;
                                                   var oliveResult = olive / oliveCounter;
                                                        rateResult.oliveResult = oliveResult + " Olive(Faithfulness).jpg Faithfulness";
                                        
                                             }
                                            if(arrayOfKeys[i] == 'Coconut')
                                              { coconut += checkIfRating[x].Coconut; coconutCounter += 1;
                                                    var coconutResult = coconut / coconutCounter;
                                                         rateResult.coconutResult = coconutResult + " Coconut(intelligence).jpg Intelligence";
                                          
                                             }
                                             if(arrayOfKeys[i] == 'Lemon')
                                              { lemon += checkIfRating[x].Lemon; lemonCounter += 1; 
                                                 var lemonResult = lemon / lemonCounter;
                                                      rateResult.lemonResult = lemonResult + " Lemon(Thouroughness).jpg Thouroughness";
                                            
                                              }
                                    if(arrayOfKeys[i] == 'Tangerine')
                                      { tangerine += checkIfRating[x].Tangerine; tangerineCounter += 1; 
                                          var tangerineResult = tangerine / tangerineCounter;
                                                  rateResult.tangerineResult = tangerineResult + " Tangerine(Cooperation).jpg Cooperation";
                                      }
                                     if(arrayOfKeys[i] == 'PassionFruit')
                                       { passionFruit += checkIfRating[x].PassionFruit; passionfruitCounter += 1; 
                                         var passionFruitResult = passionFruit / passionfruitCounter;
                                              rateResult.passionFruitResult = passionFruitResult + " Passionfruit(Passion).jpg Passion";
                         
                                       }
                                      if(arrayOfKeys[i] == 'Starfruit')
                                        { starfruit += checkIfRating[x].Starfruit; starfruitCounter += 1; 
                                            var starfruitResult = starfruit / starfruitCounter;
                                                 rateResult.starfruitResult = starfruitResult + " Starfruit(Leadership).jpg Leadership";
                      
                                        }
                                       if(arrayOfKeys[i] == 'Walnut')
                                        { walnut += checkIfRating[x].Wulnut; wulnutCounter += 1; 
                                           var walnutResult = walnut / walnutCounter;
                                                rateResult.walnutResult = walnutResult + " Wulnut(Humour).jpg Humour";
                          
                                        }
                                        if(arrayOfKeys[i] == 'Fig')
                                          { fig += checkIfRating[x].Fig; figCounter += 1; 
                                              var figResult = fig / figCounter;
                                                   rateResult.figResult = figResult + " Fig(Wisdom).jpg Wisdom";
                           
                                          }
                                         if(arrayOfKeys[i] == 'Pomengranate')
                                          { pomengranate += checkIfRating[x].Pomengranate; pomengranateCounter += 1; 
                                              var pomengranateResult = pomengranate / pomengranateCounter;
                                                   rateResult.pomengranateResult = pomengranateResult + " Pomengranate(Resourcefulness).jpg Resourcefulness";
                              
                                          }
                                          if(arrayOfKeys[i] == 'Orange')
                                            { orange += checkIfRating[x].Orange; orangeCounter += 1;
                                                  var orangeResult = orange / orangeCounter;
                                                       rateResult.orangeResult = orangeResult + " Orange(Insight).jpg Insight";
                                             }
                                           if(arrayOfKeys[i] == 'Cherry')
                                            { cherry += checkIfRating[x].Cherry; cherryCounter += 1; 
                                                 var cherryResult = cherry / cherryCounter;
                                                      rateResult.cherryResult = cherryResult + " Cherry(Holiness).jpg Holiness";
                                 
                                            }
                                            if(arrayOfKeys[i] == 'Watermellon')
                                              { watermellon += checkIfRating[x].Watermellon; watermellonCounter += 1;
                                                      var watermellonResult = watermellon / watermellonCounter;
                                                            rateResult.watermellonResult = watermellonResult + " Watermelon(Generosity).jpg Generosiy";
                                   
                                               }
                                             if(arrayOfKeys[i] == 'Guava')
                                              { guava += checkIfRating[x].Guava; guavaCounter += 1; 
                                                  var guavaResult = guava / guavaCounter;
                                                       rateResult.guavaResult = guavaResult + " Guava(Sincerity).jpg Sincerity";
                                     
                                              }
                                    if(arrayOfKeys[i] == 'KiwiFruit')
                                      { kiwifruit += checkIfRating[x].KiwiFruit; kiwiFruitCounter += 1;
                                         var kiwifruitResult = Kiwifruit / kiwiFruitCounter;
                                              rateResult.kiwifruitResult = kiwifruitResult + " Kiwifruit(Kindness).jpg Kindness";
                                       
                                      }
                                     if(arrayOfKeys[i] == 'BreadFruit')
                                      { breadfruit += checkIfRating[x].BreadFruit; breadFruitCounter += 1;
                                           var breadfruitResult = breadfruit / breadFruitCounter;
                                                rateResult.breadfruitResult = breadfruit / breadFruitCounter + " Breadfruit(Expertise).jpg Expertise";
                                          
                                       }
                                      if(arrayOfKeys[i] == 'Counterloupe')
                                        { counterloupe += checkIfRating[x].Counterloupe; counterloupeCounter += 1; 
                                            var counterloupeResult = counterloupe / counterloupeCounter;
                                                 rateResult.counterloupeResult = counterloupeResult + " Cantaloupe(Humility).jpg Humility";
                                            
                                        }
                                       if(arrayOfKeys[i] == 'Papaya')
                                        { papaya += checkIfRating[x].Papaya; papayaCounter += 1;
                                            var papayaResult = papaya / papayaCounter;
                                                 rateResult.papayaResult = papayaResult + " Papaya(Openness).jpg Openness";
                                             
                                         }
                                        if(arrayOfKeys[i] == 'Grape')
                                          { grape += checkIfRating[x].Grape; grapeCounter += 1; 
                                               var grapeResult = grape / grapeCounter;
                                                    rateResult.grapeResult = grapeResult + " Grape(Innocence).jpg Innocence";
                                             
                                          }
                                         if(arrayOfKeys[i] == 'Miracle')
                                          { miracle += checkIfRating[x].Miracle; miracleCounter += 1; 
                                               var miracleResult = miracle / miracleCounter;
                                                    rateResult.miracleResult = miracleResult + " Miraclefruit(Helpfulness).jpg Helpfulness"; 
                            
                                          }
                                          if(arrayOfKeys[i] == 'HuckleBerry')
                                            { huckleBerry += checkIfRating[x].HuckleBerry; huckleBerryCounter += 1;
                                                 var huckleBerryResult = huckleBerry / huckleBerryCounter;
                                                       rateResult.huckleBerryResult = huckleBerryResult + " Huckleberry(Friendliness).jpg Huckleberry";
                             
                                            }
                                           if(arrayOfKeys[i] == 'Pineapple')
                                            { pineapple += checkIfRating[x].Pineapple; pineappleCounter += 1;
                                                  var pineappleResult = pineapple / pineappleCounter;
                                                        rateResult.pineappleResult = pineappleResult + " Pineapple(Patience).jpg Patience";
                             
                                             }
                                            if(arrayOfKeys[i] == 'Tamarind')
                                              { tamarind += checkIfRating[x].Tamarind; tamarindCounter += 1;
                                                   var tamarindResult = tamarind / tamarindCounter;
                                                         rateResult.tamarindResult = tamarindResult + " Tamarind(Trustworthiness).jpg Trustworthiness";
                                
                                               }
                                             if(arrayOfKeys[i] == 'BlueBerry')
                                              { blueBerry += checkIfRating[x].BlueBerry; blueBerryCounter += 1; 
                                                  var blueBerryResult = blueBerry / blueBerryCounter;
                                                        rateResult.blueBerryResult = blueBerryResult + " Blueberry(Empathy).jpg Empathy";
                                  
                                              }
                                    if(arrayOfKeys[i] == 'BlackCurrant')
                                      { blackCurrant += checkIfRating[x].BlackCurrant; blackCurrantCounter += 1;
                                          var blackCurrantResult = blackCurrant / blackCurrantCounter;
                                                rateResult.blackCurrantResult = blackCurrantResult + " Blackcurrant(Brilliance).jpg Brilliance";
                                   
                                       }
                                     if(arrayOfKeys[i] == 'Jujube')
                                       { jujube += checkIfRating[x].Jujube; jujubeCounter += 1; 
                                            var jujubeResult = jujube / jujubeCounter;
                                                  rateResult.jujubeResult = jujubeResult + " Jujube(Tolerance).jpg Tolorence";
                                       
                                       }
                                      if(arrayOfKeys[i] == 'Lime')
                                        { lime += checkIfRating[x].Lime; limeCounter += 1;
                                            var limeResult = lime / limeCounter;
                                                   rateResult.limeResult = limeResult + " Lime(Frankness).jpg Frankness";
                                         
                                        }
                                       if(arrayOfKeys[i] == 'JackFruit')
                                         { jackfruit += checkIfRating[x].JackFruit; jackFruitCounter += 1;
                                              var jackfruitResult = jackfruit / jackFruitCounter;
                                                    rateResult.jackfruitResult = jackfruitResult + " Jackfruit(Capacity).jpg Capacity";
                                         
                                         }
                                        if(arrayOfKeys[i] == 'Longan')
                                          { longan += checkIfRating[x].Longan; longanCounter += 1;
                                              var longanResult = longan / longanCounter;
                                                    rateResult.longanResult = longanResult + " Longan(Emotional Intelligence).jpg Emotional Intelligence";
                                           
                                          }
                                         if(arrayOfKeys[i] == 'Kolanut')
                                          { kolanut += checkIfRating[x].Kolanut; kolanutCounter += 1; 
                                              var kolanutResult = kolanut / kolanutCounter;
                                                    rateResult.kolanutResult = kolanutResult + " Kolanut(Courtesy).jpg Courtesy";
                                             
                                          }
                                          if(arrayOfKeys[i] == 'Bitter')
                                            { bitter += checkIfRating[x].Bitter; bitterCounter += 1; 
                                                var bitterResult = bitter / bitterCounter;
                                                      rateResult.bitterResult = bitterResult + " Bitter Kola(Honour).jpg Honour";
                                                 
                                            }
                                           if(arrayOfKeys[i] == 'Peach')
                                               { peach += checkIfRating[x].Peach; peachCounter += 1;
                                                   var peachResult = peach / peachCounter;
                                                        rateResult.peachResult = peachResult + " Peach(Excellence).jpg Excellence";
                     
                                                }
                                            if(arrayOfKeys[i] == 'Lychee')
                                              { lychee += checkIfRating[x].Lychee; lycheeCounter += 1; 
                                                    var lycheeResult = lychee / lycheeCounter;
                                                          rateResult.lycheeResult = lycheeResult + " Lychee(Loyalty).jpg Loyalty";
                        
                                              }
                                             if(arrayOfKeys[i] == 'Damson')
                                              { damson += checkIfRating[x].Damson; damsonCounter += 1; 
                                                   var damsonResult = damson / damsonCounter;
                                                         rateResult.damsonResult = damsonResult + " Damson(Honesty).jpg Honesty";
                          
                                              }
                                if(arrayOfKeys[i] == 'Cashew')
                                  { cashew += checkIfRating[x].Cashew; cashewCounter += 1; 
                                      var cashewResult = cashew / cashewCounter;
                                           rateResult.cashewResult = cashewResult + " Cashew(Optimism).jpg Optimism";
                         
                                  }
                                 if(arrayOfKeys[i] == 'Mango')
                                   { mango += checkIfRating[x].Mango; mangoCounter += 1; 
                                        var mangoResult = mango / mangoCounter;
                                              rateResult.mangoResult = mangoResult + " Mango(Fairness).jpg Fairness";
                          
                                   }
                                  if(arrayOfKeys[i] == 'Avocado')
                                    { avocado += checkIfRating[x].Avocado; avocadoCounter += 1;
                                        var avocadoResult = avocado / avocadoCounter;
                                              rateResult.avocadoResult = avocadoResult + " Avocado(Compassion).jpg Compassion";
                                    }
                                   if(arrayOfKeys[i] == 'Pear')
                                    { pear += checkIfRating[x].Pear; pearCounter += 1;
                                        var pearResult = pear / pearCounter;
                                              rateResult.pearResult = pearResult + " Pear(Grace).jpg Grace";
                            
                                     }
                                    if(arrayOfKeys[i] == 'Loquat')
                                      { loquat += checkIfRating[x].Loquat; loquatCounter += 1;
                                             var loquatResult = loquat / loquatCounter;  
                                                   rateResult.loquatResult =loquatResult + " Loquat(Reliability).jpg Reliability";  

                                      }
                                  
                              }
                          
                        }
                       
                          var rateResultLength = Object.keys(rateResult).length;
                                 console.log(rateResultLength + "   this is rateResultLength");
                                 console.log(rateResult);
                          if(rateResultLength == 0){
                            res.send({'myName': 'No Rating Yet!!'});
                            return;
                          }

                          console.log(rateResult + "   this is rateResult")
                          res.send({"myName": rateResult});
                          console.log('It ran!')
                    }
                  
                  
                 }, function(){
                   db.close();
                 });
           });
});

app.post('/updateRatingFrontEnd', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
       var pIdentity = req.body.sentData.split(' ')[1];
       var email = req.body.sentData.split(' ')[0];
       function getAllFriendsRatings(){
          var apple = 0, blackCurrant = 0, blueBerry = 0, blackBerry = 0, jujube = 0, lime = 0,jackfruit = 0, longan = 0, kolanut = 0, guava = 0,
                 breadfruit = 0, grape = 0, miracle = 0, huckleBerry = 0, counterloupe = 0, papaya = 0, lemon = 0, wulnut = 0, fig = 0, 
                  pomengranate = 0, orange = 0, cherry = 0, watermellon = 0, tangerine = 0, passionFruit = 0, starfruit = 0, coconut = 0, olive = 0, date = 0, 
                   dragonFruit = 0, damsom = 0, mango = 0, avocado = 0, pineapple = 0, bitter = 0, peach = 0,lychee = 0, tamarind = 0, blackBerry = 0, banana = 0, durian = 0, cucumber = 0,
                    appleCounter = 0, bananaCounter = 0, cucumberCounter = 0, durianCounter = 0, dragonfruitCounter = 0, blackberryCounter = 0, 
                     dateCounter = 0, loquat = 0,pear = 0, cashew = 0, wulnutCounter = 0, figCounter = 0, orangeCounter = 0, cherryCounter = 0, watermellonCounter = 0, pomengranateCounter = 0, 
                      coconutCounter = 0, guavaCounter = 0, oliveCounter = 0, lemonCounter = 0, tangerineCounter = 0, passionFruitCounter = 0, starfruitCounter = 0,
                       kiwiFruitCounter = 0, blackCurrantCounter = 0, jujubeCounter = 0, limeCounter = 0, grapeCounter = 0, miracleCounter = 0, huckleBerryCounter = 0, breadFruitCounter = 0, counterloupeCounter = 0, papayaCounter = 0,
                        pineappleCounter = 0, bitterCounter = 0, peachCounter = 0, lycheeCounter = 0, jackFruitCounter = 0,longanCounter = 0,kolanutCounter = 0, tamarindCounter = 0, blueBerryCounter = 0,
                         damsonCounter = 0, cashewCounter = 0, loquatCounter = 0, mangoCounter = 0, pearCounter = 0, avocadoCounter = 0;
          var rateResult = {}; 
          var peopleRatings = {};
          var firstCounter = 0;
          var arrayCounter = 0;
          var finalLoop;
          var loopingtime;

          mongo.connect(url, function(err, db){
            var cursor = db.collection('daisesratings').find({'name': "Ratings of Daises"}).limit(1);
                cursor.forEach(function(doc, err){
                    if(err) throw err;   
                        var checkIfRating = doc.Rating[req.body.sentData.split(' ')[1]];

                        function gettingClosePeople(postersEmail, callBack){
                              var postersEmail = postersEmail;
                              var tag = '';
                              var sql = 'SELECT * FROM friendstable WHERE OwnerEmail = ? AND Tag IS NOT NULL';
                              connection.query(sql, [postersEmail], function(error, results, fields){
                                   if(error)throw error;
                                     var arrayData = [];
                                     var lengthCounter = 0;
                                     var lengthCounter2 = 0;
                                     var arrayOfClosePeople = [];
                                     for(x in results){
                                        lengthCounter++;
                                        if(results[x].Tag == 'Friends'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results[x].Tag == 'Love'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results[x].Tag == 'Family'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results[x].Tag == 'Colleague'){
                                            arrayData.push(results[x].FriendEmail);
                                        }
                                        if(results.length == lengthCounter){
                                          for(var i=0; i < arrayData.length; i++){
                                               lengthCounter2++;
                                               arrayOfClosePeople.push(arrayData[i].split('.')[0]);
                                               console.log(arrayOfClosePeople);
                                               console.log('thats array of Close!!!!!!!!!!!');
                                               if(arrayData.length == lengthCounter2){
                                                   //console.log(lengthCounter2);
                                                   //console.log('that is length counter .......');
                                                   callBack(arrayOfClosePeople);
                                               }
                                          }
                                        }

                                     }
                              });
                        }
                        
                        function sendingRateResultToClient(rateResult){
                             // console.log('the loop ran up to this level   BINGO...........');
                             var rateResultLength = Object.keys(rateResult).length;
                                
                             if(rateResultLength == 0){
                              res.send({'myName': 'No Rating Yet!!'});
                              console.log(rateResult);
                              //console.log('its from this end///////////////////////////////////////////');
                              return;
                             }

                             function updateDaisesPostingTable(ratedAverage){
                                  var sql = 'UPDATE daisesPosting SET RateAvg2 = ? Where DaisesIdentity = ?';
                                  connection.query(sql, [ratedAverage, pIdentity], function(error, results, fields){
                                      if(error)throw error;
                                      console.log()
                                  });
                             }

                             var keyLength = Object.keys(rateResult).length;
                             var rateResultCounter = 0;
                             var dataSum = 0;
                             var ratedAverage;
                             for(x in rateResult){
                                  rateResultCounter++;
                                  dataSum += Number(rateResult[x].split(' ')[0]);
                                  console.log(dataSum);
                                  if(rateResultCounter == keyLength){
                                       ratedAverage = dataSum / rateResultCounter;
                                       res.send({'message': ratedAverage, 'typeOfRater': 'close person'});
                                       updateDaisesPostingTable(ratedAverage);
                                  }
                             }
                        }

            function callingFunctionToGetRatings(arrayOfClosePeople){
                    //console.log('???????????????????????????????////');
                    console.log(peopleRatings);
                    console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');
                             // console.log(peopleRatings);
                              console.log('thats people ratings above.......................');
                              var arrayOfKeys = Object.keys(peopleRatings);
                              var iteratingCounter = 0;
                              var finalCounter = 0;

                              for(x in peopleRatings){
                            //checkIfRating[x]      // returns an object
                           var arrayOfKeys = Object.keys(peopleRatings[x]);   // returns an array of keys
                               console.log(arrayOfKeys + "   this is the array of keys")
                              for(i=0; i < arrayOfKeys.length; i++){
                                 console.time('NAME......................................PPPP');
                                     finalCounter++;
                                    if(arrayOfKeys[i] == 'Apple')
                                       { apple += peopleRatings[x].Apple; appleCounter += 1; 
                                           var appleResult = apple / appleCounter;  // returns a number (percentage Average of ratings)
                                                rateResult.appleResult = appleResult + " Apple(Love).jpg Love";
                                       }
                                     if(arrayOfKeys[i] == 'Banana')
                                        { banana += peopleRatings[x].Banana; bananaCounter += 1; 
                                          var bananaResult = banana / bananaCounter;
                                               rateResult.bananaResult = bananaResult + " Banana(Creativity).jpg Creativity";
                            
                                        }
                                      if(arrayOfKeys[i] == 'Durian')
                                        { durian += peopleRatings[x].Durian; durianCounter += 1; 
                                           var durianResult = durian / durianCounter;
                                                rateResult.durianResult = durianResult + " Durian(Confidence).jpg Confidence";
                              
                                        }
                                       if(arrayOfKeys[i] == 'Cucumber')
                                        { cucumber += peopleRatings[x].Cucumber; cucumberCounter += 1; 
                                            var cucumberResult = cucumber / cucumberCounter;
                                                 rateResult.cucumberResult = cucumberResult + " Cucumber(Caring).jpg Caring";
                               
                                        }
                                        if(arrayOfKeys[i] == 'Date')
                                          { date += peopleRatings[x].Date; dateCounter += 1; 
                                              var dateResult = date / dateCounter;
                                                   rateResult.dateResult = dateResult + " Date(Consistency).jpg Consistency";
                                
                                          }
                                         if(arrayOfKeys[i] == 'DragonFruit')
                                          { dragonFruit += peopleRatings[x].DragonFruit; dragonfruitCounter += 1;
                                             var dragonFruitResult = dragonFruit / dragonfruitCounter;
                                                  rateResult.dragonFruitResult = dragonFruitResult + " DragonFruit(Knowledge).jpg Knowledge";
                                     
                                          }
                                          if(arrayOfKeys[i] == 'BlackBerry')
                                            { blackBerry += peopleRatings[x].BlackBerry; blackberryCounter += 1;
                                                 var blackBerryResult = blackBerry / blackberryCounter;
                                                      rateResult.blackBerryResult = blackBerryResult + " Blackberry(Experience).jpg Experience";
                                   
                                             }
                                           if(arrayOfKeys[i] == 'Olive')
                                             { olive += peopleRatings[x].Olive; oliveCounter += 1;
                                                   var oliveResult = olive / oliveCounter;
                                                        rateResult.oliveResult = oliveResult + " Olive(Faithfulness).jpg Faithfulness";
                                        
                                             }
                                            if(arrayOfKeys[i] == 'Coconut')
                                              { coconut += peopleRatings[x].Coconut; coconutCounter += 1;
                                                    var coconutResult = coconut / coconutCounter;
                                                         rateResult.coconutResult = coconutResult + " Coconut(intelligence).jpg Intelligence";
                                          
                                             }
                                             if(arrayOfKeys[i] == 'Lemon')
                                              { lemon += peopleRatings[x].Lemon; lemonCounter += 1; 
                                                 var lemonResult = lemon / lemonCounter;
                                                      rateResult.lemonResult = lemonResult + " Lemon(Thouroughness).jpg Thouroughness";
                                            
                                              }
                                    if(arrayOfKeys[i] == 'Tangerine')
                                      { tangerine += peopleRatings[x].Tangerine; tangerineCounter += 1; 
                                          var tangerineResult = tangerine / tangerineCounter;
                                                  rateResult.tangerineResult = tangerineResult + " Tangerine(Cooperation).jpg Cooperation";
                                      }
                                     if(arrayOfKeys[i] == 'PassionFruit')
                                       { passionFruit += peopleRatings[x].PassionFruit; passionfruitCounter += 1; 
                                         var passionFruitResult = passionFruit / passionfruitCounter;
                                              rateResult.passionFruitResult = passionFruitResult + " Passionfruit(Passion).jpg Passion";
                         
                                       }
                                      if(arrayOfKeys[i] == 'Starfruit')
                                        { starfruit += peopleRatings[x].Starfruit; starfruitCounter += 1; 
                                            var starfruitResult = starfruit / starfruitCounter;
                                                 rateResult.starfruitResult = starfruitResult + " Starfruit(Leadership).jpg Leadership";
                      
                                        }
                                       if(arrayOfKeys[i] == 'Walnut')
                                        { walnut += peopleRatings[x].Wulnut; wulnutCounter += 1; 
                                           var walnutResult = walnut / walnutCounter;
                                                rateResult.walnutResult = walnutResult + " Wulnut(Humour).jpg Humour";
                          
                                        }
                                        if(arrayOfKeys[i] == 'Fig')
                                          { fig += peopleRatings[x].Fig; figCounter += 1; 
                                              var figResult = fig / figCounter;
                                                   rateResult.figResult = figResult + " Fig(Wisdom).jpg Wisdom";
                           
                                          }
                                         if(arrayOfKeys[i] == 'Pomengranate')
                                          { pomengranate += peopleRatings[x].Pomengranate; pomengranateCounter += 1; 
                                              var pomengranateResult = pomengranate / pomengranateCounter;
                                                   rateResult.pomengranateResult = pomengranateResult + " Pomengranate(Resourcefulness).jpg Resourcefulness";
                              
                                          }
                                          if(arrayOfKeys[i] == 'Orange')
                                            { orange += peopleRatings[x].Orange; orangeCounter += 1;
                                                  var orangeResult = orange / orangeCounter;
                                                       rateResult.orangeResult = orangeResult + " Orange(Insight).jpg Insight";
                                             }
                                           if(arrayOfKeys[i] == 'Cherry')
                                            { cherry += peopleRatings[x].Cherry; cherryCounter += 1; 
                                                 var cherryResult = cherry / cherryCounter;
                                                      rateResult.cherryResult = cherryResult + " Cherry(Holiness).jpg Holiness";
                                 
                                            }
                                            if(arrayOfKeys[i] == 'Watermellon')
                                              { watermellon += peopleRatings[x].Watermellon; watermellonCounter += 1;
                                                      var watermellonResult = watermellon / watermellonCounter;
                                                            rateResult.watermellonResult = watermellonResult + " Watermelon(Generosity).jpg Generosiy";
                                   
                                               }
                                             if(arrayOfKeys[i] == 'Guava')
                                              { guava += peopleRatings[x].Guava; guavaCounter += 1; 
                                                  var guavaResult = guava / guavaCounter;
                                                       rateResult.guavaResult = guavaResult + " Guava(Sincerity).jpg Sincerity";
                                     
                                              }
                                    if(arrayOfKeys[i] == 'KiwiFruit')
                                      { kiwifruit += peopleRatings[x].KiwiFruit; kiwiFruitCounter += 1;
                                         var kiwifruitResult = Kiwifruit / kiwiFruitCounter;
                                              rateResult.kiwifruitResult = kiwifruitResult + " Kiwifruit(Kindness).jpg Kindness";
                                       
                                      }
                                     if(arrayOfKeys[i] == 'BreadFruit')
                                      { breadfruit += peopleRatings[x].BreadFruit; breadFruitCounter += 1;
                                           var breadfruitResult = breadfruit / breadFruitCounter;
                                                rateResult.breadfruitResult = breadfruit / breadFruitCounter + " Breadfruit(Expertise).jpg Expertise";
                                          
                                       }
                                      if(arrayOfKeys[i] == 'Counterloupe')
                                        { counterloupe += peopleRatings[x].Counterloupe; counterloupeCounter += 1; 
                                            var counterloupeResult = counterloupe / counterloupeCounter;
                                                 rateResult.counterloupeResult = counterloupeResult + " Cantaloupe(Humility).jpg Humility";
                                            
                                        }
                                       if(arrayOfKeys[i] == 'Papaya')
                                        { papaya += peopleRatings[x].Papaya; papayaCounter += 1;
                                            var papayaResult = papaya / papayaCounter;
                                                 rateResult.papayaResult = papayaResult + " Papaya(Openness).jpg Openness";
                                             
                                         }
                                        if(arrayOfKeys[i] == 'Grape')
                                          { grape += peopleRatings[x].Grape; grapeCounter += 1; 
                                               var grapeResult = grape / grapeCounter;
                                                    rateResult.grapeResult = grapeResult + " Grape(Innocence).jpg Innocence";
                                             
                                          }
                                         if(arrayOfKeys[i] == 'Miracle')
                                          { miracle += peopleRatings[x].Miracle; miracleCounter += 1; 
                                               var miracleResult = miracle / miracleCounter;
                                                    rateResult.miracleResult = miracleResult + " Miraclefruit(Helpfulness).jpg Helpfulness"; 
                            
                                          }
                                          if(arrayOfKeys[i] == 'HuckleBerry')
                                            { huckleBerry += peopleRatings[x].HuckleBerry; huckleBerryCounter += 1;
                                                 var huckleBerryResult = huckleBerry / huckleBerryCounter;
                                                       rateResult.huckleBerryResult = huckleBerryResult + " Huckleberry(Friendliness).jpg Huckleberry";
                             
                                            }
                                           if(arrayOfKeys[i] == 'Pineapple')
                                            { pineapple += peopleRatings[x].Pineapple; pineappleCounter += 1;
                                                  var pineappleResult = pineapple / pineappleCounter;
                                                        rateResult.pineappleResult = pineappleResult + " Pineapple(Patience).jpg Patience";
                             
                                             }
                                            if(arrayOfKeys[i] == 'Tamarind')
                                              { tamarind += peopleRatings[x].Tamarind; tamarindCounter += 1;
                                                   var tamarindResult = tamarind / tamarindCounter;
                                                         rateResult.tamarindResult = tamarindResult + " Tamarind(Trustworthiness).jpg Trustworthiness";
                                
                                               }
                                             if(arrayOfKeys[i] == 'BlueBerry')
                                              { blueBerry += peopleRatings[x].BlueBerry; blueBerryCounter += 1; 
                                                  var blueBerryResult = blueBerry / blueBerryCounter;
                                                        rateResult.blueBerryResult = blueBerryResult + " Blueberry(Empathy).jpg Empathy";
                                  
                                              }
                                    if(arrayOfKeys[i] == 'BlackCurrant')
                                      { blackCurrant += peopleRatings[x].BlackCurrant; blackCurrantCounter += 1;
                                          var blackCurrantResult = blackCurrant / blackCurrantCounter;
                                                rateResult.blackCurrantResult = blackCurrantResult + " Blackcurrant(Brilliance).jpg Brilliance";
                                   
                                       }
                                     if(arrayOfKeys[i] == 'Jujube')
                                       { jujube += peopleRatings[x].Jujube; jujubeCounter += 1; 
                                            var jujubeResult = jujube / jujubeCounter;
                                                  rateResult.jujubeResult = jujubeResult + " Jujube(Tolerance).jpg Tolorence";
                                       
                                       }
                                      if(arrayOfKeys[i] == 'Lime')
                                        { lime += peopleRatings[x].Lime; limeCounter += 1;
                                            var limeResult = lime / limeCounter;
                                                   rateResult.limeResult = limeResult + " Lime(Frankness).jpg Frankness";
                                         
                                        }
                                       if(arrayOfKeys[i] == 'JackFruit')
                                         { jackfruit += peopleRatings[x].JackFruit; jackFruitCounter += 1;
                                              var jackfruitResult = jackfruit / jackFruitCounter;
                                                    rateResult.jackfruitResult = jackfruitResult + " Jackfruit(Capacity).jpg Capacity";
                                         
                                         }
                                        if(arrayOfKeys[i] == 'Longan')
                                          { longan += peopleRatings[x].Longan; longanCounter += 1;
                                              var longanResult = longan / longanCounter;
                                                    rateResult.longanResult = longanResult + " Longan(Emotional Intelligence).jpg Emotional Intelligence";
                                           
                                          }
                                         if(arrayOfKeys[i] == 'Kolanut')
                                          { kolanut += peopleRatings[x].Kolanut; kolanutCounter += 1; 
                                              var kolanutResult = kolanut / kolanutCounter;
                                                    rateResult.kolanutResult = kolanutResult + " Kolanut(Courtesy).jpg Courtesy";
                                             
                                          }
                                          if(arrayOfKeys[i] == 'Bitter')
                                            { bitter += peopleRatings[x].Bitter; bitterCounter += 1; 
                                                var bitterResult = bitter / bitterCounter;
                                                      rateResult.bitterResult = bitterResult + " Bitter Kola(Honour).jpg Honour";
                                                 
                                            }
                                           if(arrayOfKeys[i] == 'Peach')
                                               { peach += peopleRatings[x].Peach; peachCounter += 1;
                                                   var peachResult = peach / peachCounter;
                                                        rateResult.peachResult = peachResult + " Peach(Excellence).jpg Excellence";
                     
                                                }
                                            if(arrayOfKeys[i] == 'Lychee')
                                              { lychee += peopleRatings[x].Lychee; lycheeCounter += 1; 
                                                    var lycheeResult = lychee / lycheeCounter;
                                                          rateResult.lycheeResult = lycheeResult + " Lychee(Loyalty).jpg Loyalty";
                        
                                              }
                                             if(arrayOfKeys[i] == 'Damson')
                                              { damson += peopleRatings[x].Damson; damsonCounter += 1; 
                                                   var damsonResult = damson / damsonCounter;
                                                         rateResult.damsonResult = damsonResult + " Damson(Honesty).jpg Honesty";
                          
                                              }
                                if(arrayOfKeys[i] == 'Cashew')
                                  { cashew += peopleRatings[x].Cashew; cashewCounter += 1; 
                                      var cashewResult = cashew / cashewCounter;
                                           rateResult.cashewResult = cashewResult + " Cashew(Optimism).jpg Optimism";
                         
                                  }
                                 if(arrayOfKeys[i] == 'Mango')
                                   { mango += peopleRatings[x].Mango; mangoCounter += 1; 
                                        var mangoResult = mango / mangoCounter;
                                              rateResult.mangoResult = mangoResult + " Mango(Fairness).jpg Fairness";
                          
                                   }
                                  if(arrayOfKeys[i] == 'Avocado')
                                    { avocado += peopleRatings[x].Avocado; avocadoCounter += 1;
                                        var avocadoResult = avocado / avocadoCounter;
                                              rateResult.avocadoResult = avocadoResult + " Avocado(Compassion).jpg Compassion";
                                    }
                                   if(arrayOfKeys[i] == 'Pear')
                                    { pear += peopleRatings[x].Pear; pearCounter += 1;
                                        var pearResult = pear / pearCounter;
                                              rateResult.pearResult = pearResult + " Pear(Grace).jpg Grace";
                            
                                     }
                                    if(arrayOfKeys[i] == 'Loquat')
                                      { loquat += peopleRatings[x].Loquat; loquatCounter += 1;
                                             var loquatResult = loquat / loquatCounter;  
                                                   rateResult.loquatResult =loquatResult + " Loquat(Reliability).jpg Reliability";  

                                      }
                                       console.timeEnd('NAME......................................PPPP');
                                 // console.log(rateResult);
                                 // console.log('thats rateResult Value!!!!');
                              }
                          
                        }
                        
                       // console.log(loopingtime + '    thats looping time...................../////')
                        if((loopingtime = 'circle completed!!!')){
                             setTimeout(function(){
                                         console.log(rateResult);
                                         //console.log(loopingtime);
                                         sendingRateResultToClient(rateResult);
                                         console.log('FINAL RateResult  ............................');
                                    }, 0010);
                        }
                 };

            function firstloopfunction(loopingtime, loopingValue, arrayOfClosePeople, userRating){
                 // console.log(loopingtime);
                 // console.log('something is wrong somewhere!!!!!!!!!!!!!!!!!!!!!!!!');
              
                  for(var i=0; i <= arrayOfClosePeople.length; i++){
                          console.time('BEGINS......................................PPPP');
                           if(loopingValue == arrayOfClosePeople[i]){
                              peopleRatings[loopingValue] = userRating;
                               console.log(peopleRatings);
                               console.log('thats it above,,,,');
                           }
                          console.timeEnd('BEGINS......................................PPPP');
                  }
                   
                   //console.log(peopleRatings);
                  if(loopingtime == 'circle completed!!!'){
                      setTimeout(function(){
                           ///console.log(peopleRatings);
                           //console.log('popopoppopooiiiiiiiiiiiiiiiiuuuuuuuuuu');
                           callingFunctionToGetRatings(arrayOfClosePeople);
                      }, 0010);
                  }
            }


            function gettingPostersEmail(passedIdentity){
                var sql = 'SELECT Email FROM daisesposting WHERE DaisesIdentity = ?';
                   connection.query(sql, [passedIdentity], function(error, results, fields){
                           if(error)throw error;
                               //console.log(results);
                               var postersEmail = results[0].Email;
                               gettingClosePeople(postersEmail, function(arrayOfClosePeople){
                                console.log('this function ran');
                                  if(Object.keys(checkIfRating).length != 0){
                                    //console.log(checkIfRating);
                                         function callingSetTimeFunction(loopingtime, loopingValue, arrayOfClosePeople, userRating){ // called at the last loop
                                               setTimeout(function(){
                                                  loopingtime = 'circle completed!!!';
                                                  //console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');
                                                  //console.log(loopingtime);
                                                  firstloopfunction(loopingtime, loopingValue, arrayOfClosePeople, userRating);
                                               }, 0010);
                                         }

                                         var gettingArrayLength = Object.keys(checkIfRating).length;
                                         console.log(checkIfRating);
                                         console.log('people');
                                          for(x in checkIfRating){
                                               var userRating = checkIfRating[x];
                                               var loopingValue = x;
                                               firstCounter++;
                                               loopingtime = 'not finished looping';

                                               if(firstCounter == gettingArrayLength){
                                                  loopingtime = 'finished looping';
                                                  console.log('something is not right2');
                                                  callingSetTimeFunction(loopingtime, loopingValue, arrayOfClosePeople, userRating);
                                                  return;
                                               }

                                               firstloopfunction(loopingtime, loopingValue, arrayOfClosePeople, userRating);
                                               
                                          }

                                          
                                  }  
                              });
                   });          
           }
           // var passedIdentity = req.body.sentData;
           var passedIdentity = req.body.sentData.split(' ')[1];
            gettingPostersEmail(passedIdentity);
                }, function(){
                  db.close();
            }); //closing of the cursor.forEach!
          });
       }

       function getAllRatings(){
              var apple = 0, blueBerry = 0, blackCurrant = 0, kiwifruit = 0, blackBerry = 0, jujube = 0, lime = 0,jackfruit = 0, longan = 0, kolanut = 0, guava = 0,
                 breadfruit = 0, grape = 0, miracle = 0, huckleBerry = 0, counterloupe = 0, papaya = 0, lemon = 0, wulnut = 0, fig = 0, 
                  pomengranate = 0, orange = 0, cherry = 0, watermellon = 0, tangerine = 0, passionFruit = 0, starfruit = 0, coconut = 0, olive = 0, date = 0, 
                   dragonFruit = 0, damsom = 0, mango = 0, avocado = 0, pineapple = 0, bitter = 0, peach = 0,lychee = 0, tamarind = 0, blackBerry = 0, banana = 0, durian = 0, cucumber = 0,
                    appleCounter = 0, bananaCounter = 0, cucumberCounter = 0, durianCounter = 0, dragonfruitCounter = 0, blackberryCounter = 0, 
                     dateCounter = 0, loquat = 0,pear = 0, cashew = 0, wulnutCounter = 0, figCounter = 0, orangeCounter = 0, cherryCounter = 0, watermellonCounter = 0, pomengranateCounter = 0, 
                      coconutCounter = 0, guavaCounter = 0, oliveCounter = 0, lemonCounter = 0, tangerineCounter = 0, passionFruitCounter = 0, starfruitCounter = 0,
                       kiwiFruitCounter = 0, blackCurrantCounter = 0, jujubeCounter = 0, limeCounter = 0, grapeCounter = 0, miracleCounter = 0, huckleBerryCounter = 0, breadFruitCounter = 0, counterloupeCounter = 0, papayaCounter = 0,
                        pineappleCounter = 0, bitterCounter = 0, peachCounter = 0, lycheeCounter = 0, jackFruitCounter = 0,longanCounter = 0,kolanutCounter = 0, tamarindCounter = 0, blueBerryCounter = 0,
                         damsonCounter = 0, cashewCounter = 0, loquatCounter = 0, mangoCounter = 0, pearCounter = 0, avocadoCounter = 0;
             var rateResult = {};
              
          mongo.connect(url, function(err, db){
            var cursor = db.collection('daisesratings').find({'name': "Ratings of Daises"}).limit(1);
                  cursor.forEach(function(doc, err){
                   if(err) throw err;   
                   var checkIfRating = doc.Rating[req.body.sentData.split(' ')[1]]; // returns an object!
                   
                   console.log(checkIfRating + "  this is the value from DataBase");

                if(Object.keys(checkIfRating).length != 0)
                    console.log('this code executed');
                        //do something!
                        {
                          for(x in checkIfRating){
                            //checkIfRating[x]      // returns an object
                           var arrayOfKeys = Object.keys(checkIfRating[x]);   // returns an array of keys
                               console.log(arrayOfKeys + "   this is the array of keys")
                              for(i=0; i<=arrayOfKeys.length; i++){
                                    //do something!
                                    if(arrayOfKeys[i] == 'Apple')
                                       { apple += checkIfRating[x].Apple; appleCounter += 1; 
                                           var appleResult = apple / appleCounter;  // returns a number (percentage Average of ratings)
                                                rateResult.appleResult = appleResult + " Apple(Love).jpg Love";
                                       }
                                     if(arrayOfKeys[i] == 'Banana')
                                        { banana += checkIfRating[x].Banana; bananaCounter += 1; 
                                          var bananaResult = banana / bananaCounter;
                                               rateResult.bananaResult = bananaResult + " Banana(Creativity).jpg Creativity";
                            
                                        }
                                      if(arrayOfKeys[i] == 'Durian')
                                        { durian += checkIfRating[x].Durian; durianCounter += 1; 
                                           var durianResult = durian / durianCounter;
                                                rateResult.durianResult = durianResult + " Durian(Confidence).jpg Confidence";
                              
                                        }
                                       if(arrayOfKeys[i] == 'Cucumber')
                                        { cucumber += checkIfRating[x].Cucumber; cucumberCounter += 1; 
                                            var cucumberResult = cucumber / cucumberCounter;
                                                 rateResult.cucumberResult = cucumberResult + " Cucumber(Caring).jpg Caring";
                               
                                        }
                                        if(arrayOfKeys[i] == 'Date')
                                          { date += checkIfRating[x].Date; dateCounter += 1; 
                                              var dateResult = date / dateCounter;
                                                   rateResult.dateResult = dateResult + " Date(Consistency).jpg Consistency";
                                
                                          }
                                         if(arrayOfKeys[i] == 'DragonFruit')
                                          { dragonFruit += checkIfRating[x].DragonFruit; dragonfruitCounter += 1;
                                             var dragonFruitResult = dragonFruit / dragonfruitCounter;
                                                  rateResult.dragonFruitResult = dragonFruitResult + " DragonFruit(Knowledge).jpg Knowledge";
                                     
                                          }
                                          if(arrayOfKeys[i] == 'BlackBerry')
                                            { blackBerry += checkIfRating[x].BlackBerry; blackberryCounter += 1;
                                                 var blackBerryResult = blackBerry / blackberryCounter;
                                                      rateResult.blackBerryResult = blackBerryResult + " Blackberry(Experience).jpg Experience";
                                   
                                             }
                                           if(arrayOfKeys[i] == 'Olive')
                                             { olive += checkIfRating[x].Olive; oliveCounter += 1;
                                                   var oliveResult = olive / oliveCounter;
                                                        rateResult.oliveResult = oliveResult + " Olive(Faithfulness).jpg Faithfulness";
                                        
                                             }
                                            if(arrayOfKeys[i] == 'Coconut')
                                              { coconut += checkIfRating[x].Coconut; coconutCounter += 1;
                                                    var coconutResult = coconut / coconutCounter;
                                                         rateResult.coconutResult = coconutResult + " Coconut(intelligence).jpg Intelligence";
                                          
                                             }
                                             if(arrayOfKeys[i] == 'Lemon')
                                              { lemon += checkIfRating[x].Lemon; lemonCounter += 1; 
                                                 var lemonResult = lemon / lemonCounter;
                                                      rateResult.lemonResult = lemonResult + " Lemon(Thouroughness).jpg Thouroughness";
                                            
                                              }
                                    if(arrayOfKeys[i] == 'Tangerine')
                                      { tangerine += checkIfRating[x].Tangerine; tangerineCounter += 1; 
                                          var tangerineResult = tangerine / tangerineCounter;
                                                  rateResult.tangerineResult = tangerineResult + " Tangerine(Cooperation).jpg Cooperation";
                                      }
                                     if(arrayOfKeys[i] == 'PassionFruit')
                                       { passionFruit += checkIfRating[x].PassionFruit; passionfruitCounter += 1; 
                                         var passionFruitResult = passionFruit / passionfruitCounter;
                                              rateResult.passionFruitResult = passionFruitResult + " Passionfruit(Passion).jpg Passion";
                         
                                       }
                                      if(arrayOfKeys[i] == 'Starfruit')
                                        { starfruit += checkIfRating[x].Starfruit; starfruitCounter += 1; 
                                            var starfruitResult = starfruit / starfruitCounter;
                                                 rateResult.starfruitResult = starfruitResult + " Starfruit(Leadership).jpg Leadership";
                      
                                        }
                                       if(arrayOfKeys[i] == 'Walnut')
                                        { walnut += checkIfRating[x].Wulnut; wulnutCounter += 1; 
                                           var walnutResult = walnut / walnutCounter;
                                                rateResult.walnutResult = walnutResult + " Wulnut(Humour).jpg Humour";
                          
                                        }
                                        if(arrayOfKeys[i] == 'Fig')
                                          { fig += checkIfRating[x].Fig; figCounter += 1; 
                                              var figResult = fig / figCounter;
                                                   rateResult.figResult = figResult + " Fig(Wisdom).jpg Wisdom";
                           
                                          }
                                         if(arrayOfKeys[i] == 'Pomengranate')
                                          { pomengranate += checkIfRating[x].Pomengranate; pomengranateCounter += 1; 
                                              var pomengranateResult = pomengranate / pomengranateCounter;
                                                   rateResult.pomengranateResult = pomengranateResult + " Pomengranate(Resourcefulness).jpg Resourcefulness";
                              
                                          }
                                          if(arrayOfKeys[i] == 'Orange')
                                            { orange += checkIfRating[x].Orange; orangeCounter += 1;
                                                  var orangeResult = orange / orangeCounter;
                                                       rateResult.orangeResult = orangeResult + " Orange(Insight).jpg Insight";
                                             }
                                           if(arrayOfKeys[i] == 'Cherry')
                                            { cherry += checkIfRating[x].Cherry; cherryCounter += 1; 
                                                 var cherryResult = cherry / cherryCounter;
                                                      rateResult.cherryResult = cherryResult + " Cherry(Holiness).jpg Holiness";
                                 
                                            }
                                            if(arrayOfKeys[i] == 'Watermellon')
                                              { watermellon += checkIfRating[x].Watermellon; watermellonCounter += 1;
                                                      var watermellonResult = watermellon / watermellonCounter;
                                                            rateResult.watermellonResult = watermellonResult + " Watermelon(Generosity).jpg Generosiy";
                                   
                                               }
                                             if(arrayOfKeys[i] == 'Guava')
                                              { guava += checkIfRating[x].Guava; guavaCounter += 1; 
                                                  var guavaResult = guava / guavaCounter;
                                                       rateResult.guavaResult = guavaResult + " Guava(Sincerity).jpg Sincerity";
                                     
                                              }
                                    if(arrayOfKeys[i] == 'KiwiFruit')
                                      { kiwifruit += checkIfRating[x].KiwiFruit; kiwiFruitCounter += 1;
                                         var kiwifruitResult = Kiwifruit / kiwiFruitCounter;
                                              rateResult.kiwifruitResult = kiwifruitResult + " Kiwifruit(Kindness).jpg Kindness";
                                       
                                      }
                                     if(arrayOfKeys[i] == 'BreadFruit')
                                      { breadfruit += checkIfRating[x].BreadFruit; breadFruitCounter += 1;
                                           var breadfruitResult = breadfruit / breadFruitCounter;
                                                rateResult.breadfruitResult = breadfruit / breadFruitCounter + " Breadfruit(Expertise).jpg Expertise";
                                          
                                       }
                                      if(arrayOfKeys[i] == 'Counterloupe')
                                        { counterloupe += checkIfRating[x].Counterloupe; counterloupeCounter += 1; 
                                            var counterloupeResult = counterloupe / counterloupeCounter;
                                                 rateResult.counterloupeResult = counterloupeResult + " Cantaloupe(Humility).jpg Humility";
                                            
                                        }
                                       if(arrayOfKeys[i] == 'Papaya')
                                        { papaya += checkIfRating[x].Papaya; papayaCounter += 1;
                                            var papayaResult = papaya / papayaCounter;
                                                 rateResult.papayaResult = papayaResult + " Papaya(Openness).jpg Openness";
                                             
                                         }
                                        if(arrayOfKeys[i] == 'Grape')
                                          { grape += checkIfRating[x].Grape; grapeCounter += 1; 
                                               var grapeResult = grape / grapeCounter;
                                                    rateResult.grapeResult = grapeResult + " Grape(Innocence).jpg Innocence";
                                             
                                          }
                                         if(arrayOfKeys[i] == 'Miracle')
                                          { miracle += checkIfRating[x].Miracle; miracleCounter += 1; 
                                               var miracleResult = miracle / miracleCounter;
                                                    rateResult.miracleResult = miracleResult + " Miraclefruit(Helpfulness).jpg Helpfulness"; 
                            
                                          }
                                          if(arrayOfKeys[i] == 'HuckleBerry')
                                            { huckleBerry += checkIfRating[x].HuckleBerry; huckleBerryCounter += 1;
                                                 var huckleBerryResult = huckleBerry / huckleBerryCounter;
                                                       rateResult.huckleBerryResult = huckleBerryResult + " Huckleberry(Friendliness).jpg Huckleberry";
                             
                                            }
                                           if(arrayOfKeys[i] == 'Pineapple')
                                            { pineapple += checkIfRating[x].Pineapple; pineappleCounter += 1;
                                                  var pineappleResult = pineapple / pineappleCounter;
                                                        rateResult.pineappleResult = pineappleResult + " Pineapple(Patience).jpg Patience";
                             
                                             }
                                            if(arrayOfKeys[i] == 'Tamarind')
                                              { tamarind += checkIfRating[x].Tamarind; tamarindCounter += 1;
                                                   var tamarindResult = tamarind / tamarindCounter;
                                                         rateResult.tamarindResult = tamarindResult + " Tamarind(Trustworthiness).jpg Trustworthiness";
                                
                                               }
                                             if(arrayOfKeys[i] == 'BlueBerry')
                                              { blueBerry += checkIfRating[x].BlueBerry; blueBerryCounter += 1; 
                                                  var blueBerryResult = blueBerry / blueBerryCounter;
                                                        rateResult.blueBerryResult = blueBerryResult + " Blueberry(Empathy).jpg Empathy";
                                  
                                              }
                                    if(arrayOfKeys[i] == 'BlackCurrant')
                                      { blackCurrant += checkIfRating[x].BlackCurrant; blackCurrantCounter += 1;
                                          var blackCurrantResult = blackCurrant / blackCurrantCounter;
                                                rateResult.blackCurrantResult = blackCurrantResult + " Blackcurrant(Brilliance).jpg Brilliance";
                                   
                                       }
                                     if(arrayOfKeys[i] == 'Jujube')
                                       { jujube += checkIfRating[x].Jujube; jujubeCounter += 1; 
                                            var jujubeResult = jujube / jujubeCounter;
                                                  rateResult.jujubeResult = jujubeResult + " Jujube(Tolerance).jpg Tolorence";
                                       
                                       }
                                      if(arrayOfKeys[i] == 'Lime')
                                        { lime += checkIfRating[x].Lime; limeCounter += 1;
                                            var limeResult = lime / limeCounter;
                                                   rateResult.limeResult = limeResult + " Lime(Frankness).jpg Frankness";
                                         
                                        }
                                       if(arrayOfKeys[i] == 'JackFruit')
                                         { jackfruit += checkIfRating[x].JackFruit; jackFruitCounter += 1;
                                              var jackfruitResult = jackfruit / jackFruitCounter;
                                                    rateResult.jackfruitResult = jackfruitResult + " Jackfruit(Capacity).jpg Capacity";
                                         
                                         }
                                        if(arrayOfKeys[i] == 'Longan')
                                          { longan += checkIfRating[x].Longan; longanCounter += 1;
                                              var longanResult = longan / longanCounter;
                                                    rateResult.longanResult = longanResult + " Longan(Emotional Intelligence).jpg Emotional Intelligence";
                                           
                                          }
                                         if(arrayOfKeys[i] == 'Kolanut')
                                          { kolanut += checkIfRating[x].Kolanut; kolanutCounter += 1; 
                                              var kolanutResult = kolanut / kolanutCounter;
                                                    rateResult.kolanutResult = kolanutResult + " Kolanut(Courtesy).jpg Courtesy";
                                             
                                          }
                                          if(arrayOfKeys[i] == 'Bitter')
                                            { bitter += checkIfRating[x].Bitter; bitterCounter += 1; 
                                                var bitterResult = bitter / bitterCounter;
                                                      rateResult.bitterResult = bitterResult + " Bitter Kola(Honour).jpg Honour";
                                                 
                                            }
                                           if(arrayOfKeys[i] == 'Peach')
                                               { peach += checkIfRating[x].Peach; peachCounter += 1;
                                                   var peachResult = peach / peachCounter;
                                                        rateResult.peachResult = peachResult + " Peach(Excellence).jpg Excellence";
                     
                                                }
                                            if(arrayOfKeys[i] == 'Lychee')
                                              { lychee += checkIfRating[x].Lychee; lycheeCounter += 1; 
                                                    var lycheeResult = lychee / lycheeCounter;
                                                          rateResult.lycheeResult = lycheeResult + " Lychee(Loyalty).jpg Loyalty";
                        
                                              }
                                             if(arrayOfKeys[i] == 'Damson')
                                              { damson += checkIfRating[x].Damson; damsonCounter += 1; 
                                                   var damsonResult = damson / damsonCounter;
                                                         rateResult.damsonResult = damsonResult + " Damson(Honesty).jpg Honesty";
                          
                                              }
                                if(arrayOfKeys[i] == 'Cashew')
                                  { cashew += checkIfRating[x].Cashew; cashewCounter += 1; 
                                      var cashewResult = cashew / cashewCounter;
                                           rateResult.cashewResult = cashewResult + " Cashew(Optimism).jpg Optimism";
                         
                                  }
                                 if(arrayOfKeys[i] == 'Mango')
                                   { mango += checkIfRating[x].Mango; mangoCounter += 1; 
                                        var mangoResult = mango / mangoCounter;
                                              rateResult.mangoResult = mangoResult + " Mango(Fairness).jpg Fairness";
                          
                                   }
                                  if(arrayOfKeys[i] == 'Avocado')
                                    { avocado += checkIfRating[x].Avocado; avocadoCounter += 1;
                                        var avocadoResult = avocado / avocadoCounter;
                                              rateResult.avocadoResult = avocadoResult + " Avocado(Compassion).jpg Compassion";
                                    }
                                   if(arrayOfKeys[i] == 'Pear')
                                    { pear += checkIfRating[x].Pear; pearCounter += 1;
                                        var pearResult = pear / pearCounter;
                                              rateResult.pearResult = pearResult + " Pear(Grace).jpg Grace";
                            
                                     }
                                    if(arrayOfKeys[i] == 'Loquat')
                                      { loquat += checkIfRating[x].Loquat; loquatCounter += 1;
                                             var loquatResult = loquat / loquatCounter;  
                                                   rateResult.loquatResult =loquatResult + " Loquat(Reliability).jpg Reliability";  

                                      }
                                  
                              }
                          
                        }
                       
                          var rateResultLength = Object.keys(rateResult).length;
                                 console.log(rateResultLength + "   this is rateResultLength");
                                 console.log(rateResult);
                          if(rateResultLength == 0){
                            res.send({'message': 'No Rating Yet!!'});
                            return;
                          }
                          
                          function updateDaisesPostingTable1(ratedAverage){
                                  var sql = 'UPDATE daisesPosting SET RateAvg1 = ? Where DaisesIdentity = ?';
                                  connection.query(sql, [ratedAverage, pIdentity], function(error, results, fields){
                                      if(error)throw error;
                                      console.log();
                                  });
                          }

                          var keyLength = Object.keys(rateResult).length;
                          var rateResultCounter = 0;
                          var dataSum = 0;
                          var ratedAverage;
                          for(x in rateResult){
                              rateResultCounter++;
                              dataSum += Number(rateResult[x].split(' ')[0]);
                              console.log(dataSum);
                              if(rateResultCounter == keyLength){
                                   ratedAverage = dataSum / rateResultCounter;
                                   res.send({'message': ratedAverage, 'typeOfRater': 'not close person'});
                                   updateDaisesPostingTable1(ratedAverage);
                              }
                          }
                          //console.log(rateResult + "   this is rateResult")
                         // res.send({"myName": rateResult, 'typeOfRater': 'not close person'});
                          //console.log('It ran!')
                    }
                  
                  
                 }, function(){
                   db.close();
                 });
           });
       }

       var typeOfPerson;
       function gettingTagValue(thePostersEmail){
            var sql = 'Select Tag From friendstable Where FriendEmail = ? AND OwnerEmail = ?';
           connection.query(sql, [email, thePostersEmail], function(error, results, fields){
                 if(error)throw error;
                 typeOfPerson = results[0].Tag;

                 if(typeOfPerson == 'Friend' || "Love" || 'Aquintance' || 'Family' || 'Colleague' || 'Owner'){
                     getAllFriendsRatings();
                 }else{
                     getAllRatings();
                 }
           });
       }

       var sql = 'SELECT Email From daisesposting Where DaisesIdentity = ?';
       connection.query(sql, [req.body.sentData.split(' ')[1]], function(error, results, fields){
         if(error)throw error;
         gettingTagValue(results[0].Email);
       });
});

app.post('/rating', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
                    upload(req, res, function(err) {

                      if(err) {
                            return res.end("Error uploading file.");
                        }
                       console.log(req.body.myEmailhidden + " thats the value of hidden email");
                        var myEmailValue = req.body.myEmailhidden.split(' ')[0];
                        var uniqueNumber = req.body.myEmailhidden.split(' ')[1];
                        console.log(myEmailValue + '   this is emailValue ===========');
                        console.log(req.body);
                       // console.log(uniqueEmail); 
                       var uniqueEmail = {}
      
                    if(req.body.Apple > 1) uniqueEmail.Apple = req.body.Apple * 10;
                      if(req.body.Banana > 1) uniqueEmail.Banana = req.body.Banana * 10;
                       if(req.body.Durain > 1) uniqueEmail.Durian = req.body.Durian * 10;
                         if(req.body.Cucumber > 1) uniqueEmail.Cucumber = req.body.Cucumber * 10;
                          if(req.body.Date > 1) uniqueEmail.Date = req.body.Date * 10;
                           if(req.body.DragonFruit > 1) uniqueEmail.DragonFruit = req.body.DragonFruit * 10;
                            if(req.body.BlackBerry > 1) uniqueEmail.BlackBerry = req.body.BlackBerry * 10;
                             if(req.body.Olive > 1) uniqueEmail.Olive = req.body.Olive * 10;
                              if(req.body.Coconut > 1) uniqueEmail.Coconut = req.body.Coconut * 10;
                       if(req.body.Lemon > 1) uniqueEmail.Lemon = req.body.Lemon * 10;
                        if(req.body.Tangerine > 1) uniqueEmail.Tangerine = req.body.Tangerine * 10;
                         if(req.body.PassionFruit > 1) uniqueEmail.PassionFruit = req.body.PassionFruit * 10;
                          if(req.body.Walnut > 1) uniqueEmail.Walnut = req.body.Walnut * 10;
                           if(req.body.Starfruit > 1) uniqueEmail.Starfruit = req.body.Starfruit * 10;
                            if(req.body.Fig > 1) uniqueEmail.Fig = req.body.Fig * 10;
                             if(req.body.Pomengranate > 1) uniqueEmail.Pomengranate = req.body.Pomengranate * 10;
                              if(req.body.Orange > 1) uniqueEmail.Orange = req.body.Orange * 10;
                               if(req.body.Cherry > 1) uniqueEmail.Cherry = req.body.Cherry * 10;
                                if(req.body.Watermellon > 1) uniqueEmail.Watermellon = req.body.Watermellon * 10;
                             if(req.body.Guava > 1) uniqueEmail.Guava = req.body.Guava * 10;
                              if(req.body.KiwiFruit > 1) uniqueEmail.KiwiFruit = req.body.Kiwifruit * 10;
                               if(req.body.Cantaloupe > 1) uniqueEmail.Cantaloupe = req.body.Cantaloupe * 10;
                                if(req.body.BreadFruit > 1) uniqueEmail.BreadFruit = req.body.BreadFruit * 10;
                                 if(req.body.Papaya > 1) uniqueEmail.Papaya = req.body.Papaya * 10;
                                  if(req.body.Miracle > 1) uniqueEmail.Miracle = req.body.Miracle * 10;
                                   if(req.body.HuckleBerry > 1) uniqueEmail.HuckleBerry = req.body.HuckleBerry * 10;
                                    if(req.body.Pineapple > 1) uniqueEmail.Pineapple = req.body.Pineapple * 10;
                                      if(req.body.Grape > 1) uniqueEmail.Grape = req.body.Grape * 10;
                                  if(req.body.Tamarind > 1) uniqueEmail.Tamarind = req.body.Tamarind * 10;
                                   if(req.body.BlueBerry > 1) uniqueEmail.BlueBerry = req.body.BlueBerry * 10;
                                    if(req.body.BlackCurrant > 1) uniqueEmail.BlackCurrant = req.body.BlackCurrant * 10;
                                     if(req.body.Jujube > 1) uniqueEmail.Jujube = req.body.Jujube * 10;
                                      if(req.body.Lime > 1) uniqueEmail.Lime = req.body.Lime * 10;
                                       
                                   if(req.body.JackFruit > 1) uniqueEmail.JackFruit = req.body.JackFruit * 10;
                                    if(req.body.Kolanut > 1) uniqueEmail.Kolonut = req.body.Kolanut * 10;
                                     if(req.body.Longan > 1) uniqueEmail.Longan = req.body.Longan * 10;
                                      if(req.body.Bitter > 1) uniqueEmail.Bitter = req.body.Bitter * 10;
                                       if(req.body.Peach > 1) uniqueEmail.Peach = req.body.Peach * 10;
                                        if(req.body.Lychee > 1) uniqueEmail.Lychee = req.body.Lychee * 10;
                                         if(req.body.Damson > 1 ) uniqueEmail.Damson = req.body.Damson * 10;
                                   if(req.body.Cashew > 1) uniqueEmail.Cashew = req.body.Cashew * 10;
                                    if(req.body.Mango > 1) uniqueEmail.Mango = req.body.Mango * 10;
                                     if(req.body.Avocado > 1) uniqueEmail.Avocado = req.body.Avocado * 10;
                                      if(req.body.Pear > 1) uniqueEmail.Pear = req.body.Pear * 10;
                                       if(req.body.Loquat > 1) uniqueEmail.Loquat = req.body.Loquat * 10;
       
           creatingUniqueRatingIdentity1(myEmailValue, uniqueNumber, uniqueEmail); //creating unique user ratings!
                       res.send({'myName': "Rating was successfull!"});
           });
});

app.post('/pastDaises', jsonParser, function(req, res){
         // queries should be made from the last posted daises in the daisesposting table!
          console.log("gtgtgtgtgtgttgt  ||||| From PosttedDaises");
         var sql = 'SELECT Discursion, PersonalPicture, PostedPicture, ALaises, FirstName, LastName, Tag, RateAvg1, RateAvg2, DaisesIdentity FROM daisesposting ORDER BY ID DESC';
         connection.query(sql, function (error, results, fields) {
            if(error) throw error;
            var arrayOfData = [];
            var data = {};
            var ResultCounter = 0;
            console.log(results);
            console.log("thst is  from pastDaises");
            for(var i=0; i < results.length; i++){
                  ResultCounter++;
                  data = {
                           'firstName': results[i].FirstName,
                           'lastName': results[i].LastName,
                           'Discursion': results[i].Discursion,
                           'Alaise': results[i].Aliases,
                           'Tag': results[i].Tag,
                           'RateAvg1': results[i].RateAvg1,
                           'RateAvg2': results[i].RateAvg2,
                           'PostedPicture': results[i].PostedPicture,
                           'PersonalPicture': results[i].PersonalPicture,
                           'DaisesIdentity': results[i].DaisesIdentity
                         }
                  if(data.RateAvg1 == 0){ 
                      data.RateAvg1 = 10;  // 10 is the default for any rating!
                  }

                  if(data.RateAvg2 == 0){
                      data.RateAvg2 = 10;
                  }

                  if(data.PersonalPicture == ''){
                       data.PersonalPicture = 'man.jpg';
                  }

                  arrayOfData.push(data);

                  if(ResultCounter == results.length){
                      arrayOfData.reverse();
                      res.send({'message': arrayOfData});
                      break;
                  }
            }
         });
});

app.post('/personalWebHistory', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
         // queries should be made from the last posted daises in the daisesposting table!
         var sql = 'SELECT Discursion, PersonalPicture, PostedPicture, ALaises, FirstName, LastName, Tag, RateAvg1, RateAvg2, DaisesIdentity FROM daisesposting WHERE Email = ? ORDER BY ID DESC';
         connection.query(sql, [req.body.personalEmail], function (error, results, fields) {
            if(error) throw error;
            var arrayOfData = [];
            var data = {};
            var ResultCounter = 0;
            for(var i=0; i < results.length; i++){
                  ResultCounter++;
                  data = {
                           'firstName': results[i].FirstName,
                           'lastName': results[i].LastName,
                           'Discursion': results[i].Discursion,
                           'Alaise': results[i].Aliases,
                           'Tag': results[i].Tag,
                           'RateAvg1': results[i].RateAvg1,
                           'RateAvg2': results[i].RateAvg2,
                           'PostedPicture': results[i].PostedPicture,
                           'PersonalPicture': results[i].PersonalPicture,
                           'DaisesIdentity': results[i].DaisesIdentity
                         }
                  if(data.RateAvg1 == 0){ 
                      data.RateAvg1 = 10;  // 10 is the default for any rating!
                  }

                  if(data.RateAvg2 == 0){
                      data.RateAvg2 = 10;
                  }

                  if(data.PersonalPicture == ''){
                       data.PersonalPicture = 'man.jpg';
                  }

                  arrayOfData.push(data);

                  if(ResultCounter == results.length){
                      arrayOfData.reverse();
                      res.send({'message': arrayOfData});
                      break;
                  }
            }
         });
});

app.post('/specificDaises', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
         // queries should be made from the last posted daises in the daisesposting table!
         var sql = 'SELECT Discursion, PersonalPicture, PostedPicture, ALaises, FirstName, LastName, Tag, RateAvg1, RateAvg2, DaisesIdentity FROM daisesposting WHERE Tag = ? ORDER BY ID DESC';
         connection.query(sql, [req.body.value], function (error, results, fields) {
            if(error) throw error;
            if(Object.keys(results).length == 0){
                console.log('this code ran heeeeeeeeeeeeeeeeeeeeeeeeee');
                res.send({'message': 'No Daises found for ' + req.body.value});
                return;
            }

            //console.log('this code ran heeeeeeeeeeeeeeeeeeeeeeeeeerrr');
            var arrayOfData = [];
            var data = {};
            var ResultCounter = 0;
            for(var i=0; i < results.length; i++){
                  ResultCounter++;
                  data = {
                           'firstName': results[i].FirstName,
                           'lastName': results[i].LastName,
                           'Discursion': results[i].Discursion,
                           'Alaise': results[i].Aliases,
                           'Tag': results[i].Tag,
                           'RateAvg1': results[i].RateAvg1,
                           'RateAvg2': results[i].RateAvg2,
                           'PostedPicture': results[i].PostedPicture,
                           'PersonalPicture': results[i].PersonalPicture,
                           'DaisesIdentity': results[i].DaisesIdentity
                         }
                  if(data.RateAvg1 == 0){ 
                      data.RateAvg1 = 10;  // 10 is the default for any rating!
                  }

                  if(data.RateAvg2 == 0){
                      data.RateAvg2 = 10;
                  }

                  if(data.PersonalPicture == ''){
                       data.PersonalPicture = 'man.jpg';
                  }

                  arrayOfData.push(data);

                  if(ResultCounter == results.length){
                      arrayOfData.reverse();
                      res.send({'message': arrayOfData});
                      break;
                  }
            }
        });
});

app.get('/moreDaises', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
         // queries should be made from the last posted daises in the daisesposting table!
         var sql = 'SELECT Discursion, PersonalPicture, PostedPicture, ALaise, firstName, LastName, Tag, RateAve1, RateAve2 FROM daisesposting ORDER BY ID DESC';
         connection.query(sql,  function (error, results, fields) {
            if(error) throw error;
            var arrayOfData = [];
            var data = {};
            var ResultCounter = 0;
            for(var i=0; i < results.length; i++){
                  ResultCounter++;
                  data = {
                           'firstName': results[i].FirstName,
                           'lastName': results[i].Lastname,
                           'Discursion': results[i].Discursion,
                           'Alaise': results[i].Aliases,
                           'Tag': results[i].Tag,
                           'RateAve1': results[i].RateAve1,
                           'RateAve2': results[i].RateAve2,
                           'PostedPicture': results[i].PostedPicture,
                           'PersonalPicture': results[i].PersonalPicture,
                           'DaisesIdentity': results[i].DaisesIdentity
                         }

                  arrayOfData.push(data);

                  if(ResultCounter == results.length){
                      res.send({'message': arrayOfData});
                      break;
                  }
            }
        });
});

app.get('/homepageSearchQuery/:id', jsonParser, function(){
  
});

app.post('/homepageSearchQuery', /*cors(allowCrossDomain),*/jsonParser, function(req, res){
       var searchQuery = req.body.searchQuery;
       console.log(searchQuery + '  this is search query');
       var resultLength;
       var hiddenFieldForm = req.body.hiddenFieldForm;
       // search mongoDB!
       mongo.connect(url, function(err, db){
          if(err)throw err;
            console.log('was successfull....');
            var cursor = db.collection('Daises').find({$text: {$search: req.body.searchQuery}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).count();
            // dont forget that the cursor returns a promise!
            // you will have to handle it with the then() function call which accept a CallBacks
            //console.log(cursor);
            cursor.then(function(result){
                if(result == 0){
                  res.send({'message': 'No Result Found!'});
                  console.log("No result found .......");
                  return;
                }else{
                    console.log(hiddenFieldForm);
                    console.log('thats hidden field form above');
                    if(hiddenFieldForm != ""){
                        res.send({'message': hiddenFieldForm, 'RenderSearchPage': 'RenderSearchPageUsingFirstServer!'});
                        return; 
                    }
                    resultLength = result;
                    gettingFoundResults();
                }
            }, function(error){
                 console.log(error);
                 console.log("Error Function Ran  ...........");
            });
       });
       
       function gettingFoundResults(){
             mongo.connect(url, function(err, db){
                if(err)throw err;
                  console.log('gettingFoundResults was invoked!');
                  var cursor = db.collection('Daises').find({$text: {$search: searchQuery}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});
                     console.log(cursor.length + ' should show length');
                     console.log('getting cursor length');  
                  var loopingCounter = 0;
                  var onlineResult = [];
                  var offlineResult = [];
                  var counter = 0;
                  var onlineCounter = 0;
                  var offlineCounter = 0;
                  var foundResult;

                  function gettingOnlineStatusSQL(email, returnedDaises){
                        var sql = 'Select OnlineStatus From onlineofflinestatustable WHERE Email = ?';
                        connection.query(sql, [email], function(error, results, fields){
                            if(error)throw error;
                            returnedDaises.OnlineStatus = results[0].OnlineStatus;
                            console.log(returnedDaises.OnlineStatus);
                            console.log('checking for returnedDaises.Email here');
                            SortObjectAccordingToOnlineStatus(returnedDaises);
                        });
                  }

                  function SortObjectAccordingToOnlineStatus(returnedDaises){
                                      for(x in returnedDaises){
                                            counter++;
                                            if(returnedDaises[x] == 'online'){
                                                onlineCounter++;
                                                foundResult = {};
                                                var onlineSecondCounter = 0;
                                                for(u in returnedDaises){
                                                      onlineSecondCounter++;
                                                      if(u == 'FirstName'){
                                                         foundResult.FirstName = returnedDaises[u];
                                                      }
                                                      if(u == 'LastName'){
                                                         foundResult.LastName = returnedDaises[u];
                                                      }
                                                      if(u == 'OfflineStatus'){
                                                         foundResult.OfflineStatus = returnedDaises[u];
                                                      }
                                                      if(u == 'OnlineStatus'){
                                                         foundResult.OnlineStatus = returnedDaises[u];
                                                      }
                                                      if(u == 'PostedPicture'){
                                                         foundResult.PostedPicture = returnedDaises[u];
                                                      }
                                                      if(u == 'PostedVideo'){
                                                         foundResult.PostedVideo = returnedDaises[u];
                                                      }
                                                      if(u == 'Daises'){
                                                         foundResult.Daises = returnedDaises[u];
                                                      }
                                                      if(u == 'RateAvg1'){
                                                         foundResult.RateAvg1 = returnedDaises[u];
                                                      }
                                                      if(u == 'RateAvg2'){
                                                         foundResult.RateAvg2 = returnedDaises[u];
                                                      }
                                                      if(u == 'PersonalPicture'){
                                                         foundResult.PersonalPicture = returnedDaises[u];
                                                      }
                                                      if(u == 'DaisesIdentity'){
                                                         foundResult.DaisesIdentity = returnedDaises[u];
                                                      }

                                                      if(onlineSecondCounter == Object.keys(returnedDaises).length){
                                                         onlineResult.push(foundResult);
                                                         console.log(onlineResult);
                                                         console.log('final result of onlineResult');
                                                      }
                                                }
                                            }

                                            if(returnedDaises[x] == 'offline'){
                                                 offlineCounter++;
                                                 foundResult = {};
                                                 var offlineSecondCounter = 0;
                                                  for(k in returnedDaises){
                                                      offlineSecondCounter++;
                                                      if(k == 'FirstName'){
                                                         foundResult.FirstName = returnedDaises[k];
                                                      }
                                                      if(k == 'LastName'){
                                                         foundResult.LastName = returnedDaises[k];
                                                      }
                                                      if(k == 'OfflineStatus'){
                                                         foundResult.OfflineStatus = returnedDaises[k];
                                                      }
                                                      if(k == 'OnlineStatus'){
                                                         foundResult.OnlineStatus = returnedDaises[k];
                                                      }
                                                      if(k == 'PostedPicture'){
                                                         foundResult.PostedPicture = returnedDaises[k];
                                                      }
                                                      if(k == 'PostedVideo'){
                                                         foundResult.PostedVideo = returnedDaises[k];
                                                      }
                                                      if(k == 'Daises'){
                                                         foundResult.Daises = returnedDaises[k];
                                                      }
                                                      if(k == 'RateAvg1'){
                                                         foundResult.RateAvg1 = returnedDaises[k];
                                                      }
                                                      if(k == 'RateAvg2'){
                                                         foundResult.RateAvg2 = returnedDaises[k];
                                                      }
                                                      if(k == 'PersonalPicture'){
                                                         foundResult.PersonalPicture = returnedDaises[k];
                                                      }
                                                      if(k == 'DaisesIdentity'){
                                                         foundResult.DaisesIdentity = returnedDaises[k];
                                                      }

                                                      if(offlineSecondCounter == Object.keys(returnedDaises).length){
                                                         offlineResult.push(foundResult);
                                                         console.log('final Result of Offline Counter starts here');
                                                         console.log(offlineResult);
                                                         console.log('final Result of Offline Counter ends here');
                                                      }
                                                  }
                                            }
                                      }
                  }
                               
                    var counterForDoc = 0;
                    cursor.forEach(function(doc, err){
                        counterForDoc++
                        if(err) throw err;
                           console.log('Beginning of Returned Daises');
                           var returnedDaises = doc.Daises;
                           console.log('End of Returned Daises');
                           console.log(returnedDaises);
                           console.log("checkAbove");
                           gettingOnlineStatusSQL(returnedDaises.Email, returnedDaises);
                           if(counterForDoc == resultLength){
                                   console.log('this was true');
                                   console.log(resultLength);
                                  //time in milisecond
                                    setTimeout(function(){
                                           if(onlineCounter >= 1 && offlineCounter >= 1){
                                                   console.log('this is from firstSection');
                                                   res.send({'online': onlineResult, 'offline': offlineResult});
                                                   return;
                                           }
                                           if(onlineCounter >= 1 && offlineCounter == 0){
                                                   console.log('this is from secondSection');
                                                   res.send({'online': onlineResult, 'offline': '', 'amount': resultLength});
                                                   console.log(onlineResult);
                                                   console.log(" Why the Empty Array");
                                                   return;
                                           }
                                           if(onlineCounter == 0 && offlineCounter >= 1){
                                                   console.log('this is from thirdsection');
                                                   res.send({'online': '', 'offline': offlineResult, 'amount': resultLength});
                                                   return;
                                           }

                                           console.log(foundResult + '  whats returning undefined');
                                           console.log('that is found result');
                                    },50);
                           }
                    })
             });   
       }
       
});

app.post('/liveSearch', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
       var searchQuery = req.body.value;
       console.log(searchQuery + '  this is search query');
       var resultLength;
       // search mongoDB!
       mongo.connect(url, function(err, db){
          if(err)throw err;
            console.log('was successfull....');
            var cursor = db.collection('Daises').find({$text: {$search: req.body.value}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).count();
            // dont forget that the cursor returns a promise!
            // you will have to handle it with the then() function call which accept a CallBacks
            //console.log(cursor);
            cursor.then(function(result){
                if(result == 0){
                  res.send({'message': 'No Result Found!'});
                  return;
                }else{
                    resultLength = result;
                    gettingFoundResults();
                }
            }, function(error){
                 console.log(error);
            });
       });
       
       function gettingFoundResults(){
             mongo.connect(url, function(err, db){
                if(err)throw err;
                  console.log('gettingFoundResults was invoked!');
                  var cursor = db.collection('Daises').find({$text: {$search: searchQuery}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});
                     console.log(cursor.length)
                     console.log('getting cursor length');  
                  var loopingCounter = 0;
                  var onlineResult = [];
                  var offlineResult = [];
                  var counter = 0;
                  var onlineCounter = 0;
                  var offlineCounter = 0;
                  var foundResult;

                  function gettingOnlineStatusSQL(email, returnedDaises){
                        var sql = 'Select OnlineStatus From onlineofflinestatustable WHERE Email = ?';
                        connection.query(sql, [email], function(error, results, fields){
                            if(error)throw error;
                            returnedDaises.Email = results[0].OnlineStatus;
                            SortObjectAccordingToOnlineStatus(returnedDaises);
                        });
                  }

                  function SortObjectAccordingToOnlineStatus(returnedDaises){
                                      for(x in returnedDaises){
                                            counter++;
                                            if(returnedDaises[x] == 'online'){
                                                onlineCounter++;
                                                foundResult = {};
                                                var onlineSecondCounter = 0;
                                                for(u in returnedDaises){
                                                      onlineSecondCounter++;
                                                      if(u == 'FirstName'){
                                                         foundResult.FirstName = returnedDaises[u];
                                                      }
                                                      if(u == 'LastName'){
                                                         foundResult.LastName = returnedDaises[u];
                                                      }
                                                      if(u == 'OfflineStatus'){
                                                         foundResult.OfflineStatus = returnedDaises[u];
                                                      }
                                                      if(u == 'OnlineStatus'){
                                                         foundResult.OnlineStatus = returnedDaises[u];
                                                      }
                                                      if(u == 'PostedPicture'){
                                                         foundResult.PostedPicture = returnedDaises[u];
                                                      }
                                                      if(u == 'PostedVideo'){
                                                         foundResult.PostedVideo = returnedDaises[u];
                                                      }
                                                      if(u == 'Daises'){
                                                         foundResult.Daises = returnedDaises[u];
                                                      }
                                                      if(u == 'RateAvg1'){
                                                         foundResult.RateAvg1 = returnedDaises[u];
                                                      }
                                                      if(u == 'RateAvg2'){
                                                         foundResult.RateAvg2 = returnedDaises[u];
                                                      }
                                                      if(u == 'PersonalPicture'){
                                                         foundResult.PersonalPicture = returnedDaises[u];
                                                      }
                                                      if(u == 'DaisesIdentity'){
                                                         foundResult.DaisesIdentity = returnedDaises[u];
                                                      }

                                                      if(onlineSecondCounter == Object.keys(returnedDaises).length){
                                                         onlineResult.push(foundResult);
                                                      }
                                                }
                                            }

                                            if(returnedDaises[x] == 'offline'){
                                                 onlineCounter++;
                                                 foundResult = {};
                                                 var offlineSecondCounter = 0;
                                                  for(k in returnedDaises){
                                                      offlineSecondCounter++;
                                                      if(k == 'FirstName'){
                                                         foundResult.FirstName = returnedDaises[k];
                                                      }
                                                      if(k == 'LastName'){
                                                         foundResult.LastName = returnedDaises[k];
                                                      }
                                                      if(k == 'OfflineStatus'){
                                                         foundResult.OfflineStatus = returnedDaises[k];
                                                      }
                                                      if(k == 'OnlineStatus'){
                                                         foundResult.OnlineStatus = returnedDaises[k];
                                                      }
                                                      if(k == 'PostedPicture'){
                                                         foundResult.PostedPicture = returnedDaises[k];
                                                      }
                                                      if(k == 'PostedVideo'){
                                                         foundResult.PostedVideo = returnedDaises[k];
                                                      }
                                                      if(k == 'Daises'){
                                                         foundResult.Daises = returnedDaises[k];
                                                      }
                                                      if(k == 'RateAvg1'){
                                                         foundResult.RateAvg1 = returnedDaises[k];
                                                      }
                                                      if(k == 'RateAvg2'){
                                                         foundResult.RateAvg2 = returnedDaises[k];
                                                      }
                                                      if(k == 'PersonalPicture'){
                                                         foundResult.PersonalPicture = returnedDaises[k];
                                                      }
                                                      if(k == 'DaisesIdentity'){
                                                         foundResult.DaisesIdentity = returnedDaises[k];
                                                      }

                                                      if(offlineSecondCounter == Object.keys(returnedDaises).length){
                                                         offlineResult.push(foundResult);
                                                      }
                                                  }
                                            }
                                      }
                  }
                               
                    var counterForDoc = 0;
                    cursor.forEach(function(doc, err){
                        counterForDoc++
                        if(err) throw err;   
                           var returnedDaises = doc.Daises;
                           gettingOnlineStatusSQL(returnedDaises.Email, returnedDaises);
                           if(counterForDoc == resultLength){
                                   console.log('this was true');
                                   console.log(resultLength);
                                  //time in milisecond
                                    setTimeout(function(){
                                           if(onlineCounter >= 1 && offlineCounter >= 1){
                                                   res.send({'online': onlineResult, 'offline': offlineResult});
                                                   return;
                                           }
                                           if(onlineCounter >= 1 && offlineCounter == 0){
                                                   res.send({'online': onlineResult, 'offline': '', 'amount': resultLength});
                                                   return;
                                           }
                                           if(onlineCounter == 0 && offlineCounter >= 1){
                                                   res.send({'online': '', 'offline': offlineResult, 'amount': resultLength});
                                                   return;
                                           }

                                           console.log(foundResult + '  whats returning undefined');
                                           console.log('that is found result');
                                    },50);
                           }
                    })
             });   
       }
       
});

app.post('/liveSearch1', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
       var searchQuery = req.body.value;
       console.log(searchQuery + '  this is search query');
       var resultLength;
       // search mongoDB!
       mongo.connect(url, function(err, db){
          if(err)throw err;
            console.log('was successfull....');
            var cursor = db.collection('Daises').find({$text: {$search: req.body.value}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).count();
            // dont forget that the cursor returns a promise!
            // you will have to handle it with the then() function call which accept a CallBacks
            //console.log(cursor);
            cursor.then(function(result){
                if(result == 0){
                  res.send({'message': 'No Result Found!'});
                  return;
                }else{
                    resultLength = result;
                    gettingFoundResults();
                }
            }, function(error){
                 console.log(error);
            });
       });
       
       function gettingFoundResults(){
             mongo.connect(url, function(err, db){
                if(err)throw err;
                  console.log('gettingFoundResults was invoked!');
                  var cursor = db.collection('Daises').find({$text: {$search: searchQuery}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});
                     console.log(cursor.length)
                     console.log('getting cursor length');  
                  var loopingCounter = 0;
                  var onlineResult = [];
                  var offlineResult = [];
                  var counter = 0;
                  var onlineCounter = 0;
                  var offlineCounter = 0;
                  var foundResult;

                  function gettingOnlineStatusSQL(email, returnedDaises){
                        var sql = 'Select OnlineStatus From onlineofflinestatustable WHERE Email = ?';
                        connection.query(sql, [email], function(error, results, fields){
                            if(error)throw error;
                            returnedDaises.Email = results[0].OnlineStatus;
                            SortObjectAccordingToOnlineStatus(returnedDaises);
                        });
                  }

                  function SortObjectAccordingToOnlineStatus(returnedDaises){
                                      for(x in returnedDaises){
                                            counter++;
                                            if(returnedDaises[x] == 'online'){
                                                onlineCounter++;
                                                foundResult = {};
                                                var onlineSecondCounter = 0;
                                                for(u in returnedDaises){
                                                      onlineSecondCounter++;
                                                      if(u == 'FirstName'){
                                                         foundResult.FirstName = returnedDaises[u];
                                                      }
                                                      if(u == 'LastName'){
                                                         foundResult.LastName = returnedDaises[u];
                                                      }
                                                      if(u == 'OfflineStatus'){
                                                         foundResult.OfflineStatus = returnedDaises[u];
                                                      }
                                                      if(u == 'OnlineStatus'){
                                                         foundResult.OnlineStatus = returnedDaises[u];
                                                      }
                                                      if(u == 'PostedPicture'){
                                                         foundResult.PostedPicture = returnedDaises[u];
                                                      }
                                                      if(u == 'PostedVideo'){
                                                         foundResult.PostedVideo = returnedDaises[u];
                                                      }
                                                      if(u == 'Daises'){
                                                         foundResult.Daises = returnedDaises[u];
                                                      }
                                                      if(u == 'RateAvg1'){
                                                         foundResult.RateAvg1 = returnedDaises[u];
                                                      }
                                                      if(u == 'RateAvg2'){
                                                         foundResult.RateAvg2 = returnedDaises[u];
                                                      }
                                                      if(u == 'PersonalPicture'){
                                                         foundResult.PersonalPicture = returnedDaises[u];
                                                      }
                                                      if(u == 'DaisesIdentity'){
                                                         foundResult.DaisesIdentity = returnedDaises[u];
                                                      }

                                                      if(onlineSecondCounter == Object.keys(returnedDaises).length){
                                                         onlineResult.push(foundResult);
                                                      }
                                                }
                                            }

                                            if(returnedDaises[x] == 'offline'){
                                                 onlineCounter++;
                                                 foundResult = {};
                                                 var offlineSecondCounter = 0;
                                                  for(k in returnedDaises){
                                                      offlineSecondCounter++;
                                                      if(k == 'FirstName'){
                                                         foundResult.FirstName = returnedDaises[k];
                                                      }
                                                      if(k == 'LastName'){
                                                         foundResult.LastName = returnedDaises[k];
                                                      }
                                                      if(k == 'OfflineStatus'){
                                                         foundResult.OfflineStatus = returnedDaises[k];
                                                      }
                                                      if(k == 'OnlineStatus'){
                                                         foundResult.OnlineStatus = returnedDaises[k];
                                                      }
                                                      if(k == 'PostedPicture'){
                                                         foundResult.PostedPicture = returnedDaises[k];
                                                      }
                                                      if(k == 'PostedVideo'){
                                                         foundResult.PostedVideo = returnedDaises[k];
                                                      }
                                                      if(k == 'Daises'){
                                                         foundResult.Daises = returnedDaises[k];
                                                      }
                                                      if(k == 'RateAvg1'){
                                                         foundResult.RateAvg1 = returnedDaises[k];
                                                      }
                                                      if(k == 'RateAvg2'){
                                                         foundResult.RateAvg2 = returnedDaises[k];
                                                      }
                                                      if(k == 'PersonalPicture'){
                                                         foundResult.PersonalPicture = returnedDaises[k];
                                                      }
                                                      if(k == 'DaisesIdentity'){
                                                         foundResult.DaisesIdentity = returnedDaises[k];
                                                      }

                                                      if(offlineSecondCounter == Object.keys(returnedDaises).length){
                                                         offlineResult.push(foundResult);
                                                      }
                                                  }
                                            }
                                      }
                  }
                               
                    var counterForDoc = 0;
                    cursor.forEach(function(doc, err){
                        counterForDoc++
                        if(err) throw err;   
                           var returnedDaises = doc.Daises;
                           gettingOnlineStatusSQL(returnedDaises.Email, returnedDaises);
                           if(counterForDoc == resultLength){
                                   console.log('this was true');
                                   console.log(resultLength);
                                  //time in milisecond
                                    setTimeout(function(){
                                           if(onlineCounter >= 1 && offlineCounter >= 1){
                                                   res.send({'online': onlineResult, 'offline': offlineResult});
                                                   return;
                                           }
                                           if(onlineCounter >= 1 && offlineCounter == 0){
                                                   res.send({'online': onlineResult, 'offline': '', 'amount': resultLength});
                                                   return;
                                           }
                                           if(onlineCounter == 0 && offlineCounter >= 1){
                                                   res.send({'online': '', 'offline': offlineResult, 'amount': resultLength});
                                                   return;
                                           }

                                           console.log(foundResult + '  whats returning undefined');
                                           console.log('that is found result');
                                    },50);
                           }
                    })
             });   
       }
       
});

app.post("/changepicture", /*cors(allowCrossDomain),*/ function(req, res){
        /*  var email;
          var pictureName;*/
               upload(req,res,function(err) {
                        var email = req.body.email;
                        var pictureName = req.files.imagefileleft[0].filename;
                        if(req.files.imagefileleft == undefined){
                        console.log('its working well!!!')
                        }
                        if(err) {
                            return res.end("Error uploading file.");
                        }

                        var sql = "UPDATE registrationtable SET pictures = ? WHERE email = ?";
                        connection.query(sql, [pictureName, email],  function (error, results, fields) {
                             if(error) throw error;
                             console.log('this will go through')
                        });

                        res.send(pictureName);
              });
              // res.send("Ajax call back successfull");
});

                /// mongoose for mongoDB
      var url = 'mongodb://127.0.0.1:27017/test';
    
      function justGettingCheckingObject(){
        return checking;
      }
       
      var vinil;
    
          function RateSaving(){
                     Rate.save(function (err, Rate) {
                       if (err) return console.error(err);
                       console.log(Rate);
                     });
          }

           function pushingUniqueKeyIntoArray (gettingRamdomValues, vinil){
                 //var vinil = this.vinil;
                 vinil.daisesNumber.push(gettingRamdomValues);
                     mongo.connect(url, function(err, db){
                         db.collection('daisesratings').update({"name": "Ratings of Daises"}, {$set: {'Rating': vinil}})
                         identityOfPerticularDaises(gettingRamdomValues, vinil);
                         db.close();
                     });
                
               
          }
          
          function identityOfPerticularDaises(gettingRamdomValues, vinil){
              var postIdentifier = gettingRamdomValues;
              // vinil.postIdentifier = {};
              Object.defineProperty(vinil, postIdentifier, { value: {},
                                                             writable: true,
                                                             enumerable: true,
                                                             configurable: true });
              mongo.connect(url, function(err, db){
                     db.collection('daisesratings').update({"name": "Ratings of Daises"}, {$set: {'Rating': vinil}});
                     db.close();
                     //console.log(vinil.gettingRamdomValues + "  000000000000000000000");
                     console.log( Object.keys(vinil) + "  2222222222222222")
              });       
          }

          function creatingUniqueRatingIdentity1(myEmailValue, uniqueNumber, uniqueEmail){
                var modifiedEmail = myEmailValue;
               var splited = modifiedEmail.split('.')[0];
             
                 mongo.connect(url, function(err, db){
                   var cursor = db.collection('daisesratings').find({'name': "Ratings of Daises"}).limit(1);       
                  cursor.forEach(function(doc, err){
                    if(err) throw err;
                    // console.log(doc.Rating);
                      console.log(doc + "   Outputting doc!");
                         var someUniqueId = doc.Rating[uniqueNumber]; // returns an object;
                         someUniqueId[splited] = uniqueEmail;
                       var updatedDoc = doc.Rating;
                       db.collection('daisesratings').update({"name": "Ratings of Daises"}, {$set: {'Rating': updatedDoc}});     
                  }, function(){
                    db.close();
                  });
                });

          }
          //generating random numbers
        mongo.connect(url, function(err, db){
            console.log("Application ran up to this point");
            //this is probable returning a promise!
            var cursor = db.collection('daisesratings').find({'name': "Ratings of Daises"}).limit(1);
                  console.log("Application ran up to this point1");
                  cursor.forEach(function(doc, err){
                    console.log("Application ran up to this point2");
                    if(err) throw err;
                    console.log(doc.Rating);
                    doc.Rating.daisesNumber.push('vlllllllllllllll');
                    console.log(doc.Rating);
                  }, function(){
                    db.close();
                  });


                 //cursor returns a promise!
                 // this is according to the Current Version of MongoDB!

                  /*cursor.then(function(result){
                     console.log("Promise was called!");
                     console.log(doc.Rating);
                     doc.Rating.daisesNumber.push('vlllllllllllllll');
                     console.log(doc.Rating);
                  }, function(error){
                      throw error;
                  });*/
        });

        
          

app.post('/daisesposting', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
       upload(req,res, function(err) {
        console.log('ginana');
            //  if()
              // testing purposes to get the initial values to the submitted form inputs!
             console.log(req.files.imagefile);
               
               /* Now the condition is that one cannot post anything if the "Tag Daises" section
               is "NILL". It is either the user is entering a Daises with pictures or with videos 
               for discription or he is just discribing his/her daises with words alone. Which ever 
               the case the conditional statement that is appropraite will be executed.

               if the condition is out of this hard coded options, the form will never get to the 
               server, meaning it will never be submitted on the client side.

               On the client side the input will be validated before anything arrives on this server!
               */
              if(req.files.imagefile != undefined && req.body.daisesinput != "Enter Your Daises" 
                && req.body.selectDaises != "NILL"){
                  mongo.connect(url, function(err, db){
                    if(err) throw err;
                    var cursor = db.collection('daisesratings').find({'name': "Ratings of Daises"}).limit(1);
                           cursor.forEach(function(doc, err){
                              if(err) throw err;
                              console.log(doc + "this is doc");
                              var arrayObject = doc.Rating.daisesNumber;   // its an array of identity
                              console.log(arrayObject + " this is arrayObject!!!!");
                              var dataToUpdate = doc.Rating;
                              console.log(dataToUpdate + 'this is data to update')
                              // generation of random number!

                               var generateRandomNumber = function getRandomInt(min, max) {
                                            min = Math.ceil(min);
                                            max = Math.floor(max);
                                            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
                               }
                               var min = 1;
                               var max = 100000000000000;
                               
                               var ran3 = "ABC" + generateRandomNumber(min, max);
                               console.log(ran3+'it worked lets log it')
                               
                               vinil = dataToUpdate;
                               console.log(vinil + 'check vinil');
                               var rateValue = arrayObject;
                     for(i=0; i<=rateValue.length; i++){

                             if(rateValue[i] == ran3){
                                 for(i=0; i<=1000000; i++ ){
                                   var someRandomValue = "ABC" + generateRandomNumber();
                                      if(rateValue[i] != someRandomValue || ran3){
                                           //console.log(vinil + 'It seems something is wrong with this code block');
                                           pushingUniqueKeyIntoArray(someRandomValue, vinil);
                                           console.log(vinil + 'checking vinil again');
                                           insertingToDataBase(someRandomValue);
                                         //  identityOfPerticularDaises(someRandomValue, vinil);
                                           res.send(someRandomValue + '  Ajax was successfull!');
                                           return;
                                      }
                                 }
                                 
                                
                             }
                             if(rateValue[i] != ran3){
                                pushingUniqueKeyIntoArray(ran3, vinil);
                                insertingToDataBase(ran3);
                               // identityOfPerticularDaises(ran3);

                                res.send(ran3 + '   Ajax was successfull!');
                                return;
                             } 
                     }

                 }, function(){
                         db.close();
              });              
            
        });
                   
                       
                  
          //what the function insertingToDataBase is 
                     function insertingToDataBase(theRandomNumber){

                               var daiseValues = {
                   
                                    PostedPicture: req.files.imagefile[0].filename,
                                    Discursion: req.body.daisesinput,
                                    Tag: req.body.selectDaises,
                                    Email: req.body.email,
                                    DaisesIdentity: theRandomNumber

                               }

                            var sql1 = 'SELECT Firstname, LastName FROM registrationtable Where Email = ?';
                           // console.log(req.body.email + "   77777777777777777777777777777777");
                            connection.query(sql1, [req.body.email],  function (error, results, fields) {
                                     if(error) throw error;
                                      var firstname = results[0].Firstname;
                                        var lastname = results[0].LastName;
                                       /* console.log(results)
                                        console.log(lastname + "   Is toyin..")
                                         console.log(firstname + "   Is tklkkoloyin..")*/
                                           Object.defineProperty(daiseValues, "FirstName", { value: firstname,
                                                                                                     writable: true,
                                                                                                     enumerable: true,
                                                                                                     configurable: true });
                                           Object.defineProperty(daiseValues, "LastName", { value: lastname,
                                                                                                     writable: true,
                                                                                                     enumerable: true,
                                                                                                     configurable: true });
                                           
                                          

                                        console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
                                       var sql = 'INSERT INTO daisesposting SET ?'
                                       connection.query(sql, daiseValues,  function (error, results, fields) {
                                             if(error) throw error;
                                               console.log('Daises inputed Successfully: mysql!');
                                               createCollectionForThisPost();
                                        });

                                       function createCollectionForThisPost(){
                                             var personalPicture;
                                             var sql = 'select pictures from registrationtable where email = ?';
                                             connection.query(sql, [req.body.email], function(error, results, fields){
                                                  if(error)throw error;
                                                  personalPicture = results[0].pictures;
                                                  insertToMongoDb(personalPicture);
                                             });
                                             
                                             if(req.files.videofile){
                                                var videofile = req.files.videofile[0].filename;
                                             }else{
                                                var videofile = '';
                                             }

                                             if(req.files.imagefile){
                                                var imagefile = req.files.imagefile[0].filename;
                                             }else{
                                                var imagefile = '';
                                             }
                                             
                                             if(new Date().getHours() > 12){
                                                 var period = 'PM';
                                             }else{
                                                 var period = 'AM';
                                             }

                                            function insertToMongoDb(personalPicture){
                                                   mongo.connect(url, function(err, db){
                                                        db.collection('Daises').insert({
                                                                          'Title': 'Posted Daises',
                                                                          'Daises': {
                                                                                      'Daises': req.body.daisesinput,
                                                                                      'FirstName': firstname,
                                                                                      'LastName': lastname,
                                                                                      'PersonalPicture': personalPicture,
                                                                                      'OnlineStatus': '',
                                                                                      'PostedPicture': imagefile,
                                                                                      'PostedVideo': videofile,
                                                                                      'Email': req.body.email,
                                                                                      'RateAvg1': 10,
                                                                                      'RateAvg2': 10,
                                                                                      'DaisesIdentity': theRandomNumber
                                                                                    },
                                                                          'Time': {
                                                                                    'Period': period,
                                                                                    'Seconds': new Date().getSeconds(),
                                                                                    'Minutes': new Date().getMinutes(),
                                                                                    'Time': new Date().getHours(),
                                                                                    'Day': new Date().getDay(),
                                                                                    'Month': new Date().getMonth(),
                                                                                    'Year': new Date().getFullYear()
                                                                                  }
                                                                        });  
                                                  });
                                            };
                                        
                                       };

                            });

                                var enteredDaises = { 
                                          // needed for client side
                                          PostedPicture: req.files.imagefile[0].filename,
                                          Discursion: req.body.daisesinput,
                                          Tag: req.body.selectDaises,
                                          Email: req.body.email,
                                          generatedRandomNumber: theRandomNumber
                                };
                      } 
                        
                        //res.send(enteredDaises);
               

           /*    if(req.files.videofile != undefined && req.body.daisesinput != "Enter Your Daises" 
                && req.body.selectDaises != "NILL"){
                
               }
               if(req.body.daisesinput != "Enter Your Daises" && req.files.imagefile == undefined 
               && req.files.videofile == undefined && req.body.selectDaises != "NILL" ){
               
               }
              
              if(req.files.videofile == undefined){
                console.log('its working well!!!')
              }
              if(err) {
                  return res.end("Error uploading file.");
              }*/
            // res.send('Daises posting went through!');
        }
     });
  });



app.post('/gettingFormerChat', /*cors(allowCrossDomain),*/ jsonParser, function(req, res){
      console.log(req.body.personalEmail);
      console.log(req.body.FriendEmail);
      console.log('Yea its working perfectly!!////////////////////////');
      var personalEmail = req.body.personalEmail;
      var FriendEmail = req.body.FriendEmail;
      var arrayOfFormerChat = [];
      var counter = 0;
      var sql = 'Select Chat, Messenger FROM chattable Where OwnersEmail = ? AND FriendEmail = ?';
      connection.query(sql, [personalEmail, FriendEmail], function(error, results, fields){
          if(error)throw error;
             var resultLength = results.length;
          if(resultLength != 0){
                for(var i=0; i < results.length; i++){
                    var chat = results[i].Chat + " " + '|' + ' ' + results[i].Messenger;
                    arrayOfFormerChat.push(chat);

                    counter++; 
                    if(counter == results.length)
                      res.send({'message': arrayOfFormerChat});
                      console.log(arrayOfFormerChat);
                      console.log('array of former chat!!!');
                }
          }

          if(resultLength == 0){
              res.send({'message': 'No Chat Available!!!'});
          }

      });
})

// listening on port 5000;

server.listen(8000);
