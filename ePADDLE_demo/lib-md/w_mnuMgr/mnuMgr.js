/**
 * Menu manager.
 */
var mnuMgr = {
	fMnuRoot : null,
	fMnuNodes : null,
	fHistMgr : null,
	fMnuRootPath : "ide:mnuFra",
	fProgFraPath : "des:div.progFra",
	fEnLnkClass : "enabled_entry",
	fDisLnkClass : "disabled_entry",
	init : function(){
		try {
			scOnLoads[scOnLoads.length] = this;
		} catch(e){
			scCoLib.log("mnuMgr.init::Error: "+e);
		}
	},
	onLoad : function(){
		this.fMnuRoot = scPaLib.findNode(this.fMnuRootPath);
		if (!histMgr || !this.fMnuRoot) return;
		this.fMnuNodes = scPaLib.findNodes("des:a." + this.fEnLnkClass, this.fMnuRoot);
		// Initialisation des "enabled_click"
		for (var i = 0; i < this.fNodesClick.nds.length; i++) {
			var vNode = this.fNodesClick.nds[i];
			var vLnk = scPaLib.findNode("des:."+vNode.id);
			if(vNode.nc) vLnk.className += " enabled_click";
		}
		this.fHistMgr = new histMgr;
		for (var i in this.fMnuNodes) {
			var vLnk = this.fMnuNodes[i];
			if (!this.fHistMgr.isInHistory(vLnk.href)) {
				if (vLnk.className.indexOf("click")>0){
					vLnk.href = "#";
					vLnk.onclick = function() {return false;}
					vLnk.className = vLnk.className.replace(this.fEnLnkClass, this.fDisLnkClass);
				}
				vLnk.className = vLnk.className + " done";
			}
		}
		this.fProg = 10 * Math.round(10 - 10 * scPaLib.findNodes("des:a.done", this.fMnuRoot).length / this.fMnuNodes.length);
		this.fProgFra = scPaLib.findNode(this.fProgFraPath);
		var vProgImg = new Image();
		vProgImg.src = "../skin/img/prog/" + this.fProg + ".png";
		this.fProgFra.appendChild(vProgImg);
	},
	loadSortKey : "ZMnuMgr"
}
