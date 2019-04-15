let express = require('express');
const path = require('path');

let app = express();
const index = require('./routes/index');


let i18n = require("i18n");
i18n.configure({
   locales:['en', 'es'],
   queryParameter: 'lang',
   defaultLocale: 'en',
   updateFiles: false,
   syncFiles: false,
   cookie: 'i18n',
   directory: __dirname + '/locales'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(i18n.init);

app.use(express.static('public'));

app.use('/', index);


let server = app.listen(8000, function () {

   console.log('Express app listening at port 8000');

});

function stop() {
  server.close();
  console.log("Server stopped");
}
