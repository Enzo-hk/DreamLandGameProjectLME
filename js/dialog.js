export function createDialogBox(text) {
    let box = createBox();

    if (!text || text === "") {  // boîte de dialogue sans texte
        return {box: box, textBlock: null};
    }

    let textBlock = createText(text, box);
    return {box: box, textBlock: textBlock};
}

function createBox() {
    let rectangle = new BABYLON.GUI.Rectangle("rect");
    rectangle.background = "black";
    rectangle.color = "yellow";
    rectangle.width = "600px";
    rectangle.height = "150px";
    rectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rectangle.top = "2.5%";

    return rectangle;
}

function createText(text, box) {
    let textBlock = new BABYLON.GUI.TextBlock("textBox");
    
    textBlock.fontFamily = "Helvetica";
    textBlock.textWrapping = true;
    
    textBlock.text = text;
    textBlock.color = "white";
    textBlock.fontSize = "14px";
    box.addControl(textBlock);

    return textBlock;
}

export function updateText(dialogBox, newText) {
    let textBlock = createText(newText, dialogBox.box);
    dialogBox.textBlock = textBlock;
}

export function disableDialogBox(advancedTexture, dialogBox) {
    advancedTexture.removeControl(dialogBox.box);
}

export function enableDialogBox(advancedTexture, dialogBox) {
    advancedTexture.addControl(dialogBox.box);
}