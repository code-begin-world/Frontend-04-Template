let names = Object.getOwnPropertyNames(window);

function filterOut(names, props) {
  let set = new Set();
  props.forEach((o) => set.add(o));
  return names.filter((e) => !set.has(e));
}

function output(name, props) {
  document.body.insertAdjacentHTML('beforeend', `<h2>${name}</h2>`);
  document.body.insertAdjacentHTML('beforeend', props.map((item) => `<code>${item}</code>`).join(' '));
  document.body.insertAdjacentHTML('beforeend', '<hr>');
}

// ECMA 262
{
  let js = new Set();
  let objects = [
    'globalThis',
    'console',
    'BigInt',
    'BigInt64Array',
    'BigUint64Array',
    'Infinity',
    'NaN',
    'undefined',
    'eval',
    'isFinite',
    'isNaN',
    'parseFloat',
    'parseInt',
    'decodeURI',
    'decodeURIComponent',
    'encodeURI',
    'encodeURIComponent',
    'Array',
    'Date',
    'RegExp',
    'Promise',
    'Proxy',
    'Map',
    'WeakMap',
    'Set',
    'WeakSet',
    'Function',
    'Boolean',
    'String',
    'Number',
    'Symbol',
    'Object',
    'Error',
    'EvalError',
    'RangeError',
    'ReferenceError',
    'SyntaxError',
    'TypeError',
    'URIError',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'DataView',
    'Float32Array',
    'Float64Array',
    'Int8Array',
    'Int16Array',
    'Int32Array',
    'Uint8Array',
    'Uint16Array',
    'Uint32Array',
    'Uint8ClampedArray',
    'Atomics',
    'JSON',
    'Math',
    'Reflect',
    'escape',
    'unescape'
  ];
  objects.forEach((o) => js.add(o));
  names = names.filter((e) => !js.has(e));

  output('ECMA 262', objects);
}

// Node
{
  names = names
    .filter((e) => {
      try {
        return !(window[e].prototype instanceof Node);
      } catch (err) {
        return true;
      }
    })
    .filter((e) => e != 'Node');
}

// event bind
names = names.filter((e) => !e.match(/^on/));

// webkit
names = names.filter((e) => !e.match(/^webkit/i));

//https://html.spec.whatwg.org/#window

{
  let arr = [];
  let names = Object.getOwnPropertyNames(window);
  let js = new Set();
  let objects = [
    'BigInt',
    'BigInt64Array',
    'BigUint64Array',
    'Infinity',
    'NaN',
    'undefined',
    'eval',
    'isFinite',
    'isNaN',
    'parseFloat',
    'parseInt',
    'decodeURI',
    'decodeURIComponent',
    'encodeURI',
    'encodeURIComponent',
    'Array',
    'Date',
    'RegExp',
    'Promise',
    'Proxy',
    'Map',
    'WeakMap',
    'Set',
    'WeakSet',
    'Function',
    'Boolean',
    'String',
    'Number',
    'Symbol',
    'Object',
    'Error',
    'EvalError',
    'RangeError',
    'ReferenceError',
    'SyntaxError',
    'TypeError',
    'URIError',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'DataView',
    'Float32Array',
    'Float64Array',
    'Int8Array',
    'Int16Array',
    'Int32Array',
    'Uint8Array',
    'Uint16Array',
    'Uint32Array',
    'Uint8ClampedArray',
    'Atomics',
    'JSON',
    'Math',
    'Reflect',
    'escape',
    'unescape'
  ];
  objects.forEach((o) => js.add(o));
  names = names.filter((e) => !js.has(e));

  arr = objects;

  names = names
    .filter((e) => {
      try {
        return !(window[e].prototype instanceof Node);
      } catch (err) {
        return true;
      }
    })
    .filter((e) => e != 'Node');

  let windowprops = new Set();
  objects = [
    'window',
    'self',
    'document',
    'name',
    'location',
    'history',
    'customElements',
    'locationbar',
    'menubar',
    'personalbar',
    'scrollbars',
    'statusbar',
    'toolbar',
    'status',
    'close',
    'closed',
    'stop',
    'focus',
    'blur',
    'frames',
    'length',
    'top',
    'opener',
    'parent',
    'frameElement',
    'open',
    'navigator',
    'applicationCache',
    'alert',
    'confirm',
    'prompt',
    'print',
    'postMessage',
    'console'
  ];
  objects.forEach((o) => windowprops.add(o));
  names = names.filter((e) => !windowprops.has(e));
  output('window', arr.concat(objects));
}

