// Store a copy of the fetch function
let _oldFetch = fetch;

// Create our new version of the fetch function
window.fetch = function(){

    // Create hooks
    let fetchStart = new Event('fetchStart', {'view': document, 'bubbles': true, 'cancelable': false});
    let fetchEnd = new Event( 'fetchEnd', { 'view': document, 'bubbles': true, 'cancelable': false } );

    // Pass the supplied arguments to the real fetch function
    let fetchCall = _oldFetch.apply(this, arguments);

    // Trigger the fetchStart event
    document.dispatchEvent(fetchStart);

    fetchCall.then(function(){
        // Trigger the fetchEnd event
        document.dispatchEvent(fetchEnd);
    }).catch(function(){
        // Trigger the fetchEnd event
        document.dispatchEvent(fetchEnd);
    });

    return fetchCall;
};

document.addEventListener('fetchStart', function() {
    $('#loaderModal').modal('show');
});

document.addEventListener('fetchEnd', function() {
    $('#loaderModal').modal('hide');
});