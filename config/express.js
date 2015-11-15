var express = require('express');
var exphbs = require('express-handlebars');
var load = require('express-load');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var helmet = require('helmet');

module.exports = function() {
	var app = express();
	
	app.set('port', 3000);
	
	// Arquivos estáticos
	app.use(express.static('./public'));
	// View engine (usando o Handlebars)
	app.engine('hbs', exphbs());
	app.set('view engine', 'hbs');
	app.set('views', './app/views');
	
	// Solução usando X-HTTP-Method-Override para navagadores
	// que não suportam os verbos DELETE e PUT
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Cookie, sessão e Passport
	app.use(cookieParser());
	app.use(session({
		secret: 'homem avestruz',
		resave: true,
		saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	// Middlewares de segurança

	// Esconde do header a info "X-Powered-By: Express"
	//app.disable('x-powered-by');
	// "Diz" que esta aplicação foi feita em PHP, ao invés do Express
	app.use(helmet.hidePoweredBy({ setTo: 'PHP 5.5.14' }));
	// Evita que a aplicação seja rodada dentro de um frame/iframe,
	// impossibilitando ataques do tipo "clickjacking"
	app.use(helmet.xframe());
	// Evita ataques de XSS (cross-site scripting)
	app.use(helmet.xssFilter());
	// Impede que o browser carreguem arquivos que não sejam dos
	// MIME types "text/css" e "text/javascript" nas tags LINK e SCRIPT
	app.use(helmet.nosniff());
	
	// Carrega todos os módulos da aplicação
	load('models', {cwd: 'app'})
		.then('controllers')
		.then('routes')
		.into(app);

	// Se nenhuma rota atender, direcionar para a página 404
	app.get('*', function(req, res) {
		res.status(404).render('404');
	});
	
	return app;
};