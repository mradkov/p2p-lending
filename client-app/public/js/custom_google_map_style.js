var map;

var lat = window['lat'];
var lng = window['lng'];
var zoom = window['zoom'];
zoom = parseInt(zoom);


var loc = new google.maps.LatLng(lat, lng);
var markerPos = new google.maps.LatLng(lat, lng);

function initializeGoogleMap() {
    var stylers = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#424b5b"},{"weight":2},{"gamma":"1"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#545b6b"},{"gamma":"0"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#545b6b"},{"gamma":"1"},{"weight":"10"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#666c7b"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#545b6b"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#424a5b"},{"lightness":"0"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#666c7b"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2e3546"}]}];

    var mapOptions = {
        zoom: zoom,
        center: loc,
        mapTypeId: 'drop',
        scrollwheel: false
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var styledMapOptions = {
        map: map
    }
    var marker = new google.maps.Marker({
        position: markerPos,
        map: map
    });

    var testmap = new google.maps.StyledMapType(stylers, styledMapOptions);

    map.mapTypes.set('drop', testmap);
    map.setMapTypeId('drop');
}