//https://html.spec.whatwg.org/
{
  let interfaces = new Set();
  objects = [
    'ApplicationCache',
    'AudioTrack',
    'AudioTrackList',
    'BarProp',
    'BeforeUnloadEvent',
    'BroadcastChannel',
    'CanvasGradient',
    'CanvasPattern',
    'CanvasRenderingContext2D',
    'CloseEvent',
    'CustomElementRegistry',
    'DOMStringList',
    'DOMStringMap',
    'DataTransfer',
    'DataTransferItem',
    'DataTransferItemList',
    'DedicatedWorkerGlobalScope',
    'Document',
    'DragEvent',
    'ErrorEvent',
    'EventSource',
    'External',
    'FormDataEvent',
    'HTMLAllCollection',
    'HashChangeEvent',
    'History',
    'ImageBitmap',
    'ImageBitmapRenderingContext',
    'ImageData',
    'Location',
    'MediaError',
    'MessageChannel',
    'MessageEvent',
    'MessagePort',
    'MimeType',
    'MimeTypeArray',
    'Navigator',
    'OffscreenCanvas',
    'OffscreenCanvasRenderingContext2D',
    'PageTransitionEvent',
    'Path2D',
    'Plugin',
    'PluginArray',
    'PopStateEvent',
    'PromiseRejectionEvent',
    'RadioNodeList',
    'SharedWorker',
    'SharedWorkerGlobalScope',
    'Storage',
    'StorageEvent',
    'TextMetrics',
    'TextTrack',
    'TextTrackCue',
    'TextTrackCueList',
    'TextTrackList',
    'TimeRanges',
    'TrackEvent',
    'ValidityState',
    'VideoTrack',
    'VideoTrackList',
    'WebSocket',
    'Window',
    'Worker',
    'WorkerGlobalScope',
    'WorkerLocation',
    'WorkerNavigator'
  ];
  objects.forEach((o) => interfaces.add(o));

  names = names.filter((e) => !interfaces.has(e));

  output(
    '<a href="https://html.spec.whatwg.org/" target="_blank" rel="noopener noreferrer">https://html.spec.whatwg.org/</a>',
    objects
  );
}

//http://www.ecma-international.org/ecma-402/5.0/index.html#Title
{
  names = names.filter((e) => e != 'Intl');
  output('ecma-402 Intl', ['Intl']);
}

//https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15
{
  const arr = [
    'WebGLVertexArrayObject',
    'WebGLTransformFeedback',
    'WebGLSync',
    'WebGLSampler',
    'WebGLQuery',
    'WebGL2RenderingContext',
    'WebGLContextEvent',
    'WebGLObject',
    'WebGLBuffer',
    'WebGLFramebuffer',
    'WebGLProgram',
    'WebGLRenderbuffer',
    'WebGLShader',
    'WebGLTexture',
    'WebGLUniformLocation',
    'WebGLActiveInfo',
    'WebGLShaderPrecisionFormat',
    'WebGLRenderingContext'
  ];
  names = filterOut(names, arr);
  output('webgl', arr);
}

