import Script from 'next/script'

import FullscreenButton from 'components/FullscreenButton'

const makeScript = (path, name) => `
var container = document.querySelector('#unity-container')
var canvas = document.querySelector('#unity-canvas')
var loadingBar = document.querySelector('#unity-loading-bar')
var progressBarFull = document.querySelector('#unity-progress-bar-full')
var fullscreenButton = document.querySelector('#unity-fullscreen-button')
// var warningBanner = document.querySelector('#unity-warning')

// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
// function unityShowBanner(msg, type) {
//   function updateBannerVisibility() {
//     warningBanner.style.display = warningBanner.children.length ? 'block' : 'none'
//   }
//   var div = document.createElement('div')
//   div.innerHTML = msg
//   warningBanner.appendChild(div)
//   if (type == 'error') div.style = 'background: red; padding: 10px;'
//   else {
//     if (type == 'warning') div.style = 'background: yellow; padding: 10px;'
//     setTimeout(function () {
//       warningBanner.removeChild(div)
//       updateBannerVisibility()
//     }, 5000)
//   }
//   updateBannerVisibility()
// }

var buildUrl = '${path}'
var loaderUrl = buildUrl + '/${name}.loader.js'
var config = {
  dataUrl: buildUrl + '/${name}.data',
  frameworkUrl: buildUrl + '/${name}.framework.js',
  codeUrl: buildUrl + '/${name}.wasm',
  streamingAssetsUrl: 'StreamingAssets',
  companyName: 'DefaultCompany',
  productName: '${name}',
  productVersion: '1.0',
  showBanner: () => {},
}

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  // Mobile device style: fill the whole browser client area with the game canvas:

  var meta = document.createElement('meta')
  meta.name = 'viewport'
  meta.content =
    'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes'
  document.getElementsByTagName('head')[0].appendChild(meta)
  container.className = 'unity-mobile'

  // To lower canvas resolution on mobile devices to gain some
  // performance, uncomment the following line:
  // config.devicePixelRatio = 1;

  // canvas.style.width = window.innerWidth + 'px'
  // canvas.style.height = window.innerHeight + 'px'

  // unityShowBanner('WebGL builds are not supported on mobile devices.')
} else {
  // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

  // canvas.style.width = '960px'
  // canvas.style.height = '600px'
}

loadingBar.style.display = 'block'

var script = document.createElement('script')
script.src = loaderUrl
script.onload = () => {
  createUnityInstance(canvas, config, progress => {
    progressBarFull.style.width = 100 * progress + '%'
  })
    .then(unityInstance => {
      loadingBar.style.display = 'none'
    })
    .catch(message => {
      alert(message)
    })
}
document.body.appendChild(script)
`

const UnityFullCanvas = ({ path, name }) => (
  <>
    <div id="unity-container" className="unity-desktop">
      <canvas id="unity-canvas" />
      <div id="unity-loading-bar">
        <div id="unity-logo" />
        <div id="unity-progress-bar-empty">
          <div id="unity-progress-bar-full" />
        </div>
      </div>
    </div>
    <FullscreenButton pos="absolute" top={3} right={3} zIndex={100000} />
    <Script>{makeScript(path, name)}</Script>
    <style global jsx>{`
      html,
      body,
      #__next {
        height: 100%;
      }

      body {
        margin: 0;
        background: #231f20;
        font-family: sans-serif;
      }

      canvas {
        width: 100%;
        height: 100vh;
        outline: none;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
      }

      .unity-mobile #unity-canvas {
        width: 100%;
        height: 100%;
      }
      #unity-loading-bar {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: none;
      }
      #unity-logo {
        width: 154px;
        height: 130px;
        background: url('/unity/unity-logo-dark.png') no-repeat center;
      }
      #unity-progress-bar-empty {
        width: 141px;
        height: 18px;
        margin-top: 10px;
        margin-left: 6.5px;
        background: url('/unity/progress-bar-empty-dark.png') no-repeat center;
      }
      #unity-progress-bar-full {
        width: 0%;
        height: 18px;
        margin-top: 10px;
        background: url('/unity/progress-bar-full-dark.png') no-repeat center;
      }
      #unity-footer {
        position: relative;
      }
      .unity-mobile #unity-footer {
        display: none;
      }
      #unity-build-title {
        float: right;
        margin-right: 10px;
        line-height: 38px;
        font-family: arial;
        font-size: 18px;
      }
    `}</style>
  </>
)

export default UnityFullCanvas
