const electron = require("electron");
const fs = require("fs");
const Canvas = require("canvas");
const canv = fx.canvas();
const { Menu, MenuItem, dialog } = electron.remote;
window.$ = window.jQuery = require("jquery");

let texture;
let imageDownloadLink;

const menu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {
                label: "Open image",
                click: selectImage
            },
            {
                type: "separator"
            },
            {
                label: "Save image",
                click: onDownload
            },
            {
                type: "separator"
            },
            {
                label: "Exit",
                role: "quit"
            }
        ]
    },
    {
        label: "Help",
        submenu: [
            {
                label: "Github repository",
                click: () => electron.shell.openExternal("https://github.com/hspasov/Imagenation")
            },
            {
                type: "separator"
            },
            {
                label: "About",
                click: () =>
                    dialog.showMessageBox({
                        type: "none",
                        title: "Imagenation",
                        message: "Computer graphics project",
                        detail: "Created by\nBoyan Dimitrov, Lachezar Zahariev and Hristo Spasov\nELSYS 2017"
                    })
            }
        ]
    }
]);
Menu.setApplicationMenu(menu);

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

Array.from(document.querySelectorAll("[type='range']"))
    .forEach(element => element.addEventListener("change", sliderChange));

document.getElementById("openImage").addEventListener("click", selectImage);

document.getElementById("downloadButton").addEventListener("click", onDownload);

document.getElementById("reset").addEventListener("click", setDefault);

Array.from(document.getElementsByClassName("addPoint"))
    .forEach(element => element.addEventListener("click", onAddPoint));

function selectImage() {
    dialog.showOpenDialog({ properties: ["openFile"] }, imgPath => {
        imgPath && loadImage(imgPath[0]);
    });
}

function onDownload() {
    const link = document.getElementById("imageDownloadLink");
    link.href = imageDownloadLink;
    link.download = "Untitled.png";
    link.click();
}

function onAddPoint(event) {
    const setting = event.target.parentElement.parentElement.parentElement.id;
    const newDefaultValue = event.target.previousElementSibling.value;

    if (curvesValues[setting][newDefaultValue]) return;

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

    const point = document.createElement("div");
    point.setAttribute("class", "item");
    point.appendChild(label);
    point.appendChild(slider);

    const settingSection = document.getElementById(setting);
    settingSection.appendChild(point);
}

function sliderChange(event) {
    const setting = event.target.parentElement.parentElement.id;
    const defaultValue = event.target.defaultValue;
    const newValue = event.target.value;
    curvesValues[setting][defaultValue] = [defaultValue, newValue];
    render();
}

function setDefault() {
    Array.from(document.querySelectorAll("[type='range']")).forEach(element => {
        const setting = element.parentElement.parentElement.id;
        const defaultValue = element.defaultValue;
        if (element.defaultValue != 1 && element.defaultValue != 0) {
            element.parentElement.remove();
        }
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
            const imageHolder = document.getElementById("imageHolder");
            const width = imageHolder.clientWidth;
            const height = imageHolder.clientHeight;
            const canvas_ = new Canvas(width, height);
            const ctx = canvas_.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
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