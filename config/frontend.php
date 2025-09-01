<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Frontend Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration for the frontend application,
    | including React development server URLs and build file paths.
    |
    */

    'react_dev_server' => env('REACT_DEV_SERVER', 'http://localhost:3000'),
    
    'build_files' => [
        'js' => env('REACT_BUILD_JS', '/static/js/main.47aebcdb.js'),
        'css' => env('REACT_BUILD_CSS', '/static/css/main.3b367c70.css'),
    ],
    
    'serve_from_laravel' => env('SERVE_FRONTEND_FROM_LARAVEL', false),
];
