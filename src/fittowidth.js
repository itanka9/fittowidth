(function () {

    SCROLLBAR_ADJUST = 16

    var isFit = localStorage.getItem('fitToWidth32764')

    /* For */
    var preWrapObj

    function addPreWrapCSS() {
        var preWrapElt = document.createElement("style");
        preWrapElt.type = "text/css";
        preWrapElt.appendChild(
            document.createTextNode('pre { white-space: pre-wrap; }')
        );
        return preWrapElt
    }

    function iter(f) {
        a = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT, f, false)
        while (a.nextNode()) { }
    }

    function fit(isFit) {

        /* Wrap pre elements */
        if (isFit) {
            preWrapObj = document.querySelector('head').appendChild(addPreWrapCSS())
        } else {
            preWrapObj && preWrapObj.parentNode.removeChild(preWrapObj)
        }

        /* Walk on DOM items and adjust it */
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
                if (e.tagName == 'IMG')
                    e.style.maxHeight = e.clientHeight * maxW / e.clientWidth
                e.style.maxWidth = maxW + 'px'
            }
        } : function (e) { if (e.style.maxWidth) e.style.maxWidth = '' })
    }

    function applyFit() {
        fit(isFit)
        localStorage.setItem('fitToWidth32764', isFit)
        chrome.runtime.sendMessage({ cmd: 'status', fit: isFit });
    }

    function processMessage(msg) {
        if (msg.cmd == 'toggle') {
            isFit = !isFit
            applyFit();
        }
    }

    shortcut.add("Shift+F11", function () {
        processMessage({ cmd: 'toggle' });
    }, { disable_In_Input: true })

    window.addEventListener('resize', applyFit) 


    chrome.runtime.onMessage.addListener(processMessage)
    
    if (isFit == 'false' || !isFit)
        isFit = false
    applyFit();

})()