function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

var extractResponses = function() {
    return $('table.texte.cadre')
        .map(function() {
            return {ret: [
                $(this).find('td.qcm_examen_no').text().replace(/[^\d].*/, ''),
                $(this).find('img[alt=\'Gagné !\']').length,
                $(this).find('td.qcm_examen_question').text().replace('<br>', "\n"),
            ]};
        })
        .get();
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    const ret = extractResponses();
    ret.unshift({ret:['#;Succès;Question']})
    console.log(ret);
    if (msg.action === 'report_back') {
        sendResponse(ret);
    }
});


console.log("Extractor is ready")