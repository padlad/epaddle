/**
 * LICENCE[[
 * Version: MPL 2.0/GPL 3.0/LGPL 3.0/CeCILL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is kelis.fr code.
 *
 * The Initial Developer of the Original Code is 
 * nicolas.boyer@kelis.fr
 *
 * Portions created by the Initial Developer are Copyright (C) 2017
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 3 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 3.0 or later (the "LGPL"),
 * or the CeCILL Licence Version 2.1 (http://www.cecill.info/licences.en.html),
 * in which case the provisions of the GPL, the LGPL or the CeCILL are applicable
 * instead of those above. If you wish to allow use of your version of this file
 * only under the terms of either the GPL, the LGPL or the CeCILL, and not to allow
 * others to use your version of this file under the terms of the MPL, indicate
 * your decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL, the LGPL or the CeCILL. If you do not
 * delete the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL, the LGPL or the CeCILL.
 * ]]LICENCE
 */
 
var countDownMgr = {
	fRgtPath : 'des:.stepTools',
	fArcPath : 'ide:arc',
	fTopPath : 'ide:header',
	fCoachPath : 'ide:coachBk',
	fCountDownImgPath : 'ide:countDownImg',
	fStrings : ['Fin','Vous avez atteint la fin du parcours.'],

	init : function(){
		// Delete tous les timers à chaque loading car le preload fait passer l'init de la page courante avant l'unload de la page précédente
		scServices.clock.deleteTimers();
		if(!this.fTime) return;

		// Init variables
		var vDurationVisibility, vIntervalVisibility;
		var vRgt = scPaLib.findNode(this.fRgtPath);
		var vCoach = scPaLib.findNode(this.fCoachPath);
		var vArc = scPaLib.findNode(this.fArcPath, vRgt);
		var vTop = scPaLib.findNode(this.fTopPath);
		var vCounter = 1;
		var vPosition = !this.fDisplay || this.fDisplay == "top" ? vTop : vRgt;

		// Set Class
		var vIsCoachClass = scPaLib.findNode("chi:img", vCoach) ? " isCoach" : "";
		var vCountDownPositionClass = !this.fDisplay ? " top" : " " + this.fDisplay;
		var vCoutDownVisibilityClass = (!this.fVisibility || this.fVisibility == "visible") && !this.fCustomVisibility ? " display_yes" : " display_no";
		var vCountDownAppearanceClass = !this.fAppearance ? " discreet" : " " + this.fAppearance;
		var vCountDownBk = scDynUiMgr.addElement("div", vPosition,"countDownBk" + vCountDownPositionClass + vCountDownAppearanceClass + vIsCoachClass + vCoutDownVisibilityClass);
		if(this.fAppearance == "progressBar") {
			var vProgressBar = scDynUiMgr.addElement("progress", vCountDownBk);
			vProgressBar.max = 100;
		}
		var vCountDownDiv = scDynUiMgr.addElement("div", vCountDownBk,"countDownDiv");

		// Set CountDownImg Blocks
		if(this.fImages && this.fImages.length) {
			var vCountDownImgBk = scPaLib.findNode(this.fCountDownImgPath);
			vCountDownImgBk.className = vIsCoachClass;
			if (vArc) {
				vArc.style.bottom = "136px";
				vArc.style.borderBottomStyle = "dotted";
				vArc.style.borderBottomWidth = "1px";
			} else vCountDownImgBk.className += " isHome";
			var vCountDownImgDiv = scDynUiMgr.addElement("div", vCountDownImgBk);
		}

		// Set countdown
		var vClock = this.fClock = scServices.clock.init(vCountDownDiv,{
			countdown 	: true,
			reset 		: this.fReset,
			time 		: this.fTime,
			id 			: topazeMgr.fNodeId,
			autostart	: topazeMgr.fNodeType == "case" ? this.fReset : true,
			callbacks 	: {
				stop : function(){
					if (countDownMgr.fActionAfterCountDown =='end') {
						var vBarClassName = vRgt.className.indexOf("Open") != -1 ? "barOpened" : "barClosed";
						vRgt.className = vBarClassName + " endArcFra";
						vArc.innerHTML = '<div class="arcBk endArc"><h1 class="arcBk_ti"><span>'+countDownMgr.fStrings[0]+'</span></h1><div class="arcBk_co "><div class="endMsg">'+countDownMgr.fStrings[1]+'</div></div></div>';
					}
					else if(!isNaN(countDownMgr.fActionAfterCountDown) && vClock) {
						if(vCounter<countDownMgr.fActionAfterCountDown || countDownMgr.fActionAfterCountDown==0){
							vClock.reset();
							vClock.start();
							vCounter++;
						}
					}
					else if(scServices.scPreload) scServices.scPreload.goTo(scServices.scLoad.resolveDestUri("/co/"+countDownMgr.fActionAfterCountDown));
					else window.location.href = scServices.scLoad.resolveDestUri("/co/"+countDownMgr.fActionAfterCountDown);
				},
				interval : function(){
					if (vClock) {
						// Progress bar
						if (vProgressBar) vProgressBar.value = Math.round(vClock.getRemainingTime("percent")*100)/100;
						// Progressive
						if (countDownMgr.fAppearance == "progressive") vCountDownDiv.style.fontSize = Math.round((100 - vClock.getRemainingTime("percent"))*100)/100 + 135 + "%";
						// Custom visibility
						var vTime = Math.round(vClock.getRemainingTime("second"));
						if(countDownMgr.fCustomVisibility && vTime == countDownMgr.fCustomVisibility.firstappearance) {
							countDownMgr.xSwitchClass(vCountDownBk,"display_no","display_yes",true);
						}
						if(!vDurationVisibility && countDownMgr.fCustomVisibility && countDownMgr.fCustomVisibility.durationvisibility && vCountDownBk.className.indexOf("display_yes") != -1){
							if (vIntervalVisibility) {
								clearInterval(vIntervalVisibility);
								vIntervalVisibility = false;
							}
							vDurationVisibility = setInterval(function(){countDownMgr.xSwitchClass(vCountDownBk,"display_yes","display_no",true);}, countDownMgr.fCustomVisibility.durationvisibility*1000);
						} 
						if(vDurationVisibility && !vIntervalVisibility && countDownMgr.fCustomVisibility && countDownMgr.fCustomVisibility.intervalvisibility && vCountDownBk.className.indexOf("display_no") != -1){
							clearInterval(vDurationVisibility);
							vDurationVisibility = false;
							vIntervalVisibility = setInterval(function(){countDownMgr.xSwitchClass(vCountDownBk,"display_no","display_yes",true);}, countDownMgr.fCustomVisibility.intervalvisibility*1000);					
						}
						if(vTime == 0){
							if(vDurationVisibility) clearInterval(vDurationVisibility);
							if(vIntervalVisibility) clearInterval(vIntervalVisibility);
						}
						// Set CountDownImg Images - et surtout remettre le choix heure seconde etc sur le model ... !!!! voir pour améliorer avec une comparaison sur la source
						if(countDownMgr.fImages && countDownMgr.fImages.length) {						
							for (var i = 0; i < countDownMgr.fImages.length; i++) {
								var vImg = countDownMgr.fImages[i];
								if (vTime <= vImg.time && !vImg.seen) {								
									vCountDownImgDiv.innerHTML = "";
									scDynUiMgr.addElement("img", vCountDownImgDiv).src = vImg.src;
									vImg.seen = true;
								}
							}
						}
					}					
				}
			}
		});
		
		scOnUnloads[scOnUnloads.length] = this;
	},

	onUnload : function(){
		this.fClock.pause();
	},

	/* === Utilities ============================================================ */
	/** countDownMgr.xSwitchClass - replace a class name. */
	xSwitchClass : function(pNode, pClassOld, pClassNew, pAddIfAbsent, pMatchExact) {
		var vAddIfAbsent = typeof pAddIfAbsent == "undefined" ? false : pAddIfAbsent;
		var vMatchExact = typeof pMatchExact == "undefined" ? true : pMatchExact;
		var vClassName = pNode.className;
		var vReg = new RegExp("\\b"+pClassNew+"\\b");
		if (vMatchExact && vClassName.match(vReg)) return;
		var vClassFound = false;
		if (pClassOld && pClassOld != "") {
			if (vClassName.indexOf(pClassOld)==-1){
				if (!vAddIfAbsent) return;
				else if (pClassNew && pClassNew != '') pNode.className = vClassName + " " + pClassNew;
			} else {
				var vCurrentClasses = vClassName.split(' ');
				var vNewClasses = new Array();
				for (var i = 0, n = vCurrentClasses.length; i < n; i++) {
					var vCurrentClass = vCurrentClasses[i];
					if (vMatchExact && vCurrentClass != pClassOld || !vMatchExact && vCurrentClass.indexOf(pClassOld) != 0) {
						vNewClasses.push(vCurrentClasses[i]);
					} else {
						if (pClassNew && pClassNew != '') vNewClasses.push(pClassNew);
						vClassFound = true;
					}
				}
				pNode.className = vNewClasses.join(' ');
			}
		}
		return vClassFound;
	},

	loadSortKey : "ZcountDownMgr"
}