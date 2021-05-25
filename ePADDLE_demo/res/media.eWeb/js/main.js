"use strict";
//var tabVisu = ["visu1", "visu2", "visu3", "visu4", "visu5", "visu6", "visu7", "visu8", "visu9", "visu10"];
//var tabDatas = ['alpha', 'omega','beta','gamma','delta'];
//localStorage.setItem('visus', JSON.stringify(tabVisu));
//localStorage.setItem('datas', JSON.stringify(tabDatas));


function hide(id,e){
    if(document.getElementById(id).style.display === "block"){
        document.getElementById(id).style.display = "none";
        e.src = "img/practOpen.png";
    }else{
        document.getElementById(id).style.display = "block";
        e.src = "img/practClose.png";
    }
    
}

/*** SlideShow **/

var diapIdx = 1;

function nextDiap(n) {
    if(diapIdx > 1){
        document.getElementById('prev').style.display="block";
        document.getElementById('next').style.display="block";
    }
    diapo(diapIdx += n);
}

function diapo(n) {
    var i;
    var diapos = document.querySelectorAll(".slide");
    if(n > diapos.length){
        diapIdx = n-1;

    }
    if(n > diapos.length -1){
        document.getElementById('next').style.display="none";
    }
    if( n <3 ){
        document.getElementById('prev').style.display="none";

    }
    if (n < 2) {
        diapIdx = 2;
    }
    for (i = 0; i < diapos.length; i++) {
        diapos[i].style.display = "none";  
    }

    diapos[diapIdx-1].style.display = "flex"; 
    diapos[diapIdx-2].style.display = "flex"; 

}
/*** Drag and drop **/
// Source : www.monwebfacile.free.fr


var curseurX, curseurY;  
var idrag = 0;  
var flagOverDropZone = false;  
var idnewId = 0;  

//fonction modifiée par N. Grimbert
function initEvents(){  

    if (localStorage.getItem('visus')) {
        let parseVisu = JSON.parse(localStorage.getItem('visus'));
        for (var j = 0; j < parseVisu.length; j++) {
            if (document.getElementById(parseVisu[j])){
                setDragEvents(document.getElementById(parseVisu[j])); 
                document.getElementById(parseVisu[j]).style.display = 'block';
            }
        }
    }


    if (localStorage.getItem('datas')) {
        var datas_in;
        var datas = JSON.parse(localStorage.getItem('datas'));
        var list = document.createElement('ul');
        list.id = "list";
        document.getElementById('slides').appendChild(list);
        datas.forEach(function(key, index){
            var li = document.createElement('li');
            if(index < 2){
                document.getElementById('list').innerHTML += '<li class="slide showing" style="display: flex;"><h4>' + key + '</h4><div id="' + key + '" class="Panier" ></div></li>'; 
            }else{
                document.getElementById('list').innerHTML += '<li class="slide" style="display: none;"><h4>' + key + '</h4><div id="' + key + '" class="Panier" ></div></li>'; 
            }
        });

        for (var i = 0; i < datas.length; i++) {   
            setZoneEvents(document.getElementById(datas[i]));

        }
        if(document.getElementsByClassName('Panier').length > 2 ){
            document.getElementById('next').style.display = "block";
            document.getElementById('prev').style.display = "none";
        }
    }
} 




function setDragEvents(_obj){  
    _obj.addEventListener("dragstart",dragStartEvent,false );  
    _obj.addEventListener("dragend",dragEndEvent,false );  
    _obj.addEventListener("drag",dragEvent,false );  
}  

function setZoneEvents(_obj){  
    _obj.addEventListener("dragenter",ZoneDragenterEvent,false );  
    _obj.addEventListener("dragover",ZoneDragoverEvent,false );  
    _obj.addEventListener("dragleave",ZoneDragleaveEvent,false );  
    _obj.addEventListener("drop",ZoneDropEvent,false );  
}  
// Evenements de l'objet qui commence à se déplacer ---------------------------------------------  
function dragStartEvent(event){  
    // ----- Variables générales  
    var initElem = event.target;  

    var x = document.getElementById(initElem.id);  
    // ----- Init flag  
    flagOverDropZone = false;  
    idrag = 0;  
    // ----- Action à initialiser  
    event.dataTransfer.effectAllowed = "copy";  
    // ----- Initialisation des données de l'objet dataTransfer  
    event.dataTransfer.setData("id", initElem.id);  
    event.dataTransfer.setData("src", initElem.src);  
    event.dataTransfer.setData("titre", initElem.title);  
    event.dataTransfer.setData("origine",x.dataset.origine);  

    return false;  
}  

// Evenements de l'objet qui se déplace -----------------------------------------------  
function dragEvent(event){  
    idrag ++;  
}  

