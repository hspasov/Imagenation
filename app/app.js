const Caman = require("caman").Caman;
const fs = require("fs");
const url = require("url");
const Canvas = require("canvas");
const path = require("path");
window.$ = require("jquery");


let canv;
let texture;
let base64Url;
window.onload = function () {
    try {
        canv = fx.canvas();
    } catch (e) {
        alert(e);
        return;
    }
}

$("#imageUpload").change((event) => {
    const imgPath = event.target.files[0].path;
    $("#brighten").click(() => {
        canv.draw(texture).curves([[0, 0.5], [1, 0]]).update();
        base64Url = canv.toDataURL();
    });
    $("#darken").click(() => {
        canv.draw(texture).brightnessContrast(-0.25, 0).update();
        base64Url = canv.toDataURL();
    });
    $("#download").click(() => {
        const link = document.getElementById("downloadLink");
        link.href = base64Url;
        link.download = "happy.png";
        link.innerHTML = "Download";
    });
    loadImage(imgPath);
});

function loadImage(path) {
    console.log("here in displayImage with path", path);
    fs.readFile(path, (err, data) => {
        if (err) throw err;
        let img = new Canvas.Image;
        img.onload = () => {
            let canvas_ = new Canvas(500, 500);
            let ctx = canvas_.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 500, 500);
            let image = document.createElement("img");
            image.onload = () => {
                texture = canv.texture(image);
                canv.draw(texture).update();
                $("#imageHolder").append(canv);
                base64Url = canv.toDataURL();
            }
            image.src = canvas_.toDataURL();
        };
        img.src = data;
    });
}

function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}