/*! 20220322
* Dynamsoft JavaScript Library
* Product: Dynamsoft Web Twain
* Web Site: https://www.dynamsoft.com
*
* Copyright 2022, Dynamsoft Corporation 
* Author: Dynamsoft R&D Department
*
* Version: 17.2.5
*
* Module: addon/pdf
* final js: build\addon\dynamsoft.webtwain.addon.pdf.js
*/
;var Dynamsoft=self.Dynamsoft||{};Dynamsoft.DWT=Dynamsoft.DWT||{};Dynamsoft.aryAddonReadyFun=Dynamsoft.aryAddonReadyFun||[];Dynamsoft.AddonReady=Dynamsoft.AddonReady||function(a){Dynamsoft.aryAddonReadyFun.push(a)};(function(c){var d=[Dynamsoft.DWT],b=0;for(;b<1;b++){var a=d[b];a.EnumDWT_ConvertMode={CM_RENDERALL:1,CM_IMAGEONLY:2,CM_AUTO:3,CM_RENDERALLWITHANNOTATION:4};a.EnumDWT_PDFCompressionType={PDF_AUTO:0,PDF_FAX3:1,PDF_FAX4:2,PDF_LZW:3,PDF_RLE:4,PDF_JPEG:5,PDF_JP2000:6,PDF_JBig2:7}}})(typeof window!=="undefined"?window:this);Dynamsoft.AddonReady(function(c,b){if(!c.product.bHTML5Edition){return}var a;var d=function(f){var g=c.html5.Funs,e;if(c.env.bMac){if(Dynamsoft.dcp.b64bit){a="libDynamicPdfCorex64_"+Dynamsoft.DWT.PdfVersion+".dylib"}else{a="libDynamicPdfCore_"+Dynamsoft.DWT.PdfVersion+".dylib"}}else{if(c.env.bLinux){a="libDynamicPdfCore_"+Dynamsoft.DWT.PdfVersion+".so"}else{if(Dynamsoft.dcp.b64bit){a="DynamicPdfCorex64_"+Dynamsoft.DWT.PdfVersion+".dll"}else{a="DynamicPdfCore_"+Dynamsoft.DWT.PdfVersion+".dll"}}}if(!f._isMobileMode()){f._innerSend("GetAddOnVersion",g.makeParams("pdf",a),true,false,false)}e={PDF:{IsModuleInstalled:function(){var i=f;i._resetErr();if(i._isMobileMode()){if(Dynamsoft.pdf){return Dynamsoft.pdf.IsModuleInstalled()}return false}var h=i._innerFun("GetAddOnVersion",g.makeParams("pdf",a));return(h!="")},IsModuleInstalledAsync:function(){var h=f;h._resetErr();if(h._isMobileMode()){if(Dynamsoft.pdf){return c.Promise.resolve(Dynamsoft.pdf.IsModuleInstalled())}return c.Promise.resolve(false)}return h._innerFunV2("GetAddOnVersion",g.makeParams("pdf",a)).then(function(i){return(i!="")})},ConvertToImage:function(k,i,p,j){var o=g.replaceLocalFilename(k);var h="ConvertPDFToImage";var l=function(m){g.hideMask(h);if(p){p()}return true},q=function(m){g.hideMask(h);if(j){j()}return false};var n=f;n._resetErr();if(n._isMobileMode()){return true}g.showMask(h);n._innerSend(h,g.makeParams(o,i),true,l,q);return true},SetPassword:function(h){var i=f;i._resetErr();if(i._isMobileMode()){i._pdfPassword=h;return true}return i._innerFun("SetPDFPassword",g.makeParams(h))},SetConvertMode:function(h){var i=f;return i._setConvertMode(h)},SetConvertModeAsync:function(h){var i=f;return i._setConvertModeAsync(h)},GetConvertMode:function(){var h=f;h._resetErr();return h._pdfConvertMode},SetResolution:function(h){var i=f;i._resetErr();if(i._isMobileMode()){i._pdfResolution=1*h;return true}return f._innerFun("SetPDFResolution",g.makeParams(h))},SetResolutionAsync:function(h){var i=f;i._resetErr();if(i._isMobileMode()){i._pdfResolution=1*h;return c.Promise.resolve(true)}return f._innerFunV2("SetPDFResolution",g.makeParams(h))},IsTextBasedPDF:function(l,j,i){var m=f;m._resetErr();if(m._isMobileMode()){return m._mobileNotSupport("IsTextBasedPDF",i)}var k=g.replaceLocalFilename(l);var h=f._innerFun("IsTextBasedPDF",g.makeParams(k));if(m.ErrorCode==0){if(c.isFunction(j)){j(h)}}else{if(c.isFunction(i)){i(m.ErrorCode,m.ErrorString)}}return h},Write:{Setup:function(h){var j=h;if(!j){j={version:15}}if(c.stringify(j).length>2){if(!c.isNumber(j.version)){j.version=15}else{if(j.version>=1&&j.version<2){j.version=parseInt(10*j.version)}}}if(c.isNumber(j.compression)&&(j.compression==Dynamsoft.DWT.EnumDWT_PDFCompressionType.PDF_FAX3)){j.compression=Dynamsoft.DWT.EnumDWT_PDFCompressionType.PDF_FAX4}var k=f;k._resetErr();if(k._isMobileMode()){k._pdfWriteSetting=j;return true}var i=c.stringify(j);i=c.replaceAll(i,'"','\\"');return k._innerFun("SetPDFSettings",['["',i,'"]'].join(""))}}}};f.__addon=f.__addon||{};c.mix(f.__addon,e)};if(c.DynamicLoadAddonFuns){c.DynamicLoadAddonFuns.push(d)}});Dynamsoft.AddonReady(function(b,a){if(!b.product.bPluginEdition&&!b.product.bActiveXEdition){return}var c=function(g){var f,h,e;if(g.getSWebTwain()&&g.getSWebTwain().Addon){}else{return false}if(Dynamsoft.navInfo.bWin){var d=!Dynamsoft.navInfo.bOSx64||Dynamsoft.navInfo.bWOW64;if(d){e="DynamicPdfCore_"+Dynamsoft.DWT.PdfVersion+".dll"}else{e="DynamicPdfCorex64_"+Dynamsoft.DWT.PdfVersion+".dll"}}else{}h=g.getSWebTwain();f={PDF:{IsModuleInstalled:function(){var i=h.GetAddOnVersion("pdf",e);b.setErrorString(g);return(i!="")},IsModuleInstalledAsync:function(){var i=h.GetAddOnVersion("pdf",e);b.setErrorString(g);return b.Promise.resolve(i!="")},ConvertToImage:function(j,m,i,l){var k=h.ConvertPDFToImage(j,m);return b.wrapperRet(g,k,i,l)},SetPassword:function(i){var j=h.SetPDFPassword(i);return b.wrapperRet(g,j)},SetConvertMode:function(i){return g._setConvertMode(i)},SetConvertModeAsync:function(i){return Promise.resolve(g._setConvertMode(i))},GetConvertMode:function(){g._resetErr();return g._pdfConvertMode},SetResolution:function(j){var i=h.SetPDFResolution(j);return b.wrapperRet(g,i)},SetResolutionAsync:function(j){var i=h.SetPDFResolution(j);return b.Promise.resolve(b.wrapperRet(g,i))},IsTextBasedPDF:function(i){var j=h.IsTextBasedPDF(i);return b.wrapperRet(g,j)}}};g.Addon=g.Addon||{};b.mix(g.Addon,f)};if(b.DynamicLoadAddonFuns){b.DynamicLoadAddonFuns.push(c)}});