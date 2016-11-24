var THREEx = THREEx || {}

// shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.camera;
window.URL = window.URL || window.webkitURL;

/**
 * Grab camera
 * @constructor
 */
THREEx.WebcamGrabbing = function(){

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
        // create video element
        var domElement        = document.createElement('video')
        domElement.setAttribute('autoplay', true)

	// window.domElement = video
	domElement.style.zIndex = -1;
    domElement.style.position = 'absolute'
	domElement.style.top = '0px'
	domElement.style.left = '0px'
	domElement.style.width = '100%'
	domElement.style.height = '100%'

        /**
         * Resize video element.
         * - Made complex to handle the aspect change
         * - it is frequently when the mobile is changing orientation
         * - after a search on the internet, it seems hard/impossible to prevent browser from changing orientation
         */
        function onResize(){
                // is the size of the video available ?
                if( domElement.videoHeight === 0 )   return

                var videoAspect = domElement.videoWidth / domElement.videoHeight
                var windowAspect = window.innerWidth / window.innerHeight
                var video = document.querySelector('video')
                if( videoAspect < windowAspect ){
                        domElement.style.left        = '0%'
                        domElement.style.width       = window.innerWidth + 'px'
                        domElement.style.marginLeft  = '0px'

                        domElement.style.top         = '50%'
                        domElement.style.height      =  (window.innerWidth/videoAspect) + 'px'
                        domElement.style.marginTop   = -(window.innerWidth/videoAspect) /2 + 'px'
                }else{
                        domElement.style.top         = '0%'
                        domElement.style.height      = window.innerHeight+'px'
                        domElement.style.marginTop   =  '0px'

                        domElement.style.left        = '50%'
                        domElement.style.width       =  (window.innerHeight*videoAspect) + 'px'
                        domElement.style.marginLeft  = -(window.innerHeight*videoAspect)/2 + 'px'
                }
        }

        window.addEventListener('resize', function(event){
                onResize()
        })

        // just to be sure - resize on mobile is funky to say the least
        setInterval(function(){
                onResize()
        }, 500)

         // define getUserMedia() constraints
         var constraints = {
                        video: true,
                        audio: false,
                }

        // get the media sources
        MediaStreamTrack.getSources (function(sources) {
            sources.forEach(function(info) {
                if (info.kind == "video" && info.facing == "environment") {
                    constraints = {
                      video: {
                        optional: [{sourceId: info.id}]
                      }
                    };
                }
            })

            navigator.getUserMedia( constraints, function(stream){
                    domElement.src = URL.createObjectURL(stream);
                }, function(error) {
                        alert(error.name);
                        console.error("Cant getUserMedia()! due to ", error);
                });

        })

        
	this.domElement = domElement
}