// Evenements de l'objet qui ne se déplace plus. Relachement du click  
function dragEndEvent(event){  

    // ----- Init flag  
    idrag = 0;  
    flagOverDropZone = false;  
}  

// Evenement entrée dans la drop zone -------------------------------------------------  
function ZoneDragenterEvent(event){  
    // ----- Autorisation             
    event.dataTransfer.dropEffect = "copyMove";  
    event.dataTransfer.effectAllowed = "copy";  

}  

// Evenement survol de la drop zone ---------------------------------------------------  
function ZoneDragoverEvent(event){  
    // ----- Blocage de la progression de l'évènement  
    event.preventDefault();  
    // Autorisation  
    event.dataTransfer.dropEffect = "copy";  
    event.dataTransfer.effectAllowed = "copyMove";  

    if(!flagOverDropZone) {  
        flagOverDropZone = true;  
    }  
    return false;  
}  

// Evenement quitte la drop zone ------------------------------------------------------  
function ZoneDragleaveEvent(event){  
    // ----- Init variable  
    flagOverDropZone = false;  
}  

// Evenement laché sur la drop zone ---------------------------------------------------- 
//fonction modifiée par N.Grimbert
function ZoneDropEvent(event){  

    // ----- re-initialisation du style  
    event.target.style.transform = "scale(1)";  
    // ----- Initialisation des variables locales des actions  
    var connection = AutorisationInterdiction(event);  

    // ----- Définition des actions en fonction de l'origine et de la destination  
    if(  
        connection.flgPanierPanier ||  
        connection.flgbinbin ||  
        connection.flgbinPanier ||  
        connection.flgCataloguebin ||  
        connection.flgHorsCataloguePanier ||  
        connection.flgHorsCataloguebin  
    ){  
        event.preventDefault();    
        return false;  
    }  
    // ----- Gestion des évènements clavier  
    var keyEventCtrlKey = (event.ctrlKey) ? true : false;  
    var keyEventShift = (event.shiftKey) ? true : false;  
    var keyEventAlt = (event.altKey) ? true : false;  
    // Blocage ou déblocage de la remontée de l'évènement  
    if(!keyEventShift) event.preventDefault();  
    // ----- Copie avec conservation de l'original  
    var workingNode = document.getElementById(event.dataTransfer.getData('id')); 
    var workingId = event.dataTransfer.getData('id');
    //
    if(localStorage.getItem(event.target.id)){
        let parseLS = JSON.parse(localStorage.getItem(event.target.id));
        let foundp = false;
        for (var p =0 ; p < parseLS.length ; p++){
            if(parseLS[p] === workingId){
                foundp = true;
            }
        }
        if(foundp){
            alert('vous avez déjà posé ce visuel');
        }else{

            if(!keyEventCtrlKey && !connection.flgPanierbin){  
                // ----- Copie réelle de l'élément glissé

                var nodeCopy = workingNode.cloneNode(true);  
                idnewId++;  
                nodeCopy.id = workingId+ "_" + idnewId ;  

            }

            var bsuppr = document.createElement('a');
            bsuppr.id = "bin"; 
            bsuppr.addEventListener("click",clickMiniature,false ); 
            bsuppr.appendChild(nodeCopy);  
            if(event.target.tagName === 'IMG'){
                event.target.offsetParent.appendChild(bsuppr); 
                saveInLS(event.target.offsetParent.id,nodeCopy.id);
            }else{
                event.target.appendChild(bsuppr);
                saveInLS(event.target.id,nodeCopy.id);
            }


            var x = document.getElementById(nodeCopy.id);  

            // ----- Style de l'élèment copié  
            x.style.position = "relative";  
            x.style.cursor = "move";  
            if(connection.flgPanierbin) {  
                x.style.cursor = "pointer";  
                x.style.top = "70px";  
                //        x.dataset.origine = "bin";  
            }  
        }

    }else{
        if(!keyEventCtrlKey && !connection.flgPanierbin){  
            // ----- Copie réelle de l'élément glissé
            var nodeCopy = workingNode.cloneNode(true);  
            idnewId++;  
            nodeCopy.id = workingId+ "_" + idnewId ;  

        }

        var bsuppr = document.createElement('a');
        bsuppr.id = "bin"; 
        bsuppr.addEventListener("click",clickMiniature,false ); 
        bsuppr.appendChild(nodeCopy);  
        if(event.target.tagName === 'IMG'){
            event.target.offsetParent.appendChild(bsuppr); 
            saveInLS(event.target.offsetParent.id,nodeCopy.id);
        }else{
            event.target.appendChild(bsuppr);
            saveInLS(event.target.id,nodeCopy.id);
        }


        var x = document.getElementById(nodeCopy.id);  

        // ----- Style de l'élèment copié  
        x.style.position = "relative";  
        x.style.cursor = "move";  
        if(connection.flgPanierbin) {  
            x.style.cursor = "pointer";  
            x.style.top = "70px";  
        }  

    }

    // ----- Ecoute pour click sur miniatures  

    flagOverDropZone = false;  
}  

