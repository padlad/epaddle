var ueMnuMgr = {
	fTocPath : "ide:tplMnu",
	fTocCoPath : "ide:tplMnuCo",
	fTocScrollPath : "ide:tplMnuScroll",
	fFraPath : "ide:content",
	fClsToc : "tplMnu",
	fClsFra : "tplCoMnu",
	fClsPre : "ueMnu",
	fCookiePre : "ueMnu",
	
	fToc : null,
	fTocCo : null,
	fTocSrl : null,
	fFra : null,
	fTglBtn : null,

	fClsTgl : "btnMnuTgl",

	/* Localisations */
	fStrings : ["menu","",
	            "Cacher le menu","Afficher le menu",
	            "défilement haut","Faire défiler le menu vers le haut",
	            "défilement bas","Faire défiler le menu vers le bas"],

	/* === Public ============================================================= */
	init : function() {
		this.fToc = scPaLib.findNode(this.fTocPath);
		if (!this.fToc) return;
		this.fTocCo = scPaLib.findNode(this.fTocCoPath);
		this.fTocSrl = scPaLib.findNode(this.fTocScrollPath);
		this.fFra = scPaLib.findNode(this.fFraPath);
		// init toc position
		// if(document.cookie.indexOf(this.fCookiePre+"Close=true")>=0) this.closeToc();
		this.closeToc();
		// else this.openToc();
		// init toc scroll container
		this.fTocSrl.style.overflow="hidden";
		// Add SiRule to keep current selected element visible
		this.fKeepVis = new scSiRuleEnsureVisible("des:div.mnu_sel_yes",this.fTocSrl);
		scOnLoads[scOnLoads.length] = this;
	},
	onLoad : function() {
		try{
			// Add toggle button
			this.fTglBtn = this.xAddBtn(this.fToc, this.fClsTgl+(this.fOpen?"On":"Off"), this.fStrings[0], (this.fOpen ? this.fStrings[2] : this.fStrings[3]));
			this.fTglBtn.onclick = this.sToggleToc;
			// Add Scroll up button
			this.fSrlUp = this.xAddElt("div", this.fTocCo, this.fClsPre+"SrlUp", null, null, this.fTocSrl);
			this.fSrlUp.onclick = function(){
				ueMnuMgr.scrollTask.fSpeed -= 2;
			}
			this.fSrlUp.onmouseover = function(){
				if(ueMnuMgr.scrollTask.fSpeed >= 0) {
					ueMnuMgr.scrollTask.fSpeed = -2; 
					scTiLib.addTaskNow(ueMnuMgr.scrollTask);
				}
			}
			this.fSrlUp.onmouseout = function(){
				ueMnuMgr.scrollTask.fSpeed = 0;
			}
			var vSrlUpBtn = this.xAddBtn(this.fSrlUp, this.fClsPre+"SrlUpBtn", this.fStrings[4], this.fStrings[5]);
			vSrlUpBtn.onclick = function(){
				ueMnuMgr.scrollTask.step(-20); 
				return false;
			}
			// Add Scroll down button
			this.fSrlDwn = this.xAddElt("div", this.fTocCo, this.fClsPre+"SrlDwn", null, null);
			this.fSrlDwn.onclick = function(){
				ueMnuMgr.scrollTask.fSpeed += 2;
			}
			this.fSrlDwn.onmouseover = function(){
				if(ueMnuMgr.scrollTask.fSpeed <= 0) {
					ueMnuMgr.scrollTask.fSpeed = 2; 
					scTiLib.addTaskNow(ueMnuMgr.scrollTask);
				}
			}
			this.fSrlDwn.onmouseout = function(){
				ueMnuMgr.scrollTask.fSpeed = 0;
			}
			var vSrlDwnBtn = this.xAddBtn(this.fSrlDwn, this.fClsPre+"SrlDwnBtn", this.fStrings[6], this.fStrings[7]);
			vSrlDwnBtn.onclick = function(){
				ueMnuMgr.scrollTask.step(20); 
				return false;
			}
			// Init scroll manager
			this.scrollTask.checkBtn();
			scSiLib.addRule(this.fTocSrl, this.scrollTask);
			this.fTocSrl.onscroll = function(){ueMnuMgr.scrollTask.checkBtn()};
			if(scCoLib.isIE) this.fTocSrl.onmousewheel = function(){ueMnuMgr.scrollTask.step(Math.round(-event.wheelDelta/60))};
			else this.fTocSrl.addEventListener('DOMMouseScroll', function(pEvent){ueMnuMgr.scrollTask.step(pEvent.detail)}, false);
		} catch(e){scCoLib.log("ERROR ueMnuMgr.onLoad: "+e)}
	},
	loadSortKey : "AZ",
	/** Called by the toggle button - this == ueMnuMgr.fTglBtn. */
	sToggleToc : function(){
		if (ueMnuMgr.fOpen){
			ueMnuMgr.closeToc();
		} else {
			ueMnuMgr.openToc();
		}
		return false;
	},
	closeToc : function(){
		document.cookie = this.fCookiePre+"Close=true";
		this.fTocCo.style.display = "none";
		this.fToc.className = this.fToc.className.replace(this.fClsToc+"On",this.fClsToc+"Off");
		this.fFra.className = this.fFra.className.replace(this.fClsFra+"On",this.fClsFra+"Off");
		this.fOpen = false;
		if (this.fTglBtn) { //The toggle button may not be created yet
			this.fTglBtn.className = this.fClsTgl+"Off";
			this.fTglBtn.title = this.fStrings[3];
		}
	},
	openToc : function(){
		document.cookie = this.fCookiePre+"Close=false";
		this.fTocCo.style.display = "";
		this.fToc.className = this.fToc.className.replace(this.fClsToc+"Off",this.fClsToc+"On");
		this.fFra.className = this.fFra.className.replace(this.fClsFra+"Off",this.fClsFra+"On");
		this.fOpen = true;
		if (this.fTglBtn) { //The toggle button may not be created yet
			this.fTglBtn.className = this.fClsTgl+"On";
			this.fTglBtn.title = this.fStrings[2];
		}
	},

	/* === Utilities ========================================================== */
	/** ueMnuMgr.xAddElt : Add an HTML element to a parent node. */
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
	/** ueMnuMgr.xAddBtn : Add a HTML button to a parent node. */
	xAddBtn : function(pParent, pClassName, pCapt, pTitle, pNxtSib) {
		var vBtn = pParent.ownerDocument.createElement("a");
		vBtn.className = pClassName;
		vBtn.fName = pClassName;
		vBtn.href = "#";
		vBtn.target = "_self";
		if (pTitle) vBtn.setAttribute("title", pTitle);
		vBtn.innerHTML = "<span>" + pCapt + "</span>"
		if (pNxtSib) pParent.insertBefore(vBtn,pNxtSib)
		else pParent.appendChild(vBtn);
		return vBtn;
	},

	/* === Tasks ============================================================== */
	/** ueMnuMgr.scrollTask : menu scroll timer & size task */
	scrollTask : {
		fClassOffUp : "btnOff",
		fClassOffDown : "btnOff",
		fSpeed : 0,
		execTask : function(){
			try {
				if(this.fSpeed == 0) return false;
				ueMnuMgr.fTocSrl.scrollTop += this.fSpeed;
				return true;
			}catch(e){
				this.fSpeed = 0;
				return false;
			}
		},
		step: function(pPx) {
			try { ueMnuMgr.fTocSrl.scrollTop += pPx; }catch(e){}
		},
		checkBtn: function(){
			var vScrollTop = ueMnuMgr.fTocSrl.scrollTop;
			var vBtnUpOff = ueMnuMgr.fSrlUp.className.indexOf(this.fClassOffUp);
			if(vScrollTop <= 0) {
				if(vBtnUpOff < 0) ueMnuMgr.fSrlUp.className+= " "+this.fClassOffUp;
			} else {
				if(vBtnUpOff >= 0) ueMnuMgr.fSrlUp.className = ueMnuMgr.fSrlUp.className.substring(0, vBtnUpOff);
			}
		
			var vContentH = scSiLib.getContentHeight(ueMnuMgr.fTocSrl);
			var vBtnDownOff = ueMnuMgr.fSrlDwn.className.indexOf(this.fClassOffDown);
			if( vContentH - vScrollTop <= ueMnuMgr.fTocSrl.offsetHeight){
				if(vBtnDownOff < 0) ueMnuMgr.fSrlDwn.className+= " "+this.fClassOffDown;
			} else {
				if(vBtnDownOff >=0) ueMnuMgr.fSrlDwn.className = ueMnuMgr.fSrlDwn.className.substring(0, vBtnDownOff);
			}
		},
		onResizedAnc:function(pOwnerNode, pEvent){
			if(pEvent.phase==2) this.checkBtn();
		},
		ruleSortKey : "checkBtn"
	}
} 

