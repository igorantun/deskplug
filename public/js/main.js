/* Requires */
var Plugged = require('plugged');
var config = require('./config.json');
var utils = require('./lib/utils.js');
var log = require('./lib/log.js');


/* Variables */
var plug = new Plugged();
var nmr = 0;


/* Config */
emojione.ascii = true;
emojione.imageType = 'png';
emojione.unicodeAlt = false;


/* Callbacks */
plug.login(config.auth);

plug.on(plug.LOGIN_SUCCESS, function() {
    log('start', 'Successfully logged in.');
    plug.connect(config.room);
});

plug.on(plug.JOINED_ROOM, function() {
    log('start', 'Successfully connected to ' + config.room + '.');

    document.getElementById('messages').innerHTML = '';
    $('#input').prop('disabled', false);
    $('#woot').prop('disabled', false);
    $('#meh').prop('disabled', false);

    updateVideo();
});

plug.on(plug.CHAT, function(chat) {
    log('chat', chat.username + ': ' + chat.message);

    $('#messages').append('<div class="msg"><strong>' + chat.username + ':</strong> ' + chat.message + '</div>');
    $('#messages').animate({
        scrollTop: $('#messages').prop('scrollHeight')
    }, 500);

    var element = document.getElementsByClassName('msg')[nmr];
    $('#messages').linkify();
    nmr++;

    if(element.innerHTML != undefined) {
        var output = emojione.shortnameToImage(element.innerHTML);
        var input = element.innerHTML;
        element.innerHTML = output;
    }
});

plug.on(plug.ADVANCE, function(booth, now, prev) {
    updateVideo();
});


/* Functions */
function updateVideo() {
    document.getElementById('track').innerHTML = plug.getCurrentMedia().author + ' - ' + plug.getCurrentMedia().title;
    document.getElementById('dj').innerHTML = plug.getUserByID(plug.getCurrentDJ().id).username;

    if(plug.getCurrentMedia().format === 1) {
        document.getElementById('ytplayer').src = 'http://www.youtube.com/embed/' + plug.getCurrentMedia().cid + '?autoplay=1&controls=0&showinfo=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&start=' + utils.getElapsed();
    } else {
        // HANDLE SOUNDCLOUD HERE
    }
}

function sendVote(vote) {
    if(vote === 'woot') {
        setTimeout(function(){$('#woot').prop('disabled', true)}, 250);
        $('#meh').prop('disabled', false);
        plug.woot();
    } else if(vote === 'meh') {
        setTimeout(function(){$('#meh').prop('disabled', true)}, 250);
        $('#woot').prop('disabled', false);
        plug.meh();
    }
}


/* Binds */
$('#input').keypress(function(e) {
    if(e.which == 13) {
        plug.sendChat($('#input').val());
        $('#input').val('');
    }
});

$('#slider').bind('change', function() {
    var volume = parseInt($('#slider').val());
    document.getElementById('volume').innerHTML = volume + '%';
    callPlayer('setVolume', [volume]);
});


/* Internal */
function callPlayer(func, args) {
    document.getElementById('ytplayer').contentWindow.postMessage(JSON.stringify({
        'event': 'command',
        'func': func,
        'args': args || []
    }), '*');
}

function reconnect() {
    plug.connect(config.room);
};