function AutorisationInterdiction(event){  
    var datas = JSON.parse(localStorage.getItem('datas'));
    for (var i = 0; i < datas.length; i++) {
        var flgPanierPanier = (event.dataTransfer.getData('origine') == "Panier" && event.target.id == datas[i]) ? true : false;  
        var flgCataloguePanier = (event.dataTransfer.getData('origine') == "Catalogue" && event.target.id == datas[i]) ? true : false;  
        var flgHorsCataloguePanier = (event.dataTransfer.getData('origine') == "" && event.target.id == datas[i]) ? true : false;  
    }

    var flgCataloguebin = (event.dataTransfer.getData('origine') == "Catalogue" && event.target.id == "bin") ? true : false;  

    return {  
        "flgPanierPanier" : flgPanierPanier,  

        "flgCataloguePanier" :flgCataloguePanier,  
        "flgCataloguebin" : flgCataloguebin,  
        "flgHorsCataloguePanier" : flgHorsCataloguePanier  
    }  
}     

// Gestion du click sur miniatures du panier ou de la bin -------------------------  
function clickMiniature(event){  

    var x = document.getElementById(event.target.id);  
    var textParDefaut = "Voulez-vous supprimer ce visuel ?";  
    var reponse = confirm(textParDefaut);      
    if(reponse)   { // Suppression de la miniature

        removeFromLS(x.offsetParent.id,x.id);
        document.getElementById(x.offsetParent.id).removeChild(x.parentElement);  
    }  
}  

function is_tactileScreen(){    
    try{  
        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)   
        {return true;}  
        else {return false;}  
    }  
    catch(e){return false;}  
}             
function bodyLoadEnd(){  
    if(!is_tactileScreen()) initEvents();   
    else alert('Fonction réservée aux écrans non tactiles');  


}  

//Fonctions ajoutées par N. Grimbert

function saveInLS(key , value){
    let idx = value.indexOf('_');
    value = value.substring(0,idx);

    if(localStorage.getItem(key)){
        let keyParse = JSON.parse(localStorage.getItem(key));
        let found = false;
        for(var l =0 ; l < keyParse.length;l++){
            console.log(keyParse[l]);
            if(keyParse[l] === value){
                found = true;
            }
        }  
        if(!found) {
            keyParse.push(value);
        }
        localStorage.setItem(key, JSON.stringify(keyParse));
    }
    else{
        localStorage.setItem(key, JSON.stringify([value]));
    }
}

function removeFromLS(key,value){
    let idx = value.indexOf('_');
    value = value.substring(0,idx);
    let KeyParse = JSON.parse(localStorage.getItem(key));
    for (var i =0 ; i < KeyParse.length; i++){
        if (KeyParse[i] === value){   
            KeyParse.splice(i , 1);
        }
    }
    if(KeyParse.length >= 1){
        localStorage.setItem(key, JSON.stringify(KeyParse));}
    else{
        localStorage.removeItem(key);
    }
}
/*** END Drag and drop **/




/*** END SlideShow **/

///*** Chronomètre ***/
////Source : www.exelib.net
//
//var sp = document.getElementsByTagName("span");
//var btn_start=document.getElementById("start");
//var t;
//var ms=0,s=0,mn=0,h=0;
//
//function start(){
//    t =setInterval(update_chrono,100);
//    btn_start.disabled=true;
//
//}
//start();
///*La fonction update_chrono incrémente le nombre de millisecondes par 1 <==> 1*cadence = 100 */
//function update_chrono(){
//    ms+=1;
//    /*si ms=10 <==> ms*cadence = 1000ms <==> 1s alors on incrémente le nombre de secondes*/
//    if(ms==10){
//        ms=1;
//        s+=1;
//    }
//    /*on teste si s=60 pour incrémenter le nombre de minute*/
//    if(s==60){
//        s=0;
//        mn+=1;
//    }
//    if(mn==60){
//        mn=0;
//        h+=1;
//    }
//    /*afficher les nouvelle valeurs*/
//    sp[0].innerHTML=h+" h";
//    sp[1].innerHTML=mn+" min";
//    sp[2].innerHTML=s+" s";
//    sp[3].innerHTML=ms+" ms";
//
//}
///*** Fin chronomètre ***/
