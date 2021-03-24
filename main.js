document.addEventListener('DOMContentLoaded', function() {
    function GrabGligli(cb) {
       chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "report_back"}, function(response) {
                
                const blob = new Blob([response.map((d) => d.ret.join(';')).join("\n")], {type: "text/csv"});
                chrome.downloads.download({
                    url: URL.createObjectURL(blob),
                    filename: "stat.csv",
                }, cb);
            });  
        });
    }
    
    GrabGligli(() => window.close());
});