//https://www.w3.org/TR/webaudio/
{
  const arr = [
    'AudioContext',
    'AudioNode',
    'AnalyserNode',
    'AudioBuffer',
    'AudioBufferSourceNode',
    'AudioDestinationNode',
    'AudioParam',
    'AudioListener',
    'AudioWorklet',
    'AudioWorkletGlobalScope',
    'AudioWorkletNode',
    'AudioWorkletProcessor',
    'BiquadFilterNode',
    'ChannelMergerNode',
    'ChannelSplitterNode',
    'ConstantSourceNode',
    'ConvolverNode',
    'DelayNode',
    'DynamicsCompressorNode',
    'GainNode',
    'IIRFilterNode',
    'MediaElementAudioSourceNode',
    'MediaStreamAudioSourceNode',
    'MediaStreamTrackAudioSourceNode',
    'MediaStreamAudioDestinationNode',
    'PannerNode',
    'PeriodicWave',
    'OscillatorNode',
    'StereoPannerNode',
    'WaveShaperNode',
    'ScriptProcessorNode',
    'AudioProcessingEvent'
  ];
  names = filterOut(names, arr);
  output('webaudio', arr);
}

//https://encoding.spec.whatwg.org/#dom-textencoder
{
  const arr = ['TextDecoder', 'TextEncoder', 'TextDecoderStream', 'TextEncoderStream'];
  names = filterOut(names, arr);

  output('dom-textencoder', arr);
}

//https://streams.spec.whatwg.org/#blqs-class
{
  const arr = [
    'ReadableStream',
    'ReadableStreamDefaultReader',
    'ReadableStreamBYOBReader',
    'ReadableStreamDefaultController',
    'ReadableByteStreamController',
    'ReadableStreamBYOBRequest',
    'WritableStream',
    'WritableStreamDefaultWriter',
    'WritableStreamDefaultController',
    'TransformStream',
    'TransformStreamDefaultController',
    'ByteLengthQueuingStrategy',
    'CountQueuingStrategy'
  ];
  names = filterOut(names, arr);
  output('blqs-class', arr);
}

//https://wicg.github.io/BackgroundSync/spec/#sync-manager-interface

names = filterOut(names, ['SyncManager']);
output('sync-manager-interface', ['SyncManager']);

// rtc
{
  const arr = [
    'MediaStreamTrackEvent',
    'MediaStreamTrack',
    'MediaStreamEvent',
    'MediaStream',
    'MediaSettingsRange',
    'MediaRecorder',
    'MediaEncryptedEvent',
    'MediaCapabilities',
    'RTCTrackEvent',
    'RTCStatsReport',
    'RTCSessionDescription',
    'RTCSctpTransport',
    'RTCRtpTransceiver',
    'RTCRtpSender',
    'RTCRtpReceiver',
    'RTCPeerConnectionIceEvent',
    'RTCPeerConnectionIceErrorEvent',
    'RTCPeerConnection',
    'RTCIceCandidate',
    'RTCErrorEvent',
    'RTCError',
    'RTCDtlsTransport',
    'RTCDataChannelEvent',
    'RTCDataChannel',
    'RTCDTMFToneChangeEvent',
    'RTCDTMFSender',
    'RTCCertificate',
    'RTCEncodedVideoFrame',
    'RTCEncodedAudioFrame'
  ];
  names = filterOut(names, arr);
  output('WebRTC', arr);
}

