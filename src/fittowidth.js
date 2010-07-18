(function () {

   SCROLLBAR_ADJUST = 16

   var port = chrome.extension.connect({name: "ftw32"})
   var isFit = localStorage.getItem('fitToWidth32764')

   function iter(f) {
      a = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT, f, false)
      while (a.nextNode()) {}
   }

   function fit(isFit) {
      iter(isFit ? function (e) {
	 var realLeft = e.offsetLeft, i = e
	 
	 /* This is potential bottleneck.
	  
	    Solution is do treewalk instead of nodeIterator, 
	    but it's too lazy for now. */
	 while (i.offsetParent) {
	    i = i.offsetParent
	    realLeft += i.offsetLeft
	 }
	 
         var maxW = document.documentElement.clientWidth - realLeft - SCROLLBAR_ADJUST
	 
	 if (maxW < e.offsetWidth) {
            if(e.tagName == 'IMG')
               e.style.maxHeight = e.clientHeight * maxW / e.clientWidth
            e.style.maxWidth = maxW + 'px'
	 }
      } : function (e) { if (e.style.maxWidth) e.style.maxWidth = '' })
   }

   function applyFit() {
      fit(isFit)
      localStorage.setItem('fitToWidth32764', isFit)
      port.postMessage({cmd: 'status', fit:isFit});
   }

   function processMessage (msg) {
      if (msg.cmd == 'toggle') {
	 isFit = !isFit
	 applyFit();
      }
   }

   shortcut.add("Shift+F11", function() {
      processMessage({cmd: 'toggle'});
   }, {disable_In_Input: true})


   chrome.extension.onConnect.addListener(function(port) {
      port.onMessage.addListener(processMessage);
   });

   if (isFit == 'false' || !isFit)
      isFit = false
   applyFit();

})()