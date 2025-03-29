var cfg = require('./cf.js');

console.log(cfg)

var express         = require('express'),
    routes	        = require('./src/routes/routes.js'),
    helmet          = require('helmet');

var app = express()

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(helmet())

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');   
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-filename, Content-disposition, system, token, idaction");
    res.setHeader('Access-Control-Expose-Headers', "x-filename, Content-disposition")
    next();
});

app.use(routes)

app.listen(cfg.puerto, function() {
	console.log(cfg.puerto + '::' + cfg.messageTerminal );
});

