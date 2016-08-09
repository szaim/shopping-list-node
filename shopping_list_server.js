var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.update = function(id, name) {
    console.log(typeof id, id, "ID");
   for (var i = 0; i < this.items.length; i++) {
       if (this.items[i].id == id) {
           console.log("NAME", name);
        this.items[i].name = name;
        return true
       }
   }
   console.log('ITEMS', this.items);
   return false
};


var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

// console.log(storage.items);

var app = express();
// Headers from server 
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
    
  
});

app.post('/items', jsonParser, function(request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    }
    //if body has no name prevent it from being added
   if (request.body.name == undefined) {
    //   console.log('res', response.sendStatus(405));
        return  response.sendStatus(406);
    }
    // console.log(request.body);
    var item = storage.add(request.body.name);
    response.status(201).json(item);
});


//added post to test "Post to an ID that exists"
app.post('/items/:id', jsonParser, function(request, response) {
    // console.log(response);
    response.status(409).json({'error': 'error'});
});

app.delete('/items/:id', function(request, response){
    // Reminder:
    // URL -> params has id
    var id = request.params.id;
    // var idToDelete = storage.items[id];
    var index = -1;
    for (var i = 0; i < storage.items.length; i++) {
        if (storage.items[i].id == id) {
            // var item = storage.items.splice(i,1);
            var index = i;
            // return response.status(200).json(item)
        }
    }
    if (index == -1){
    response.status(400).json({'status': 'error'});
    } else {
        var item = storage.items.splice(index, 1);
        response.json(item);
    }
    

    // console.log('the array that contains the rest of the items: ', storage.items);
});

app.put('/items/:id', jsonParser, function(request, response) {
    // return the index of the object
    var id = request.params.id;
    var name = request.body.name;

    if (!request.params.id) {
        return response.sendStatus(404);
    }

    response.status(200).json(storage.update(id, name));
    // console.log(storage.items);
    
});
app.listen(process.env.PORT, process.env.IP);
exports.app = app;
exports.storage = storage;
/*
CRUD 
Get   Post          PUT     Delete  <-- verbs 
read  create/add    update  Remove

*/