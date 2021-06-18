var canvas = document.querySelector(".canvas");
var invisibleCanvas = document.querySelector(".invisible-canvas");
var tilesetContainer = document.querySelector(".tileset-container");
var tilesetSelection = document.querySelector(".tileset-container_selection");
var tilesetSelectionHover = document.querySelector(".tileset-container_selection-hover");
var tilemapPosition = document.querySelector(".draw-tile_position");
var tilesetImage = document.querySelector('#tileset-source');

var colliderContainer = document.querySelector(".collider-container");
var colliderSelection = document.querySelector(".collider-container_selection");
var colliderSelectionHover = document.querySelector(".collider-container_selection-hover");
var colliderCanvas = document.querySelector(".collider-canvas");
var colliderImage = document.querySelector("#collider-source");

var selection = [0, 0]; //Which tile we will paint from the menu
var isCurrentlyOnTileCanvas = true;

var isMouseDown = false;
var currentLayer = 0;
var layers = [
    //Bottom
    {
        //Structure is "x-y": ["tileset_x", "tileset_y"]
        //EXAMPLE: "1-1": [3, 4]
    },
    //Middle
    {},
    //Top
    {}
];
var collisionDrawLayers = [
    //Bottom
    {},
    //Middle
    {},
    //Top
    {}
];

var size_of_crop = 32;

var collisionLayers = [];
for(let i = 0; i < size_of_crop; i++){ //Rows
    collisionLayers[i] = [];
    for(let j = 0; j < size_of_crop; j++){ //Columns
        collisionLayers[i][j] = 0;
    }
}
console.log(collisionLayers);

//Select the tile from the Tiles grid
tilesetContainer.addEventListener("mousedown", (event) => {
    selectPicker(true);
    selection = getCoords(event, 32, 32);
    tilesetSelection.style.left = selection[0] * 32 + "px";
    tilesetSelection.style.top = selection[1] * 32 + "px";
});
tilesetContainer.addEventListener("mousemove", (event) => {
    var position = getCoords(event, 32, 32);
    tilesetSelectionHover.style.left = Math.max(position[0] * 32, 0) + "px";
    tilesetSelectionHover.style.top = Math.max(position[1] * 32, 0) + "px";
});
tilesetContainer.addEventListener("mouseenter", (event) => {
    tilesetSelectionHover.style.outlineColor = "#00ffff80";
});
tilesetContainer.addEventListener("mouseout", (event) => {
    tilesetSelectionHover.style.outlineColor = "#00ffff00";
});

//Select the collider from the Colliders grid
colliderContainer.addEventListener("mousedown", (event) => {
    selectPicker(false);
    selection = getCoords(event, 64, 64);
    colliderSelection.style.left = selection[0] * 64 + "px";
    colliderSelection.style.top = selection[1] * 64 + "px";
});
colliderContainer.addEventListener("mousemove", (event) => {
    var position = getCoords(event, 64, 64);
    colliderSelectionHover.style.left = Math.max(position[0] * 64, 0) + "px";
    colliderSelectionHover.style.top = Math.max(position[1] * 64, 0) + "px";
});
colliderContainer.addEventListener("mouseenter", (event) => {
    colliderSelectionHover.style.outlineColor = "#00ffff80";
});
colliderContainer.addEventListener("mouseout", (event) => {
    colliderSelectionHover.style.outlineColor = "#00ffff00";
});

function openActionDropdown(){
    document.getElementById("actionDropdown").classList.toggle("show");
}
window.onclick = function(event) {
    if(!event.target.matches('.dropdown-button')){
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for(var i = 0; i < dropdowns.length; i++){
            var openDropdown = dropdowns[i];
            if(openDropdown.classList.contains('show')){
                openDropdown.classList.remove('show');
            }
        }
    }
}

function selectPicker(tileset){
    if(tileset){
        tilesetSelection.style.outlineColor = "#00ffff";
        colliderSelection.style.outlineColor = "#00ffff00";
        colliderCanvas.style.display = "none";
        isCurrentlyOnTileCanvas = true;
    }else{
        tilesetSelection.style.outlineColor = "#00ffff00";
        colliderSelection.style.outlineColor = "#00ffff";
        colliderCanvas.style.display = "block";
        isCurrentlyOnTileCanvas = false;
    }
}

