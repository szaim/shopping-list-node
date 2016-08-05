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
   for (var i = 0; i < storage.items.length; i++) {
       if (storage.items[i].id == id) {
        storage.items[i].name = name;
        return true
       }
   }
   return false
};


var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');
storage.update(1, 'Potato');
console.log(storage.items);

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

    var item = storage.add(request.body.name);
    console.log(request.body);
    response.status(201).json(item);
});

app.delete('/items/:id', function(request, response){
    
    var id = request.params.id;
    var idToDelete = storage.items[id];
    var item = storage.items.splice(idToDelete, 1);
    if(!item){
        console.log(response.sendStatus(400));
    } else if(!id){
        console.log(response.sendStatus(404).json('error'));
    }
    response.status(200).json(item);
    

    console.log('the array that contains the rest of the items: ', storage.items);
});

app.put('/items/:id', jsonParser, function(request, response) {
    // return the index of the object
    var id = request.body.id;
    var name = request.body.name;
    storage.update(id, name);
    console.log(storage.items);
    // console.log('body', request.body);
    // console.log(name);
    
});
app.listen(process.env.PORT, process.env.IP);

/*
CRUD 
Get   Post          PUT     Delete  <-- verbs 
read  create/add    update  Remove

*/