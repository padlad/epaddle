/* ========== Search manager ================================================ */
var searchMgr = {
	fPathRoot : "des:.root",
	fPathSchBox : "ide:schBox",
	fPathContent : "ide:content",
	fPathContentScroller : "ide:content/des:div.scroller",
	fPathHighLightBox : "ide:schResultBox",
	fStrings : ["Annuler","Annuler la recherche",                                                    //0
	            "Rechercher un mot","Aucun résultat.",                                               //2
	            "1 page trouvée.","%s pages trouvées.",                                              //4
	            "Précisez votre recherche...","Termes recherchés : <span class=\'schTerm\'>%s</span>", //6
	            "Précédent","Occurrence précédente",                                                 //8
	            "Suivant","Occurrence Suivante",                                                     //10
	            "Liste","Afficher/cacher la liste des pages trouvées"],                              //12

	/* ========== Public functions ============================================ */

	declareIndex: function(pIdx){
		scCoLib.log("searchMgr.declareIndex : "+pIdx);
		this.fIdxUrl = scCoLib.hrefBase().substring(0,scCoLib.hrefBase().lastIndexOf("/")) + "/" + pIdx;
	},

	declarePageList: function(pPgeList){
		scCoLib.log("searchMgr.declarePageList : "+pPgeList);
		this.fPgeList = pPgeList;
	},

	init: function(){
		scCoLib.log("searchMgr.init");
		this.fRoot = scPaLib.findNode(this.fPathRoot);
		this.fContent = scPaLib.findNode(this.fPathContent);
		var vSchBox = scPaLib.findNode(this.fPathSchBox);
		if (!vSchBox) return;
		this.fSearchFrame = this.xAddElt("div",vSchBox,"schFrame");
		this.fSearchCmds = this.xAddElt("div",this.fSearchFrame,"schCmds");
		scOnLoads[scOnLoads.length] = this;
	},

	onLoad: function(){
		scCoLib.log("searchMgr.onLoad");
		this.fSearchInput = this.xAddElt("input",this.fSearchCmds,"schInput");
		this.fSearchInput.title=this.fStrings[2];
		this.fSearchInput.onkeyup = this.sKeyUp;
		this.fSearchLaunch = this.xAddBtn(this.fSearchCmds,"schBtnLaunch",this.fStrings[2],this.fStrings[2]);
		this.fSearchLaunch.onclick = this.sFind;
		this.fSearchPropose = this.xAddElt("div",this.fSearchCmds,"schPropose",true);

		this.fResultFrame = this.xAddElt("div",this.fRoot,"schResFrame");
		this.fResultList = this.xAddElt("div",this.fResultFrame,"schResList");
		this.fSearchLbl = this.xAddElt("div",this.fResultList,"schLbl");
		this.fResultScroll = this.xAddElt("div",this.fResultList,"schResListSrl");
		this.fResultTgle = this.xAddBtn(this.fResultFrame,"schBtnTgle schBtnTgle_cls",this.fStrings[12],this.fStrings[13]);
		this.fResultTgle.onclick = this.sListTgle;
		var vHighLightBox = this.xAddElt("div",this.fResultFrame,"schHitFrame");
		this.fHitLbl = this.xAddElt("span",vHighLightBox,"schHitLbl");
		this.fBtnPrvHit = this.xAddBtn(vHighLightBox,"schBtnPrvHit",this.fStrings[8],this.fStrings[9]);
		this.fBtnPrvHit.onclick = this.sPrvHit;
		this.fBtnNxtHit = this.xAddBtn(vHighLightBox,"schBtnNxtHit",this.fStrings[10],this.fStrings[11]);
		this.fBtnNxtHit.onclick = this.sNxtHit;

		this.fSearchReset = this.xAddBtn(this.fResultFrame,"schBtnReset",this.fStrings[0],this.fStrings[1]);
		this.fSearchReset.onclick = this.sReset;
		
		this.fContentScroller = scPaLib.findNode(this.fPathContentScroller);
		if(this.fContentScroller) this.fContentScroller.fKeepVis = new scSiRuleEnsureVisible("des:span.schHit_current", this.fContentScroller);

		this.xUpdateUi();
	},

	toggleSearchForm: function(){
		scCoLib.log("searchMgr.toggleSearchForm");

	},
	focus: function(){
	 if (this.fSearchInput) this.fSearchInput.focus();
	},

	reset: function(){
		if (!this.fSearchDisplay) return;
		scCoLib.log("searchMgr.reset");
		this.fSearchDisplay = false;
		scServices.scSearch.resetLastSearch(this.fIdxUrl);
		window.location.reload();
	},

	find: function(){
		scCoLib.log("searchMgr.find");
		this.xResetHighlight();
		this.fSearchPropose.style.display = "none";
		this.fSearchPropose.fShown = false;
		this.fSearchPropose.innerHTML = "";
		var vStr = this.fSearchInput.value;
		scServices.scSearch.find(this.fIdxUrl, this.fSearchInput.value);
		this.xUpdateUi();
		this.xListTgle(true);
	},

	propose: function(){
		scCoLib.log("searchMgr.propose");
		var vStr = this.fSearchInput.value;
		var vWds = scServices.scSearch.propose(this.fIdxUrl, vStr,{async:true});
		var vShowProp = !vWds || (vWds && vWds.length==0 && vStr.length<3) || vWds && vWds.length>0;
		this.fSearchPropose.style.display = vShowProp ? "" : "none";
		this.fSearchPropose.fShown = vShowProp ? true : false;
		
		var vProp;
		this.fSearchPropose.innerHTML = "";
		if (vWds && vWds.length>0){
			for(var i = 0;i<vWds.length;i++){
				vProp = this.xAddBtn(this.fSearchPropose,"schBtnPropose",vWds[i].wrd);
				vProp.onclick = this.sProp;
				vProp.onkeyup = this.sPropKeyUp;
			}
		} else if (!vWds || (vWds && vWds.length==0 && vStr.length<3)){
			this.xAddElt("span", this.fSearchPropose,"schProposeExceeded").innerHTML=this.fStrings[6];
		}
	},

	/* ========== Private functions =========================================== */

	sReset: function(){
		searchMgr.reset();
		return false;
	},

	sFind: function(){
		searchMgr.find();
		return false;
	},

	sListTgle: function(){
		searchMgr.xListTgle();
		return false;
	},

	sProp: function(){
		searchMgr.fSearchInput.value = this.firstChild.innerHTML;
		searchMgr.find();
	},

	sPropKeyUp: function(pEvt){
		var vEvt = pEvt || window.event;
		var vNode;
		switch(vEvt.keyCode){
		case 40:
			vNode = scPaLib.findNode("nsi:a",this);
			break;
		case 38:
			vNode = scPaLib.findNode("psi:a",this);
			if(!vNode) vNode = scPaLib.findNode("anc:.schCmds/chi:.schInput",this);
		}
		if (vNode) vNode.focus();
	},

	sKeyUp: function(pEvt){
		var vEvt = pEvt || window.event;
		if (this.value.length==0) searchMgr.xResetUi();
		if (this.value.length>0) searchMgr.propose();
		else {
			searchMgr.fSearchPropose.style.display = "none";
			searchMgr.fSearchPropose.fShown = false;
		}
		if (this.value.length>0 && vEvt.keyCode == "13") searchMgr.find();
		if (searchMgr.fSearchPropose.fShown && vEvt.keyCode == "40") {
			var vProp = scPaLib.findNode("chi.a",searchMgr.fSearchPropose);
			if (vProp) vProp.focus();
		}
		if (vEvt.stopPropagation) vEvt.stopPropagation();
		else vEvt.cancelBubble = true;
	},

	sPrvHit: function(){
		searchMgr.xListTgle(false);
		if (searchMgr.fTextHits && searchMgr.fTextHits.length>0 && searchMgr.fCurrHit>0){
			tplMgr.xSwitchClass(searchMgr.fTextHits[searchMgr.fCurrHit], "schHit_current", "schHit");
			searchMgr.fCurrHit--;
			tplMgr.xSwitchClass(searchMgr.fTextHits[searchMgr.fCurrHit], "schHit", "schHit_current");
			//TODO : scroll
		}
		searchMgr.xUpdateHitUi();
		return false;
	},

	sNxtHit: function(){
		searchMgr.xListTgle(false);
		if (searchMgr.fTextHits && searchMgr.fTextHits.length>0 && searchMgr.fCurrHit<searchMgr.fTextHits.length-1){
			if (searchMgr.fCurrHit>=0) tplMgr.xSwitchClass(searchMgr.fTextHits[searchMgr.fCurrHit], "schHit_current", "schHit");
			searchMgr.fCurrHit++;
			tplMgr.xSwitchClass(searchMgr.fTextHits[searchMgr.fCurrHit], "schHit", "schHit_current");
			//TODO : scroll
		}
		searchMgr.xUpdateHitUi();
		return false;
	},

	xLoadIndex: function(){
		scServices.scSearch.declareIndex(this.fIdxUrl);
	},

	xListTgle: function(pState){
		if (typeof pState == "undefined") pState = !this.fListOpen;
		if (pState){
			tplMgr.xSwitchClass(searchMgr.fRoot, "schDisplayList_off", "schDisplayList_on", true);
		} else {
			tplMgr.xSwitchClass(searchMgr.fRoot, "schDisplayList_on", "schDisplayList_off", true);
		}
		this.fListOpen = pState;
	},


	xResetUi: function(){
		if (!this.fSearchDisplay) return;
		scCoLib.log("searchMgr.xResetUi");
		this.fSearchDisplay = false;
		tplMgr.xSwitchClass(this.fRoot, "schDisplay_on", "schDisplay_off", true);
		tplMgr.xSwitchClass(this.fRoot, "schDisplayList_on", "schDisplayist_off", true);
		this.fSearchInput.value = "";
		this.fSearchInput.className = "schInput";
		this.fSearchLbl.innerHTML = "";
		this.fSearchPropose.style.display = "none";
		this.fSearchPropose.innerHTML = "";
		this.xResetHighlight();
	},

	xUpdateUi: function(){
		if (this.fSearchInput.value.length>0) tplMgr.xSwitchClass(this.fSearchCmds,"schCmds_noact", "schCmds_act", true);
		else tplMgr.xSwitchClass(this.fSearchCmds,"schCmds_act", "schCmds_noact", true);
		var vRes = scServices.scSearch.getLastResults(this.fIdxUrl);
		if (!vRes) return;

		this.fSearchDisplay = true;
		tplMgr.xSwitchClass(searchMgr.fRoot, "schDisplay_off", "schDisplay_on", true);
		this.fResultScroll.innerHTML = "";
		if (vRes && vRes.length > 0){
			vRes.sort(function(a,b){return (scCoLib.toInt(b.cat)  - scCoLib.toInt(a.cat))})
			if (!this.fPageList){
				var vReq = null;
				if (window.XMLHttpRequest && (!this.fIsLocal || !window.ActiveXObject)) vReq = new XMLHttpRequest();
				else if (window.ActiveXObject) vReq = new ActiveXObject("Microsoft.XMLHTTP");
				vReq.open("GET",this.fPgeList,false);
				vReq.send();
				this.fPageList = scServices.scSearch.xDeserialiseObjJs(vReq.responseText);
			}
			this.fSearchLbl.innerHTML = (vRes.length == 1 ? this.fStrings[4] : this.fStrings[5].replace("%s",vRes.length));
			for (var i = 0; i < vRes.length; i++){
				var vResult = vRes[i];
				var vPageInfo = this.fPageList[vResult.url];
				var vPgeBk = this.xAddElt("div",this.fResultScroll,"schPgeBk schPgeRank_"+vResult.cat);
				var vPgeBtn = this.xAddBtn(vPgeBk,"schPgeBtn schPgeType_"+vPageInfo.type,vPageInfo.title);
				vPgeBtn.fUrl = scServices.scLoad.getRootUrl() + "/" + vResult.url;
				if (tplMgr.fHistMgr.isInHistory(vPgeBtn.fUrl)) vPgeBtn.href = vPgeBtn.fUrl;
				else {
					vPgeBtn.href = "#";
					vPgeBtn.onclick = function(){return false;}
					tplMgr.xSwitchClass(vPgeBk, "schPgeBkAct_on", "schPgeBkAct_off", true);
				}
			}
			this.xHighlight(this.fContent, scServices.scSearch.getLastSearch(this.fIdxUrl));
		} else {
			this.fSearchLbl.innerHTML = this.fStrings[3];
			this.xUpdateHitUi();
			this.xResetHighlight();
		}

	},

	xUpdateHitUi: function(){
		if (searchMgr.fTextHits && searchMgr.fTextHits.length>0 && searchMgr.fCurrHit>0) tplMgr.xSwitchClass(this.fBtnPrvHit,"schBtnHitAct_no", "schBtnHitAct_yes", true);
		else tplMgr.xSwitchClass(this.fBtnPrvHit,"schBtnHitAct_yes", "schBtnHitAct_no", true);
		if (searchMgr.fTextHits && searchMgr.fTextHits.length>0 && searchMgr.fCurrHit<searchMgr.fTextHits.length-1) tplMgr.xSwitchClass(this.fBtnNxtHit,"schBtnHitAct_no", "schBtnHitAct_yes", true);
		else tplMgr.xSwitchClass(this.fBtnNxtHit,"schBtnHitAct_yes", "schBtnHitAct_no", true);
		if(this.fContentScroller) this.fContentScroller.fKeepVis.resetNode();
	},

	xHighlight: function(pRoot, pStr){
		var vTextNodes = [];
		var vNoIdxFilter = scPaLib.compileFilter(".noIndex|.footnotes|script|noscript");
		var textNodeWalker = function (pNde){
			while (pNde){
				if (pNde.nodeType == 3) vTextNodes.push(pNde);
				else if (pNde.nodeType == 1 && !scPaLib.checkNode(vNoIdxFilter,pNde)) textNodeWalker(pNde.firstChild);
				pNde = pNde.nextSibling;
			}
		}
		textNodeWalker(pRoot.firstChild);
		var i,j,k,vTxtNode,vTxtVal,vTxtNorm,vTxtMached,vHolder,vToken,vHits,vHit,vReg,vOffset,vIsOldOffset;
		var vTokens = scServices.scSearch.buildTokens(this.fIdxUrl, pStr);
		for (i = 0; i<vTokens.length;i++) vTokens[i].fCount=0;
		for (i = 0; i<vTextNodes.length;i++){
			vHits = [];
			vTxtNode = vTextNodes[i];
			vTxtNorm = scServices.scSearch.normalizeString(this.fIdxUrl, vTxtNode.nodeValue);
			for (j = 0; j<vTokens.length;j++){
				vToken = vTokens[j];
				if (!vToken.neg && vTxtNorm.length>=vToken.wrd.length){
					if (vToken.exact) vReg = new RegExp("(?:^|\\W)("+vToken.wrd+")(?:$|\\W)","i");
					else vReg = new RegExp(vToken.wrd,"i");
					vOffset = vTxtNorm.search(vReg);
					while(vOffset>=0){
						vToken.fCount++
						if(vToken.exact && /\W/.test(vTxtNorm.charAt(vOffset))) vOffset++;
						vIsOldOffset = false;
						vHit = {start:vOffset,end:vOffset+vToken.wrd.length};
						for (k = 0; k<vHits.length;k++){
							if (vHit.start>=vHits[k].start && vHit.start<=vHits[k].end || vHit.end>=vHits[k].start && vHit.end<=vHits[k].end){
								vHits[k].start = Math.min(vHit.start,vHits[k].start);
								vHits[k].end = Math.max(vHit.end,vHits[k].end);
								vIsOldOffset = true;
							}
						}
						if (!vIsOldOffset) vHits.push(vHit);
						vOffset = vTxtNorm.substring(vHit.end).search(vReg);
						if (vOffset>=0) vOffset = vHit.end + vOffset;
					}
				}
			}
			if (vHits.length>0){
				vHits.sort(function(a,b){return a.start - b.start});
				var vIdx = 0;
				vTxtMached = "";
				vTxtVal = vTxtNode.nodeValue;
				for (var j = 0; j<vHits.length;j++){
					vHit = vHits[j];
					vTxtMached += vTxtVal.substring(vIdx,vHit.start);
					vTxtMached += "<span class='schHit' id='schId"+i+j+"'>"+vTxtVal.substring(vHit.start,vHit.end)+"</span>";
					vIdx = vHit.end;
				}
				vTxtMached += vTxtVal.substring(vHits[vHits.length-1].end);
				vHolder = this.xAddElt("span", vTxtNode.parentNode, null, null, null, vTxtNode);
				vTxtNode.parentNode.removeChild(vTxtNode);
				vHolder.innerHTML = vTxtMached;
			}
		}
		this.fTextHits = scPaLib.findNodes("des:span.schHit",pRoot);
		var vDispTokens = [];
		for (i = 0; i<vTokens.length;i++){
			vToken = vTokens[i];
			if (!vToken.neg) vDispTokens.push((vToken.exact?'"':'')+vToken.wrd+(vToken.exact?'"':'')+" <em>("+vToken.fCount+")</em>");
		}
		this.fHitLbl.innerHTML = this.fStrings[7].replace("%s",vDispTokens.join(", "));
		this.fCurrHit = -1;
		this.xUpdateHitUi();
		tplMgr.xSwitchClass(pRoot, "schHighlight_off", "schHighlight_on",true);
	},

	xResetHighlight: function(){
		if (!this.fTextHits || this.fTextHits.length==0) return;
		for (i = 0; i<this.fTextHits.length;i++){
			var vTextHit = this.fTextHits[i];
			var vParent = vTextHit.parentNode;
			var vTextNode = vParent.ownerDocument.createTextNode(String(vTextHit.firstChild.nodeValue));
			vParent.insertBefore(vTextNode,vTextHit);
			vParent.removeChild(vTextHit);
		}
		this.fTextHits = [];
		this.fCurrHit = -1;
		this.fHitLbl.innerHTML = "";
		tplMgr.xSwitchClass(this.fContent, "schHighlight_on", "schHighlight_off");
	},
	
	/* === Utilities ========================================================== */

	/** searchMgr.xAddElt : Add an HTML element to a parent node. */
	xAddElt : function(pName, pParent, pClassName, pNoDisplay, pHidden, pNxtSib){
		var vElt;
		if(scCoLib.isIE && pName.toLowerCase() == "iframe") {
			//BUG IE : impossible de masquer les bordures si on ajoute l'iframe via l'API DOM.
			var vFrmHolder = pParent.ownerDocument.createElement("div");
			if (pNxtSib) pParent.insertBefore(vFrmHolder,pNxtSib)
			else pParent.appendChild(vFrmHolder);
			vFrmHolder.innerHTML = "<iframe scrolling='no' frameborder='0'></iframe>";
			vElt = vFrmHolder.firstChild;
		} else {
			vElt = pParent.ownerDocument.createElement(pName);
			if (pNxtSib) pParent.insertBefore(vElt,pNxtSib)
			else pParent.appendChild(vElt);
		}
		if (pClassName) vElt.className = pClassName;
		if (pNoDisplay) vElt.style.display = "none";
		if (pHidden) vElt.style.visibility = "hidden";
		return vElt;
	},

	/** searchMgr.xAddBtn : Add a HTML button to a parent node. */
	xAddBtn : function(pParent, pClassName, pCapt, pTitle, pNxtSib) {
		var vBtn = pParent.ownerDocument.createElement("a");
		vBtn.className = pClassName;
		vBtn.fName = pClassName;
		vBtn.href = "#";
		vBtn.target = "_self";
		if (pTitle) vBtn.setAttribute("title", pTitle);
		if (pCapt) vBtn.innerHTML = "<span>" + pCapt + "</span>"
		if (pNxtSib) pParent.insertBefore(vBtn,pNxtSib)
		else pParent.appendChild(vBtn);
		return vBtn;
	},

	xGetCookie: function(pLbl){
		var vReg = new RegExp(pLbl+"=([^;]*)");
		var vArr = vReg.exec(document.cookie);
		if(vArr && vArr.length==2) return(unescape(vArr[1]));
		else return "";
	},

	xSetCookie: function(pLbl,pVal){
		document.cookie = pLbl+"="+escape(pVal);
	},

	loadSortKey: "ZZsearchMgr"
}


