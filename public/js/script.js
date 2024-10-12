const socket = io(); //sent connection request to server

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
       const  { latitude, longitude } =  position.coords;
       socket.emit("send-locartion", {latitude, longitude});
    }, (error)=>{
        console.log(error);
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }
    );
}

const map = L.map("map").setView([0,0], 17); //earth's coordinate and 10 lvl zoom

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:"sparkel_god"
        // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markers = {};

socket.on("recieve-locartion", (data)=>{
        const { id, latitude, longitude } =  data;
        map.setView([latitude, longitude],);
        if(markers[id]){
            markers[id].setLatLng([latitude, longitude]);
        } else {
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }
});

socket.on("user-disconnected", (id)=>{
    if (markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})