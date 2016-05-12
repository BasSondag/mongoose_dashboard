var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose  = require('mongoose');
var app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'./static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//model
mongoose.connect('mongodb://localhost/mongoose_dashboard');


var PackSchema = new mongoose.Schema({
	name: String,
	habitat: String,
	food: String,
	groupsize: String
}) 

PackSchema.path('name').required(true,'name cannot be blank')
PackSchema.path('habitat').required(true,'habitat cannot be blank')
PackSchema.path('food').required(true,'food cannot be blank')
PackSchema.path('groupsize').required(true,'groupsize cannot be blank')

mongoose.model('Pack', PackSchema);
var Pack = mongoose.model('Pack');

//routes
//get
app.get('/', function(req, res){
	console.log('index');
	Pack.find({}, function(err, packs){
		res.render('index', {all_packs: packs});
	})
})

app.get('/packs/new', function(req, res){
	console.log('new');
	res.render('new');

})

app.get('/packs/:id', function(req, res){
	console.log(req.params.id);
	Pack.findOne({_id: req.params.id}, function(err, pack){
		console.log(pack )
		res.render('show', {one_pack: pack});
	})
})


app.get('/packs/:id/edit', function(req, res){
	console.log('edit');
	Pack.findOne({_id: req.params.id}, function(err, pack){
		console.log(pack )
		res.render('edit', {one_pack: pack});
	})
})


//post

app.post('/packs', function(req, res){
	var pack = new Pack({name: req.body.name, habitat: req.body.habitat, food: req.body.food, groupsize: req.body.groupsize})
	pack.save(function(err){
		if(err) {
			console.log("pack is not saved")
			res.render('new', {title: 'you have errors!', errors: pack.errors})
		} else {

			res.redirect('/')
		}

	})
})

app.post('/packs/:id', function(req, res){
	var id = req.params.id;
	var pack = req.body;
	Pack.update({_id: id}, pack, {runValidators: true}, function(err){
		if(err){
			console.log(err)
			render("/packs")
		}else {
			res.redirect('/packs/' + req.params.id)
		}
	})
})

app.post('/packs/:id/destroy', function(req, res){
	var id = req.params.id;
	Pack.remove({_id: id}, function(err){
		if(err){
			console.log(err)
			res.redirect('/packs/'+ req.params.id)
		} else {

			res.redirect('/')
		}
	})
} )


app.listen(8000, function(){
	console.log('welcome pack to 8000')
})

