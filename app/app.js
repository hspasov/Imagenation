const Caman = require("caman").Caman;
const fs = require("fs");
const url = require("url");
const Canvas = require("canvas");
const path = require("path");
window.$ = require("jquery");


let canvas;
let texture;
window.onload = function () {
    try {
        canvas = fx.canvas();
    } catch (e) {
        alert(e);
        return;
    }
}

$("#imageUpload").change((event) => {
    const imgPath = event.target.files[0].path;
    $("#brighten").click(() => {
        canvas.draw(texture).curves([[0, 0.5], [1, 0]]).update();
    });
    $("#darken").click(() => {
        canvas.draw(texture).brightnessContrast(-0.25, 0).update();
    });
    $("#download").click(() => {
        const link = document.createElement("a");
        link.href = document.getElementsByTagName("canvas")[0].toDataURL();
        link.download = "happy.png";
        link.innerHTML = "Download";
        document.getElementById("downloadLinkHolder").appendChild(link);
    });
    loadImage(imgPath);
});

function loadImage(path) {
    console.log("here in displayImage with path", path);
    fs.readFile(path, (err, data) => {
        if (err) throw err;
        let img = new Canvas.Image;
        img.onload = () => {
            let canvas_ = new Canvas(img.width, img.height);
            let ctx = canvas_.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            let image = document.createElement("img");
            image.onload = () => {
                texture = canvas.texture(image);
                canvas.draw(texture).update();
                image.parentNode.insertBefore(canvas, image);
                image.parentNode.removeChild(image);
            }
            image.src = canvas_.toDataURL();
            $("#imageHolder").append(image);
        };
        img.src = data;
    });
}