//Handler for placing new tiles on the map
function addTile(mouseEvent){
    var clicked = getCoords(event, 32, 32);
    var key = clicked[0] + "-" + clicked[1];

    if(mouseEvent.shiftKey){
        delete layers[currentLayer][key];
    }else{
        layers[currentLayer][key] = [selection[0], selection[1]];
    }
    draw();
}
function addCollisionTile(mouseEvent){
    var clicked = getCoords(event, 32, 32);
    var key = clicked[0] + "-" + clicked[1];

    const {x, y} = event.target.getBoundingClientRect();
    const mouseX = event.clientX - x;
    const mouseY = event.clientY - y;

    if(mouseEvent.shiftKey){
        delete collisionDrawLayers[currentLayer][key];
        collisionLayers[Math.floor(mouseY / 32)][Math.floor(mouseX / 32)] = 0;
    }else{
        collisionDrawLayers[currentLayer][key] = [selection[0], selection[1]];
        collisionLayers[Math.floor(mouseY / 32)][Math.floor(mouseX / 32)] = 3 * selection[1] + selection[0] + 1;
    }
    drawCollision();
}

function drawPosition(){
    var position = getCoords(event, 32, 32);
    tilemapPosition.style.left = position[0] * 32 + "px";
    tilemapPosition.style.top = position[1] * 32 + "px";
}

//Bind mouse events for painting (or removing) tiles on click/drag
canvas.addEventListener("mousedown", () => {
    isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
    countColors();
    isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
    isMouseDown = false;
});
canvas.addEventListener("mousedown", addTile);
canvas.addEventListener("mousemove", (event) => {
    if(isMouseDown){
        addTile(event);
    }
    drawPosition();
});
canvas.addEventListener("mouseenter", (event) => {
    tilemapPosition.style.backgroundColor = "#ffffff80";
});
canvas.addEventListener("mouseout", (event) => {
    tilemapPosition.style.backgroundColor = "#ffffff00";
});

colliderCanvas.addEventListener("mousedown", () => {
    isMouseDown = true;
});
colliderCanvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});
colliderCanvas.addEventListener("mouseleave", () => {
    isMouseDown = false;
});
colliderCanvas.addEventListener("mousedown", addCollisionTile);
colliderCanvas.addEventListener("mousemove", (event) => {
    if(isMouseDown){
        addCollisionTile(event);
    }
    drawPosition();
});
colliderCanvas.addEventListener("mouseenter", (event) => {
    tilemapPosition.style.backgroundColor = "#ffffff80";
});
colliderCanvas.addEventListener("mouseout", (event) => {
    tilemapPosition.style.backgroundColor = "#ffffff00";
});

//Utility for getting coordinates of mouse click
function getCoords(e, sizeX, sizeY){
    const {x, y} = e.target.getBoundingClientRect();
    const mouseX = e.clientX - x;
    const mouseY = e.clientY - y;
    return [Math.floor(mouseX / sizeX), Math.floor(mouseY / sizeY)];
}

//Converts data to image: data string and pipes into new browser tab
function exportImage(){
    var text = `int level[${canvas.height}][${canvas.width}] = {`;
    for(var y = 0; y < canvas.height / 32; y++){
        text += "\n\t{ ";
        for(var x = 0; x < canvas.width / 32; x++){
            text += collisionLayers[y][x] + ", ";
        }
        text += "},";
    }
    text += "\n};"

    var ctx = invisibleCanvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var topLayer = document.getElementById("topLayerCheckbox");
    var middleLayer = document.getElementById("middleLayerCheckbox");
    var bottomLayer = document.getElementById("bottomLayerCheckbox");

    layers.forEach((layer) => {
        //Check if it's not the top layer
        if((layer == layers[2] && topLayer.checked) || (layer == layers[1] && middleLayer.checked) || (layer == layers[0] && bottomLayer.checked)){
            Object.keys(layer).forEach((key) => {
                //Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
                var positionX = Number(key.split("-")[0]);
                var positionY = Number(key.split("-")[1]);
                var[tilesheetX, tilesheetY] = layer[key];

                var tilesetImg = tilesetImage;
                ctx.drawImage(
                    tilesetImg,
                    tilesheetX * 32,
                    tilesheetY * 32,
                    size_of_crop,
                    size_of_crop,
                    positionX * 32,
                    positionY * 32,
                    size_of_crop,
                    size_of_crop
                );
            });
        }
    });

    var data = invisibleCanvas.toDataURL();
    var image = new Image();
    image.src = data;

    var w = window.open("");
    w.document.write(image.outerHTML);
    w.document.writeln(`<pre>${text}</pre>`)
}

