var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 4,
        // only show roadmap type of map, and disable ability to switch to other type
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false
    });

    map.data.setControls(['Polygon']);
    map.data.setStyle({
        editable: true,
        draggable: true
    });
    bindDataLayerListeners(map.data);


    loadPolygons(map);  //load saved data
}


// Apply listeners to refresh the GeoJson display on a given data layer.
function bindDataLayerListeners(dataLayer) {
    dataLayer.addListener('addfeature', savePolygon);
    dataLayer.addListener('removefeature', savePolygon);
    //dataLayer.addListener('setgeometry', savePolygon);
}

function loadPolygons(map) {
    var data = JSON.parse(localStorage.getItem('geoData'));


    map.data.forEach(function (f) {
        map.data.remove(f);
    });
    map.data.addGeoJson(data)
}



function savePolygon() {
    map.data.toGeoJson(function (json) {
        localStorage.setItem('geoData', JSON.stringify(json));
        initControls(json);
    });
}

function initControls(data)
{
    var sel = document.getElementById('polyList');
    sel.options.length = 0;

    for (var i = 0; i < data.features.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = data.features[i].geometry.type;
        opt.value = i;
        sel.appendChild(opt);
    }

    document.getElementById("btnDelete").disabled = (data.features.length === 0);
    document.getElementById("btnDelete").onclick = function(){
        var selIdx = sel.options[sel.selectedIndex].value; //get poly index
        data.features.splice(parseInt(selIdx), 1);

        //reload
        localStorage.setItem('geoData', JSON.stringify(data));
        initControls(data);
        loadPolygons(map);
    };
}
initMap();