// SVG
{
  const arr = [
    'SVGLength',
    'SVGAElement',
    'SVGAltGlyphElement',
    'SVGAngle',
    'SVGAnimateColorElement',
    'SVGAnimateElement',
    'SVGAnimateMotionElement',
    'SVGAnimateTransformElement',
    'SVGAnimatedAngle',
    'SVGAnimatedBoolean',
    'SVGAnimatedEnumeration',
    'SVGAnimatedInteger',
    'SVGAnimatedLength',
    'SVGAnimatedLengthList',
    'SVGAnimatedNumber',
    'SVGAnimatedNumberList',
    'SVGAnimatedPathData',
    'SVGAnimatedPoints',
    'SVGAnimatedPreserveAspectRatio',
    'SVGAnimatedRect',
    'SVGAnimatedString',
    'SVGAnimatedTransformList',
    'SVGAnimationElement',
    'SVGCircleElement',
    'SVGClipPathElement',
    'SVGComponentTransferFunctionElement',
    'SVGCursorElement',
    'SVGDefsElement',
    'SVGDescElement',
    'SVGDocument',
    'SVGElement',
    'SVGEllipseElement',
    'SVGFEBlendElement',
    'SVGFEColorMatrixElement',
    'SVGFEComponentTransferElement',
    'SVGFECompositeElement',
    'SVGFEConvolveMatrixElement',
    'SVGFEDiffuseLightingElement',
    'SVGFEDisplacementMapElement',
    'SVGFEDistantLightElement',
    'SVGFEDropShadowElement',
    'SVGFEFloodElement',
    'SVGFEFuncAElement',
    'SVGFEFuncBElement',
    'SVGFEFuncGElement',
    'SVGFEFuncRElement',
    'SVGFEGaussianBlurElement',
    'SVGFEImageElement',
    'SVGFEMergeElement',
    'SVGFEMergeNodeElement',
    'SVGFEMorphologyElement',
    'SVGFEOffsetElement',
    'SVGFEPointLightElement',
    'SVGFESpecularLightingElement',
    'SVGFESpotLightElement',
    'SVGFETileElement',
    'SVGFETurbulenceElement',
    'SVGFilterElement',
    'SVGFilterPrimitiveStandardAttributes',
    'SVGFitToViewBox',
    'SVGFontElement',
    'SVGFontFaceElement',
    'SVGFontFaceFormatElement',
    'SVGFontFaceNameElement',
    'SVGFontFaceSrcElement',
    'SVGFontFaceUriElement',
    'SVGForeignObjectElement',
    'SVGGElement',
    'SVGGlyphElement',
    'SVGGradientElement',
    'SVGGraphicsElement',
    'SVGHKernElement',
    'SVGImageElement',
    'SVGLengthList',
    'SVGLineElement',
    'SVGLinearGradientElement',
    'SVGMPathElement',
    'SVGMarkerElement',
    'SVGMaskElement',
    'SVGMatrix',
    'SVGMetadataElement',
    'SVGMissingGlyphElement',
    'SVGNumber',
    'SVGNumberList',
    'SVGPathElement',
    'SVGPathSeg',
    'SVGPathSegArcAbs',
    'SVGPathSegArcRel',
    'SVGPathSegClosePath',
    'SVGPathSegCurvetoCubicAbs',
    'SVGPathSegCurvetoCubicRel',
    'SVGPathSegCurvetoCubicSmoothAbs',
    'SVGPathSegCurvetoCubicSmoothRel',
    'SVGPathSegCurvetoQuadraticAbs',
    'SVGPathSegCurvetoQuadraticRel',
    'SVGPathSegCurvetoQuadraticSmoothAbs',
    'SVGPathSegCurvetoQuadraticSmoothRel',
    'SVGPathSegLinetoAbs',
    'SVGPathSegLinetoHorizontalAbs',
    'SVGPathSegLinetoHorizontalRel',
    'SVGPathSegLinetoRel',
    'SVGPathSegLinetoVerticalAbs',
    'SVGPathSegLinetoVerticalRel',
    'SVGPathSegList',
    'SVGPathSegMovetoAbs',
    'SVGPathSegMovetoRel',
    'SVGPatternElement',
    'SVGPoint',
    'SVGPointList',
    'SVGPolygonElement',
    'SVGPolylineElement',
    'SVGPreserveAspectRatio',
    'SVGRadialGradientElement',
    'SVGRect',
    'SVGRectElement',
    'SVGSVGElement',
    'SVGScriptElement',
    'SVGSetElement',
    'SVGStopElement',
    'SVGStringList',
    'SVGStylable',
    'SVGStyleElement',
    'SVGSwitchElement',
    'SVGSymbolElement',
    'SVGTRefElement',
    'SVGTSpanElement',
    'SVGTests',
    'SVGTextContentElement',
    'SVGTextElement',
    'SVGTextPathElement',
    'SVGTextPositioningElement',
    'SVGTitleElement',
    'SVGTransform',
    'SVGTransformList',
    'SVGTransformable',
    'SVGURIReference',
    'SVGUnitTypes',
    'SVGUseElement',
    'SVGVKernElement',
    'SVGViewElement',
    'SVGZoomAndPan',
    'SVGZoomEvent',
    'TimeEvent'
  ];
  names = filterOut(names, arr);
  output('SVG', arr);
}

