const fs = require("fs");
const Canvas = require("canvas");

const canv = fx.canvas();
let texture;
let imageDownloadLink;

// Set default values
const curvesValues = {
    red: {
        0: [0, 0],
        1: [1, 1]
    }, green: {
        0: [0, 0],
        1: [1, 1]
    }, blue: {
        0: [0, 0],
        1: [1, 1]
    }, luminance: {
        0: [0, 0],
        1: [1, 1]
    }
};

document.getElementById("imageUpload").addEventListener("change", onImageUpload);

Array.from(document.querySelectorAll("[type='range']"))
    .forEach(element => element.addEventListener("change", sliderChange));

document.getElementById("downloadButton").addEventListener("click", onDownload);

document.getElementById("reset").addEventListener("click", setDefault);

Array.from(document.getElementsByClassName("addPoint"))
    .forEach(element => element.addEventListener("click", onAddPoint));

function onImageUpload(event) {
    const imgPath = event.target.files[0].path;
    loadImage(imgPath);
}

function onDownload() {
    const link = document.getElementById("imageDownloadLink");
    link.href = imageDownloadLink;
    link.download = "Untitled.png";
    link.click();
}

function onAddPoint(event) {
    const setting = event.target.parentElement.id;
    const newDefaultValue = event.target.previousElementSibling.value;
    curvesValues[setting][newDefaultValue] = [newDefaultValue, newDefaultValue];

    const label = document.createElement("label");
    label.innerHTML = newDefaultValue;

    const slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", 0);
    slider.setAttribute("max", 1);
    slider.setAttribute("value", newDefaultValue);
    slider.setAttribute("step", 0.1);
    slider.addEventListener("change", sliderChange);

    const settingSection = document.getElementById(setting);
    settingSection.appendChild(label);
    settingSection.appendChild(slider);
}

function sliderChange(event) {
    const setting = event.target.parentElement.id;
    const defaultValue = event.target.defaultValue;
    const newValue = event.target.value;
    curvesValues[setting][defaultValue] = [defaultValue, newValue];
    render();
}

function setDefault() {
    Array.from(document.querySelectorAll("[type='range']")).forEach(element => {
        const setting = element.parentElement.id;
        const defaultValue = element.defaultValue;
        element.value = defaultValue;
        curvesValues[setting][defaultValue] = [defaultValue, defaultValue];
    });
    render();
}

function render() {
    canv.draw(texture).curves(
        Object.values(curvesValues.red),
        Object.values(curvesValues.green),
        Object.values(curvesValues.blue)
    ).curves(Object.values(curvesValues.luminance)).update();
    imageDownloadLink = canv.toDataURL();
}

function loadImage(path) {
    fs.readFile(path, (err, data) => {
        if (err) throw err;
        const img = new Canvas.Image;
        img.onload = () => {
            const canvas_ = new Canvas(500, 500);
            const ctx = canvas_.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 500, 500);
            const image = document.createElement("img");
            image.onload = () => {
                texture = canv.texture(image);
                canv.draw(texture).update();
                document.getElementById("imageHolder").appendChild(canv);
                imageDownloadLink = canv.toDataURL();
            }
            image.src = canvas_.toDataURL();
        };
        img.src = data;
    });
}