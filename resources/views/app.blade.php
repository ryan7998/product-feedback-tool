<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
    <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta name="theme-color" content="#4f46e5"/>
    <meta name="description" content="Product Feedback Tool - A modern platform for collecting and managing user feedback with real-time collaboration and professional design."/>
    <link rel="apple-touch-icon" href="/favicon.svg"/>
    <link rel="manifest" href="/manifest.json"/>
    <title>Product Feedback Tool</title>
    
    @if(config('frontend.serve_from_laravel'))
        {{-- Production: Serve built React files from Laravel --}}
        <script defer="defer" src="{{ config('frontend.build_files.js') }}"></script>
        <link href="{{ config('frontend.build_files.css') }}" rel="stylesheet">
    @else
        {{-- Local Development: Serve from React dev server --}}
        <script defer="defer" src="{{ config('frontend.react_dev_server') }}{{ config('frontend.build_files.js') }}"></script>
        <link href="{{ config('frontend.react_dev_server') }}{{ config('frontend.build_files.css') }}" rel="stylesheet">
    @endif
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
</body>
</html>