// css
{
  const arr = [
    'CSSVariableReferenceValue',
    'CSSUnparsedValue',
    'CSSUnitValue',
    'CSSTranslate',
    'CSSTransformValue',
    'CSSTransformComponent',
    'CSSSupportsRule',
    'CSSStyleValue',
    'CSSStyleSheet',
    'CSSStyleRule',
    'CSSStyleDeclaration',
    'CSSSkewY',
    'CSSSkewX',
    'CSSSkew',
    'CSSScale',
    'CSSRuleList',
    'CSSRule',
    'CSSRotate',
    'CSSPositionValue',
    'CSSPerspective',
    'CSSPageRule',
    'CSSNumericValue',
    'CSSNumericArray',
    'CSSNamespaceRule',
    'CSSMediaRule',
    'CSSMatrixComponent',
    'CSSMathValue',
    'CSSMathSum',
    'CSSMathProduct',
    'CSSMathNegate',
    'CSSMathMin',
    'CSSMathMax',
    'CSSMathInvert',
    'CSSKeywordValue',
    'CSSKeyframesRule',
    'CSSKeyframeRule',
    'CSSImportRule',
    'CSSImageValue',
    'CSSGroupingRule',
    'CSSFontFaceRule',
    'CSSConditionRule',
    'CSS',
    'CSSAnimation',
    'CSSTransition',
    'getComputedStyle',
    'matchMedia',
    'MediaQueryListEvent',
    'MediaQueryList',
    'MediaList',
    'StyleSheetList',
    'StyleSheet',
    'StylePropertyMapReadOnly',
    'StylePropertyMap',
    'TransitionEvent',
    'KeyframeEffect',
    'Animation',
    'AnimationEffect',
    'AnimationPlaybackEvent',
    'DocumentTimeline',
    'AnimationTimeline'
  ];
  names = filterOut(names, arr);
  output('css', arr);
}

// Payment   https://w3c.github.io/payment-request/#introduction
{
  const arr = ['PaymentRequest', 'PaymentAddress', 'PaymentRequest', 'PaymentResponse', 'PaymentMethodChangeEvent'];
  names = filterOut(names, arr);
  output('Payment Request API', arr);
}

// presentation https://w3c.github.io/presentation-api/#interface-presentation
{
  const arr = [
    'Presentation',
    'PresentationAvailability',
    'PresentationConnection',
    'PresentationConnectionAvailableEvent',
    'PresentationConnectionCloseEvent',
    'PresentationConnectionList',
    'PresentationReceiver',
    'PresentationRequest'
  ];
  names = filterOut(names, arr);
  output('Presentation', arr);
}

// XHR
{
  const arr = ['XMLHttpRequestUpload', 'XMLHttpRequestEventTarget', 'XMLHttpRequest', 'FormData', 'ProgressEvent'];
  names = filterOut(names, arr);
  output('XHR', arr);
}

// fetch
{
  const arr = ['fetch', 'Request', 'Response', 'Headers'];
  names = filterOut(names, arr);
  output('fetch', arr);
}

// streams
{
  const arr = [
    'ReadableStream',
    'ReadableStreamDefaultReader',
    'WritableStream',
    'WritableStreamDefaultWriter',
    'CountQueuingStrategy',
    'ByteLengthQueuingStrategy'
  ];
  names = filterOut(names, arr);
  output('streams', arr);
}

// window screen
{
  const arr = [
    'moveTo',
    'moveBy',
    'resizeTo',
    'resizeBy',
    'scroll',
    'scrollTo',
    'scrollBy',
    'scrollX',
    'scrollY',
    'screenX',
    'screenY',
    'innerHeight',
    'innerWidth',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    'devicePixelRatio',
    'screenLeft',
    'screenTop'
  ];
  names = filterOut(names, arr);
  output('window screen', arr);
}

// URL
{
  const arr = ['URL', 'URLSearchParams'];
  names = filterOut(names, arr);
  output('URL', arr);
}

// // 
// {
//   const arr = [];
//   names = filterOut(names, arr);
//   output('', arr);
// }

console.log(names.length);
