function sendGetRequest(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.send();
    request.onreadystatechange = function(e) {
        if (e.currentTarget && e.currentTarget.readyState == 4 &&
            e.currentTarget.status == 200) {
            callback(JSON.parse(e.currentTarget.responseText));
        }
    }
}