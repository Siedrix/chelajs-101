var express = require('express.io'),
	swig = require('swig'),
	mongoose = require('mongoose');

var app = express();
app.http().io();

var Schema = mongoose.Schema;

// View engine
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('view cache', false);
swig.setDefaults({ cache: false });

// Static assets
app.use(express.static('./public'));

// Server config
app.configure(function() {
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.json());
});

// db connect
mongoose.connect('mongodb://localhost/chela-101');

var linkSchema = new Schema({
	title:  String,
	url: String
});

var Link = mongoose.model('Blog', linkSchema);

app.get('/', function (req, res) {
	res.render('index', { /* template locals context */ });
});

app.get('/links', function (req, res) {
	Link.find({}, function(err, links){
		res.send(links);
	});
});

app.post('/links', function (req, res) {
	// req.body.id = Math.random();
	var link = new Link(req.body);

	link.save(function(err){
		res.send(link);
		req.io.broadcast('link:add', link.toJSON() );
	});
});

app.del('/links/:id', function (req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);

	Link.remove({_id:id}, function(err){
		res.send({removed : true});
		req.io.broadcast('link:remove', req.params.id );
	});
});

app.listen(7076);