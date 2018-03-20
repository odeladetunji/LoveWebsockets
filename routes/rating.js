/*var http = require('http');
var express = require('express')();
var multer = require('multer');
var router = express.Router();


router.post('/', function(req, res){
	    upload(req,res,function(err) {
                   

                        if(err) {
                            return res.end("Error uploading file.");
                        }
                       console.log(req.body);
                        //now we are going to get the rating field and make an object of i
                       var uniqueEmail = {}
      
                    if(req.body.Apple > 1) uniqueEmail.Apple = req.body.Apple;
                      if(req.body.Banana > 1) {uniqueEmail.Banana = req.body.Banana;}
                       if(req.body.Durain > 1) {uniqueEmail.Durian = req.body.Durian;}
                         if(req.body.Cucumber > 1) uniqueEmail.Cucumber = req.body.Cucumber;
                          if(req.body.Date > 1) uniqueEmail.Date = req.body.Date;
                           if(req.body.DragonFruit > 1) uniqueEmail.DragonFruit = req.body.DragonFruit;
                            if(req.body.BlackBerry > 1) uniqueEmail.BlackBerry = req.body.BlackBerry;
                             if(req.body.Olive > 1) uniqueEmail.Olive = req.body.Olive;
                              if(req.body.Coconut > 1) uniqueEmail.Coconut = req.body.Coconut;
                       if(req.body.Lemon > 1) uniqueEmail.Lemon = req.body.Lemon;
                        if(req.body.Tangerine > 1) uniqueEmail.Tangerine = req.body.Tangerine;
                         if(req.body.PassionFruit > 1) uniqueEmail.PassionFruit = req.body.PassionFruit;
                          if(req.body.Walnut > 1) uniqueEmail.Walnut = req.body.Walnut;
                           if(req.body.Starfruit > 1) uniqueEmail.Starfruit = req.body.Starfruit;
                            if(req.body.Fig > 1) uniqueEmail.Fig = req.body.Fig;
                             if(req.body.Pomengranate > 1) uniqueEmail.Pomengranate = req.body.Pomengranate;
                              if(req.body.Orange > 1) uniqueEmail.Orange = req.body.Orange;
                               if(req.body.Cherry > 1) uniqueEmail.Cherry = req.body.Cherry;
                                if(req.body.Watermellon > 1) uniqueEmail.Watermellon = req.body.Watermellon;
                             if(req.body.Guava > 1) uniqueEmail.Guava = req.body.Guava;
                              if(req.body.KiwiFruit > 1) uniqueEmail.KiwiFruit = req.body.Kiwifruit;
                               if(req.body.Cantaloupe > 1) uniqueEmail.Cantaloupe = req.body.Cantaloupe;
                                if(req.body.BreadFruit > 1) uniqueEmail.BreadFruit = req.body.BreadFruit;
                                 if(req.body.Papaya > 1) uniqueEmail.Papaya = req.body.Papaya;
                                  if(req.body.Miracle > 1) uniqueEmail.Miracle = req.body.Miracle;
                                   if(req.body.HuckleBerry > 1) uniqueEmail.HuckleBerry = req.body.HuckleBerry;
                                    if(req.body.Pineapple > 1) uniqueEmail.Pineapple = req.body.Pineapple;
                                      if(req.body.Grape > 1) uniqueEmail.Grape = req.body.Grape;
                                  if(req.body.Tamarind > 1) uniqueEmail.Tamarind = req.body.Tamarind;
                                   if(req.body.BlueBerry > 1) uniqueEmail.BlueBerry = req.body.BlueBerry;
                                    if(req.body.BlackCurrant > 1) uniqueEmail.BlackCurrant = req.body.BlackCurrant;
                                     if(req.body.Jujube > 1) uniqueEmail.Jujube = req.body.Jujube;
                                      if(req.body.Lime > 1) uniqueEmail.Lime = req.body.Lime;
                                       
                                   if(req.body.JackFruit > 1) uniqueEmail.JackFruit = req.body.JackFruit;
                                    if(req.body.Kolanut > 1) uniqueEmail.Kolonut = req.body.Kolanut;
                                     if(req.body.Longan > 1) uniqueEmail.Longan = req.body.Longan;
                                      if(req.body.Bitter > 1) uniqueEmail.Bitter = req.body.Bitter;
                                       if(req.body.Peach > 1) uniqueEmail.Peach = req.body.Peach;
                                        if(req.body.Lychee > 1) uniqueEmail.Lychee = req.body.Lychee;
                                         if(req.body.Damson > 1 ) uniqueEmail.Damson = req.body.Damson;
                                   if(req.body.Cashew > 1) uniqueEmail.Cashew = req.body.Cashew;
                                    if(req.body.Mango > 1) uniqueEmail.Mango = req.body.Mango;
                                     if(req.body.Avocado > 1) uniqueEmail.Avocado = req.body.Avocado;
                                      if(req.body.Pear > 1) uniqueEmail.Pear = req.body.Pear;
                                       if(req.body.Loquat > 1) uniqueEmail.Loquat = req.body.Loquat;
                                       
                        console.log(uniqueEmail);
                        console.log('loop is completed');
                       
                       res.send('Rating, Rating, Rating!!!!');
              });
})
module.exports = router;*/