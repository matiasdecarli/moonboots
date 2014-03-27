var express = require('express'),
    Moonboots = require('./index.js'),
    app = express();

// configure our app
var clientApp = new Moonboots({
    main: __dirname + '/sample/app/app.js',
    templateFile: __dirname + '/sample/app.html',
    modulesDir: __dirname + '/sample/modules',
    developmentMode: true,
    libraries: [
        __dirname + '/sample/libraries/jquery.js'
    ],
    stylesheets: [
        __dirname + '/sample/stylesheets/style.css',
        __dirname + '/sample/stylesheets/app.css'
    ],
    beforeBuildCSS: function () {
        console.log('Before build CSS');
    },
    beforeBuildJS: function (cb) {
        // Simulating an async build step
        setTimeout(function () {
            console.log('Before build JS');
            cb();
        }, 2000);
    },
    server: app
});

// We can choose to not run a server, but instead just
// write the files to a directory. If we ran the script
// with `node server.js --build` then our files will be
// buil5 and saved to ./build with developmentMode
// turned off and the script will exit
if (!!process.argv.join(' ').indexOf(' --build')) {
    clientApp.config.developmentMode = false;
    clientApp.build(__dirname + '/sample-build');
    return;
}

// if we want to prime the user's cache with the
// application files. The login page is a great place
// to do this. We can retrieve the name of the
// JS file for the current app, by calling module's
// jsFileName() function.
app.get('/login', function (req, res) {
    // then in our login page we can lazy load the application to
    // prime the user's cache while they're typing in their username/password
    res.render('login', {appFileName: clientApp.jsFileName()});
});

// We also just need to specify the routes at which we want to serve this clientside app.
// This is important for supporting "deep linking" into a single page app. The server
// has to know what urls to let the browser app handle.
app.get('*', clientApp.html());

// start listening for http requests
app.listen(3000, function () {
    console.log('Sample app started at localhost:3000');
});