function setCookie(cname, cvalue, exdays){
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 100));
    var expires = "expires" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++){
        var c = ca[i];
        while(c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if(c.indexOf(name) == 0){
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

//Reset state to empty
function clearCanvas(){
    if(isCurrentlyOnTileCanvas){
        layers = [{}, {}, {}];
        draw();
    }else{
        collisionLayers = [];
        drawCollision();
    }
}

function setLayer(newLayer){
    //Update the layer
    currentLayer = newLayer;

    switch(currentLayer){
        case 0:
            document.getElementById("editing-layer").innerHTML = "Editing Layer: Bottom Layer";
            break;
        case 1:
            document.getElementById("editing-layer").innerHTML = "Editing Layer: Middle Layer";
            break;
        case 2:
            document.getElementById("editing-layer").innerHTML = "Editing Layer: Top Layer";
            break;
    }

    //Update the UI to show updated layer
    document.querySelector(`[tile-layer="${currentLayer}"]`).focus();
}

function draw(){
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var invCtx = invisibleCanvas.getContext("2d");
    invCtx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach((layer) => {
        Object.keys(layer).forEach((key) => {
            //Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
            var positionX = Number(key.split("-")[0]);
            var positionY = Number(key.split("-")[1]);
            var[tilesheetX, tilesheetY] = layer[key];

            var tilesetImg = tilesetImage;
            ctx.drawImage(
                tilesetImg,
                tilesheetX * 32,
                tilesheetY * 32,
                size_of_crop,
                size_of_crop,
                positionX * 32,
                positionY * 32,
                size_of_crop,
                size_of_crop
            );
            invCtx.drawImage(
                tilesetImg,
                tilesheetX * 32,
                tilesheetY * 32,
                size_of_crop,
                size_of_crop,
                positionX * 32,
                positionY * 32,
                size_of_crop,
                size_of_crop
            );
        });
    });
}
function drawCollision(){
    var ctx = colliderCanvas.getContext("2d");
    ctx.clearRect(0, 0, colliderCanvas.width, colliderCanvas.height);

    collisionDrawLayers.forEach((layer) => {
        Object.keys(layer).forEach((key) => {
            //Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
            var positionX = Number(key.split("-")[0]);
            var positionY = Number(key.split("-")[1]);
            var[tilesheetX, tilesheetY] = layer[key];

            var tilesetImg = colliderImage;
            ctx.drawImage(
                tilesetImg,
                tilesheetX * 64,
                tilesheetY * 64,
                size_of_crop,
                size_of_crop,
                positionX * 32,
                positionY * 32,
                size_of_crop,
                size_of_crop
            );
        });
    });
}

function countColors(){
    var ctx = canvas.getContext("2d");
    var w = canvas.width, h = canvas.height;

    //Get bitmap
    var idata = ctx.getImageData(0, 0, w, h), //area to analyze
        buffer32 = new Uint32Array(idata.data.buffer), //use 32-bit buffer (faster)
        i, len = buffer32.length,
        stats = {};

    for(i = 0; i < len; i++){
        var key = "" + (buffer32[i] & 0xffffff); //filter away alpha channel
        if(!stats[key]) stats[key] = 0; //init this color key
        stats[key]++; //count it...
    }

    var keys = Object.keys(stats),
        count = keys.length,
        key = keys[0]
        
    document.getElementById('color-count').innerHTML = `Color count: ${count}`
}

//Default image for booting up -> Just looks nicer than loading emtpy canvas
var defaultState = [{"0-4":[3,2],"1-4":[4,2],"2-4":[4,2],"3-4":[4,2],"4-4":[4,1],"5-5":[4,2],"6-5":[4,2],"7-5":[4,2],"8-5":[4,2],"9-5":[4,2],"10-5":[4,2],"11-6":[3,2],"12-6":[4,2],"13-6":[4,2],"14-6":[4,2],"12-5":[4,1],"5-4":[4,1],"3-3":[4,1],"0-3":[4,1],"1-3":[4,1],"4-3":[4,1],"5-3":[4,1],"7-3":[4,1],"8-3":[4,1],"9-3":[4,1],"10-3":[4,1],"10-4":[4,1],"11-4":[4,1],"11-5":[4,1],"4-5":[3,2],"2-3":[4,1],"6-3":[4,1],"11-3":[4,1],"12-3":[4,1],"13-3":[4,1],"14-3":[4,1],"6-4":[4,1],"7-4":[4,1],"8-4":[4,1],"9-4":[4,1],"12-4":[4,1],"13-4":[4,1],"14-4":[4,1],"13-5":[4,1],"14-5":[4,1],"14-2":[4,1],"13-2":[4,1],"12-2":[4,1],"11-2":[4,1],"10-2":[4,1],"9-2":[4,1],"8-2":[4,1],"7-2":[4,1],"6-2":[4,1],"5-2":[4,1],"4-2":[4,1],"3-2":[4,1],"2-2":[4,1],"1-2":[4,1],"0-2":[4,1],"0-1":[4,1],"1-1":[4,1],"2-1":[4,1],"3-1":[4,1],"4-1":[4,1],"6-1":[4,1],"8-1":[4,1],"9-1":[4,1],"10-1":[4,1],"11-1":[4,1],"12-1":[4,1],"13-1":[4,1],"14-1":[4,1],"7-1":[4,1],"5-1":[4,1],"0-0":[4,1],"1-0":[4,1],"2-0":[4,1],"3-0":[4,1],"4-0":[4,1],"5-0":[4,1],"6-0":[4,1],"7-0":[4,1],"8-0":[4,1],"9-0":[4,1],"10-0":[4,1],"11-0":[4,1],"12-0":[4,1],"13-0":[4,1],"14-0":[4,1],"14-14":[2,6],"7-14":[3,6],"6-14":[2,6],"5-14":[3,6],"4-13":[3,6],"3-13":[2,6],"1-11":[2,10],"1-10":[2,10],"0-8":[0,6],"0-10":[2,10],"3-10":[3,6],"4-10":[2,6],"0-5":[3,6],"0-6":[0,6],"0-7":[1,6],"0-9":[1,6],"0-11":[2,10],"0-12":[2,10],"0-13":[2,10],"0-14":[0,6],"1-14":[1,6],"1-13":[2,10],"1-12":[3,6],"1-9":[2,6],"1-8":[1,6],"1-7":[0,6],"1-6":[3,6],"1-5":[2,6],"2-5":[3,6],"2-6":[2,6],"2-7":[3,6],"2-8":[0,6],"2-9":[3,6],"2-13":[2,10],"2-14":[0,6],"3-14":[1,6],"3-12":[3,6],"3-11":[2,6],"3-9":[2,6],"3-8":[3,6],"3-7":[2,6],"3-6":[3,6],"3-5":[2,6],"4-6":[2,6],"4-7":[3,6],"4-8":[2,6],"4-9":[3,6],"4-11":[3,6],"4-12":[2,6],"4-14":[2,6],"5-13":[2,6],"5-12":[4,10],"5-11":[4,10],"5-10":[4,10],"5-9":[4,10],"5-8":[3,6],"5-7":[2,6],"5-6":[3,6],"6-6":[2,6],"6-7":[3,6],"6-8":[2,6],"6-9":[4,10],"6-10":[4,10],"6-11":[4,10],"6-12":[4,10],"6-13":[3,6],"7-13":[2,6],"7-12":[4,10],"7-10":[4,10],"7-9":[4,10],"7-8":[3,6],"7-7":[2,6],"7-6":[3,6],"8-6":[2,6],"8-7":[3,6],"8-10":[4,10],"8-11":[4,10],"8-12":[4,10],"8-14":[2,6],"8-13":[3,6],"9-14":[3,6],"9-13":[2,6],"9-12":[4,10],"9-11":[4,10],"9-10":[4,10],"9-7":[2,6],"9-6":[3,6],"10-7":[3,6],"10-8":[2,6],"10-9":[3,6],"10-10":[2,6],"10-11":[3,6],"10-12":[2,6],"10-13":[3,6],"10-14":[2,6],"10-6":[2,6],"11-7":[2,6],"12-7":[3,6],"13-7":[2,6],"14-7":[2,6],"14-8":[2,6],"14-9":[3,6],"14-10":[4,3],"14-11":[4,4],"14-12":[2,6],"14-13":[3,6],"13-14":[3,6],"12-14":[2,6],"11-14":[3,6],"11-13":[2,6],"12-13":[3,6],"13-13":[2,6],"13-12":[3,6],"12-12":[2,6],"11-12":[3,6],"11-11":[2,6],"12-11":[3,6],"13-11":[4,4],"13-10":[2,6],"12-10":[2,6],"11-10":[3,6],"12-9":[3,6],"13-9":[2,6],"13-8":[3,6],"12-8":[2,6],"11-9":[2,6],"11-8":[3,6],"2-10":[2,10],"2-11":[2,10],"2-12":[2,10],"8-9":[4,10],"8-8":[4,10],"9-9":[4,10],"9-8":[4,10],"7-11":[4,10]},{"5-9":[2,7],"6-9":[2,7],"7-9":[2,7],"3-9":[0,6],"3-11":[0,6],"3-13":[0,6],"1-9":[0,6],"2-9":[1,6],"1-10":[1,7],"3-10":[1,6],"3-12":[1,6],"2-10":[1,7],"1-12":[2,10],"0-8":[1,2],"1-8":[1,2],"2-8":[1,2],"2-7":[2,1],"2-6":[2,0],"1-6":[1,0],"0-6":[1,0],"1-7":[1,1],"0-7":[1,1],"11-11":[3,3],"12-11":[4,3],"13-11":[4,4],"14-11":[4,4],"11-12":[3,4],"11-13":[3,5],"12-13":[4,5],"13-13":[4,5],"14-13":[4,5],"12-12":[4,4],"13-12":[4,4],"14-12":[4,4],"0-10":[0,7],"13-10":[3,3],"11-5":[3,1],"4-4":[3,1],"8-8":[2,7],"9-8":[2,7]},{"0-5":[4,12],"1-5":[4,12],"2-5":[4,12],"3-5":[4,12],"4-6":[4,12],"5-6":[4,12],"6-6":[4,12],"7-6":[4,12],"8-6":[4,12],"9-6":[4,12],"10-6":[4,12],"11-7":[4,12],"12-7":[4,12],"13-7":[4,12],"14-7":[4,12],"0-9":[4,12],"1-9":[4,12],"2-9":[4,12],"11-14":[4,12],"12-14":[4,12],"13-14":[4,12],"14-14":[4,12],"6-2":[2,15],"6-3":[0,13],"7-3":[3,12],"8-3":[0,14],"9-3":[1,16],"10-3":[1,15],"11-3":[4,15],"4-2":[4,14],"5-2":[0,12],"4-1":[0,13],"3-1":[3,14],"1-1":[1,16],"2-1":[0,14],"11-1":[4,2],"12-1":[4,2],"13-1":[5,2],"11-0":[4,0],"12-0":[4,0],"13-0":[5,0],"10-1":[4,2],"9-1":[3,2],"10-0":[4,0],"9-0":[3,0],"9-2":[4,12],"10-2":[4,12],"11-2":[4,12],"12-2":[4,12],"13-2":[4,12],"5-13":[4,13],"9-13":[5,13],"6-13":[4,11],"7-13":[4,11],"8-13":[4,11],"0-14":[4,11],"1-14":[4,11],"2-14":[5,13]}];

function updateCheckbox(cname){
    setCookie(cname, document.getElementById(cname).checked, 100);
}

//Initialize app when tileset source is done loading
tilesetImage.onload = function(){
    if(getCookie("topLayerCheckbox") != null){
        document.getElementById("topLayerCheckbox").checked = getCookie("topLayerCheckbox") == 'true';
    }else{
        setCookie("topLayerCheckbox", true, 100);
    }
    if(getCookie("middleLayerCheckbox") != null){
        document.getElementById("middleLayerCheckbox").checked = getCookie("middleLayerCheckbox") == 'true';
    }else{
        setCookie("middleLayerCheckbox", true, 100);
    }
    if(getCookie("bottomLayerCheckbox") != null){
        document.getElementById("bottomLayerCheckbox").checked = getCookie("bottomLayerCheckbox") == 'true';
    }else{
        setCookie("bottomLayerCheckbox", true, 100);
    }

    layers = defaultState;
    draw();
    setLayer(0);
    countColors();
}
tilesetImage.src = "https://assets.codepen.io/21542/TileEditorSpritesheet.2x_2.png";