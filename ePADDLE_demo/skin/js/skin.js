var tds=scPaLib.findNodes("des:.choiceList_in");
for (i=0; i<tds.length; i++)
{
    var label = document.createElement("label");
    label.className="newBlock";
    tds[i].appendChild(label); 
}

var tds=scPaLib.findNodes("des:.choiceList_sol");
for (i=0; i<tds.length; i++)
{
    var label = document.createElement("label");
    label.className="newBlock";
    tds[i].appendChild(label); 
}
scOnLoads.push({
    onLoad: function () {
        var j;
        var span = document.getElementsByTagName('span');
        for(j=0 ; j < span.length; j++){ 
            if(span[j].title){
                var title = span[j].title;
                title = title.substring(0 , title.indexOf(' '));
                if(title ==="Desc"){    
                    var txtA = document.createElement('textarea');
                    txtA.className = "desc";
                    txtA.onkeyup = span[j].getElementsByTagName('span')[0].getElementsByTagName('input')[0].onkeyup;
                    span[j].getElementsByTagName('span')[0].getElementsByTagName('input')[0].style.display = 'none';
                    span[j].firstElementChild.appendChild(txtA);
                }
            }
        }

    },
    loadSortKey: "ZZZZ"
});