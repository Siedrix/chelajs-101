var express = require('express.io'),
	swig = require('swig');

var app = express();
var links = [];

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

app.get('/', function (req, res) {
	res.render('index', { /* template locals context */ });
});

app.get('/links', function (req, res) {
	res.send(links);
});

app.post('/links', function (req, res) {
	req.body.id = Math.random();
	links.push(req.body);

	res.send(req.body);
});

app.del('/links/:id', function (req, res) {
	links = links.filter(function(item){
		return item.id !== parseFloat(req.params.id, 10);
	});

	res.send({removed : true});
});

app.listen(7076);