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
                '"' + $(this).find('td.qcm_examen_question').text().replaceAll('<br>', "\r").replaceAll('"', '""') + '"',
            ]};
        })
        .get();
}

function listStat() {
    return $('form table tbody tr td table')
    .map(function() {
        const samples = $(this).find('tbody tr td table tbody tr').map(function(){
            return $(this).find('td.qcm_examen_reponses').map(function() {
                return $(this).text();
            }).get();
        }).get();

        const links = $(this).find('tbody tr td table tbody tr a').map(function(){
            return window.location.origin + '/' + $(this).attr('href');
        }).get();

        var s = [];
        for (var i=0; i<samples.length/4; i++) {
            s = s.concat({
                date: samples[i*4],
                score: samples[i*4+2],
                time: samples[i*4+3],
                link: links[i],
            });
        }
        
        return {
            title: $(this).find('h3').text(),
            samples: s,
        };
    }).get().filter(function(elt) {return elt.title});
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    switch (msg.action) {
        case 'report_back':
            const resp = extractResponses();
            resp.unshift({ret:['#;Succès;Question']})
            console.log(resp);
            sendResponse(resp);
        case 'get_stat':
            const stats = listStat();
            console.log(stats);
            sendResponse(stats);
        default:
            sendResponse('empty');
    }
});




console.log("Extractor is ready")