document.addEventListener('DOMContentLoaded', function() {
    function GrabGligli(cb) {
       chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "report_back"}, function(response) {
                
                const blob = new Blob([response.map((d) => d.ret.join(',')).join("\n")], {type: "text/csv; charset=utf-8"});
                chrome.downloads.download({
                    url: URL.createObjectURL(blob),
                    filename: "stat.csv",
                    headers:[
                        {
                            name: 'Content-Type',
                            value: 'text/csv; charset=utf-8',
                        }
                    ]
                }, cb);
            });  
        });

        /*chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "get_stat"}, function(response) {
                console.log('response', response);
                response.forEach(function(elt) {
                    const a = chrome.tabs.create({
                        url: elt.link,
                    });
                    console.log(a);
                });
            });
            console.log(tabs[0].id);
        });*/

    }
    
    GrabGligli(() => window.close());

    console.log('script loaded');
});