/* === Tools ================================================================ */
/** scSiRuleEnsureVisible : sc size rule that ensures a given node is visible in it's container' */
function scSiRuleEnsureVisible(pPathNode, pContainer) {
	this.fPathNode = pPathNode;
	this.fContainer = pContainer;
	scOnLoads[scOnLoads.length] = this;
}
scSiRuleEnsureVisible.prototype.onLoad = function() {
	try {
		this.resetNode();
		scSiLib.addRule(this.fContainer, this);
	} catch(e){scCoLib.log("ERROR scSiRuleEnsureVisible.onLoad: "+e);}
}
scSiRuleEnsureVisible.prototype.onResizedAnc = function(pOwnerNode, pEvent) {
	if(pEvent.phase==1 || pEvent.resizedNode == pOwnerNode) return;
	this.ensureVis();
}
scSiRuleEnsureVisible.prototype.onResizedDes = function(pOwnerNode, pEvent) {
	if(pEvent.phase==1) return;
	this.ensureVis();
}
scSiRuleEnsureVisible.prototype.resetNode = function() {
	this.fNode = scPaLib.findNode(this.fPathNode, this.fContainer);
	this.ensureVis();
}
scSiRuleEnsureVisible.prototype.initTask = function(pTargetScrollTop) {
	this.fTargetScrollTop = pTargetScrollTop;
	try{
		this.fEndTime = ( Date.now ? Date.now() : new Date().getTime() ) + 100;
		this.fCycles = Math.min(25, Math.max(10, Math.round(Math.abs(this.fContainer.scrollTop - this.fTargetScrollTop)/ 10)));
		scTiLib.addTaskNow(this);
	}catch(e){scCoLib.log("ERROR scSiRuleEnsureVisible.initTask: "+e);}
}
scSiRuleEnsureVisible.prototype.execTask = function() {
	try{
		var vNow = Date.now ? Date.now() : new Date().getTime();
		while(this.fEndTime < vNow && this.fCycles >0) {
			//On saute des steps si le processor est trop lent.
			this.fCycles--;
			this.fEndTime += 100;
		}
		this.fCycles--;
		if(this.fCycles <= 0) {
			this.precipitateEndTask();
			return false;
		} else {
			this.fEndTime += 100;

			var vCurrScrollTop = this.fContainer.scrollTop;
			var vNewScrollTop = vCurrScrollTop - (2 * (vCurrScrollTop - this.fTargetScrollTop) / (this.fCycles+1) );
			this.fContainer.scrollTop = vNewScrollTop;
			return true;
		}
	}catch(e){scCoLib.log("ERROR scSiRuleEnsureVisible.execTask: "+e);}
}
scSiRuleEnsureVisible.prototype.precipitateEndTask = function() {
	try{
		this.fContainer.scrollTop = this.fTargetScrollTop;
	}catch(e){scCoLib.log("ERROR scSiRuleEnsureVisible.precipitateEndTask: "+e);}
}
scSiRuleEnsureVisible.prototype.ensureVis = function() {
	if( !this.fNode) return;
	try{
		var vParent = this.fNode.offsetParent;
		if( !vParent) return;
		var vOffset = this.fNode.offsetTop;
		while(vParent != this.fContainer) {
			var vNewParent = vParent.offsetParent;
			vOffset += vParent.offsetTop;
			vParent = vNewParent;
		}
		var vOffsetMiddle = vOffset + this.fNode.offsetHeight/2;
		var vMiddle = this.fContainer.clientHeight / 2;
		this.initTask(vOffsetMiddle - vMiddle);
	} catch(e) {scCoLib.log("ERROR scSiRuleEnsureVisible.ensureVis: "+e)}
}
scSiRuleEnsureVisible.prototype.loadSortKey = "SiZ";
scSiRuleEnsureVisible.prototype.ruleSortKey = "Z";

