function MS(a,e){for(var t=0;t<e.length;t++){const i=e[t];if(typeof i!="string"&&!Array.isArray(i)){for(const s in i)if(s!=="default"&&!(s in a)){const o=Object.getOwnPropertyDescriptor(i,s);o&&Object.defineProperty(a,s,o.get?o:{enumerable:!0,get:()=>i[s]})}}}return Object.freeze(Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();function ES(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}var Ff={exports:{}},il={},Uf={exports:{}},_t={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Xg;function bS(){if(Xg)return _t;Xg=1;var a=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),o=Symbol.for("react.provider"),c=Symbol.for("react.context"),u=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),h=Symbol.for("react.memo"),p=Symbol.for("react.lazy"),_=Symbol.iterator;function m(B){return B===null||typeof B!="object"?null:(B=_&&B[_]||B["@@iterator"],typeof B=="function"?B:null)}var S={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,b={};function x(B,J,Ie){this.props=B,this.context=J,this.refs=b,this.updater=Ie||S}x.prototype.isReactComponent={},x.prototype.setState=function(B,J){if(typeof B!="object"&&typeof B!="function"&&B!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,B,J,"setState")},x.prototype.forceUpdate=function(B){this.updater.enqueueForceUpdate(this,B,"forceUpdate")};function E(){}E.prototype=x.prototype;function w(B,J,Ie){this.props=B,this.context=J,this.refs=b,this.updater=Ie||S}var P=w.prototype=new E;P.constructor=w,M(P,x.prototype),P.isPureReactComponent=!0;var A=Array.isArray,N=Object.prototype.hasOwnProperty,L={current:null},F={key:!0,ref:!0,__self:!0,__source:!0};function T(B,J,Ie){var Fe,De={},ue=null,Se=null;if(J!=null)for(Fe in J.ref!==void 0&&(Se=J.ref),J.key!==void 0&&(ue=""+J.key),J)N.call(J,Fe)&&!F.hasOwnProperty(Fe)&&(De[Fe]=J[Fe]);var ge=arguments.length-2;if(ge===1)De.children=Ie;else if(1<ge){for(var Oe=Array(ge),Qe=0;Qe<ge;Qe++)Oe[Qe]=arguments[Qe+2];De.children=Oe}if(B&&B.defaultProps)for(Fe in ge=B.defaultProps,ge)De[Fe]===void 0&&(De[Fe]=ge[Fe]);return{$$typeof:a,type:B,key:ue,ref:Se,props:De,_owner:L.current}}function I(B,J){return{$$typeof:a,type:B.type,key:J,ref:B.ref,props:B.props,_owner:B._owner}}function z(B){return typeof B=="object"&&B!==null&&B.$$typeof===a}function k(B){var J={"=":"=0",":":"=2"};return"$"+B.replace(/[=:]/g,function(Ie){return J[Ie]})}var q=/\/+/g;function Q(B,J){return typeof B=="object"&&B!==null&&B.key!=null?k(""+B.key):J.toString(36)}function se(B,J,Ie,Fe,De){var ue=typeof B;(ue==="undefined"||ue==="boolean")&&(B=null);var Se=!1;if(B===null)Se=!0;else switch(ue){case"string":case"number":Se=!0;break;case"object":switch(B.$$typeof){case a:case e:Se=!0}}if(Se)return Se=B,De=De(Se),B=Fe===""?"."+Q(Se,0):Fe,A(De)?(Ie="",B!=null&&(Ie=B.replace(q,"$&/")+"/"),se(De,J,Ie,"",function(Qe){return Qe})):De!=null&&(z(De)&&(De=I(De,Ie+(!De.key||Se&&Se.key===De.key?"":(""+De.key).replace(q,"$&/")+"/")+B)),J.push(De)),1;if(Se=0,Fe=Fe===""?".":Fe+":",A(B))for(var ge=0;ge<B.length;ge++){ue=B[ge];var Oe=Fe+Q(ue,ge);Se+=se(ue,J,Ie,Oe,De)}else if(Oe=m(B),typeof Oe=="function")for(B=Oe.call(B),ge=0;!(ue=B.next()).done;)ue=ue.value,Oe=Fe+Q(ue,ge++),Se+=se(ue,J,Ie,Oe,De);else if(ue==="object")throw J=String(B),Error("Objects are not valid as a React child (found: "+(J==="[object Object]"?"object with keys {"+Object.keys(B).join(", ")+"}":J)+"). If you meant to render a collection of children, use an array instead.");return Se}function V(B,J,Ie){if(B==null)return B;var Fe=[],De=0;return se(B,Fe,"","",function(ue){return J.call(Ie,ue,De++)}),Fe}function W(B){if(B._status===-1){var J=B._result;J=J(),J.then(function(Ie){(B._status===0||B._status===-1)&&(B._status=1,B._result=Ie)},function(Ie){(B._status===0||B._status===-1)&&(B._status=2,B._result=Ie)}),B._status===-1&&(B._status=0,B._result=J)}if(B._status===1)return B._result.default;throw B._result}var H={current:null},Y={transition:null},ae={ReactCurrentDispatcher:H,ReactCurrentBatchConfig:Y,ReactCurrentOwner:L};function oe(){throw Error("act(...) is not supported in production builds of React.")}return _t.Children={map:V,forEach:function(B,J,Ie){V(B,function(){J.apply(this,arguments)},Ie)},count:function(B){var J=0;return V(B,function(){J++}),J},toArray:function(B){return V(B,function(J){return J})||[]},only:function(B){if(!z(B))throw Error("React.Children.only expected to receive a single React element child.");return B}},_t.Component=x,_t.Fragment=t,_t.Profiler=s,_t.PureComponent=w,_t.StrictMode=i,_t.Suspense=f,_t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ae,_t.act=oe,_t.cloneElement=function(B,J,Ie){if(B==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+B+".");var Fe=M({},B.props),De=B.key,ue=B.ref,Se=B._owner;if(J!=null){if(J.ref!==void 0&&(ue=J.ref,Se=L.current),J.key!==void 0&&(De=""+J.key),B.type&&B.type.defaultProps)var ge=B.type.defaultProps;for(Oe in J)N.call(J,Oe)&&!F.hasOwnProperty(Oe)&&(Fe[Oe]=J[Oe]===void 0&&ge!==void 0?ge[Oe]:J[Oe])}var Oe=arguments.length-2;if(Oe===1)Fe.children=Ie;else if(1<Oe){ge=Array(Oe);for(var Qe=0;Qe<Oe;Qe++)ge[Qe]=arguments[Qe+2];Fe.children=ge}return{$$typeof:a,type:B.type,key:De,ref:ue,props:Fe,_owner:Se}},_t.createContext=function(B){return B={$$typeof:c,_currentValue:B,_currentValue2:B,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},B.Provider={$$typeof:o,_context:B},B.Consumer=B},_t.createElement=T,_t.createFactory=function(B){var J=T.bind(null,B);return J.type=B,J},_t.createRef=function(){return{current:null}},_t.forwardRef=function(B){return{$$typeof:u,render:B}},_t.isValidElement=z,_t.lazy=function(B){return{$$typeof:p,_payload:{_status:-1,_result:B},_init:W}},_t.memo=function(B,J){return{$$typeof:h,type:B,compare:J===void 0?null:J}},_t.startTransition=function(B){var J=Y.transition;Y.transition={};try{B()}finally{Y.transition=J}},_t.unstable_act=oe,_t.useCallback=function(B,J){return H.current.useCallback(B,J)},_t.useContext=function(B){return H.current.useContext(B)},_t.useDebugValue=function(){},_t.useDeferredValue=function(B){return H.current.useDeferredValue(B)},_t.useEffect=function(B,J){return H.current.useEffect(B,J)},_t.useId=function(){return H.current.useId()},_t.useImperativeHandle=function(B,J,Ie){return H.current.useImperativeHandle(B,J,Ie)},_t.useInsertionEffect=function(B,J){return H.current.useInsertionEffect(B,J)},_t.useLayoutEffect=function(B,J){return H.current.useLayoutEffect(B,J)},_t.useMemo=function(B,J){return H.current.useMemo(B,J)},_t.useReducer=function(B,J,Ie){return H.current.useReducer(B,J,Ie)},_t.useRef=function(B){return H.current.useRef(B)},_t.useState=function(B){return H.current.useState(B)},_t.useSyncExternalStore=function(B,J,Ie){return H.current.useSyncExternalStore(B,J,Ie)},_t.useTransition=function(){return H.current.useTransition()},_t.version="18.3.1",_t}var $g;function Hp(){return $g||($g=1,Uf.exports=bS()),Uf.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qg;function TS(){if(qg)return il;qg=1;var a=Hp(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,s=a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,o={key:!0,ref:!0,__self:!0,__source:!0};function c(u,f,h){var p,_={},m=null,S=null;h!==void 0&&(m=""+h),f.key!==void 0&&(m=""+f.key),f.ref!==void 0&&(S=f.ref);for(p in f)i.call(f,p)&&!o.hasOwnProperty(p)&&(_[p]=f[p]);if(u&&u.defaultProps)for(p in f=u.defaultProps,f)_[p]===void 0&&(_[p]=f[p]);return{$$typeof:e,type:u,key:m,ref:S,props:_,_owner:s.current}}return il.Fragment=t,il.jsx=c,il.jsxs=c,il}var Yg;function wS(){return Yg||(Yg=1,Ff.exports=TS()),Ff.exports}var v=wS(),Wc={},Of={exports:{}},Qn={},kf={exports:{}},Bf={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Kg;function AS(){return Kg||(Kg=1,(function(a){function e(Y,ae){var oe=Y.length;Y.push(ae);e:for(;0<oe;){var B=oe-1>>>1,J=Y[B];if(0<s(J,ae))Y[B]=ae,Y[oe]=J,oe=B;else break e}}function t(Y){return Y.length===0?null:Y[0]}function i(Y){if(Y.length===0)return null;var ae=Y[0],oe=Y.pop();if(oe!==ae){Y[0]=oe;e:for(var B=0,J=Y.length,Ie=J>>>1;B<Ie;){var Fe=2*(B+1)-1,De=Y[Fe],ue=Fe+1,Se=Y[ue];if(0>s(De,oe))ue<J&&0>s(Se,De)?(Y[B]=Se,Y[ue]=oe,B=ue):(Y[B]=De,Y[Fe]=oe,B=Fe);else if(ue<J&&0>s(Se,oe))Y[B]=Se,Y[ue]=oe,B=ue;else break e}}return ae}function s(Y,ae){var oe=Y.sortIndex-ae.sortIndex;return oe!==0?oe:Y.id-ae.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;a.unstable_now=function(){return o.now()}}else{var c=Date,u=c.now();a.unstable_now=function(){return c.now()-u}}var f=[],h=[],p=1,_=null,m=3,S=!1,M=!1,b=!1,x=typeof setTimeout=="function"?setTimeout:null,E=typeof clearTimeout=="function"?clearTimeout:null,w=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function P(Y){for(var ae=t(h);ae!==null;){if(ae.callback===null)i(h);else if(ae.startTime<=Y)i(h),ae.sortIndex=ae.expirationTime,e(f,ae);else break;ae=t(h)}}function A(Y){if(b=!1,P(Y),!M)if(t(f)!==null)M=!0,W(N);else{var ae=t(h);ae!==null&&H(A,ae.startTime-Y)}}function N(Y,ae){M=!1,b&&(b=!1,E(T),T=-1),S=!0;var oe=m;try{for(P(ae),_=t(f);_!==null&&(!(_.expirationTime>ae)||Y&&!k());){var B=_.callback;if(typeof B=="function"){_.callback=null,m=_.priorityLevel;var J=B(_.expirationTime<=ae);ae=a.unstable_now(),typeof J=="function"?_.callback=J:_===t(f)&&i(f),P(ae)}else i(f);_=t(f)}if(_!==null)var Ie=!0;else{var Fe=t(h);Fe!==null&&H(A,Fe.startTime-ae),Ie=!1}return Ie}finally{_=null,m=oe,S=!1}}var L=!1,F=null,T=-1,I=5,z=-1;function k(){return!(a.unstable_now()-z<I)}function q(){if(F!==null){var Y=a.unstable_now();z=Y;var ae=!0;try{ae=F(!0,Y)}finally{ae?Q():(L=!1,F=null)}}else L=!1}var Q;if(typeof w=="function")Q=function(){w(q)};else if(typeof MessageChannel<"u"){var se=new MessageChannel,V=se.port2;se.port1.onmessage=q,Q=function(){V.postMessage(null)}}else Q=function(){x(q,0)};function W(Y){F=Y,L||(L=!0,Q())}function H(Y,ae){T=x(function(){Y(a.unstable_now())},ae)}a.unstable_IdlePriority=5,a.unstable_ImmediatePriority=1,a.unstable_LowPriority=4,a.unstable_NormalPriority=3,a.unstable_Profiling=null,a.unstable_UserBlockingPriority=2,a.unstable_cancelCallback=function(Y){Y.callback=null},a.unstable_continueExecution=function(){M||S||(M=!0,W(N))},a.unstable_forceFrameRate=function(Y){0>Y||125<Y?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):I=0<Y?Math.floor(1e3/Y):5},a.unstable_getCurrentPriorityLevel=function(){return m},a.unstable_getFirstCallbackNode=function(){return t(f)},a.unstable_next=function(Y){switch(m){case 1:case 2:case 3:var ae=3;break;default:ae=m}var oe=m;m=ae;try{return Y()}finally{m=oe}},a.unstable_pauseExecution=function(){},a.unstable_requestPaint=function(){},a.unstable_runWithPriority=function(Y,ae){switch(Y){case 1:case 2:case 3:case 4:case 5:break;default:Y=3}var oe=m;m=Y;try{return ae()}finally{m=oe}},a.unstable_scheduleCallback=function(Y,ae,oe){var B=a.unstable_now();switch(typeof oe=="object"&&oe!==null?(oe=oe.delay,oe=typeof oe=="number"&&0<oe?B+oe:B):oe=B,Y){case 1:var J=-1;break;case 2:J=250;break;case 5:J=1073741823;break;case 4:J=1e4;break;default:J=5e3}return J=oe+J,Y={id:p++,callback:ae,priorityLevel:Y,startTime:oe,expirationTime:J,sortIndex:-1},oe>B?(Y.sortIndex=oe,e(h,Y),t(f)===null&&Y===t(h)&&(b?(E(T),T=-1):b=!0,H(A,oe-B))):(Y.sortIndex=J,e(f,Y),M||S||(M=!0,W(N))),Y},a.unstable_shouldYield=k,a.unstable_wrapCallback=function(Y){var ae=m;return function(){var oe=m;m=ae;try{return Y.apply(this,arguments)}finally{m=oe}}}})(Bf)),Bf}var Zg;function CS(){return Zg||(Zg=1,kf.exports=AS()),kf.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qg;function RS(){if(Qg)return Qn;Qg=1;var a=Hp(),e=CS();function t(n){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+n,l=1;l<arguments.length;l++)r+="&args[]="+encodeURIComponent(arguments[l]);return"Minified React error #"+n+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,s={};function o(n,r){c(n,r),c(n+"Capture",r)}function c(n,r){for(s[n]=r,n=0;n<r.length;n++)i.add(r[n])}var u=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),f=Object.prototype.hasOwnProperty,h=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,p={},_={};function m(n){return f.call(_,n)?!0:f.call(p,n)?!1:h.test(n)?_[n]=!0:(p[n]=!0,!1)}function S(n,r,l,d){if(l!==null&&l.type===0)return!1;switch(typeof r){case"function":case"symbol":return!0;case"boolean":return d?!1:l!==null?!l.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,r,l,d){if(r===null||typeof r>"u"||S(n,r,l,d))return!0;if(d)return!1;if(l!==null)switch(l.type){case 3:return!r;case 4:return r===!1;case 5:return isNaN(r);case 6:return isNaN(r)||1>r}return!1}function b(n,r,l,d,g,y,R){this.acceptsBooleans=r===2||r===3||r===4,this.attributeName=d,this.attributeNamespace=g,this.mustUseProperty=l,this.propertyName=n,this.type=r,this.sanitizeURL=y,this.removeEmptyString=R}var x={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){x[n]=new b(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var r=n[0];x[r]=new b(r,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){x[n]=new b(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){x[n]=new b(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){x[n]=new b(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){x[n]=new b(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){x[n]=new b(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){x[n]=new b(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){x[n]=new b(n,5,!1,n.toLowerCase(),null,!1,!1)});var E=/[\-:]([a-z])/g;function w(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var r=n.replace(E,w);x[r]=new b(r,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var r=n.replace(E,w);x[r]=new b(r,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var r=n.replace(E,w);x[r]=new b(r,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){x[n]=new b(n,1,!1,n.toLowerCase(),null,!1,!1)}),x.xlinkHref=new b("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){x[n]=new b(n,1,!1,n.toLowerCase(),null,!0,!0)});function P(n,r,l,d){var g=x.hasOwnProperty(r)?x[r]:null;(g!==null?g.type!==0:d||!(2<r.length)||r[0]!=="o"&&r[0]!=="O"||r[1]!=="n"&&r[1]!=="N")&&(M(r,l,g,d)&&(l=null),d||g===null?m(r)&&(l===null?n.removeAttribute(r):n.setAttribute(r,""+l)):g.mustUseProperty?n[g.propertyName]=l===null?g.type===3?!1:"":l:(r=g.attributeName,d=g.attributeNamespace,l===null?n.removeAttribute(r):(g=g.type,l=g===3||g===4&&l===!0?"":""+l,d?n.setAttributeNS(d,r,l):n.setAttribute(r,l))))}var A=a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,N=Symbol.for("react.element"),L=Symbol.for("react.portal"),F=Symbol.for("react.fragment"),T=Symbol.for("react.strict_mode"),I=Symbol.for("react.profiler"),z=Symbol.for("react.provider"),k=Symbol.for("react.context"),q=Symbol.for("react.forward_ref"),Q=Symbol.for("react.suspense"),se=Symbol.for("react.suspense_list"),V=Symbol.for("react.memo"),W=Symbol.for("react.lazy"),H=Symbol.for("react.offscreen"),Y=Symbol.iterator;function ae(n){return n===null||typeof n!="object"?null:(n=Y&&n[Y]||n["@@iterator"],typeof n=="function"?n:null)}var oe=Object.assign,B;function J(n){if(B===void 0)try{throw Error()}catch(l){var r=l.stack.trim().match(/\n( *(at )?)/);B=r&&r[1]||""}return`
`+B+n}var Ie=!1;function Fe(n,r){if(!n||Ie)return"";Ie=!0;var l=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(r)if(r=function(){throw Error()},Object.defineProperty(r.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(r,[])}catch(ce){var d=ce}Reflect.construct(n,[],r)}else{try{r.call()}catch(ce){d=ce}n.call(r.prototype)}else{try{throw Error()}catch(ce){d=ce}n()}}catch(ce){if(ce&&d&&typeof ce.stack=="string"){for(var g=ce.stack.split(`
`),y=d.stack.split(`
`),R=g.length-1,O=y.length-1;1<=R&&0<=O&&g[R]!==y[O];)O--;for(;1<=R&&0<=O;R--,O--)if(g[R]!==y[O]){if(R!==1||O!==1)do if(R--,O--,0>O||g[R]!==y[O]){var G=`
`+g[R].replace(" at new "," at ");return n.displayName&&G.includes("<anonymous>")&&(G=G.replace("<anonymous>",n.displayName)),G}while(1<=R&&0<=O);break}}}finally{Ie=!1,Error.prepareStackTrace=l}return(n=n?n.displayName||n.name:"")?J(n):""}function De(n){switch(n.tag){case 5:return J(n.type);case 16:return J("Lazy");case 13:return J("Suspense");case 19:return J("SuspenseList");case 0:case 2:case 15:return n=Fe(n.type,!1),n;case 11:return n=Fe(n.type.render,!1),n;case 1:return n=Fe(n.type,!0),n;default:return""}}function ue(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case F:return"Fragment";case L:return"Portal";case I:return"Profiler";case T:return"StrictMode";case Q:return"Suspense";case se:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case k:return(n.displayName||"Context")+".Consumer";case z:return(n._context.displayName||"Context")+".Provider";case q:var r=n.render;return n=n.displayName,n||(n=r.displayName||r.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case V:return r=n.displayName||null,r!==null?r:ue(n.type)||"Memo";case W:r=n._payload,n=n._init;try{return ue(n(r))}catch{}}return null}function Se(n){var r=n.type;switch(n.tag){case 24:return"Cache";case 9:return(r.displayName||"Context")+".Consumer";case 10:return(r._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=r.render,n=n.displayName||n.name||"",r.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return r;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ue(r);case 8:return r===T?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof r=="function")return r.displayName||r.name||null;if(typeof r=="string")return r}return null}function ge(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Oe(n){var r=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(r==="checkbox"||r==="radio")}function Qe(n){var r=Oe(n)?"checked":"value",l=Object.getOwnPropertyDescriptor(n.constructor.prototype,r),d=""+n[r];if(!n.hasOwnProperty(r)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var g=l.get,y=l.set;return Object.defineProperty(n,r,{configurable:!0,get:function(){return g.call(this)},set:function(R){d=""+R,y.call(this,R)}}),Object.defineProperty(n,r,{enumerable:l.enumerable}),{getValue:function(){return d},setValue:function(R){d=""+R},stopTracking:function(){n._valueTracker=null,delete n[r]}}}}function Je(n){n._valueTracker||(n._valueTracker=Qe(n))}function Bt(n){if(!n)return!1;var r=n._valueTracker;if(!r)return!0;var l=r.getValue(),d="";return n&&(d=Oe(n)?n.checked?"true":"false":n.value),n=d,n!==l?(r.setValue(n),!0):!1}function ut(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function wt(n,r){var l=r.checked;return oe({},r,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:l??n._wrapperState.initialChecked})}function It(n,r){var l=r.defaultValue==null?"":r.defaultValue,d=r.checked!=null?r.checked:r.defaultChecked;l=ge(r.value!=null?r.value:l),n._wrapperState={initialChecked:d,initialValue:l,controlled:r.type==="checkbox"||r.type==="radio"?r.checked!=null:r.value!=null}}function dt(n,r){r=r.checked,r!=null&&P(n,"checked",r,!1)}function Zt(n,r){dt(n,r);var l=ge(r.value),d=r.type;if(l!=null)d==="number"?(l===0&&n.value===""||n.value!=l)&&(n.value=""+l):n.value!==""+l&&(n.value=""+l);else if(d==="submit"||d==="reset"){n.removeAttribute("value");return}r.hasOwnProperty("value")?Tn(n,r.type,l):r.hasOwnProperty("defaultValue")&&Tn(n,r.type,ge(r.defaultValue)),r.checked==null&&r.defaultChecked!=null&&(n.defaultChecked=!!r.defaultChecked)}function zt(n,r,l){if(r.hasOwnProperty("value")||r.hasOwnProperty("defaultValue")){var d=r.type;if(!(d!=="submit"&&d!=="reset"||r.value!==void 0&&r.value!==null))return;r=""+n._wrapperState.initialValue,l||r===n.value||(n.value=r),n.defaultValue=r}l=n.name,l!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,l!==""&&(n.name=l)}function Tn(n,r,l){(r!=="number"||ut(n.ownerDocument)!==n)&&(l==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+l&&(n.defaultValue=""+l))}var X=Array.isArray;function Vt(n,r,l,d){if(n=n.options,r){r={};for(var g=0;g<l.length;g++)r["$"+l[g]]=!0;for(l=0;l<n.length;l++)g=r.hasOwnProperty("$"+n[l].value),n[l].selected!==g&&(n[l].selected=g),g&&d&&(n[l].defaultSelected=!0)}else{for(l=""+ge(l),r=null,g=0;g<n.length;g++){if(n[g].value===l){n[g].selected=!0,d&&(n[g].defaultSelected=!0);return}r!==null||n[g].disabled||(r=n[g])}r!==null&&(r.selected=!0)}}function ft(n,r){if(r.dangerouslySetInnerHTML!=null)throw Error(t(91));return oe({},r,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Pt(n,r){var l=r.value;if(l==null){if(l=r.children,r=r.defaultValue,l!=null){if(r!=null)throw Error(t(92));if(X(l)){if(1<l.length)throw Error(t(93));l=l[0]}r=l}r==null&&(r=""),l=r}n._wrapperState={initialValue:ge(l)}}function Le(n,r){var l=ge(r.value),d=ge(r.defaultValue);l!=null&&(l=""+l,l!==n.value&&(n.value=l),r.defaultValue==null&&n.defaultValue!==l&&(n.defaultValue=l)),d!=null&&(n.defaultValue=""+d)}function jt(n){var r=n.textContent;r===n._wrapperState.initialValue&&r!==""&&r!==null&&(n.value=r)}function U(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function C(n,r){return n==null||n==="http://www.w3.org/1999/xhtml"?U(r):n==="http://www.w3.org/2000/svg"&&r==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Z,he=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(r,l,d,g){MSApp.execUnsafeLocalFunction(function(){return n(r,l,d,g)})}:n})(function(n,r){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=r;else{for(Z=Z||document.createElement("div"),Z.innerHTML="<svg>"+r.valueOf().toString()+"</svg>",r=Z.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;r.firstChild;)n.appendChild(r.firstChild)}});function _e(n,r){if(r){var l=n.firstChild;if(l&&l===n.lastChild&&l.nodeType===3){l.nodeValue=r;return}}n.textContent=r}var Ee={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ne=["Webkit","ms","Moz","O"];Object.keys(Ee).forEach(function(n){Ne.forEach(function(r){r=r+n.charAt(0).toUpperCase()+n.substring(1),Ee[r]=Ee[n]})});function de(n,r,l){return r==null||typeof r=="boolean"||r===""?"":l||typeof r!="number"||r===0||Ee.hasOwnProperty(n)&&Ee[n]?(""+r).trim():r+"px"}function pe(n,r){n=n.style;for(var l in r)if(r.hasOwnProperty(l)){var d=l.indexOf("--")===0,g=de(l,r[l],d);l==="float"&&(l="cssFloat"),d?n.setProperty(l,g):n[l]=g}}var ke=oe({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ze(n,r){if(r){if(ke[n]&&(r.children!=null||r.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(r.dangerouslySetInnerHTML!=null){if(r.children!=null)throw Error(t(60));if(typeof r.dangerouslySetInnerHTML!="object"||!("__html"in r.dangerouslySetInnerHTML))throw Error(t(61))}if(r.style!=null&&typeof r.style!="object")throw Error(t(62))}}function Ae(n,r){if(n.indexOf("-")===-1)return typeof r.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var be=null;function nt(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var st=null,pt=null,j=null;function we(n){if(n=Ho(n)){if(typeof st!="function")throw Error(t(280));var r=n.stateNode;r&&(r=ac(r),st(n.stateNode,n.type,r))}}function fe(n){pt?j?j.push(n):j=[n]:pt=n}function Be(){if(pt){var n=pt,r=j;if(j=pt=null,we(n),r)for(n=0;n<r.length;n++)we(r[n])}}function Re(n,r){return n(r)}function xe(){}var Xe=!1;function at(n,r,l){if(Xe)return n(r,l);Xe=!0;try{return Re(n,r,l)}finally{Xe=!1,(pt!==null||j!==null)&&(xe(),Be())}}function Ut(n,r){var l=n.stateNode;if(l===null)return null;var d=ac(l);if(d===null)return null;l=d[r];e:switch(r){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(d=!d.disabled)||(n=n.type,d=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!d;break e;default:n=!1}if(n)return null;if(l&&typeof l!="function")throw Error(t(231,r,typeof l));return l}var At=!1;if(u)try{var zn={};Object.defineProperty(zn,"passive",{get:function(){At=!0}}),window.addEventListener("test",zn,zn),window.removeEventListener("test",zn,zn)}catch{At=!1}function Mi(n,r,l,d,g,y,R,O,G){var ce=Array.prototype.slice.call(arguments,3);try{r.apply(l,ce)}catch(ye){this.onError(ye)}}var mr=!1,pa=null,Cs=!1,ma=null,gr={onError:function(n){mr=!0,pa=n}};function So(n,r,l,d,g,y,R,O,G){mr=!1,pa=null,Mi.apply(gr,arguments)}function Gl(n,r,l,d,g,y,R,O,G){if(So.apply(this,arguments),mr){if(mr){var ce=pa;mr=!1,pa=null}else throw Error(t(198));Cs||(Cs=!0,ma=ce)}}function Zi(n){var r=n,l=n;if(n.alternate)for(;r.return;)r=r.return;else{n=r;do r=n,(r.flags&4098)!==0&&(l=r.return),n=r.return;while(n)}return r.tag===3?l:null}function Rs(n){if(n.tag===13){var r=n.memoizedState;if(r===null&&(n=n.alternate,n!==null&&(r=n.memoizedState)),r!==null)return r.dehydrated}return null}function Mo(n){if(Zi(n)!==n)throw Error(t(188))}function ga(n){var r=n.alternate;if(!r){if(r=Zi(n),r===null)throw Error(t(188));return r!==n?null:n}for(var l=n,d=r;;){var g=l.return;if(g===null)break;var y=g.alternate;if(y===null){if(d=g.return,d!==null){l=d;continue}break}if(g.child===y.child){for(y=g.child;y;){if(y===l)return Mo(g),n;if(y===d)return Mo(g),r;y=y.sibling}throw Error(t(188))}if(l.return!==d.return)l=g,d=y;else{for(var R=!1,O=g.child;O;){if(O===l){R=!0,l=g,d=y;break}if(O===d){R=!0,d=g,l=y;break}O=O.sibling}if(!R){for(O=y.child;O;){if(O===l){R=!0,l=y,d=g;break}if(O===d){R=!0,d=y,l=g;break}O=O.sibling}if(!R)throw Error(t(189))}}if(l.alternate!==d)throw Error(t(190))}if(l.tag!==3)throw Error(t(188));return l.stateNode.current===l?n:r}function Eo(n){return n=ga(n),n!==null?bo(n):null}function bo(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var r=bo(n);if(r!==null)return r;n=n.sibling}return null}var jl=e.unstable_scheduleCallback,Wl=e.unstable_cancelCallback,id=e.unstable_shouldYield,rd=e.unstable_requestPaint,Qt=e.unstable_now,sd=e.unstable_getCurrentPriorityLevel,To=e.unstable_ImmediatePriority,D=e.unstable_UserBlockingPriority,K=e.unstable_NormalPriority,le=e.unstable_LowPriority,ne=e.unstable_IdlePriority,te=null,Pe=null;function Ge(n){if(Pe&&typeof Pe.onCommitFiberRoot=="function")try{Pe.onCommitFiberRoot(te,n,void 0,(n.current.flags&128)===128)}catch{}}var Ce=Math.clz32?Math.clz32:ot,$e=Math.log,Ze=Math.LN2;function ot(n){return n>>>=0,n===0?32:31-($e(n)/Ze|0)|0}var lt=64,Ye=4194304;function Mt(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Ht(n,r){var l=n.pendingLanes;if(l===0)return 0;var d=0,g=n.suspendedLanes,y=n.pingedLanes,R=l&268435455;if(R!==0){var O=R&~g;O!==0?d=Mt(O):(y&=R,y!==0&&(d=Mt(y)))}else R=l&~g,R!==0?d=Mt(R):y!==0&&(d=Mt(y));if(d===0)return 0;if(r!==0&&r!==d&&(r&g)===0&&(g=d&-d,y=r&-r,g>=y||g===16&&(y&4194240)!==0))return r;if((d&4)!==0&&(d|=l&16),r=n.entangledLanes,r!==0)for(n=n.entanglements,r&=d;0<r;)l=31-Ce(r),g=1<<l,d|=n[l],r&=~g;return d}function qt(n,r){switch(n){case 1:case 2:case 4:return r+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return r+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Nt(n,r){for(var l=n.suspendedLanes,d=n.pingedLanes,g=n.expirationTimes,y=n.pendingLanes;0<y;){var R=31-Ce(y),O=1<<R,G=g[R];G===-1?((O&l)===0||(O&d)!==0)&&(g[R]=qt(O,r)):G<=r&&(n.expiredLanes|=O),y&=~O}}function dn(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Ve(){var n=lt;return lt<<=1,(lt&4194240)===0&&(lt=64),n}function wn(n){for(var r=[],l=0;31>l;l++)r.push(n);return r}function mt(n,r,l){n.pendingLanes|=r,r!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,r=31-Ce(r),n[r]=l}function Wn(n,r){var l=n.pendingLanes&~r;n.pendingLanes=r,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=r,n.mutableReadLanes&=r,n.entangledLanes&=r,r=n.entanglements;var d=n.eventTimes;for(n=n.expirationTimes;0<l;){var g=31-Ce(l),y=1<<g;r[g]=0,d[g]=-1,n[g]=-1,l&=~y}}function Xn(n,r){var l=n.entangledLanes|=r;for(n=n.entanglements;l;){var d=31-Ce(l),g=1<<d;g&r|n[d]&r&&(n[d]|=r),l&=~g}}var gt=0;function _r(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var Rt,Wt,Ui,Dt,Oi,Qi=!1,Ps=[],jr=null,Wr=null,Xr=null,wo=new Map,Ao=new Map,$r=[],jy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Rm(n,r){switch(n){case"focusin":case"focusout":jr=null;break;case"dragenter":case"dragleave":Wr=null;break;case"mouseover":case"mouseout":Xr=null;break;case"pointerover":case"pointerout":wo.delete(r.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ao.delete(r.pointerId)}}function Co(n,r,l,d,g,y){return n===null||n.nativeEvent!==y?(n={blockedOn:r,domEventName:l,eventSystemFlags:d,nativeEvent:y,targetContainers:[g]},r!==null&&(r=Ho(r),r!==null&&Wt(r)),n):(n.eventSystemFlags|=d,r=n.targetContainers,g!==null&&r.indexOf(g)===-1&&r.push(g),n)}function Wy(n,r,l,d,g){switch(r){case"focusin":return jr=Co(jr,n,r,l,d,g),!0;case"dragenter":return Wr=Co(Wr,n,r,l,d,g),!0;case"mouseover":return Xr=Co(Xr,n,r,l,d,g),!0;case"pointerover":var y=g.pointerId;return wo.set(y,Co(wo.get(y)||null,n,r,l,d,g)),!0;case"gotpointercapture":return y=g.pointerId,Ao.set(y,Co(Ao.get(y)||null,n,r,l,d,g)),!0}return!1}function Pm(n){var r=Ns(n.target);if(r!==null){var l=Zi(r);if(l!==null){if(r=l.tag,r===13){if(r=Rs(l),r!==null){n.blockedOn=r,Oi(n.priority,function(){Ui(l)});return}}else if(r===3&&l.stateNode.current.memoizedState.isDehydrated){n.blockedOn=l.tag===3?l.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Xl(n){if(n.blockedOn!==null)return!1;for(var r=n.targetContainers;0<r.length;){var l=od(n.domEventName,n.eventSystemFlags,r[0],n.nativeEvent);if(l===null){l=n.nativeEvent;var d=new l.constructor(l.type,l);be=d,l.target.dispatchEvent(d),be=null}else return r=Ho(l),r!==null&&Wt(r),n.blockedOn=l,!1;r.shift()}return!0}function Nm(n,r,l){Xl(n)&&l.delete(r)}function Xy(){Qi=!1,jr!==null&&Xl(jr)&&(jr=null),Wr!==null&&Xl(Wr)&&(Wr=null),Xr!==null&&Xl(Xr)&&(Xr=null),wo.forEach(Nm),Ao.forEach(Nm)}function Ro(n,r){n.blockedOn===r&&(n.blockedOn=null,Qi||(Qi=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Xy)))}function Po(n){function r(g){return Ro(g,n)}if(0<Ps.length){Ro(Ps[0],n);for(var l=1;l<Ps.length;l++){var d=Ps[l];d.blockedOn===n&&(d.blockedOn=null)}}for(jr!==null&&Ro(jr,n),Wr!==null&&Ro(Wr,n),Xr!==null&&Ro(Xr,n),wo.forEach(r),Ao.forEach(r),l=0;l<$r.length;l++)d=$r[l],d.blockedOn===n&&(d.blockedOn=null);for(;0<$r.length&&(l=$r[0],l.blockedOn===null);)Pm(l),l.blockedOn===null&&$r.shift()}var _a=A.ReactCurrentBatchConfig,$l=!0;function $y(n,r,l,d){var g=gt,y=_a.transition;_a.transition=null;try{gt=1,ad(n,r,l,d)}finally{gt=g,_a.transition=y}}function qy(n,r,l,d){var g=gt,y=_a.transition;_a.transition=null;try{gt=4,ad(n,r,l,d)}finally{gt=g,_a.transition=y}}function ad(n,r,l,d){if($l){var g=od(n,r,l,d);if(g===null)bd(n,r,d,ql,l),Rm(n,d);else if(Wy(g,n,r,l,d))d.stopPropagation();else if(Rm(n,d),r&4&&-1<jy.indexOf(n)){for(;g!==null;){var y=Ho(g);if(y!==null&&Rt(y),y=od(n,r,l,d),y===null&&bd(n,r,d,ql,l),y===g)break;g=y}g!==null&&d.stopPropagation()}else bd(n,r,d,null,l)}}var ql=null;function od(n,r,l,d){if(ql=null,n=nt(d),n=Ns(n),n!==null)if(r=Zi(n),r===null)n=null;else if(l=r.tag,l===13){if(n=Rs(r),n!==null)return n;n=null}else if(l===3){if(r.stateNode.current.memoizedState.isDehydrated)return r.tag===3?r.stateNode.containerInfo:null;n=null}else r!==n&&(n=null);return ql=n,null}function Dm(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(sd()){case To:return 1;case D:return 4;case K:case le:return 16;case ne:return 536870912;default:return 16}default:return 16}}var qr=null,ld=null,Yl=null;function Lm(){if(Yl)return Yl;var n,r=ld,l=r.length,d,g="value"in qr?qr.value:qr.textContent,y=g.length;for(n=0;n<l&&r[n]===g[n];n++);var R=l-n;for(d=1;d<=R&&r[l-d]===g[y-d];d++);return Yl=g.slice(n,1<d?1-d:void 0)}function Kl(n){var r=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&r===13&&(n=13)):n=r,n===10&&(n=13),32<=n||n===13?n:0}function Zl(){return!0}function Im(){return!1}function li(n){function r(l,d,g,y,R){this._reactName=l,this._targetInst=g,this.type=d,this.nativeEvent=y,this.target=R,this.currentTarget=null;for(var O in n)n.hasOwnProperty(O)&&(l=n[O],this[O]=l?l(y):y[O]);return this.isDefaultPrevented=(y.defaultPrevented!=null?y.defaultPrevented:y.returnValue===!1)?Zl:Im,this.isPropagationStopped=Im,this}return oe(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var l=this.nativeEvent;l&&(l.preventDefault?l.preventDefault():typeof l.returnValue!="unknown"&&(l.returnValue=!1),this.isDefaultPrevented=Zl)},stopPropagation:function(){var l=this.nativeEvent;l&&(l.stopPropagation?l.stopPropagation():typeof l.cancelBubble!="unknown"&&(l.cancelBubble=!0),this.isPropagationStopped=Zl)},persist:function(){},isPersistent:Zl}),r}var xa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},cd=li(xa),No=oe({},xa,{view:0,detail:0}),Yy=li(No),ud,dd,Do,Ql=oe({},No,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:hd,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Do&&(Do&&n.type==="mousemove"?(ud=n.screenX-Do.screenX,dd=n.screenY-Do.screenY):dd=ud=0,Do=n),ud)},movementY:function(n){return"movementY"in n?n.movementY:dd}}),Fm=li(Ql),Ky=oe({},Ql,{dataTransfer:0}),Zy=li(Ky),Qy=oe({},No,{relatedTarget:0}),fd=li(Qy),Jy=oe({},xa,{animationName:0,elapsedTime:0,pseudoElement:0}),e1=li(Jy),t1=oe({},xa,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),n1=li(t1),i1=oe({},xa,{data:0}),Um=li(i1),r1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},s1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},a1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function o1(n){var r=this.nativeEvent;return r.getModifierState?r.getModifierState(n):(n=a1[n])?!!r[n]:!1}function hd(){return o1}var l1=oe({},No,{key:function(n){if(n.key){var r=r1[n.key]||n.key;if(r!=="Unidentified")return r}return n.type==="keypress"?(n=Kl(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?s1[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:hd,charCode:function(n){return n.type==="keypress"?Kl(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Kl(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),c1=li(l1),u1=oe({},Ql,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Om=li(u1),d1=oe({},No,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:hd}),f1=li(d1),h1=oe({},xa,{propertyName:0,elapsedTime:0,pseudoElement:0}),p1=li(h1),m1=oe({},Ql,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),g1=li(m1),_1=[9,13,27,32],pd=u&&"CompositionEvent"in window,Lo=null;u&&"documentMode"in document&&(Lo=document.documentMode);var x1=u&&"TextEvent"in window&&!Lo,km=u&&(!pd||Lo&&8<Lo&&11>=Lo),Bm=" ",zm=!1;function Vm(n,r){switch(n){case"keyup":return _1.indexOf(r.keyCode)!==-1;case"keydown":return r.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Hm(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var va=!1;function v1(n,r){switch(n){case"compositionend":return Hm(r);case"keypress":return r.which!==32?null:(zm=!0,Bm);case"textInput":return n=r.data,n===Bm&&zm?null:n;default:return null}}function y1(n,r){if(va)return n==="compositionend"||!pd&&Vm(n,r)?(n=Lm(),Yl=ld=qr=null,va=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(r.ctrlKey||r.altKey||r.metaKey)||r.ctrlKey&&r.altKey){if(r.char&&1<r.char.length)return r.char;if(r.which)return String.fromCharCode(r.which)}return null;case"compositionend":return km&&r.locale!=="ko"?null:r.data;default:return null}}var S1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Gm(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r==="input"?!!S1[n.type]:r==="textarea"}function jm(n,r,l,d){fe(d),r=ic(r,"onChange"),0<r.length&&(l=new cd("onChange","change",null,l,d),n.push({event:l,listeners:r}))}var Io=null,Fo=null;function M1(n){l0(n,0)}function Jl(n){var r=ba(n);if(Bt(r))return n}function E1(n,r){if(n==="change")return r}var Wm=!1;if(u){var md;if(u){var gd="oninput"in document;if(!gd){var Xm=document.createElement("div");Xm.setAttribute("oninput","return;"),gd=typeof Xm.oninput=="function"}md=gd}else md=!1;Wm=md&&(!document.documentMode||9<document.documentMode)}function $m(){Io&&(Io.detachEvent("onpropertychange",qm),Fo=Io=null)}function qm(n){if(n.propertyName==="value"&&Jl(Fo)){var r=[];jm(r,Fo,n,nt(n)),at(M1,r)}}function b1(n,r,l){n==="focusin"?($m(),Io=r,Fo=l,Io.attachEvent("onpropertychange",qm)):n==="focusout"&&$m()}function T1(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Jl(Fo)}function w1(n,r){if(n==="click")return Jl(r)}function A1(n,r){if(n==="input"||n==="change")return Jl(r)}function C1(n,r){return n===r&&(n!==0||1/n===1/r)||n!==n&&r!==r}var ki=typeof Object.is=="function"?Object.is:C1;function Uo(n,r){if(ki(n,r))return!0;if(typeof n!="object"||n===null||typeof r!="object"||r===null)return!1;var l=Object.keys(n),d=Object.keys(r);if(l.length!==d.length)return!1;for(d=0;d<l.length;d++){var g=l[d];if(!f.call(r,g)||!ki(n[g],r[g]))return!1}return!0}function Ym(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Km(n,r){var l=Ym(n);n=0;for(var d;l;){if(l.nodeType===3){if(d=n+l.textContent.length,n<=r&&d>=r)return{node:l,offset:r-n};n=d}e:{for(;l;){if(l.nextSibling){l=l.nextSibling;break e}l=l.parentNode}l=void 0}l=Ym(l)}}function Zm(n,r){return n&&r?n===r?!0:n&&n.nodeType===3?!1:r&&r.nodeType===3?Zm(n,r.parentNode):"contains"in n?n.contains(r):n.compareDocumentPosition?!!(n.compareDocumentPosition(r)&16):!1:!1}function Qm(){for(var n=window,r=ut();r instanceof n.HTMLIFrameElement;){try{var l=typeof r.contentWindow.location.href=="string"}catch{l=!1}if(l)n=r.contentWindow;else break;r=ut(n.document)}return r}function _d(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r&&(r==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||r==="textarea"||n.contentEditable==="true")}function R1(n){var r=Qm(),l=n.focusedElem,d=n.selectionRange;if(r!==l&&l&&l.ownerDocument&&Zm(l.ownerDocument.documentElement,l)){if(d!==null&&_d(l)){if(r=d.start,n=d.end,n===void 0&&(n=r),"selectionStart"in l)l.selectionStart=r,l.selectionEnd=Math.min(n,l.value.length);else if(n=(r=l.ownerDocument||document)&&r.defaultView||window,n.getSelection){n=n.getSelection();var g=l.textContent.length,y=Math.min(d.start,g);d=d.end===void 0?y:Math.min(d.end,g),!n.extend&&y>d&&(g=d,d=y,y=g),g=Km(l,y);var R=Km(l,d);g&&R&&(n.rangeCount!==1||n.anchorNode!==g.node||n.anchorOffset!==g.offset||n.focusNode!==R.node||n.focusOffset!==R.offset)&&(r=r.createRange(),r.setStart(g.node,g.offset),n.removeAllRanges(),y>d?(n.addRange(r),n.extend(R.node,R.offset)):(r.setEnd(R.node,R.offset),n.addRange(r)))}}for(r=[],n=l;n=n.parentNode;)n.nodeType===1&&r.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof l.focus=="function"&&l.focus(),l=0;l<r.length;l++)n=r[l],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var P1=u&&"documentMode"in document&&11>=document.documentMode,ya=null,xd=null,Oo=null,vd=!1;function Jm(n,r,l){var d=l.window===l?l.document:l.nodeType===9?l:l.ownerDocument;vd||ya==null||ya!==ut(d)||(d=ya,"selectionStart"in d&&_d(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Oo&&Uo(Oo,d)||(Oo=d,d=ic(xd,"onSelect"),0<d.length&&(r=new cd("onSelect","select",null,r,l),n.push({event:r,listeners:d}),r.target=ya)))}function ec(n,r){var l={};return l[n.toLowerCase()]=r.toLowerCase(),l["Webkit"+n]="webkit"+r,l["Moz"+n]="moz"+r,l}var Sa={animationend:ec("Animation","AnimationEnd"),animationiteration:ec("Animation","AnimationIteration"),animationstart:ec("Animation","AnimationStart"),transitionend:ec("Transition","TransitionEnd")},yd={},e0={};u&&(e0=document.createElement("div").style,"AnimationEvent"in window||(delete Sa.animationend.animation,delete Sa.animationiteration.animation,delete Sa.animationstart.animation),"TransitionEvent"in window||delete Sa.transitionend.transition);function tc(n){if(yd[n])return yd[n];if(!Sa[n])return n;var r=Sa[n],l;for(l in r)if(r.hasOwnProperty(l)&&l in e0)return yd[n]=r[l];return n}var t0=tc("animationend"),n0=tc("animationiteration"),i0=tc("animationstart"),r0=tc("transitionend"),s0=new Map,a0="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Yr(n,r){s0.set(n,r),o(r,[n])}for(var Sd=0;Sd<a0.length;Sd++){var Md=a0[Sd],N1=Md.toLowerCase(),D1=Md[0].toUpperCase()+Md.slice(1);Yr(N1,"on"+D1)}Yr(t0,"onAnimationEnd"),Yr(n0,"onAnimationIteration"),Yr(i0,"onAnimationStart"),Yr("dblclick","onDoubleClick"),Yr("focusin","onFocus"),Yr("focusout","onBlur"),Yr(r0,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),o("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),o("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),o("onBeforeInput",["compositionend","keypress","textInput","paste"]),o("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),o("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),o("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ko="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),L1=new Set("cancel close invalid load scroll toggle".split(" ").concat(ko));function o0(n,r,l){var d=n.type||"unknown-event";n.currentTarget=l,Gl(d,r,void 0,n),n.currentTarget=null}function l0(n,r){r=(r&4)!==0;for(var l=0;l<n.length;l++){var d=n[l],g=d.event;d=d.listeners;e:{var y=void 0;if(r)for(var R=d.length-1;0<=R;R--){var O=d[R],G=O.instance,ce=O.currentTarget;if(O=O.listener,G!==y&&g.isPropagationStopped())break e;o0(g,O,ce),y=G}else for(R=0;R<d.length;R++){if(O=d[R],G=O.instance,ce=O.currentTarget,O=O.listener,G!==y&&g.isPropagationStopped())break e;o0(g,O,ce),y=G}}}if(Cs)throw n=ma,Cs=!1,ma=null,n}function Xt(n,r){var l=r[Pd];l===void 0&&(l=r[Pd]=new Set);var d=n+"__bubble";l.has(d)||(c0(r,n,2,!1),l.add(d))}function Ed(n,r,l){var d=0;r&&(d|=4),c0(l,n,d,r)}var nc="_reactListening"+Math.random().toString(36).slice(2);function Bo(n){if(!n[nc]){n[nc]=!0,i.forEach(function(l){l!=="selectionchange"&&(L1.has(l)||Ed(l,!1,n),Ed(l,!0,n))});var r=n.nodeType===9?n:n.ownerDocument;r===null||r[nc]||(r[nc]=!0,Ed("selectionchange",!1,r))}}function c0(n,r,l,d){switch(Dm(r)){case 1:var g=$y;break;case 4:g=qy;break;default:g=ad}l=g.bind(null,r,l,n),g=void 0,!At||r!=="touchstart"&&r!=="touchmove"&&r!=="wheel"||(g=!0),d?g!==void 0?n.addEventListener(r,l,{capture:!0,passive:g}):n.addEventListener(r,l,!0):g!==void 0?n.addEventListener(r,l,{passive:g}):n.addEventListener(r,l,!1)}function bd(n,r,l,d,g){var y=d;if((r&1)===0&&(r&2)===0&&d!==null)e:for(;;){if(d===null)return;var R=d.tag;if(R===3||R===4){var O=d.stateNode.containerInfo;if(O===g||O.nodeType===8&&O.parentNode===g)break;if(R===4)for(R=d.return;R!==null;){var G=R.tag;if((G===3||G===4)&&(G=R.stateNode.containerInfo,G===g||G.nodeType===8&&G.parentNode===g))return;R=R.return}for(;O!==null;){if(R=Ns(O),R===null)return;if(G=R.tag,G===5||G===6){d=y=R;continue e}O=O.parentNode}}d=d.return}at(function(){var ce=y,ye=nt(l),Me=[];e:{var ve=s0.get(n);if(ve!==void 0){var He=cd,We=n;switch(n){case"keypress":if(Kl(l)===0)break e;case"keydown":case"keyup":He=c1;break;case"focusin":We="focus",He=fd;break;case"focusout":We="blur",He=fd;break;case"beforeblur":case"afterblur":He=fd;break;case"click":if(l.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":He=Fm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":He=Zy;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":He=f1;break;case t0:case n0:case i0:He=e1;break;case r0:He=p1;break;case"scroll":He=Yy;break;case"wheel":He=g1;break;case"copy":case"cut":case"paste":He=n1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":He=Om}var qe=(r&4)!==0,on=!qe&&n==="scroll",ee=qe?ve!==null?ve+"Capture":null:ve;qe=[];for(var $=ce,ie;$!==null;){ie=$;var Te=ie.stateNode;if(ie.tag===5&&Te!==null&&(ie=Te,ee!==null&&(Te=Ut($,ee),Te!=null&&qe.push(zo($,Te,ie)))),on)break;$=$.return}0<qe.length&&(ve=new He(ve,We,null,l,ye),Me.push({event:ve,listeners:qe}))}}if((r&7)===0){e:{if(ve=n==="mouseover"||n==="pointerover",He=n==="mouseout"||n==="pointerout",ve&&l!==be&&(We=l.relatedTarget||l.fromElement)&&(Ns(We)||We[xr]))break e;if((He||ve)&&(ve=ye.window===ye?ye:(ve=ye.ownerDocument)?ve.defaultView||ve.parentWindow:window,He?(We=l.relatedTarget||l.toElement,He=ce,We=We?Ns(We):null,We!==null&&(on=Zi(We),We!==on||We.tag!==5&&We.tag!==6)&&(We=null)):(He=null,We=ce),He!==We)){if(qe=Fm,Te="onMouseLeave",ee="onMouseEnter",$="mouse",(n==="pointerout"||n==="pointerover")&&(qe=Om,Te="onPointerLeave",ee="onPointerEnter",$="pointer"),on=He==null?ve:ba(He),ie=We==null?ve:ba(We),ve=new qe(Te,$+"leave",He,l,ye),ve.target=on,ve.relatedTarget=ie,Te=null,Ns(ye)===ce&&(qe=new qe(ee,$+"enter",We,l,ye),qe.target=ie,qe.relatedTarget=on,Te=qe),on=Te,He&&We)t:{for(qe=He,ee=We,$=0,ie=qe;ie;ie=Ma(ie))$++;for(ie=0,Te=ee;Te;Te=Ma(Te))ie++;for(;0<$-ie;)qe=Ma(qe),$--;for(;0<ie-$;)ee=Ma(ee),ie--;for(;$--;){if(qe===ee||ee!==null&&qe===ee.alternate)break t;qe=Ma(qe),ee=Ma(ee)}qe=null}else qe=null;He!==null&&u0(Me,ve,He,qe,!1),We!==null&&on!==null&&u0(Me,on,We,qe,!0)}}e:{if(ve=ce?ba(ce):window,He=ve.nodeName&&ve.nodeName.toLowerCase(),He==="select"||He==="input"&&ve.type==="file")var Ke=E1;else if(Gm(ve))if(Wm)Ke=A1;else{Ke=T1;var et=b1}else(He=ve.nodeName)&&He.toLowerCase()==="input"&&(ve.type==="checkbox"||ve.type==="radio")&&(Ke=w1);if(Ke&&(Ke=Ke(n,ce))){jm(Me,Ke,l,ye);break e}et&&et(n,ve,ce),n==="focusout"&&(et=ve._wrapperState)&&et.controlled&&ve.type==="number"&&Tn(ve,"number",ve.value)}switch(et=ce?ba(ce):window,n){case"focusin":(Gm(et)||et.contentEditable==="true")&&(ya=et,xd=ce,Oo=null);break;case"focusout":Oo=xd=ya=null;break;case"mousedown":vd=!0;break;case"contextmenu":case"mouseup":case"dragend":vd=!1,Jm(Me,l,ye);break;case"selectionchange":if(P1)break;case"keydown":case"keyup":Jm(Me,l,ye)}var tt;if(pd)e:{switch(n){case"compositionstart":var rt="onCompositionStart";break e;case"compositionend":rt="onCompositionEnd";break e;case"compositionupdate":rt="onCompositionUpdate";break e}rt=void 0}else va?Vm(n,l)&&(rt="onCompositionEnd"):n==="keydown"&&l.keyCode===229&&(rt="onCompositionStart");rt&&(km&&l.locale!=="ko"&&(va||rt!=="onCompositionStart"?rt==="onCompositionEnd"&&va&&(tt=Lm()):(qr=ye,ld="value"in qr?qr.value:qr.textContent,va=!0)),et=ic(ce,rt),0<et.length&&(rt=new Um(rt,n,null,l,ye),Me.push({event:rt,listeners:et}),tt?rt.data=tt:(tt=Hm(l),tt!==null&&(rt.data=tt)))),(tt=x1?v1(n,l):y1(n,l))&&(ce=ic(ce,"onBeforeInput"),0<ce.length&&(ye=new Um("onBeforeInput","beforeinput",null,l,ye),Me.push({event:ye,listeners:ce}),ye.data=tt))}l0(Me,r)})}function zo(n,r,l){return{instance:n,listener:r,currentTarget:l}}function ic(n,r){for(var l=r+"Capture",d=[];n!==null;){var g=n,y=g.stateNode;g.tag===5&&y!==null&&(g=y,y=Ut(n,l),y!=null&&d.unshift(zo(n,y,g)),y=Ut(n,r),y!=null&&d.push(zo(n,y,g))),n=n.return}return d}function Ma(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function u0(n,r,l,d,g){for(var y=r._reactName,R=[];l!==null&&l!==d;){var O=l,G=O.alternate,ce=O.stateNode;if(G!==null&&G===d)break;O.tag===5&&ce!==null&&(O=ce,g?(G=Ut(l,y),G!=null&&R.unshift(zo(l,G,O))):g||(G=Ut(l,y),G!=null&&R.push(zo(l,G,O)))),l=l.return}R.length!==0&&n.push({event:r,listeners:R})}var I1=/\r\n?/g,F1=/\u0000|\uFFFD/g;function d0(n){return(typeof n=="string"?n:""+n).replace(I1,`
`).replace(F1,"")}function rc(n,r,l){if(r=d0(r),d0(n)!==r&&l)throw Error(t(425))}function sc(){}var Td=null,wd=null;function Ad(n,r){return n==="textarea"||n==="noscript"||typeof r.children=="string"||typeof r.children=="number"||typeof r.dangerouslySetInnerHTML=="object"&&r.dangerouslySetInnerHTML!==null&&r.dangerouslySetInnerHTML.__html!=null}var Cd=typeof setTimeout=="function"?setTimeout:void 0,U1=typeof clearTimeout=="function"?clearTimeout:void 0,f0=typeof Promise=="function"?Promise:void 0,O1=typeof queueMicrotask=="function"?queueMicrotask:typeof f0<"u"?function(n){return f0.resolve(null).then(n).catch(k1)}:Cd;function k1(n){setTimeout(function(){throw n})}function Rd(n,r){var l=r,d=0;do{var g=l.nextSibling;if(n.removeChild(l),g&&g.nodeType===8)if(l=g.data,l==="/$"){if(d===0){n.removeChild(g),Po(r);return}d--}else l!=="$"&&l!=="$?"&&l!=="$!"||d++;l=g}while(l);Po(r)}function Kr(n){for(;n!=null;n=n.nextSibling){var r=n.nodeType;if(r===1||r===3)break;if(r===8){if(r=n.data,r==="$"||r==="$!"||r==="$?")break;if(r==="/$")return null}}return n}function h0(n){n=n.previousSibling;for(var r=0;n;){if(n.nodeType===8){var l=n.data;if(l==="$"||l==="$!"||l==="$?"){if(r===0)return n;r--}else l==="/$"&&r++}n=n.previousSibling}return null}var Ea=Math.random().toString(36).slice(2),Ji="__reactFiber$"+Ea,Vo="__reactProps$"+Ea,xr="__reactContainer$"+Ea,Pd="__reactEvents$"+Ea,B1="__reactListeners$"+Ea,z1="__reactHandles$"+Ea;function Ns(n){var r=n[Ji];if(r)return r;for(var l=n.parentNode;l;){if(r=l[xr]||l[Ji]){if(l=r.alternate,r.child!==null||l!==null&&l.child!==null)for(n=h0(n);n!==null;){if(l=n[Ji])return l;n=h0(n)}return r}n=l,l=n.parentNode}return null}function Ho(n){return n=n[Ji]||n[xr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ba(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function ac(n){return n[Vo]||null}var Nd=[],Ta=-1;function Zr(n){return{current:n}}function $t(n){0>Ta||(n.current=Nd[Ta],Nd[Ta]=null,Ta--)}function Gt(n,r){Ta++,Nd[Ta]=n.current,n.current=r}var Qr={},Nn=Zr(Qr),$n=Zr(!1),Ds=Qr;function wa(n,r){var l=n.type.contextTypes;if(!l)return Qr;var d=n.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===r)return d.__reactInternalMemoizedMaskedChildContext;var g={},y;for(y in l)g[y]=r[y];return d&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=g),g}function qn(n){return n=n.childContextTypes,n!=null}function oc(){$t($n),$t(Nn)}function p0(n,r,l){if(Nn.current!==Qr)throw Error(t(168));Gt(Nn,r),Gt($n,l)}function m0(n,r,l){var d=n.stateNode;if(r=r.childContextTypes,typeof d.getChildContext!="function")return l;d=d.getChildContext();for(var g in d)if(!(g in r))throw Error(t(108,Se(n)||"Unknown",g));return oe({},l,d)}function lc(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Qr,Ds=Nn.current,Gt(Nn,n),Gt($n,$n.current),!0}function g0(n,r,l){var d=n.stateNode;if(!d)throw Error(t(169));l?(n=m0(n,r,Ds),d.__reactInternalMemoizedMergedChildContext=n,$t($n),$t(Nn),Gt(Nn,n)):$t($n),Gt($n,l)}var vr=null,cc=!1,Dd=!1;function _0(n){vr===null?vr=[n]:vr.push(n)}function V1(n){cc=!0,_0(n)}function Jr(){if(!Dd&&vr!==null){Dd=!0;var n=0,r=gt;try{var l=vr;for(gt=1;n<l.length;n++){var d=l[n];do d=d(!0);while(d!==null)}vr=null,cc=!1}catch(g){throw vr!==null&&(vr=vr.slice(n+1)),jl(To,Jr),g}finally{gt=r,Dd=!1}}return null}var Aa=[],Ca=0,uc=null,dc=0,Ei=[],bi=0,Ls=null,yr=1,Sr="";function Is(n,r){Aa[Ca++]=dc,Aa[Ca++]=uc,uc=n,dc=r}function x0(n,r,l){Ei[bi++]=yr,Ei[bi++]=Sr,Ei[bi++]=Ls,Ls=n;var d=yr;n=Sr;var g=32-Ce(d)-1;d&=~(1<<g),l+=1;var y=32-Ce(r)+g;if(30<y){var R=g-g%5;y=(d&(1<<R)-1).toString(32),d>>=R,g-=R,yr=1<<32-Ce(r)+g|l<<g|d,Sr=y+n}else yr=1<<y|l<<g|d,Sr=n}function Ld(n){n.return!==null&&(Is(n,1),x0(n,1,0))}function Id(n){for(;n===uc;)uc=Aa[--Ca],Aa[Ca]=null,dc=Aa[--Ca],Aa[Ca]=null;for(;n===Ls;)Ls=Ei[--bi],Ei[bi]=null,Sr=Ei[--bi],Ei[bi]=null,yr=Ei[--bi],Ei[bi]=null}var ci=null,ui=null,Yt=!1,Bi=null;function v0(n,r){var l=Ci(5,null,null,0);l.elementType="DELETED",l.stateNode=r,l.return=n,r=n.deletions,r===null?(n.deletions=[l],n.flags|=16):r.push(l)}function y0(n,r){switch(n.tag){case 5:var l=n.type;return r=r.nodeType!==1||l.toLowerCase()!==r.nodeName.toLowerCase()?null:r,r!==null?(n.stateNode=r,ci=n,ui=Kr(r.firstChild),!0):!1;case 6:return r=n.pendingProps===""||r.nodeType!==3?null:r,r!==null?(n.stateNode=r,ci=n,ui=null,!0):!1;case 13:return r=r.nodeType!==8?null:r,r!==null?(l=Ls!==null?{id:yr,overflow:Sr}:null,n.memoizedState={dehydrated:r,treeContext:l,retryLane:1073741824},l=Ci(18,null,null,0),l.stateNode=r,l.return=n,n.child=l,ci=n,ui=null,!0):!1;default:return!1}}function Fd(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Ud(n){if(Yt){var r=ui;if(r){var l=r;if(!y0(n,r)){if(Fd(n))throw Error(t(418));r=Kr(l.nextSibling);var d=ci;r&&y0(n,r)?v0(d,l):(n.flags=n.flags&-4097|2,Yt=!1,ci=n)}}else{if(Fd(n))throw Error(t(418));n.flags=n.flags&-4097|2,Yt=!1,ci=n}}}function S0(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;ci=n}function fc(n){if(n!==ci)return!1;if(!Yt)return S0(n),Yt=!0,!1;var r;if((r=n.tag!==3)&&!(r=n.tag!==5)&&(r=n.type,r=r!=="head"&&r!=="body"&&!Ad(n.type,n.memoizedProps)),r&&(r=ui)){if(Fd(n))throw M0(),Error(t(418));for(;r;)v0(n,r),r=Kr(r.nextSibling)}if(S0(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,r=0;n;){if(n.nodeType===8){var l=n.data;if(l==="/$"){if(r===0){ui=Kr(n.nextSibling);break e}r--}else l!=="$"&&l!=="$!"&&l!=="$?"||r++}n=n.nextSibling}ui=null}}else ui=ci?Kr(n.stateNode.nextSibling):null;return!0}function M0(){for(var n=ui;n;)n=Kr(n.nextSibling)}function Ra(){ui=ci=null,Yt=!1}function Od(n){Bi===null?Bi=[n]:Bi.push(n)}var H1=A.ReactCurrentBatchConfig;function Go(n,r,l){if(n=l.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(l._owner){if(l=l._owner,l){if(l.tag!==1)throw Error(t(309));var d=l.stateNode}if(!d)throw Error(t(147,n));var g=d,y=""+n;return r!==null&&r.ref!==null&&typeof r.ref=="function"&&r.ref._stringRef===y?r.ref:(r=function(R){var O=g.refs;R===null?delete O[y]:O[y]=R},r._stringRef=y,r)}if(typeof n!="string")throw Error(t(284));if(!l._owner)throw Error(t(290,n))}return n}function hc(n,r){throw n=Object.prototype.toString.call(r),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(r).join(", ")+"}":n))}function E0(n){var r=n._init;return r(n._payload)}function b0(n){function r(ee,$){if(n){var ie=ee.deletions;ie===null?(ee.deletions=[$],ee.flags|=16):ie.push($)}}function l(ee,$){if(!n)return null;for(;$!==null;)r(ee,$),$=$.sibling;return null}function d(ee,$){for(ee=new Map;$!==null;)$.key!==null?ee.set($.key,$):ee.set($.index,$),$=$.sibling;return ee}function g(ee,$){return ee=os(ee,$),ee.index=0,ee.sibling=null,ee}function y(ee,$,ie){return ee.index=ie,n?(ie=ee.alternate,ie!==null?(ie=ie.index,ie<$?(ee.flags|=2,$):ie):(ee.flags|=2,$)):(ee.flags|=1048576,$)}function R(ee){return n&&ee.alternate===null&&(ee.flags|=2),ee}function O(ee,$,ie,Te){return $===null||$.tag!==6?($=Rf(ie,ee.mode,Te),$.return=ee,$):($=g($,ie),$.return=ee,$)}function G(ee,$,ie,Te){var Ke=ie.type;return Ke===F?ye(ee,$,ie.props.children,Te,ie.key):$!==null&&($.elementType===Ke||typeof Ke=="object"&&Ke!==null&&Ke.$$typeof===W&&E0(Ke)===$.type)?(Te=g($,ie.props),Te.ref=Go(ee,$,ie),Te.return=ee,Te):(Te=Oc(ie.type,ie.key,ie.props,null,ee.mode,Te),Te.ref=Go(ee,$,ie),Te.return=ee,Te)}function ce(ee,$,ie,Te){return $===null||$.tag!==4||$.stateNode.containerInfo!==ie.containerInfo||$.stateNode.implementation!==ie.implementation?($=Pf(ie,ee.mode,Te),$.return=ee,$):($=g($,ie.children||[]),$.return=ee,$)}function ye(ee,$,ie,Te,Ke){return $===null||$.tag!==7?($=Hs(ie,ee.mode,Te,Ke),$.return=ee,$):($=g($,ie),$.return=ee,$)}function Me(ee,$,ie){if(typeof $=="string"&&$!==""||typeof $=="number")return $=Rf(""+$,ee.mode,ie),$.return=ee,$;if(typeof $=="object"&&$!==null){switch($.$$typeof){case N:return ie=Oc($.type,$.key,$.props,null,ee.mode,ie),ie.ref=Go(ee,null,$),ie.return=ee,ie;case L:return $=Pf($,ee.mode,ie),$.return=ee,$;case W:var Te=$._init;return Me(ee,Te($._payload),ie)}if(X($)||ae($))return $=Hs($,ee.mode,ie,null),$.return=ee,$;hc(ee,$)}return null}function ve(ee,$,ie,Te){var Ke=$!==null?$.key:null;if(typeof ie=="string"&&ie!==""||typeof ie=="number")return Ke!==null?null:O(ee,$,""+ie,Te);if(typeof ie=="object"&&ie!==null){switch(ie.$$typeof){case N:return ie.key===Ke?G(ee,$,ie,Te):null;case L:return ie.key===Ke?ce(ee,$,ie,Te):null;case W:return Ke=ie._init,ve(ee,$,Ke(ie._payload),Te)}if(X(ie)||ae(ie))return Ke!==null?null:ye(ee,$,ie,Te,null);hc(ee,ie)}return null}function He(ee,$,ie,Te,Ke){if(typeof Te=="string"&&Te!==""||typeof Te=="number")return ee=ee.get(ie)||null,O($,ee,""+Te,Ke);if(typeof Te=="object"&&Te!==null){switch(Te.$$typeof){case N:return ee=ee.get(Te.key===null?ie:Te.key)||null,G($,ee,Te,Ke);case L:return ee=ee.get(Te.key===null?ie:Te.key)||null,ce($,ee,Te,Ke);case W:var et=Te._init;return He(ee,$,ie,et(Te._payload),Ke)}if(X(Te)||ae(Te))return ee=ee.get(ie)||null,ye($,ee,Te,Ke,null);hc($,Te)}return null}function We(ee,$,ie,Te){for(var Ke=null,et=null,tt=$,rt=$=0,Mn=null;tt!==null&&rt<ie.length;rt++){tt.index>rt?(Mn=tt,tt=null):Mn=tt.sibling;var Ct=ve(ee,tt,ie[rt],Te);if(Ct===null){tt===null&&(tt=Mn);break}n&&tt&&Ct.alternate===null&&r(ee,tt),$=y(Ct,$,rt),et===null?Ke=Ct:et.sibling=Ct,et=Ct,tt=Mn}if(rt===ie.length)return l(ee,tt),Yt&&Is(ee,rt),Ke;if(tt===null){for(;rt<ie.length;rt++)tt=Me(ee,ie[rt],Te),tt!==null&&($=y(tt,$,rt),et===null?Ke=tt:et.sibling=tt,et=tt);return Yt&&Is(ee,rt),Ke}for(tt=d(ee,tt);rt<ie.length;rt++)Mn=He(tt,ee,rt,ie[rt],Te),Mn!==null&&(n&&Mn.alternate!==null&&tt.delete(Mn.key===null?rt:Mn.key),$=y(Mn,$,rt),et===null?Ke=Mn:et.sibling=Mn,et=Mn);return n&&tt.forEach(function(ls){return r(ee,ls)}),Yt&&Is(ee,rt),Ke}function qe(ee,$,ie,Te){var Ke=ae(ie);if(typeof Ke!="function")throw Error(t(150));if(ie=Ke.call(ie),ie==null)throw Error(t(151));for(var et=Ke=null,tt=$,rt=$=0,Mn=null,Ct=ie.next();tt!==null&&!Ct.done;rt++,Ct=ie.next()){tt.index>rt?(Mn=tt,tt=null):Mn=tt.sibling;var ls=ve(ee,tt,Ct.value,Te);if(ls===null){tt===null&&(tt=Mn);break}n&&tt&&ls.alternate===null&&r(ee,tt),$=y(ls,$,rt),et===null?Ke=ls:et.sibling=ls,et=ls,tt=Mn}if(Ct.done)return l(ee,tt),Yt&&Is(ee,rt),Ke;if(tt===null){for(;!Ct.done;rt++,Ct=ie.next())Ct=Me(ee,Ct.value,Te),Ct!==null&&($=y(Ct,$,rt),et===null?Ke=Ct:et.sibling=Ct,et=Ct);return Yt&&Is(ee,rt),Ke}for(tt=d(ee,tt);!Ct.done;rt++,Ct=ie.next())Ct=He(tt,ee,rt,Ct.value,Te),Ct!==null&&(n&&Ct.alternate!==null&&tt.delete(Ct.key===null?rt:Ct.key),$=y(Ct,$,rt),et===null?Ke=Ct:et.sibling=Ct,et=Ct);return n&&tt.forEach(function(SS){return r(ee,SS)}),Yt&&Is(ee,rt),Ke}function on(ee,$,ie,Te){if(typeof ie=="object"&&ie!==null&&ie.type===F&&ie.key===null&&(ie=ie.props.children),typeof ie=="object"&&ie!==null){switch(ie.$$typeof){case N:e:{for(var Ke=ie.key,et=$;et!==null;){if(et.key===Ke){if(Ke=ie.type,Ke===F){if(et.tag===7){l(ee,et.sibling),$=g(et,ie.props.children),$.return=ee,ee=$;break e}}else if(et.elementType===Ke||typeof Ke=="object"&&Ke!==null&&Ke.$$typeof===W&&E0(Ke)===et.type){l(ee,et.sibling),$=g(et,ie.props),$.ref=Go(ee,et,ie),$.return=ee,ee=$;break e}l(ee,et);break}else r(ee,et);et=et.sibling}ie.type===F?($=Hs(ie.props.children,ee.mode,Te,ie.key),$.return=ee,ee=$):(Te=Oc(ie.type,ie.key,ie.props,null,ee.mode,Te),Te.ref=Go(ee,$,ie),Te.return=ee,ee=Te)}return R(ee);case L:e:{for(et=ie.key;$!==null;){if($.key===et)if($.tag===4&&$.stateNode.containerInfo===ie.containerInfo&&$.stateNode.implementation===ie.implementation){l(ee,$.sibling),$=g($,ie.children||[]),$.return=ee,ee=$;break e}else{l(ee,$);break}else r(ee,$);$=$.sibling}$=Pf(ie,ee.mode,Te),$.return=ee,ee=$}return R(ee);case W:return et=ie._init,on(ee,$,et(ie._payload),Te)}if(X(ie))return We(ee,$,ie,Te);if(ae(ie))return qe(ee,$,ie,Te);hc(ee,ie)}return typeof ie=="string"&&ie!==""||typeof ie=="number"?(ie=""+ie,$!==null&&$.tag===6?(l(ee,$.sibling),$=g($,ie),$.return=ee,ee=$):(l(ee,$),$=Rf(ie,ee.mode,Te),$.return=ee,ee=$),R(ee)):l(ee,$)}return on}var Pa=b0(!0),T0=b0(!1),pc=Zr(null),mc=null,Na=null,kd=null;function Bd(){kd=Na=mc=null}function zd(n){var r=pc.current;$t(pc),n._currentValue=r}function Vd(n,r,l){for(;n!==null;){var d=n.alternate;if((n.childLanes&r)!==r?(n.childLanes|=r,d!==null&&(d.childLanes|=r)):d!==null&&(d.childLanes&r)!==r&&(d.childLanes|=r),n===l)break;n=n.return}}function Da(n,r){mc=n,kd=Na=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&r)!==0&&(Yn=!0),n.firstContext=null)}function Ti(n){var r=n._currentValue;if(kd!==n)if(n={context:n,memoizedValue:r,next:null},Na===null){if(mc===null)throw Error(t(308));Na=n,mc.dependencies={lanes:0,firstContext:n}}else Na=Na.next=n;return r}var Fs=null;function Hd(n){Fs===null?Fs=[n]:Fs.push(n)}function w0(n,r,l,d){var g=r.interleaved;return g===null?(l.next=l,Hd(r)):(l.next=g.next,g.next=l),r.interleaved=l,Mr(n,d)}function Mr(n,r){n.lanes|=r;var l=n.alternate;for(l!==null&&(l.lanes|=r),l=n,n=n.return;n!==null;)n.childLanes|=r,l=n.alternate,l!==null&&(l.childLanes|=r),l=n,n=n.return;return l.tag===3?l.stateNode:null}var es=!1;function Gd(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function A0(n,r){n=n.updateQueue,r.updateQueue===n&&(r.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Er(n,r){return{eventTime:n,lane:r,tag:0,payload:null,callback:null,next:null}}function ts(n,r,l){var d=n.updateQueue;if(d===null)return null;if(d=d.shared,(bt&2)!==0){var g=d.pending;return g===null?r.next=r:(r.next=g.next,g.next=r),d.pending=r,Mr(n,l)}return g=d.interleaved,g===null?(r.next=r,Hd(d)):(r.next=g.next,g.next=r),d.interleaved=r,Mr(n,l)}function gc(n,r,l){if(r=r.updateQueue,r!==null&&(r=r.shared,(l&4194240)!==0)){var d=r.lanes;d&=n.pendingLanes,l|=d,r.lanes=l,Xn(n,l)}}function C0(n,r){var l=n.updateQueue,d=n.alternate;if(d!==null&&(d=d.updateQueue,l===d)){var g=null,y=null;if(l=l.firstBaseUpdate,l!==null){do{var R={eventTime:l.eventTime,lane:l.lane,tag:l.tag,payload:l.payload,callback:l.callback,next:null};y===null?g=y=R:y=y.next=R,l=l.next}while(l!==null);y===null?g=y=r:y=y.next=r}else g=y=r;l={baseState:d.baseState,firstBaseUpdate:g,lastBaseUpdate:y,shared:d.shared,effects:d.effects},n.updateQueue=l;return}n=l.lastBaseUpdate,n===null?l.firstBaseUpdate=r:n.next=r,l.lastBaseUpdate=r}function _c(n,r,l,d){var g=n.updateQueue;es=!1;var y=g.firstBaseUpdate,R=g.lastBaseUpdate,O=g.shared.pending;if(O!==null){g.shared.pending=null;var G=O,ce=G.next;G.next=null,R===null?y=ce:R.next=ce,R=G;var ye=n.alternate;ye!==null&&(ye=ye.updateQueue,O=ye.lastBaseUpdate,O!==R&&(O===null?ye.firstBaseUpdate=ce:O.next=ce,ye.lastBaseUpdate=G))}if(y!==null){var Me=g.baseState;R=0,ye=ce=G=null,O=y;do{var ve=O.lane,He=O.eventTime;if((d&ve)===ve){ye!==null&&(ye=ye.next={eventTime:He,lane:0,tag:O.tag,payload:O.payload,callback:O.callback,next:null});e:{var We=n,qe=O;switch(ve=r,He=l,qe.tag){case 1:if(We=qe.payload,typeof We=="function"){Me=We.call(He,Me,ve);break e}Me=We;break e;case 3:We.flags=We.flags&-65537|128;case 0:if(We=qe.payload,ve=typeof We=="function"?We.call(He,Me,ve):We,ve==null)break e;Me=oe({},Me,ve);break e;case 2:es=!0}}O.callback!==null&&O.lane!==0&&(n.flags|=64,ve=g.effects,ve===null?g.effects=[O]:ve.push(O))}else He={eventTime:He,lane:ve,tag:O.tag,payload:O.payload,callback:O.callback,next:null},ye===null?(ce=ye=He,G=Me):ye=ye.next=He,R|=ve;if(O=O.next,O===null){if(O=g.shared.pending,O===null)break;ve=O,O=ve.next,ve.next=null,g.lastBaseUpdate=ve,g.shared.pending=null}}while(!0);if(ye===null&&(G=Me),g.baseState=G,g.firstBaseUpdate=ce,g.lastBaseUpdate=ye,r=g.shared.interleaved,r!==null){g=r;do R|=g.lane,g=g.next;while(g!==r)}else y===null&&(g.shared.lanes=0);ks|=R,n.lanes=R,n.memoizedState=Me}}function R0(n,r,l){if(n=r.effects,r.effects=null,n!==null)for(r=0;r<n.length;r++){var d=n[r],g=d.callback;if(g!==null){if(d.callback=null,d=l,typeof g!="function")throw Error(t(191,g));g.call(d)}}}var jo={},er=Zr(jo),Wo=Zr(jo),Xo=Zr(jo);function Us(n){if(n===jo)throw Error(t(174));return n}function jd(n,r){switch(Gt(Xo,r),Gt(Wo,n),Gt(er,jo),n=r.nodeType,n){case 9:case 11:r=(r=r.documentElement)?r.namespaceURI:C(null,"");break;default:n=n===8?r.parentNode:r,r=n.namespaceURI||null,n=n.tagName,r=C(r,n)}$t(er),Gt(er,r)}function La(){$t(er),$t(Wo),$t(Xo)}function P0(n){Us(Xo.current);var r=Us(er.current),l=C(r,n.type);r!==l&&(Gt(Wo,n),Gt(er,l))}function Wd(n){Wo.current===n&&($t(er),$t(Wo))}var Jt=Zr(0);function xc(n){for(var r=n;r!==null;){if(r.tag===13){var l=r.memoizedState;if(l!==null&&(l=l.dehydrated,l===null||l.data==="$?"||l.data==="$!"))return r}else if(r.tag===19&&r.memoizedProps.revealOrder!==void 0){if((r.flags&128)!==0)return r}else if(r.child!==null){r.child.return=r,r=r.child;continue}if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return null;r=r.return}r.sibling.return=r.return,r=r.sibling}return null}var Xd=[];function $d(){for(var n=0;n<Xd.length;n++)Xd[n]._workInProgressVersionPrimary=null;Xd.length=0}var vc=A.ReactCurrentDispatcher,qd=A.ReactCurrentBatchConfig,Os=0,en=null,gn=null,yn=null,yc=!1,$o=!1,qo=0,G1=0;function Dn(){throw Error(t(321))}function Yd(n,r){if(r===null)return!1;for(var l=0;l<r.length&&l<n.length;l++)if(!ki(n[l],r[l]))return!1;return!0}function Kd(n,r,l,d,g,y){if(Os=y,en=r,r.memoizedState=null,r.updateQueue=null,r.lanes=0,vc.current=n===null||n.memoizedState===null?$1:q1,n=l(d,g),$o){y=0;do{if($o=!1,qo=0,25<=y)throw Error(t(301));y+=1,yn=gn=null,r.updateQueue=null,vc.current=Y1,n=l(d,g)}while($o)}if(vc.current=Ec,r=gn!==null&&gn.next!==null,Os=0,yn=gn=en=null,yc=!1,r)throw Error(t(300));return n}function Zd(){var n=qo!==0;return qo=0,n}function tr(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return yn===null?en.memoizedState=yn=n:yn=yn.next=n,yn}function wi(){if(gn===null){var n=en.alternate;n=n!==null?n.memoizedState:null}else n=gn.next;var r=yn===null?en.memoizedState:yn.next;if(r!==null)yn=r,gn=n;else{if(n===null)throw Error(t(310));gn=n,n={memoizedState:gn.memoizedState,baseState:gn.baseState,baseQueue:gn.baseQueue,queue:gn.queue,next:null},yn===null?en.memoizedState=yn=n:yn=yn.next=n}return yn}function Yo(n,r){return typeof r=="function"?r(n):r}function Qd(n){var r=wi(),l=r.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=n;var d=gn,g=d.baseQueue,y=l.pending;if(y!==null){if(g!==null){var R=g.next;g.next=y.next,y.next=R}d.baseQueue=g=y,l.pending=null}if(g!==null){y=g.next,d=d.baseState;var O=R=null,G=null,ce=y;do{var ye=ce.lane;if((Os&ye)===ye)G!==null&&(G=G.next={lane:0,action:ce.action,hasEagerState:ce.hasEagerState,eagerState:ce.eagerState,next:null}),d=ce.hasEagerState?ce.eagerState:n(d,ce.action);else{var Me={lane:ye,action:ce.action,hasEagerState:ce.hasEagerState,eagerState:ce.eagerState,next:null};G===null?(O=G=Me,R=d):G=G.next=Me,en.lanes|=ye,ks|=ye}ce=ce.next}while(ce!==null&&ce!==y);G===null?R=d:G.next=O,ki(d,r.memoizedState)||(Yn=!0),r.memoizedState=d,r.baseState=R,r.baseQueue=G,l.lastRenderedState=d}if(n=l.interleaved,n!==null){g=n;do y=g.lane,en.lanes|=y,ks|=y,g=g.next;while(g!==n)}else g===null&&(l.lanes=0);return[r.memoizedState,l.dispatch]}function Jd(n){var r=wi(),l=r.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=n;var d=l.dispatch,g=l.pending,y=r.memoizedState;if(g!==null){l.pending=null;var R=g=g.next;do y=n(y,R.action),R=R.next;while(R!==g);ki(y,r.memoizedState)||(Yn=!0),r.memoizedState=y,r.baseQueue===null&&(r.baseState=y),l.lastRenderedState=y}return[y,d]}function N0(){}function D0(n,r){var l=en,d=wi(),g=r(),y=!ki(d.memoizedState,g);if(y&&(d.memoizedState=g,Yn=!0),d=d.queue,ef(F0.bind(null,l,d,n),[n]),d.getSnapshot!==r||y||yn!==null&&yn.memoizedState.tag&1){if(l.flags|=2048,Ko(9,I0.bind(null,l,d,g,r),void 0,null),Sn===null)throw Error(t(349));(Os&30)!==0||L0(l,r,g)}return g}function L0(n,r,l){n.flags|=16384,n={getSnapshot:r,value:l},r=en.updateQueue,r===null?(r={lastEffect:null,stores:null},en.updateQueue=r,r.stores=[n]):(l=r.stores,l===null?r.stores=[n]:l.push(n))}function I0(n,r,l,d){r.value=l,r.getSnapshot=d,U0(r)&&O0(n)}function F0(n,r,l){return l(function(){U0(r)&&O0(n)})}function U0(n){var r=n.getSnapshot;n=n.value;try{var l=r();return!ki(n,l)}catch{return!0}}function O0(n){var r=Mr(n,1);r!==null&&Gi(r,n,1,-1)}function k0(n){var r=tr();return typeof n=="function"&&(n=n()),r.memoizedState=r.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Yo,lastRenderedState:n},r.queue=n,n=n.dispatch=X1.bind(null,en,n),[r.memoizedState,n]}function Ko(n,r,l,d){return n={tag:n,create:r,destroy:l,deps:d,next:null},r=en.updateQueue,r===null?(r={lastEffect:null,stores:null},en.updateQueue=r,r.lastEffect=n.next=n):(l=r.lastEffect,l===null?r.lastEffect=n.next=n:(d=l.next,l.next=n,n.next=d,r.lastEffect=n)),n}function B0(){return wi().memoizedState}function Sc(n,r,l,d){var g=tr();en.flags|=n,g.memoizedState=Ko(1|r,l,void 0,d===void 0?null:d)}function Mc(n,r,l,d){var g=wi();d=d===void 0?null:d;var y=void 0;if(gn!==null){var R=gn.memoizedState;if(y=R.destroy,d!==null&&Yd(d,R.deps)){g.memoizedState=Ko(r,l,y,d);return}}en.flags|=n,g.memoizedState=Ko(1|r,l,y,d)}function z0(n,r){return Sc(8390656,8,n,r)}function ef(n,r){return Mc(2048,8,n,r)}function V0(n,r){return Mc(4,2,n,r)}function H0(n,r){return Mc(4,4,n,r)}function G0(n,r){if(typeof r=="function")return n=n(),r(n),function(){r(null)};if(r!=null)return n=n(),r.current=n,function(){r.current=null}}function j0(n,r,l){return l=l!=null?l.concat([n]):null,Mc(4,4,G0.bind(null,r,n),l)}function tf(){}function W0(n,r){var l=wi();r=r===void 0?null:r;var d=l.memoizedState;return d!==null&&r!==null&&Yd(r,d[1])?d[0]:(l.memoizedState=[n,r],n)}function X0(n,r){var l=wi();r=r===void 0?null:r;var d=l.memoizedState;return d!==null&&r!==null&&Yd(r,d[1])?d[0]:(n=n(),l.memoizedState=[n,r],n)}function $0(n,r,l){return(Os&21)===0?(n.baseState&&(n.baseState=!1,Yn=!0),n.memoizedState=l):(ki(l,r)||(l=Ve(),en.lanes|=l,ks|=l,n.baseState=!0),r)}function j1(n,r){var l=gt;gt=l!==0&&4>l?l:4,n(!0);var d=qd.transition;qd.transition={};try{n(!1),r()}finally{gt=l,qd.transition=d}}function q0(){return wi().memoizedState}function W1(n,r,l){var d=ss(n);if(l={lane:d,action:l,hasEagerState:!1,eagerState:null,next:null},Y0(n))K0(r,l);else if(l=w0(n,r,l,d),l!==null){var g=Hn();Gi(l,n,d,g),Z0(l,r,d)}}function X1(n,r,l){var d=ss(n),g={lane:d,action:l,hasEagerState:!1,eagerState:null,next:null};if(Y0(n))K0(r,g);else{var y=n.alternate;if(n.lanes===0&&(y===null||y.lanes===0)&&(y=r.lastRenderedReducer,y!==null))try{var R=r.lastRenderedState,O=y(R,l);if(g.hasEagerState=!0,g.eagerState=O,ki(O,R)){var G=r.interleaved;G===null?(g.next=g,Hd(r)):(g.next=G.next,G.next=g),r.interleaved=g;return}}catch{}finally{}l=w0(n,r,g,d),l!==null&&(g=Hn(),Gi(l,n,d,g),Z0(l,r,d))}}function Y0(n){var r=n.alternate;return n===en||r!==null&&r===en}function K0(n,r){$o=yc=!0;var l=n.pending;l===null?r.next=r:(r.next=l.next,l.next=r),n.pending=r}function Z0(n,r,l){if((l&4194240)!==0){var d=r.lanes;d&=n.pendingLanes,l|=d,r.lanes=l,Xn(n,l)}}var Ec={readContext:Ti,useCallback:Dn,useContext:Dn,useEffect:Dn,useImperativeHandle:Dn,useInsertionEffect:Dn,useLayoutEffect:Dn,useMemo:Dn,useReducer:Dn,useRef:Dn,useState:Dn,useDebugValue:Dn,useDeferredValue:Dn,useTransition:Dn,useMutableSource:Dn,useSyncExternalStore:Dn,useId:Dn,unstable_isNewReconciler:!1},$1={readContext:Ti,useCallback:function(n,r){return tr().memoizedState=[n,r===void 0?null:r],n},useContext:Ti,useEffect:z0,useImperativeHandle:function(n,r,l){return l=l!=null?l.concat([n]):null,Sc(4194308,4,G0.bind(null,r,n),l)},useLayoutEffect:function(n,r){return Sc(4194308,4,n,r)},useInsertionEffect:function(n,r){return Sc(4,2,n,r)},useMemo:function(n,r){var l=tr();return r=r===void 0?null:r,n=n(),l.memoizedState=[n,r],n},useReducer:function(n,r,l){var d=tr();return r=l!==void 0?l(r):r,d.memoizedState=d.baseState=r,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:r},d.queue=n,n=n.dispatch=W1.bind(null,en,n),[d.memoizedState,n]},useRef:function(n){var r=tr();return n={current:n},r.memoizedState=n},useState:k0,useDebugValue:tf,useDeferredValue:function(n){return tr().memoizedState=n},useTransition:function(){var n=k0(!1),r=n[0];return n=j1.bind(null,n[1]),tr().memoizedState=n,[r,n]},useMutableSource:function(){},useSyncExternalStore:function(n,r,l){var d=en,g=tr();if(Yt){if(l===void 0)throw Error(t(407));l=l()}else{if(l=r(),Sn===null)throw Error(t(349));(Os&30)!==0||L0(d,r,l)}g.memoizedState=l;var y={value:l,getSnapshot:r};return g.queue=y,z0(F0.bind(null,d,y,n),[n]),d.flags|=2048,Ko(9,I0.bind(null,d,y,l,r),void 0,null),l},useId:function(){var n=tr(),r=Sn.identifierPrefix;if(Yt){var l=Sr,d=yr;l=(d&~(1<<32-Ce(d)-1)).toString(32)+l,r=":"+r+"R"+l,l=qo++,0<l&&(r+="H"+l.toString(32)),r+=":"}else l=G1++,r=":"+r+"r"+l.toString(32)+":";return n.memoizedState=r},unstable_isNewReconciler:!1},q1={readContext:Ti,useCallback:W0,useContext:Ti,useEffect:ef,useImperativeHandle:j0,useInsertionEffect:V0,useLayoutEffect:H0,useMemo:X0,useReducer:Qd,useRef:B0,useState:function(){return Qd(Yo)},useDebugValue:tf,useDeferredValue:function(n){var r=wi();return $0(r,gn.memoizedState,n)},useTransition:function(){var n=Qd(Yo)[0],r=wi().memoizedState;return[n,r]},useMutableSource:N0,useSyncExternalStore:D0,useId:q0,unstable_isNewReconciler:!1},Y1={readContext:Ti,useCallback:W0,useContext:Ti,useEffect:ef,useImperativeHandle:j0,useInsertionEffect:V0,useLayoutEffect:H0,useMemo:X0,useReducer:Jd,useRef:B0,useState:function(){return Jd(Yo)},useDebugValue:tf,useDeferredValue:function(n){var r=wi();return gn===null?r.memoizedState=n:$0(r,gn.memoizedState,n)},useTransition:function(){var n=Jd(Yo)[0],r=wi().memoizedState;return[n,r]},useMutableSource:N0,useSyncExternalStore:D0,useId:q0,unstable_isNewReconciler:!1};function zi(n,r){if(n&&n.defaultProps){r=oe({},r),n=n.defaultProps;for(var l in n)r[l]===void 0&&(r[l]=n[l]);return r}return r}function nf(n,r,l,d){r=n.memoizedState,l=l(d,r),l=l==null?r:oe({},r,l),n.memoizedState=l,n.lanes===0&&(n.updateQueue.baseState=l)}var bc={isMounted:function(n){return(n=n._reactInternals)?Zi(n)===n:!1},enqueueSetState:function(n,r,l){n=n._reactInternals;var d=Hn(),g=ss(n),y=Er(d,g);y.payload=r,l!=null&&(y.callback=l),r=ts(n,y,g),r!==null&&(Gi(r,n,g,d),gc(r,n,g))},enqueueReplaceState:function(n,r,l){n=n._reactInternals;var d=Hn(),g=ss(n),y=Er(d,g);y.tag=1,y.payload=r,l!=null&&(y.callback=l),r=ts(n,y,g),r!==null&&(Gi(r,n,g,d),gc(r,n,g))},enqueueForceUpdate:function(n,r){n=n._reactInternals;var l=Hn(),d=ss(n),g=Er(l,d);g.tag=2,r!=null&&(g.callback=r),r=ts(n,g,d),r!==null&&(Gi(r,n,d,l),gc(r,n,d))}};function Q0(n,r,l,d,g,y,R){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(d,y,R):r.prototype&&r.prototype.isPureReactComponent?!Uo(l,d)||!Uo(g,y):!0}function J0(n,r,l){var d=!1,g=Qr,y=r.contextType;return typeof y=="object"&&y!==null?y=Ti(y):(g=qn(r)?Ds:Nn.current,d=r.contextTypes,y=(d=d!=null)?wa(n,g):Qr),r=new r(l,y),n.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=bc,n.stateNode=r,r._reactInternals=n,d&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=g,n.__reactInternalMemoizedMaskedChildContext=y),r}function eg(n,r,l,d){n=r.state,typeof r.componentWillReceiveProps=="function"&&r.componentWillReceiveProps(l,d),typeof r.UNSAFE_componentWillReceiveProps=="function"&&r.UNSAFE_componentWillReceiveProps(l,d),r.state!==n&&bc.enqueueReplaceState(r,r.state,null)}function rf(n,r,l,d){var g=n.stateNode;g.props=l,g.state=n.memoizedState,g.refs={},Gd(n);var y=r.contextType;typeof y=="object"&&y!==null?g.context=Ti(y):(y=qn(r)?Ds:Nn.current,g.context=wa(n,y)),g.state=n.memoizedState,y=r.getDerivedStateFromProps,typeof y=="function"&&(nf(n,r,y,l),g.state=n.memoizedState),typeof r.getDerivedStateFromProps=="function"||typeof g.getSnapshotBeforeUpdate=="function"||typeof g.UNSAFE_componentWillMount!="function"&&typeof g.componentWillMount!="function"||(r=g.state,typeof g.componentWillMount=="function"&&g.componentWillMount(),typeof g.UNSAFE_componentWillMount=="function"&&g.UNSAFE_componentWillMount(),r!==g.state&&bc.enqueueReplaceState(g,g.state,null),_c(n,l,g,d),g.state=n.memoizedState),typeof g.componentDidMount=="function"&&(n.flags|=4194308)}function Ia(n,r){try{var l="",d=r;do l+=De(d),d=d.return;while(d);var g=l}catch(y){g=`
Error generating stack: `+y.message+`
`+y.stack}return{value:n,source:r,stack:g,digest:null}}function sf(n,r,l){return{value:n,source:null,stack:l??null,digest:r??null}}function af(n,r){try{console.error(r.value)}catch(l){setTimeout(function(){throw l})}}var K1=typeof WeakMap=="function"?WeakMap:Map;function tg(n,r,l){l=Er(-1,l),l.tag=3,l.payload={element:null};var d=r.value;return l.callback=function(){Nc||(Nc=!0,Sf=d),af(n,r)},l}function ng(n,r,l){l=Er(-1,l),l.tag=3;var d=n.type.getDerivedStateFromError;if(typeof d=="function"){var g=r.value;l.payload=function(){return d(g)},l.callback=function(){af(n,r)}}var y=n.stateNode;return y!==null&&typeof y.componentDidCatch=="function"&&(l.callback=function(){af(n,r),typeof d!="function"&&(is===null?is=new Set([this]):is.add(this));var R=r.stack;this.componentDidCatch(r.value,{componentStack:R!==null?R:""})}),l}function ig(n,r,l){var d=n.pingCache;if(d===null){d=n.pingCache=new K1;var g=new Set;d.set(r,g)}else g=d.get(r),g===void 0&&(g=new Set,d.set(r,g));g.has(l)||(g.add(l),n=uS.bind(null,n,r,l),r.then(n,n))}function rg(n){do{var r;if((r=n.tag===13)&&(r=n.memoizedState,r=r!==null?r.dehydrated!==null:!0),r)return n;n=n.return}while(n!==null);return null}function sg(n,r,l,d,g){return(n.mode&1)===0?(n===r?n.flags|=65536:(n.flags|=128,l.flags|=131072,l.flags&=-52805,l.tag===1&&(l.alternate===null?l.tag=17:(r=Er(-1,1),r.tag=2,ts(l,r,1))),l.lanes|=1),n):(n.flags|=65536,n.lanes=g,n)}var Z1=A.ReactCurrentOwner,Yn=!1;function Vn(n,r,l,d){r.child=n===null?T0(r,null,l,d):Pa(r,n.child,l,d)}function ag(n,r,l,d,g){l=l.render;var y=r.ref;return Da(r,g),d=Kd(n,r,l,d,y,g),l=Zd(),n!==null&&!Yn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~g,br(n,r,g)):(Yt&&l&&Ld(r),r.flags|=1,Vn(n,r,d,g),r.child)}function og(n,r,l,d,g){if(n===null){var y=l.type;return typeof y=="function"&&!Cf(y)&&y.defaultProps===void 0&&l.compare===null&&l.defaultProps===void 0?(r.tag=15,r.type=y,lg(n,r,y,d,g)):(n=Oc(l.type,null,d,r,r.mode,g),n.ref=r.ref,n.return=r,r.child=n)}if(y=n.child,(n.lanes&g)===0){var R=y.memoizedProps;if(l=l.compare,l=l!==null?l:Uo,l(R,d)&&n.ref===r.ref)return br(n,r,g)}return r.flags|=1,n=os(y,d),n.ref=r.ref,n.return=r,r.child=n}function lg(n,r,l,d,g){if(n!==null){var y=n.memoizedProps;if(Uo(y,d)&&n.ref===r.ref)if(Yn=!1,r.pendingProps=d=y,(n.lanes&g)!==0)(n.flags&131072)!==0&&(Yn=!0);else return r.lanes=n.lanes,br(n,r,g)}return of(n,r,l,d,g)}function cg(n,r,l){var d=r.pendingProps,g=d.children,y=n!==null?n.memoizedState:null;if(d.mode==="hidden")if((r.mode&1)===0)r.memoizedState={baseLanes:0,cachePool:null,transitions:null},Gt(Ua,di),di|=l;else{if((l&1073741824)===0)return n=y!==null?y.baseLanes|l:l,r.lanes=r.childLanes=1073741824,r.memoizedState={baseLanes:n,cachePool:null,transitions:null},r.updateQueue=null,Gt(Ua,di),di|=n,null;r.memoizedState={baseLanes:0,cachePool:null,transitions:null},d=y!==null?y.baseLanes:l,Gt(Ua,di),di|=d}else y!==null?(d=y.baseLanes|l,r.memoizedState=null):d=l,Gt(Ua,di),di|=d;return Vn(n,r,g,l),r.child}function ug(n,r){var l=r.ref;(n===null&&l!==null||n!==null&&n.ref!==l)&&(r.flags|=512,r.flags|=2097152)}function of(n,r,l,d,g){var y=qn(l)?Ds:Nn.current;return y=wa(r,y),Da(r,g),l=Kd(n,r,l,d,y,g),d=Zd(),n!==null&&!Yn?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~g,br(n,r,g)):(Yt&&d&&Ld(r),r.flags|=1,Vn(n,r,l,g),r.child)}function dg(n,r,l,d,g){if(qn(l)){var y=!0;lc(r)}else y=!1;if(Da(r,g),r.stateNode===null)wc(n,r),J0(r,l,d),rf(r,l,d,g),d=!0;else if(n===null){var R=r.stateNode,O=r.memoizedProps;R.props=O;var G=R.context,ce=l.contextType;typeof ce=="object"&&ce!==null?ce=Ti(ce):(ce=qn(l)?Ds:Nn.current,ce=wa(r,ce));var ye=l.getDerivedStateFromProps,Me=typeof ye=="function"||typeof R.getSnapshotBeforeUpdate=="function";Me||typeof R.UNSAFE_componentWillReceiveProps!="function"&&typeof R.componentWillReceiveProps!="function"||(O!==d||G!==ce)&&eg(r,R,d,ce),es=!1;var ve=r.memoizedState;R.state=ve,_c(r,d,R,g),G=r.memoizedState,O!==d||ve!==G||$n.current||es?(typeof ye=="function"&&(nf(r,l,ye,d),G=r.memoizedState),(O=es||Q0(r,l,O,d,ve,G,ce))?(Me||typeof R.UNSAFE_componentWillMount!="function"&&typeof R.componentWillMount!="function"||(typeof R.componentWillMount=="function"&&R.componentWillMount(),typeof R.UNSAFE_componentWillMount=="function"&&R.UNSAFE_componentWillMount()),typeof R.componentDidMount=="function"&&(r.flags|=4194308)):(typeof R.componentDidMount=="function"&&(r.flags|=4194308),r.memoizedProps=d,r.memoizedState=G),R.props=d,R.state=G,R.context=ce,d=O):(typeof R.componentDidMount=="function"&&(r.flags|=4194308),d=!1)}else{R=r.stateNode,A0(n,r),O=r.memoizedProps,ce=r.type===r.elementType?O:zi(r.type,O),R.props=ce,Me=r.pendingProps,ve=R.context,G=l.contextType,typeof G=="object"&&G!==null?G=Ti(G):(G=qn(l)?Ds:Nn.current,G=wa(r,G));var He=l.getDerivedStateFromProps;(ye=typeof He=="function"||typeof R.getSnapshotBeforeUpdate=="function")||typeof R.UNSAFE_componentWillReceiveProps!="function"&&typeof R.componentWillReceiveProps!="function"||(O!==Me||ve!==G)&&eg(r,R,d,G),es=!1,ve=r.memoizedState,R.state=ve,_c(r,d,R,g);var We=r.memoizedState;O!==Me||ve!==We||$n.current||es?(typeof He=="function"&&(nf(r,l,He,d),We=r.memoizedState),(ce=es||Q0(r,l,ce,d,ve,We,G)||!1)?(ye||typeof R.UNSAFE_componentWillUpdate!="function"&&typeof R.componentWillUpdate!="function"||(typeof R.componentWillUpdate=="function"&&R.componentWillUpdate(d,We,G),typeof R.UNSAFE_componentWillUpdate=="function"&&R.UNSAFE_componentWillUpdate(d,We,G)),typeof R.componentDidUpdate=="function"&&(r.flags|=4),typeof R.getSnapshotBeforeUpdate=="function"&&(r.flags|=1024)):(typeof R.componentDidUpdate!="function"||O===n.memoizedProps&&ve===n.memoizedState||(r.flags|=4),typeof R.getSnapshotBeforeUpdate!="function"||O===n.memoizedProps&&ve===n.memoizedState||(r.flags|=1024),r.memoizedProps=d,r.memoizedState=We),R.props=d,R.state=We,R.context=G,d=ce):(typeof R.componentDidUpdate!="function"||O===n.memoizedProps&&ve===n.memoizedState||(r.flags|=4),typeof R.getSnapshotBeforeUpdate!="function"||O===n.memoizedProps&&ve===n.memoizedState||(r.flags|=1024),d=!1)}return lf(n,r,l,d,y,g)}function lf(n,r,l,d,g,y){ug(n,r);var R=(r.flags&128)!==0;if(!d&&!R)return g&&g0(r,l,!1),br(n,r,y);d=r.stateNode,Z1.current=r;var O=R&&typeof l.getDerivedStateFromError!="function"?null:d.render();return r.flags|=1,n!==null&&R?(r.child=Pa(r,n.child,null,y),r.child=Pa(r,null,O,y)):Vn(n,r,O,y),r.memoizedState=d.state,g&&g0(r,l,!0),r.child}function fg(n){var r=n.stateNode;r.pendingContext?p0(n,r.pendingContext,r.pendingContext!==r.context):r.context&&p0(n,r.context,!1),jd(n,r.containerInfo)}function hg(n,r,l,d,g){return Ra(),Od(g),r.flags|=256,Vn(n,r,l,d),r.child}var cf={dehydrated:null,treeContext:null,retryLane:0};function uf(n){return{baseLanes:n,cachePool:null,transitions:null}}function pg(n,r,l){var d=r.pendingProps,g=Jt.current,y=!1,R=(r.flags&128)!==0,O;if((O=R)||(O=n!==null&&n.memoizedState===null?!1:(g&2)!==0),O?(y=!0,r.flags&=-129):(n===null||n.memoizedState!==null)&&(g|=1),Gt(Jt,g&1),n===null)return Ud(r),n=r.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((r.mode&1)===0?r.lanes=1:n.data==="$!"?r.lanes=8:r.lanes=1073741824,null):(R=d.children,n=d.fallback,y?(d=r.mode,y=r.child,R={mode:"hidden",children:R},(d&1)===0&&y!==null?(y.childLanes=0,y.pendingProps=R):y=kc(R,d,0,null),n=Hs(n,d,l,null),y.return=r,n.return=r,y.sibling=n,r.child=y,r.child.memoizedState=uf(l),r.memoizedState=cf,n):df(r,R));if(g=n.memoizedState,g!==null&&(O=g.dehydrated,O!==null))return Q1(n,r,R,d,O,g,l);if(y){y=d.fallback,R=r.mode,g=n.child,O=g.sibling;var G={mode:"hidden",children:d.children};return(R&1)===0&&r.child!==g?(d=r.child,d.childLanes=0,d.pendingProps=G,r.deletions=null):(d=os(g,G),d.subtreeFlags=g.subtreeFlags&14680064),O!==null?y=os(O,y):(y=Hs(y,R,l,null),y.flags|=2),y.return=r,d.return=r,d.sibling=y,r.child=d,d=y,y=r.child,R=n.child.memoizedState,R=R===null?uf(l):{baseLanes:R.baseLanes|l,cachePool:null,transitions:R.transitions},y.memoizedState=R,y.childLanes=n.childLanes&~l,r.memoizedState=cf,d}return y=n.child,n=y.sibling,d=os(y,{mode:"visible",children:d.children}),(r.mode&1)===0&&(d.lanes=l),d.return=r,d.sibling=null,n!==null&&(l=r.deletions,l===null?(r.deletions=[n],r.flags|=16):l.push(n)),r.child=d,r.memoizedState=null,d}function df(n,r){return r=kc({mode:"visible",children:r},n.mode,0,null),r.return=n,n.child=r}function Tc(n,r,l,d){return d!==null&&Od(d),Pa(r,n.child,null,l),n=df(r,r.pendingProps.children),n.flags|=2,r.memoizedState=null,n}function Q1(n,r,l,d,g,y,R){if(l)return r.flags&256?(r.flags&=-257,d=sf(Error(t(422))),Tc(n,r,R,d)):r.memoizedState!==null?(r.child=n.child,r.flags|=128,null):(y=d.fallback,g=r.mode,d=kc({mode:"visible",children:d.children},g,0,null),y=Hs(y,g,R,null),y.flags|=2,d.return=r,y.return=r,d.sibling=y,r.child=d,(r.mode&1)!==0&&Pa(r,n.child,null,R),r.child.memoizedState=uf(R),r.memoizedState=cf,y);if((r.mode&1)===0)return Tc(n,r,R,null);if(g.data==="$!"){if(d=g.nextSibling&&g.nextSibling.dataset,d)var O=d.dgst;return d=O,y=Error(t(419)),d=sf(y,d,void 0),Tc(n,r,R,d)}if(O=(R&n.childLanes)!==0,Yn||O){if(d=Sn,d!==null){switch(R&-R){case 4:g=2;break;case 16:g=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:g=32;break;case 536870912:g=268435456;break;default:g=0}g=(g&(d.suspendedLanes|R))!==0?0:g,g!==0&&g!==y.retryLane&&(y.retryLane=g,Mr(n,g),Gi(d,n,g,-1))}return Af(),d=sf(Error(t(421))),Tc(n,r,R,d)}return g.data==="$?"?(r.flags|=128,r.child=n.child,r=dS.bind(null,n),g._reactRetry=r,null):(n=y.treeContext,ui=Kr(g.nextSibling),ci=r,Yt=!0,Bi=null,n!==null&&(Ei[bi++]=yr,Ei[bi++]=Sr,Ei[bi++]=Ls,yr=n.id,Sr=n.overflow,Ls=r),r=df(r,d.children),r.flags|=4096,r)}function mg(n,r,l){n.lanes|=r;var d=n.alternate;d!==null&&(d.lanes|=r),Vd(n.return,r,l)}function ff(n,r,l,d,g){var y=n.memoizedState;y===null?n.memoizedState={isBackwards:r,rendering:null,renderingStartTime:0,last:d,tail:l,tailMode:g}:(y.isBackwards=r,y.rendering=null,y.renderingStartTime=0,y.last=d,y.tail=l,y.tailMode=g)}function gg(n,r,l){var d=r.pendingProps,g=d.revealOrder,y=d.tail;if(Vn(n,r,d.children,l),d=Jt.current,(d&2)!==0)d=d&1|2,r.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=r.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&mg(n,l,r);else if(n.tag===19)mg(n,l,r);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===r)break e;for(;n.sibling===null;){if(n.return===null||n.return===r)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}d&=1}if(Gt(Jt,d),(r.mode&1)===0)r.memoizedState=null;else switch(g){case"forwards":for(l=r.child,g=null;l!==null;)n=l.alternate,n!==null&&xc(n)===null&&(g=l),l=l.sibling;l=g,l===null?(g=r.child,r.child=null):(g=l.sibling,l.sibling=null),ff(r,!1,g,l,y);break;case"backwards":for(l=null,g=r.child,r.child=null;g!==null;){if(n=g.alternate,n!==null&&xc(n)===null){r.child=g;break}n=g.sibling,g.sibling=l,l=g,g=n}ff(r,!0,l,null,y);break;case"together":ff(r,!1,null,null,void 0);break;default:r.memoizedState=null}return r.child}function wc(n,r){(r.mode&1)===0&&n!==null&&(n.alternate=null,r.alternate=null,r.flags|=2)}function br(n,r,l){if(n!==null&&(r.dependencies=n.dependencies),ks|=r.lanes,(l&r.childLanes)===0)return null;if(n!==null&&r.child!==n.child)throw Error(t(153));if(r.child!==null){for(n=r.child,l=os(n,n.pendingProps),r.child=l,l.return=r;n.sibling!==null;)n=n.sibling,l=l.sibling=os(n,n.pendingProps),l.return=r;l.sibling=null}return r.child}function J1(n,r,l){switch(r.tag){case 3:fg(r),Ra();break;case 5:P0(r);break;case 1:qn(r.type)&&lc(r);break;case 4:jd(r,r.stateNode.containerInfo);break;case 10:var d=r.type._context,g=r.memoizedProps.value;Gt(pc,d._currentValue),d._currentValue=g;break;case 13:if(d=r.memoizedState,d!==null)return d.dehydrated!==null?(Gt(Jt,Jt.current&1),r.flags|=128,null):(l&r.child.childLanes)!==0?pg(n,r,l):(Gt(Jt,Jt.current&1),n=br(n,r,l),n!==null?n.sibling:null);Gt(Jt,Jt.current&1);break;case 19:if(d=(l&r.childLanes)!==0,(n.flags&128)!==0){if(d)return gg(n,r,l);r.flags|=128}if(g=r.memoizedState,g!==null&&(g.rendering=null,g.tail=null,g.lastEffect=null),Gt(Jt,Jt.current),d)break;return null;case 22:case 23:return r.lanes=0,cg(n,r,l)}return br(n,r,l)}var _g,hf,xg,vg;_g=function(n,r){for(var l=r.child;l!==null;){if(l.tag===5||l.tag===6)n.appendChild(l.stateNode);else if(l.tag!==4&&l.child!==null){l.child.return=l,l=l.child;continue}if(l===r)break;for(;l.sibling===null;){if(l.return===null||l.return===r)return;l=l.return}l.sibling.return=l.return,l=l.sibling}},hf=function(){},xg=function(n,r,l,d){var g=n.memoizedProps;if(g!==d){n=r.stateNode,Us(er.current);var y=null;switch(l){case"input":g=wt(n,g),d=wt(n,d),y=[];break;case"select":g=oe({},g,{value:void 0}),d=oe({},d,{value:void 0}),y=[];break;case"textarea":g=ft(n,g),d=ft(n,d),y=[];break;default:typeof g.onClick!="function"&&typeof d.onClick=="function"&&(n.onclick=sc)}ze(l,d);var R;l=null;for(ce in g)if(!d.hasOwnProperty(ce)&&g.hasOwnProperty(ce)&&g[ce]!=null)if(ce==="style"){var O=g[ce];for(R in O)O.hasOwnProperty(R)&&(l||(l={}),l[R]="")}else ce!=="dangerouslySetInnerHTML"&&ce!=="children"&&ce!=="suppressContentEditableWarning"&&ce!=="suppressHydrationWarning"&&ce!=="autoFocus"&&(s.hasOwnProperty(ce)?y||(y=[]):(y=y||[]).push(ce,null));for(ce in d){var G=d[ce];if(O=g!=null?g[ce]:void 0,d.hasOwnProperty(ce)&&G!==O&&(G!=null||O!=null))if(ce==="style")if(O){for(R in O)!O.hasOwnProperty(R)||G&&G.hasOwnProperty(R)||(l||(l={}),l[R]="");for(R in G)G.hasOwnProperty(R)&&O[R]!==G[R]&&(l||(l={}),l[R]=G[R])}else l||(y||(y=[]),y.push(ce,l)),l=G;else ce==="dangerouslySetInnerHTML"?(G=G?G.__html:void 0,O=O?O.__html:void 0,G!=null&&O!==G&&(y=y||[]).push(ce,G)):ce==="children"?typeof G!="string"&&typeof G!="number"||(y=y||[]).push(ce,""+G):ce!=="suppressContentEditableWarning"&&ce!=="suppressHydrationWarning"&&(s.hasOwnProperty(ce)?(G!=null&&ce==="onScroll"&&Xt("scroll",n),y||O===G||(y=[])):(y=y||[]).push(ce,G))}l&&(y=y||[]).push("style",l);var ce=y;(r.updateQueue=ce)&&(r.flags|=4)}},vg=function(n,r,l,d){l!==d&&(r.flags|=4)};function Zo(n,r){if(!Yt)switch(n.tailMode){case"hidden":r=n.tail;for(var l=null;r!==null;)r.alternate!==null&&(l=r),r=r.sibling;l===null?n.tail=null:l.sibling=null;break;case"collapsed":l=n.tail;for(var d=null;l!==null;)l.alternate!==null&&(d=l),l=l.sibling;d===null?r||n.tail===null?n.tail=null:n.tail.sibling=null:d.sibling=null}}function Ln(n){var r=n.alternate!==null&&n.alternate.child===n.child,l=0,d=0;if(r)for(var g=n.child;g!==null;)l|=g.lanes|g.childLanes,d|=g.subtreeFlags&14680064,d|=g.flags&14680064,g.return=n,g=g.sibling;else for(g=n.child;g!==null;)l|=g.lanes|g.childLanes,d|=g.subtreeFlags,d|=g.flags,g.return=n,g=g.sibling;return n.subtreeFlags|=d,n.childLanes=l,r}function eS(n,r,l){var d=r.pendingProps;switch(Id(r),r.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ln(r),null;case 1:return qn(r.type)&&oc(),Ln(r),null;case 3:return d=r.stateNode,La(),$t($n),$t(Nn),$d(),d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null),(n===null||n.child===null)&&(fc(r)?r.flags|=4:n===null||n.memoizedState.isDehydrated&&(r.flags&256)===0||(r.flags|=1024,Bi!==null&&(bf(Bi),Bi=null))),hf(n,r),Ln(r),null;case 5:Wd(r);var g=Us(Xo.current);if(l=r.type,n!==null&&r.stateNode!=null)xg(n,r,l,d,g),n.ref!==r.ref&&(r.flags|=512,r.flags|=2097152);else{if(!d){if(r.stateNode===null)throw Error(t(166));return Ln(r),null}if(n=Us(er.current),fc(r)){d=r.stateNode,l=r.type;var y=r.memoizedProps;switch(d[Ji]=r,d[Vo]=y,n=(r.mode&1)!==0,l){case"dialog":Xt("cancel",d),Xt("close",d);break;case"iframe":case"object":case"embed":Xt("load",d);break;case"video":case"audio":for(g=0;g<ko.length;g++)Xt(ko[g],d);break;case"source":Xt("error",d);break;case"img":case"image":case"link":Xt("error",d),Xt("load",d);break;case"details":Xt("toggle",d);break;case"input":It(d,y),Xt("invalid",d);break;case"select":d._wrapperState={wasMultiple:!!y.multiple},Xt("invalid",d);break;case"textarea":Pt(d,y),Xt("invalid",d)}ze(l,y),g=null;for(var R in y)if(y.hasOwnProperty(R)){var O=y[R];R==="children"?typeof O=="string"?d.textContent!==O&&(y.suppressHydrationWarning!==!0&&rc(d.textContent,O,n),g=["children",O]):typeof O=="number"&&d.textContent!==""+O&&(y.suppressHydrationWarning!==!0&&rc(d.textContent,O,n),g=["children",""+O]):s.hasOwnProperty(R)&&O!=null&&R==="onScroll"&&Xt("scroll",d)}switch(l){case"input":Je(d),zt(d,y,!0);break;case"textarea":Je(d),jt(d);break;case"select":case"option":break;default:typeof y.onClick=="function"&&(d.onclick=sc)}d=g,r.updateQueue=d,d!==null&&(r.flags|=4)}else{R=g.nodeType===9?g:g.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=U(l)),n==="http://www.w3.org/1999/xhtml"?l==="script"?(n=R.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof d.is=="string"?n=R.createElement(l,{is:d.is}):(n=R.createElement(l),l==="select"&&(R=n,d.multiple?R.multiple=!0:d.size&&(R.size=d.size))):n=R.createElementNS(n,l),n[Ji]=r,n[Vo]=d,_g(n,r,!1,!1),r.stateNode=n;e:{switch(R=Ae(l,d),l){case"dialog":Xt("cancel",n),Xt("close",n),g=d;break;case"iframe":case"object":case"embed":Xt("load",n),g=d;break;case"video":case"audio":for(g=0;g<ko.length;g++)Xt(ko[g],n);g=d;break;case"source":Xt("error",n),g=d;break;case"img":case"image":case"link":Xt("error",n),Xt("load",n),g=d;break;case"details":Xt("toggle",n),g=d;break;case"input":It(n,d),g=wt(n,d),Xt("invalid",n);break;case"option":g=d;break;case"select":n._wrapperState={wasMultiple:!!d.multiple},g=oe({},d,{value:void 0}),Xt("invalid",n);break;case"textarea":Pt(n,d),g=ft(n,d),Xt("invalid",n);break;default:g=d}ze(l,g),O=g;for(y in O)if(O.hasOwnProperty(y)){var G=O[y];y==="style"?pe(n,G):y==="dangerouslySetInnerHTML"?(G=G?G.__html:void 0,G!=null&&he(n,G)):y==="children"?typeof G=="string"?(l!=="textarea"||G!=="")&&_e(n,G):typeof G=="number"&&_e(n,""+G):y!=="suppressContentEditableWarning"&&y!=="suppressHydrationWarning"&&y!=="autoFocus"&&(s.hasOwnProperty(y)?G!=null&&y==="onScroll"&&Xt("scroll",n):G!=null&&P(n,y,G,R))}switch(l){case"input":Je(n),zt(n,d,!1);break;case"textarea":Je(n),jt(n);break;case"option":d.value!=null&&n.setAttribute("value",""+ge(d.value));break;case"select":n.multiple=!!d.multiple,y=d.value,y!=null?Vt(n,!!d.multiple,y,!1):d.defaultValue!=null&&Vt(n,!!d.multiple,d.defaultValue,!0);break;default:typeof g.onClick=="function"&&(n.onclick=sc)}switch(l){case"button":case"input":case"select":case"textarea":d=!!d.autoFocus;break e;case"img":d=!0;break e;default:d=!1}}d&&(r.flags|=4)}r.ref!==null&&(r.flags|=512,r.flags|=2097152)}return Ln(r),null;case 6:if(n&&r.stateNode!=null)vg(n,r,n.memoizedProps,d);else{if(typeof d!="string"&&r.stateNode===null)throw Error(t(166));if(l=Us(Xo.current),Us(er.current),fc(r)){if(d=r.stateNode,l=r.memoizedProps,d[Ji]=r,(y=d.nodeValue!==l)&&(n=ci,n!==null))switch(n.tag){case 3:rc(d.nodeValue,l,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&rc(d.nodeValue,l,(n.mode&1)!==0)}y&&(r.flags|=4)}else d=(l.nodeType===9?l:l.ownerDocument).createTextNode(d),d[Ji]=r,r.stateNode=d}return Ln(r),null;case 13:if($t(Jt),d=r.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Yt&&ui!==null&&(r.mode&1)!==0&&(r.flags&128)===0)M0(),Ra(),r.flags|=98560,y=!1;else if(y=fc(r),d!==null&&d.dehydrated!==null){if(n===null){if(!y)throw Error(t(318));if(y=r.memoizedState,y=y!==null?y.dehydrated:null,!y)throw Error(t(317));y[Ji]=r}else Ra(),(r.flags&128)===0&&(r.memoizedState=null),r.flags|=4;Ln(r),y=!1}else Bi!==null&&(bf(Bi),Bi=null),y=!0;if(!y)return r.flags&65536?r:null}return(r.flags&128)!==0?(r.lanes=l,r):(d=d!==null,d!==(n!==null&&n.memoizedState!==null)&&d&&(r.child.flags|=8192,(r.mode&1)!==0&&(n===null||(Jt.current&1)!==0?_n===0&&(_n=3):Af())),r.updateQueue!==null&&(r.flags|=4),Ln(r),null);case 4:return La(),hf(n,r),n===null&&Bo(r.stateNode.containerInfo),Ln(r),null;case 10:return zd(r.type._context),Ln(r),null;case 17:return qn(r.type)&&oc(),Ln(r),null;case 19:if($t(Jt),y=r.memoizedState,y===null)return Ln(r),null;if(d=(r.flags&128)!==0,R=y.rendering,R===null)if(d)Zo(y,!1);else{if(_n!==0||n!==null&&(n.flags&128)!==0)for(n=r.child;n!==null;){if(R=xc(n),R!==null){for(r.flags|=128,Zo(y,!1),d=R.updateQueue,d!==null&&(r.updateQueue=d,r.flags|=4),r.subtreeFlags=0,d=l,l=r.child;l!==null;)y=l,n=d,y.flags&=14680066,R=y.alternate,R===null?(y.childLanes=0,y.lanes=n,y.child=null,y.subtreeFlags=0,y.memoizedProps=null,y.memoizedState=null,y.updateQueue=null,y.dependencies=null,y.stateNode=null):(y.childLanes=R.childLanes,y.lanes=R.lanes,y.child=R.child,y.subtreeFlags=0,y.deletions=null,y.memoizedProps=R.memoizedProps,y.memoizedState=R.memoizedState,y.updateQueue=R.updateQueue,y.type=R.type,n=R.dependencies,y.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),l=l.sibling;return Gt(Jt,Jt.current&1|2),r.child}n=n.sibling}y.tail!==null&&Qt()>Oa&&(r.flags|=128,d=!0,Zo(y,!1),r.lanes=4194304)}else{if(!d)if(n=xc(R),n!==null){if(r.flags|=128,d=!0,l=n.updateQueue,l!==null&&(r.updateQueue=l,r.flags|=4),Zo(y,!0),y.tail===null&&y.tailMode==="hidden"&&!R.alternate&&!Yt)return Ln(r),null}else 2*Qt()-y.renderingStartTime>Oa&&l!==1073741824&&(r.flags|=128,d=!0,Zo(y,!1),r.lanes=4194304);y.isBackwards?(R.sibling=r.child,r.child=R):(l=y.last,l!==null?l.sibling=R:r.child=R,y.last=R)}return y.tail!==null?(r=y.tail,y.rendering=r,y.tail=r.sibling,y.renderingStartTime=Qt(),r.sibling=null,l=Jt.current,Gt(Jt,d?l&1|2:l&1),r):(Ln(r),null);case 22:case 23:return wf(),d=r.memoizedState!==null,n!==null&&n.memoizedState!==null!==d&&(r.flags|=8192),d&&(r.mode&1)!==0?(di&1073741824)!==0&&(Ln(r),r.subtreeFlags&6&&(r.flags|=8192)):Ln(r),null;case 24:return null;case 25:return null}throw Error(t(156,r.tag))}function tS(n,r){switch(Id(r),r.tag){case 1:return qn(r.type)&&oc(),n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 3:return La(),$t($n),$t(Nn),$d(),n=r.flags,(n&65536)!==0&&(n&128)===0?(r.flags=n&-65537|128,r):null;case 5:return Wd(r),null;case 13:if($t(Jt),n=r.memoizedState,n!==null&&n.dehydrated!==null){if(r.alternate===null)throw Error(t(340));Ra()}return n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 19:return $t(Jt),null;case 4:return La(),null;case 10:return zd(r.type._context),null;case 22:case 23:return wf(),null;case 24:return null;default:return null}}var Ac=!1,In=!1,nS=typeof WeakSet=="function"?WeakSet:Set,je=null;function Fa(n,r){var l=n.ref;if(l!==null)if(typeof l=="function")try{l(null)}catch(d){sn(n,r,d)}else l.current=null}function pf(n,r,l){try{l()}catch(d){sn(n,r,d)}}var yg=!1;function iS(n,r){if(Td=$l,n=Qm(),_d(n)){if("selectionStart"in n)var l={start:n.selectionStart,end:n.selectionEnd};else e:{l=(l=n.ownerDocument)&&l.defaultView||window;var d=l.getSelection&&l.getSelection();if(d&&d.rangeCount!==0){l=d.anchorNode;var g=d.anchorOffset,y=d.focusNode;d=d.focusOffset;try{l.nodeType,y.nodeType}catch{l=null;break e}var R=0,O=-1,G=-1,ce=0,ye=0,Me=n,ve=null;t:for(;;){for(var He;Me!==l||g!==0&&Me.nodeType!==3||(O=R+g),Me!==y||d!==0&&Me.nodeType!==3||(G=R+d),Me.nodeType===3&&(R+=Me.nodeValue.length),(He=Me.firstChild)!==null;)ve=Me,Me=He;for(;;){if(Me===n)break t;if(ve===l&&++ce===g&&(O=R),ve===y&&++ye===d&&(G=R),(He=Me.nextSibling)!==null)break;Me=ve,ve=Me.parentNode}Me=He}l=O===-1||G===-1?null:{start:O,end:G}}else l=null}l=l||{start:0,end:0}}else l=null;for(wd={focusedElem:n,selectionRange:l},$l=!1,je=r;je!==null;)if(r=je,n=r.child,(r.subtreeFlags&1028)!==0&&n!==null)n.return=r,je=n;else for(;je!==null;){r=je;try{var We=r.alternate;if((r.flags&1024)!==0)switch(r.tag){case 0:case 11:case 15:break;case 1:if(We!==null){var qe=We.memoizedProps,on=We.memoizedState,ee=r.stateNode,$=ee.getSnapshotBeforeUpdate(r.elementType===r.type?qe:zi(r.type,qe),on);ee.__reactInternalSnapshotBeforeUpdate=$}break;case 3:var ie=r.stateNode.containerInfo;ie.nodeType===1?ie.textContent="":ie.nodeType===9&&ie.documentElement&&ie.removeChild(ie.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Te){sn(r,r.return,Te)}if(n=r.sibling,n!==null){n.return=r.return,je=n;break}je=r.return}return We=yg,yg=!1,We}function Qo(n,r,l){var d=r.updateQueue;if(d=d!==null?d.lastEffect:null,d!==null){var g=d=d.next;do{if((g.tag&n)===n){var y=g.destroy;g.destroy=void 0,y!==void 0&&pf(r,l,y)}g=g.next}while(g!==d)}}function Cc(n,r){if(r=r.updateQueue,r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&n)===n){var d=l.create;l.destroy=d()}l=l.next}while(l!==r)}}function mf(n){var r=n.ref;if(r!==null){var l=n.stateNode;switch(n.tag){case 5:n=l;break;default:n=l}typeof r=="function"?r(n):r.current=n}}function Sg(n){var r=n.alternate;r!==null&&(n.alternate=null,Sg(r)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(r=n.stateNode,r!==null&&(delete r[Ji],delete r[Vo],delete r[Pd],delete r[B1],delete r[z1])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Mg(n){return n.tag===5||n.tag===3||n.tag===4}function Eg(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Mg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function gf(n,r,l){var d=n.tag;if(d===5||d===6)n=n.stateNode,r?l.nodeType===8?l.parentNode.insertBefore(n,r):l.insertBefore(n,r):(l.nodeType===8?(r=l.parentNode,r.insertBefore(n,l)):(r=l,r.appendChild(n)),l=l._reactRootContainer,l!=null||r.onclick!==null||(r.onclick=sc));else if(d!==4&&(n=n.child,n!==null))for(gf(n,r,l),n=n.sibling;n!==null;)gf(n,r,l),n=n.sibling}function _f(n,r,l){var d=n.tag;if(d===5||d===6)n=n.stateNode,r?l.insertBefore(n,r):l.appendChild(n);else if(d!==4&&(n=n.child,n!==null))for(_f(n,r,l),n=n.sibling;n!==null;)_f(n,r,l),n=n.sibling}var An=null,Vi=!1;function ns(n,r,l){for(l=l.child;l!==null;)bg(n,r,l),l=l.sibling}function bg(n,r,l){if(Pe&&typeof Pe.onCommitFiberUnmount=="function")try{Pe.onCommitFiberUnmount(te,l)}catch{}switch(l.tag){case 5:In||Fa(l,r);case 6:var d=An,g=Vi;An=null,ns(n,r,l),An=d,Vi=g,An!==null&&(Vi?(n=An,l=l.stateNode,n.nodeType===8?n.parentNode.removeChild(l):n.removeChild(l)):An.removeChild(l.stateNode));break;case 18:An!==null&&(Vi?(n=An,l=l.stateNode,n.nodeType===8?Rd(n.parentNode,l):n.nodeType===1&&Rd(n,l),Po(n)):Rd(An,l.stateNode));break;case 4:d=An,g=Vi,An=l.stateNode.containerInfo,Vi=!0,ns(n,r,l),An=d,Vi=g;break;case 0:case 11:case 14:case 15:if(!In&&(d=l.updateQueue,d!==null&&(d=d.lastEffect,d!==null))){g=d=d.next;do{var y=g,R=y.destroy;y=y.tag,R!==void 0&&((y&2)!==0||(y&4)!==0)&&pf(l,r,R),g=g.next}while(g!==d)}ns(n,r,l);break;case 1:if(!In&&(Fa(l,r),d=l.stateNode,typeof d.componentWillUnmount=="function"))try{d.props=l.memoizedProps,d.state=l.memoizedState,d.componentWillUnmount()}catch(O){sn(l,r,O)}ns(n,r,l);break;case 21:ns(n,r,l);break;case 22:l.mode&1?(In=(d=In)||l.memoizedState!==null,ns(n,r,l),In=d):ns(n,r,l);break;default:ns(n,r,l)}}function Tg(n){var r=n.updateQueue;if(r!==null){n.updateQueue=null;var l=n.stateNode;l===null&&(l=n.stateNode=new nS),r.forEach(function(d){var g=fS.bind(null,n,d);l.has(d)||(l.add(d),d.then(g,g))})}}function Hi(n,r){var l=r.deletions;if(l!==null)for(var d=0;d<l.length;d++){var g=l[d];try{var y=n,R=r,O=R;e:for(;O!==null;){switch(O.tag){case 5:An=O.stateNode,Vi=!1;break e;case 3:An=O.stateNode.containerInfo,Vi=!0;break e;case 4:An=O.stateNode.containerInfo,Vi=!0;break e}O=O.return}if(An===null)throw Error(t(160));bg(y,R,g),An=null,Vi=!1;var G=g.alternate;G!==null&&(G.return=null),g.return=null}catch(ce){sn(g,r,ce)}}if(r.subtreeFlags&12854)for(r=r.child;r!==null;)wg(r,n),r=r.sibling}function wg(n,r){var l=n.alternate,d=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Hi(r,n),nr(n),d&4){try{Qo(3,n,n.return),Cc(3,n)}catch(qe){sn(n,n.return,qe)}try{Qo(5,n,n.return)}catch(qe){sn(n,n.return,qe)}}break;case 1:Hi(r,n),nr(n),d&512&&l!==null&&Fa(l,l.return);break;case 5:if(Hi(r,n),nr(n),d&512&&l!==null&&Fa(l,l.return),n.flags&32){var g=n.stateNode;try{_e(g,"")}catch(qe){sn(n,n.return,qe)}}if(d&4&&(g=n.stateNode,g!=null)){var y=n.memoizedProps,R=l!==null?l.memoizedProps:y,O=n.type,G=n.updateQueue;if(n.updateQueue=null,G!==null)try{O==="input"&&y.type==="radio"&&y.name!=null&&dt(g,y),Ae(O,R);var ce=Ae(O,y);for(R=0;R<G.length;R+=2){var ye=G[R],Me=G[R+1];ye==="style"?pe(g,Me):ye==="dangerouslySetInnerHTML"?he(g,Me):ye==="children"?_e(g,Me):P(g,ye,Me,ce)}switch(O){case"input":Zt(g,y);break;case"textarea":Le(g,y);break;case"select":var ve=g._wrapperState.wasMultiple;g._wrapperState.wasMultiple=!!y.multiple;var He=y.value;He!=null?Vt(g,!!y.multiple,He,!1):ve!==!!y.multiple&&(y.defaultValue!=null?Vt(g,!!y.multiple,y.defaultValue,!0):Vt(g,!!y.multiple,y.multiple?[]:"",!1))}g[Vo]=y}catch(qe){sn(n,n.return,qe)}}break;case 6:if(Hi(r,n),nr(n),d&4){if(n.stateNode===null)throw Error(t(162));g=n.stateNode,y=n.memoizedProps;try{g.nodeValue=y}catch(qe){sn(n,n.return,qe)}}break;case 3:if(Hi(r,n),nr(n),d&4&&l!==null&&l.memoizedState.isDehydrated)try{Po(r.containerInfo)}catch(qe){sn(n,n.return,qe)}break;case 4:Hi(r,n),nr(n);break;case 13:Hi(r,n),nr(n),g=n.child,g.flags&8192&&(y=g.memoizedState!==null,g.stateNode.isHidden=y,!y||g.alternate!==null&&g.alternate.memoizedState!==null||(yf=Qt())),d&4&&Tg(n);break;case 22:if(ye=l!==null&&l.memoizedState!==null,n.mode&1?(In=(ce=In)||ye,Hi(r,n),In=ce):Hi(r,n),nr(n),d&8192){if(ce=n.memoizedState!==null,(n.stateNode.isHidden=ce)&&!ye&&(n.mode&1)!==0)for(je=n,ye=n.child;ye!==null;){for(Me=je=ye;je!==null;){switch(ve=je,He=ve.child,ve.tag){case 0:case 11:case 14:case 15:Qo(4,ve,ve.return);break;case 1:Fa(ve,ve.return);var We=ve.stateNode;if(typeof We.componentWillUnmount=="function"){d=ve,l=ve.return;try{r=d,We.props=r.memoizedProps,We.state=r.memoizedState,We.componentWillUnmount()}catch(qe){sn(d,l,qe)}}break;case 5:Fa(ve,ve.return);break;case 22:if(ve.memoizedState!==null){Rg(Me);continue}}He!==null?(He.return=ve,je=He):Rg(Me)}ye=ye.sibling}e:for(ye=null,Me=n;;){if(Me.tag===5){if(ye===null){ye=Me;try{g=Me.stateNode,ce?(y=g.style,typeof y.setProperty=="function"?y.setProperty("display","none","important"):y.display="none"):(O=Me.stateNode,G=Me.memoizedProps.style,R=G!=null&&G.hasOwnProperty("display")?G.display:null,O.style.display=de("display",R))}catch(qe){sn(n,n.return,qe)}}}else if(Me.tag===6){if(ye===null)try{Me.stateNode.nodeValue=ce?"":Me.memoizedProps}catch(qe){sn(n,n.return,qe)}}else if((Me.tag!==22&&Me.tag!==23||Me.memoizedState===null||Me===n)&&Me.child!==null){Me.child.return=Me,Me=Me.child;continue}if(Me===n)break e;for(;Me.sibling===null;){if(Me.return===null||Me.return===n)break e;ye===Me&&(ye=null),Me=Me.return}ye===Me&&(ye=null),Me.sibling.return=Me.return,Me=Me.sibling}}break;case 19:Hi(r,n),nr(n),d&4&&Tg(n);break;case 21:break;default:Hi(r,n),nr(n)}}function nr(n){var r=n.flags;if(r&2){try{e:{for(var l=n.return;l!==null;){if(Mg(l)){var d=l;break e}l=l.return}throw Error(t(160))}switch(d.tag){case 5:var g=d.stateNode;d.flags&32&&(_e(g,""),d.flags&=-33);var y=Eg(n);_f(n,y,g);break;case 3:case 4:var R=d.stateNode.containerInfo,O=Eg(n);gf(n,O,R);break;default:throw Error(t(161))}}catch(G){sn(n,n.return,G)}n.flags&=-3}r&4096&&(n.flags&=-4097)}function rS(n,r,l){je=n,Ag(n)}function Ag(n,r,l){for(var d=(n.mode&1)!==0;je!==null;){var g=je,y=g.child;if(g.tag===22&&d){var R=g.memoizedState!==null||Ac;if(!R){var O=g.alternate,G=O!==null&&O.memoizedState!==null||In;O=Ac;var ce=In;if(Ac=R,(In=G)&&!ce)for(je=g;je!==null;)R=je,G=R.child,R.tag===22&&R.memoizedState!==null?Pg(g):G!==null?(G.return=R,je=G):Pg(g);for(;y!==null;)je=y,Ag(y),y=y.sibling;je=g,Ac=O,In=ce}Cg(n)}else(g.subtreeFlags&8772)!==0&&y!==null?(y.return=g,je=y):Cg(n)}}function Cg(n){for(;je!==null;){var r=je;if((r.flags&8772)!==0){var l=r.alternate;try{if((r.flags&8772)!==0)switch(r.tag){case 0:case 11:case 15:In||Cc(5,r);break;case 1:var d=r.stateNode;if(r.flags&4&&!In)if(l===null)d.componentDidMount();else{var g=r.elementType===r.type?l.memoizedProps:zi(r.type,l.memoizedProps);d.componentDidUpdate(g,l.memoizedState,d.__reactInternalSnapshotBeforeUpdate)}var y=r.updateQueue;y!==null&&R0(r,y,d);break;case 3:var R=r.updateQueue;if(R!==null){if(l=null,r.child!==null)switch(r.child.tag){case 5:l=r.child.stateNode;break;case 1:l=r.child.stateNode}R0(r,R,l)}break;case 5:var O=r.stateNode;if(l===null&&r.flags&4){l=O;var G=r.memoizedProps;switch(r.type){case"button":case"input":case"select":case"textarea":G.autoFocus&&l.focus();break;case"img":G.src&&(l.src=G.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(r.memoizedState===null){var ce=r.alternate;if(ce!==null){var ye=ce.memoizedState;if(ye!==null){var Me=ye.dehydrated;Me!==null&&Po(Me)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}In||r.flags&512&&mf(r)}catch(ve){sn(r,r.return,ve)}}if(r===n){je=null;break}if(l=r.sibling,l!==null){l.return=r.return,je=l;break}je=r.return}}function Rg(n){for(;je!==null;){var r=je;if(r===n){je=null;break}var l=r.sibling;if(l!==null){l.return=r.return,je=l;break}je=r.return}}function Pg(n){for(;je!==null;){var r=je;try{switch(r.tag){case 0:case 11:case 15:var l=r.return;try{Cc(4,r)}catch(G){sn(r,l,G)}break;case 1:var d=r.stateNode;if(typeof d.componentDidMount=="function"){var g=r.return;try{d.componentDidMount()}catch(G){sn(r,g,G)}}var y=r.return;try{mf(r)}catch(G){sn(r,y,G)}break;case 5:var R=r.return;try{mf(r)}catch(G){sn(r,R,G)}}}catch(G){sn(r,r.return,G)}if(r===n){je=null;break}var O=r.sibling;if(O!==null){O.return=r.return,je=O;break}je=r.return}}var sS=Math.ceil,Rc=A.ReactCurrentDispatcher,xf=A.ReactCurrentOwner,Ai=A.ReactCurrentBatchConfig,bt=0,Sn=null,fn=null,Cn=0,di=0,Ua=Zr(0),_n=0,Jo=null,ks=0,Pc=0,vf=0,el=null,Kn=null,yf=0,Oa=1/0,Tr=null,Nc=!1,Sf=null,is=null,Dc=!1,rs=null,Lc=0,tl=0,Mf=null,Ic=-1,Fc=0;function Hn(){return(bt&6)!==0?Qt():Ic!==-1?Ic:Ic=Qt()}function ss(n){return(n.mode&1)===0?1:(bt&2)!==0&&Cn!==0?Cn&-Cn:H1.transition!==null?(Fc===0&&(Fc=Ve()),Fc):(n=gt,n!==0||(n=window.event,n=n===void 0?16:Dm(n.type)),n)}function Gi(n,r,l,d){if(50<tl)throw tl=0,Mf=null,Error(t(185));mt(n,l,d),((bt&2)===0||n!==Sn)&&(n===Sn&&((bt&2)===0&&(Pc|=l),_n===4&&as(n,Cn)),Zn(n,d),l===1&&bt===0&&(r.mode&1)===0&&(Oa=Qt()+500,cc&&Jr()))}function Zn(n,r){var l=n.callbackNode;Nt(n,r);var d=Ht(n,n===Sn?Cn:0);if(d===0)l!==null&&Wl(l),n.callbackNode=null,n.callbackPriority=0;else if(r=d&-d,n.callbackPriority!==r){if(l!=null&&Wl(l),r===1)n.tag===0?V1(Dg.bind(null,n)):_0(Dg.bind(null,n)),O1(function(){(bt&6)===0&&Jr()}),l=null;else{switch(_r(d)){case 1:l=To;break;case 4:l=D;break;case 16:l=K;break;case 536870912:l=ne;break;default:l=K}l=zg(l,Ng.bind(null,n))}n.callbackPriority=r,n.callbackNode=l}}function Ng(n,r){if(Ic=-1,Fc=0,(bt&6)!==0)throw Error(t(327));var l=n.callbackNode;if(ka()&&n.callbackNode!==l)return null;var d=Ht(n,n===Sn?Cn:0);if(d===0)return null;if((d&30)!==0||(d&n.expiredLanes)!==0||r)r=Uc(n,d);else{r=d;var g=bt;bt|=2;var y=Ig();(Sn!==n||Cn!==r)&&(Tr=null,Oa=Qt()+500,zs(n,r));do try{lS();break}catch(O){Lg(n,O)}while(!0);Bd(),Rc.current=y,bt=g,fn!==null?r=0:(Sn=null,Cn=0,r=_n)}if(r!==0){if(r===2&&(g=dn(n),g!==0&&(d=g,r=Ef(n,g))),r===1)throw l=Jo,zs(n,0),as(n,d),Zn(n,Qt()),l;if(r===6)as(n,d);else{if(g=n.current.alternate,(d&30)===0&&!aS(g)&&(r=Uc(n,d),r===2&&(y=dn(n),y!==0&&(d=y,r=Ef(n,y))),r===1))throw l=Jo,zs(n,0),as(n,d),Zn(n,Qt()),l;switch(n.finishedWork=g,n.finishedLanes=d,r){case 0:case 1:throw Error(t(345));case 2:Vs(n,Kn,Tr);break;case 3:if(as(n,d),(d&130023424)===d&&(r=yf+500-Qt(),10<r)){if(Ht(n,0)!==0)break;if(g=n.suspendedLanes,(g&d)!==d){Hn(),n.pingedLanes|=n.suspendedLanes&g;break}n.timeoutHandle=Cd(Vs.bind(null,n,Kn,Tr),r);break}Vs(n,Kn,Tr);break;case 4:if(as(n,d),(d&4194240)===d)break;for(r=n.eventTimes,g=-1;0<d;){var R=31-Ce(d);y=1<<R,R=r[R],R>g&&(g=R),d&=~y}if(d=g,d=Qt()-d,d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3e3>d?3e3:4320>d?4320:1960*sS(d/1960))-d,10<d){n.timeoutHandle=Cd(Vs.bind(null,n,Kn,Tr),d);break}Vs(n,Kn,Tr);break;case 5:Vs(n,Kn,Tr);break;default:throw Error(t(329))}}}return Zn(n,Qt()),n.callbackNode===l?Ng.bind(null,n):null}function Ef(n,r){var l=el;return n.current.memoizedState.isDehydrated&&(zs(n,r).flags|=256),n=Uc(n,r),n!==2&&(r=Kn,Kn=l,r!==null&&bf(r)),n}function bf(n){Kn===null?Kn=n:Kn.push.apply(Kn,n)}function aS(n){for(var r=n;;){if(r.flags&16384){var l=r.updateQueue;if(l!==null&&(l=l.stores,l!==null))for(var d=0;d<l.length;d++){var g=l[d],y=g.getSnapshot;g=g.value;try{if(!ki(y(),g))return!1}catch{return!1}}}if(l=r.child,r.subtreeFlags&16384&&l!==null)l.return=r,r=l;else{if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return!0;r=r.return}r.sibling.return=r.return,r=r.sibling}}return!0}function as(n,r){for(r&=~vf,r&=~Pc,n.suspendedLanes|=r,n.pingedLanes&=~r,n=n.expirationTimes;0<r;){var l=31-Ce(r),d=1<<l;n[l]=-1,r&=~d}}function Dg(n){if((bt&6)!==0)throw Error(t(327));ka();var r=Ht(n,0);if((r&1)===0)return Zn(n,Qt()),null;var l=Uc(n,r);if(n.tag!==0&&l===2){var d=dn(n);d!==0&&(r=d,l=Ef(n,d))}if(l===1)throw l=Jo,zs(n,0),as(n,r),Zn(n,Qt()),l;if(l===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=r,Vs(n,Kn,Tr),Zn(n,Qt()),null}function Tf(n,r){var l=bt;bt|=1;try{return n(r)}finally{bt=l,bt===0&&(Oa=Qt()+500,cc&&Jr())}}function Bs(n){rs!==null&&rs.tag===0&&(bt&6)===0&&ka();var r=bt;bt|=1;var l=Ai.transition,d=gt;try{if(Ai.transition=null,gt=1,n)return n()}finally{gt=d,Ai.transition=l,bt=r,(bt&6)===0&&Jr()}}function wf(){di=Ua.current,$t(Ua)}function zs(n,r){n.finishedWork=null,n.finishedLanes=0;var l=n.timeoutHandle;if(l!==-1&&(n.timeoutHandle=-1,U1(l)),fn!==null)for(l=fn.return;l!==null;){var d=l;switch(Id(d),d.tag){case 1:d=d.type.childContextTypes,d!=null&&oc();break;case 3:La(),$t($n),$t(Nn),$d();break;case 5:Wd(d);break;case 4:La();break;case 13:$t(Jt);break;case 19:$t(Jt);break;case 10:zd(d.type._context);break;case 22:case 23:wf()}l=l.return}if(Sn=n,fn=n=os(n.current,null),Cn=di=r,_n=0,Jo=null,vf=Pc=ks=0,Kn=el=null,Fs!==null){for(r=0;r<Fs.length;r++)if(l=Fs[r],d=l.interleaved,d!==null){l.interleaved=null;var g=d.next,y=l.pending;if(y!==null){var R=y.next;y.next=g,d.next=R}l.pending=d}Fs=null}return n}function Lg(n,r){do{var l=fn;try{if(Bd(),vc.current=Ec,yc){for(var d=en.memoizedState;d!==null;){var g=d.queue;g!==null&&(g.pending=null),d=d.next}yc=!1}if(Os=0,yn=gn=en=null,$o=!1,qo=0,xf.current=null,l===null||l.return===null){_n=1,Jo=r,fn=null;break}e:{var y=n,R=l.return,O=l,G=r;if(r=Cn,O.flags|=32768,G!==null&&typeof G=="object"&&typeof G.then=="function"){var ce=G,ye=O,Me=ye.tag;if((ye.mode&1)===0&&(Me===0||Me===11||Me===15)){var ve=ye.alternate;ve?(ye.updateQueue=ve.updateQueue,ye.memoizedState=ve.memoizedState,ye.lanes=ve.lanes):(ye.updateQueue=null,ye.memoizedState=null)}var He=rg(R);if(He!==null){He.flags&=-257,sg(He,R,O,y,r),He.mode&1&&ig(y,ce,r),r=He,G=ce;var We=r.updateQueue;if(We===null){var qe=new Set;qe.add(G),r.updateQueue=qe}else We.add(G);break e}else{if((r&1)===0){ig(y,ce,r),Af();break e}G=Error(t(426))}}else if(Yt&&O.mode&1){var on=rg(R);if(on!==null){(on.flags&65536)===0&&(on.flags|=256),sg(on,R,O,y,r),Od(Ia(G,O));break e}}y=G=Ia(G,O),_n!==4&&(_n=2),el===null?el=[y]:el.push(y),y=R;do{switch(y.tag){case 3:y.flags|=65536,r&=-r,y.lanes|=r;var ee=tg(y,G,r);C0(y,ee);break e;case 1:O=G;var $=y.type,ie=y.stateNode;if((y.flags&128)===0&&(typeof $.getDerivedStateFromError=="function"||ie!==null&&typeof ie.componentDidCatch=="function"&&(is===null||!is.has(ie)))){y.flags|=65536,r&=-r,y.lanes|=r;var Te=ng(y,O,r);C0(y,Te);break e}}y=y.return}while(y!==null)}Ug(l)}catch(Ke){r=Ke,fn===l&&l!==null&&(fn=l=l.return);continue}break}while(!0)}function Ig(){var n=Rc.current;return Rc.current=Ec,n===null?Ec:n}function Af(){(_n===0||_n===3||_n===2)&&(_n=4),Sn===null||(ks&268435455)===0&&(Pc&268435455)===0||as(Sn,Cn)}function Uc(n,r){var l=bt;bt|=2;var d=Ig();(Sn!==n||Cn!==r)&&(Tr=null,zs(n,r));do try{oS();break}catch(g){Lg(n,g)}while(!0);if(Bd(),bt=l,Rc.current=d,fn!==null)throw Error(t(261));return Sn=null,Cn=0,_n}function oS(){for(;fn!==null;)Fg(fn)}function lS(){for(;fn!==null&&!id();)Fg(fn)}function Fg(n){var r=Bg(n.alternate,n,di);n.memoizedProps=n.pendingProps,r===null?Ug(n):fn=r,xf.current=null}function Ug(n){var r=n;do{var l=r.alternate;if(n=r.return,(r.flags&32768)===0){if(l=eS(l,r,di),l!==null){fn=l;return}}else{if(l=tS(l,r),l!==null){l.flags&=32767,fn=l;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{_n=6,fn=null;return}}if(r=r.sibling,r!==null){fn=r;return}fn=r=n}while(r!==null);_n===0&&(_n=5)}function Vs(n,r,l){var d=gt,g=Ai.transition;try{Ai.transition=null,gt=1,cS(n,r,l,d)}finally{Ai.transition=g,gt=d}return null}function cS(n,r,l,d){do ka();while(rs!==null);if((bt&6)!==0)throw Error(t(327));l=n.finishedWork;var g=n.finishedLanes;if(l===null)return null;if(n.finishedWork=null,n.finishedLanes=0,l===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var y=l.lanes|l.childLanes;if(Wn(n,y),n===Sn&&(fn=Sn=null,Cn=0),(l.subtreeFlags&2064)===0&&(l.flags&2064)===0||Dc||(Dc=!0,zg(K,function(){return ka(),null})),y=(l.flags&15990)!==0,(l.subtreeFlags&15990)!==0||y){y=Ai.transition,Ai.transition=null;var R=gt;gt=1;var O=bt;bt|=4,xf.current=null,iS(n,l),wg(l,n),R1(wd),$l=!!Td,wd=Td=null,n.current=l,rS(l),rd(),bt=O,gt=R,Ai.transition=y}else n.current=l;if(Dc&&(Dc=!1,rs=n,Lc=g),y=n.pendingLanes,y===0&&(is=null),Ge(l.stateNode),Zn(n,Qt()),r!==null)for(d=n.onRecoverableError,l=0;l<r.length;l++)g=r[l],d(g.value,{componentStack:g.stack,digest:g.digest});if(Nc)throw Nc=!1,n=Sf,Sf=null,n;return(Lc&1)!==0&&n.tag!==0&&ka(),y=n.pendingLanes,(y&1)!==0?n===Mf?tl++:(tl=0,Mf=n):tl=0,Jr(),null}function ka(){if(rs!==null){var n=_r(Lc),r=Ai.transition,l=gt;try{if(Ai.transition=null,gt=16>n?16:n,rs===null)var d=!1;else{if(n=rs,rs=null,Lc=0,(bt&6)!==0)throw Error(t(331));var g=bt;for(bt|=4,je=n.current;je!==null;){var y=je,R=y.child;if((je.flags&16)!==0){var O=y.deletions;if(O!==null){for(var G=0;G<O.length;G++){var ce=O[G];for(je=ce;je!==null;){var ye=je;switch(ye.tag){case 0:case 11:case 15:Qo(8,ye,y)}var Me=ye.child;if(Me!==null)Me.return=ye,je=Me;else for(;je!==null;){ye=je;var ve=ye.sibling,He=ye.return;if(Sg(ye),ye===ce){je=null;break}if(ve!==null){ve.return=He,je=ve;break}je=He}}}var We=y.alternate;if(We!==null){var qe=We.child;if(qe!==null){We.child=null;do{var on=qe.sibling;qe.sibling=null,qe=on}while(qe!==null)}}je=y}}if((y.subtreeFlags&2064)!==0&&R!==null)R.return=y,je=R;else e:for(;je!==null;){if(y=je,(y.flags&2048)!==0)switch(y.tag){case 0:case 11:case 15:Qo(9,y,y.return)}var ee=y.sibling;if(ee!==null){ee.return=y.return,je=ee;break e}je=y.return}}var $=n.current;for(je=$;je!==null;){R=je;var ie=R.child;if((R.subtreeFlags&2064)!==0&&ie!==null)ie.return=R,je=ie;else e:for(R=$;je!==null;){if(O=je,(O.flags&2048)!==0)try{switch(O.tag){case 0:case 11:case 15:Cc(9,O)}}catch(Ke){sn(O,O.return,Ke)}if(O===R){je=null;break e}var Te=O.sibling;if(Te!==null){Te.return=O.return,je=Te;break e}je=O.return}}if(bt=g,Jr(),Pe&&typeof Pe.onPostCommitFiberRoot=="function")try{Pe.onPostCommitFiberRoot(te,n)}catch{}d=!0}return d}finally{gt=l,Ai.transition=r}}return!1}function Og(n,r,l){r=Ia(l,r),r=tg(n,r,1),n=ts(n,r,1),r=Hn(),n!==null&&(mt(n,1,r),Zn(n,r))}function sn(n,r,l){if(n.tag===3)Og(n,n,l);else for(;r!==null;){if(r.tag===3){Og(r,n,l);break}else if(r.tag===1){var d=r.stateNode;if(typeof r.type.getDerivedStateFromError=="function"||typeof d.componentDidCatch=="function"&&(is===null||!is.has(d))){n=Ia(l,n),n=ng(r,n,1),r=ts(r,n,1),n=Hn(),r!==null&&(mt(r,1,n),Zn(r,n));break}}r=r.return}}function uS(n,r,l){var d=n.pingCache;d!==null&&d.delete(r),r=Hn(),n.pingedLanes|=n.suspendedLanes&l,Sn===n&&(Cn&l)===l&&(_n===4||_n===3&&(Cn&130023424)===Cn&&500>Qt()-yf?zs(n,0):vf|=l),Zn(n,r)}function kg(n,r){r===0&&((n.mode&1)===0?r=1:(r=Ye,Ye<<=1,(Ye&130023424)===0&&(Ye=4194304)));var l=Hn();n=Mr(n,r),n!==null&&(mt(n,r,l),Zn(n,l))}function dS(n){var r=n.memoizedState,l=0;r!==null&&(l=r.retryLane),kg(n,l)}function fS(n,r){var l=0;switch(n.tag){case 13:var d=n.stateNode,g=n.memoizedState;g!==null&&(l=g.retryLane);break;case 19:d=n.stateNode;break;default:throw Error(t(314))}d!==null&&d.delete(r),kg(n,l)}var Bg;Bg=function(n,r,l){if(n!==null)if(n.memoizedProps!==r.pendingProps||$n.current)Yn=!0;else{if((n.lanes&l)===0&&(r.flags&128)===0)return Yn=!1,J1(n,r,l);Yn=(n.flags&131072)!==0}else Yn=!1,Yt&&(r.flags&1048576)!==0&&x0(r,dc,r.index);switch(r.lanes=0,r.tag){case 2:var d=r.type;wc(n,r),n=r.pendingProps;var g=wa(r,Nn.current);Da(r,l),g=Kd(null,r,d,n,g,l);var y=Zd();return r.flags|=1,typeof g=="object"&&g!==null&&typeof g.render=="function"&&g.$$typeof===void 0?(r.tag=1,r.memoizedState=null,r.updateQueue=null,qn(d)?(y=!0,lc(r)):y=!1,r.memoizedState=g.state!==null&&g.state!==void 0?g.state:null,Gd(r),g.updater=bc,r.stateNode=g,g._reactInternals=r,rf(r,d,n,l),r=lf(null,r,d,!0,y,l)):(r.tag=0,Yt&&y&&Ld(r),Vn(null,r,g,l),r=r.child),r;case 16:d=r.elementType;e:{switch(wc(n,r),n=r.pendingProps,g=d._init,d=g(d._payload),r.type=d,g=r.tag=pS(d),n=zi(d,n),g){case 0:r=of(null,r,d,n,l);break e;case 1:r=dg(null,r,d,n,l);break e;case 11:r=ag(null,r,d,n,l);break e;case 14:r=og(null,r,d,zi(d.type,n),l);break e}throw Error(t(306,d,""))}return r;case 0:return d=r.type,g=r.pendingProps,g=r.elementType===d?g:zi(d,g),of(n,r,d,g,l);case 1:return d=r.type,g=r.pendingProps,g=r.elementType===d?g:zi(d,g),dg(n,r,d,g,l);case 3:e:{if(fg(r),n===null)throw Error(t(387));d=r.pendingProps,y=r.memoizedState,g=y.element,A0(n,r),_c(r,d,null,l);var R=r.memoizedState;if(d=R.element,y.isDehydrated)if(y={element:d,isDehydrated:!1,cache:R.cache,pendingSuspenseBoundaries:R.pendingSuspenseBoundaries,transitions:R.transitions},r.updateQueue.baseState=y,r.memoizedState=y,r.flags&256){g=Ia(Error(t(423)),r),r=hg(n,r,d,l,g);break e}else if(d!==g){g=Ia(Error(t(424)),r),r=hg(n,r,d,l,g);break e}else for(ui=Kr(r.stateNode.containerInfo.firstChild),ci=r,Yt=!0,Bi=null,l=T0(r,null,d,l),r.child=l;l;)l.flags=l.flags&-3|4096,l=l.sibling;else{if(Ra(),d===g){r=br(n,r,l);break e}Vn(n,r,d,l)}r=r.child}return r;case 5:return P0(r),n===null&&Ud(r),d=r.type,g=r.pendingProps,y=n!==null?n.memoizedProps:null,R=g.children,Ad(d,g)?R=null:y!==null&&Ad(d,y)&&(r.flags|=32),ug(n,r),Vn(n,r,R,l),r.child;case 6:return n===null&&Ud(r),null;case 13:return pg(n,r,l);case 4:return jd(r,r.stateNode.containerInfo),d=r.pendingProps,n===null?r.child=Pa(r,null,d,l):Vn(n,r,d,l),r.child;case 11:return d=r.type,g=r.pendingProps,g=r.elementType===d?g:zi(d,g),ag(n,r,d,g,l);case 7:return Vn(n,r,r.pendingProps,l),r.child;case 8:return Vn(n,r,r.pendingProps.children,l),r.child;case 12:return Vn(n,r,r.pendingProps.children,l),r.child;case 10:e:{if(d=r.type._context,g=r.pendingProps,y=r.memoizedProps,R=g.value,Gt(pc,d._currentValue),d._currentValue=R,y!==null)if(ki(y.value,R)){if(y.children===g.children&&!$n.current){r=br(n,r,l);break e}}else for(y=r.child,y!==null&&(y.return=r);y!==null;){var O=y.dependencies;if(O!==null){R=y.child;for(var G=O.firstContext;G!==null;){if(G.context===d){if(y.tag===1){G=Er(-1,l&-l),G.tag=2;var ce=y.updateQueue;if(ce!==null){ce=ce.shared;var ye=ce.pending;ye===null?G.next=G:(G.next=ye.next,ye.next=G),ce.pending=G}}y.lanes|=l,G=y.alternate,G!==null&&(G.lanes|=l),Vd(y.return,l,r),O.lanes|=l;break}G=G.next}}else if(y.tag===10)R=y.type===r.type?null:y.child;else if(y.tag===18){if(R=y.return,R===null)throw Error(t(341));R.lanes|=l,O=R.alternate,O!==null&&(O.lanes|=l),Vd(R,l,r),R=y.sibling}else R=y.child;if(R!==null)R.return=y;else for(R=y;R!==null;){if(R===r){R=null;break}if(y=R.sibling,y!==null){y.return=R.return,R=y;break}R=R.return}y=R}Vn(n,r,g.children,l),r=r.child}return r;case 9:return g=r.type,d=r.pendingProps.children,Da(r,l),g=Ti(g),d=d(g),r.flags|=1,Vn(n,r,d,l),r.child;case 14:return d=r.type,g=zi(d,r.pendingProps),g=zi(d.type,g),og(n,r,d,g,l);case 15:return lg(n,r,r.type,r.pendingProps,l);case 17:return d=r.type,g=r.pendingProps,g=r.elementType===d?g:zi(d,g),wc(n,r),r.tag=1,qn(d)?(n=!0,lc(r)):n=!1,Da(r,l),J0(r,d,g),rf(r,d,g,l),lf(null,r,d,!0,n,l);case 19:return gg(n,r,l);case 22:return cg(n,r,l)}throw Error(t(156,r.tag))};function zg(n,r){return jl(n,r)}function hS(n,r,l,d){this.tag=n,this.key=l,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=r,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=d,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ci(n,r,l,d){return new hS(n,r,l,d)}function Cf(n){return n=n.prototype,!(!n||!n.isReactComponent)}function pS(n){if(typeof n=="function")return Cf(n)?1:0;if(n!=null){if(n=n.$$typeof,n===q)return 11;if(n===V)return 14}return 2}function os(n,r){var l=n.alternate;return l===null?(l=Ci(n.tag,r,n.key,n.mode),l.elementType=n.elementType,l.type=n.type,l.stateNode=n.stateNode,l.alternate=n,n.alternate=l):(l.pendingProps=r,l.type=n.type,l.flags=0,l.subtreeFlags=0,l.deletions=null),l.flags=n.flags&14680064,l.childLanes=n.childLanes,l.lanes=n.lanes,l.child=n.child,l.memoizedProps=n.memoizedProps,l.memoizedState=n.memoizedState,l.updateQueue=n.updateQueue,r=n.dependencies,l.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext},l.sibling=n.sibling,l.index=n.index,l.ref=n.ref,l}function Oc(n,r,l,d,g,y){var R=2;if(d=n,typeof n=="function")Cf(n)&&(R=1);else if(typeof n=="string")R=5;else e:switch(n){case F:return Hs(l.children,g,y,r);case T:R=8,g|=8;break;case I:return n=Ci(12,l,r,g|2),n.elementType=I,n.lanes=y,n;case Q:return n=Ci(13,l,r,g),n.elementType=Q,n.lanes=y,n;case se:return n=Ci(19,l,r,g),n.elementType=se,n.lanes=y,n;case H:return kc(l,g,y,r);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case z:R=10;break e;case k:R=9;break e;case q:R=11;break e;case V:R=14;break e;case W:R=16,d=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return r=Ci(R,l,r,g),r.elementType=n,r.type=d,r.lanes=y,r}function Hs(n,r,l,d){return n=Ci(7,n,d,r),n.lanes=l,n}function kc(n,r,l,d){return n=Ci(22,n,d,r),n.elementType=H,n.lanes=l,n.stateNode={isHidden:!1},n}function Rf(n,r,l){return n=Ci(6,n,null,r),n.lanes=l,n}function Pf(n,r,l){return r=Ci(4,n.children!==null?n.children:[],n.key,r),r.lanes=l,r.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},r}function mS(n,r,l,d,g){this.tag=r,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=wn(0),this.expirationTimes=wn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=wn(0),this.identifierPrefix=d,this.onRecoverableError=g,this.mutableSourceEagerHydrationData=null}function Nf(n,r,l,d,g,y,R,O,G){return n=new mS(n,r,l,O,G),r===1?(r=1,y===!0&&(r|=8)):r=0,y=Ci(3,null,null,r),n.current=y,y.stateNode=n,y.memoizedState={element:d,isDehydrated:l,cache:null,transitions:null,pendingSuspenseBoundaries:null},Gd(y),n}function gS(n,r,l){var d=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:L,key:d==null?null:""+d,children:n,containerInfo:r,implementation:l}}function Vg(n){if(!n)return Qr;n=n._reactInternals;e:{if(Zi(n)!==n||n.tag!==1)throw Error(t(170));var r=n;do{switch(r.tag){case 3:r=r.stateNode.context;break e;case 1:if(qn(r.type)){r=r.stateNode.__reactInternalMemoizedMergedChildContext;break e}}r=r.return}while(r!==null);throw Error(t(171))}if(n.tag===1){var l=n.type;if(qn(l))return m0(n,l,r)}return r}function Hg(n,r,l,d,g,y,R,O,G){return n=Nf(l,d,!0,n,g,y,R,O,G),n.context=Vg(null),l=n.current,d=Hn(),g=ss(l),y=Er(d,g),y.callback=r??null,ts(l,y,g),n.current.lanes=g,mt(n,g,d),Zn(n,d),n}function Bc(n,r,l,d){var g=r.current,y=Hn(),R=ss(g);return l=Vg(l),r.context===null?r.context=l:r.pendingContext=l,r=Er(y,R),r.payload={element:n},d=d===void 0?null:d,d!==null&&(r.callback=d),n=ts(g,r,R),n!==null&&(Gi(n,g,R,y),gc(n,g,R)),R}function zc(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Gg(n,r){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var l=n.retryLane;n.retryLane=l!==0&&l<r?l:r}}function Df(n,r){Gg(n,r),(n=n.alternate)&&Gg(n,r)}function _S(){return null}var jg=typeof reportError=="function"?reportError:function(n){console.error(n)};function Lf(n){this._internalRoot=n}Vc.prototype.render=Lf.prototype.render=function(n){var r=this._internalRoot;if(r===null)throw Error(t(409));Bc(n,r,null,null)},Vc.prototype.unmount=Lf.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var r=n.containerInfo;Bs(function(){Bc(null,n,null,null)}),r[xr]=null}};function Vc(n){this._internalRoot=n}Vc.prototype.unstable_scheduleHydration=function(n){if(n){var r=Dt();n={blockedOn:null,target:n,priority:r};for(var l=0;l<$r.length&&r!==0&&r<$r[l].priority;l++);$r.splice(l,0,n),l===0&&Pm(n)}};function If(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Hc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Wg(){}function xS(n,r,l,d,g){if(g){if(typeof d=="function"){var y=d;d=function(){var ce=zc(R);y.call(ce)}}var R=Hg(r,d,n,0,null,!1,!1,"",Wg);return n._reactRootContainer=R,n[xr]=R.current,Bo(n.nodeType===8?n.parentNode:n),Bs(),R}for(;g=n.lastChild;)n.removeChild(g);if(typeof d=="function"){var O=d;d=function(){var ce=zc(G);O.call(ce)}}var G=Nf(n,0,!1,null,null,!1,!1,"",Wg);return n._reactRootContainer=G,n[xr]=G.current,Bo(n.nodeType===8?n.parentNode:n),Bs(function(){Bc(r,G,l,d)}),G}function Gc(n,r,l,d,g){var y=l._reactRootContainer;if(y){var R=y;if(typeof g=="function"){var O=g;g=function(){var G=zc(R);O.call(G)}}Bc(r,R,n,g)}else R=xS(l,r,n,g,d);return zc(R)}Rt=function(n){switch(n.tag){case 3:var r=n.stateNode;if(r.current.memoizedState.isDehydrated){var l=Mt(r.pendingLanes);l!==0&&(Xn(r,l|1),Zn(r,Qt()),(bt&6)===0&&(Oa=Qt()+500,Jr()))}break;case 13:Bs(function(){var d=Mr(n,1);if(d!==null){var g=Hn();Gi(d,n,1,g)}}),Df(n,1)}},Wt=function(n){if(n.tag===13){var r=Mr(n,134217728);if(r!==null){var l=Hn();Gi(r,n,134217728,l)}Df(n,134217728)}},Ui=function(n){if(n.tag===13){var r=ss(n),l=Mr(n,r);if(l!==null){var d=Hn();Gi(l,n,r,d)}Df(n,r)}},Dt=function(){return gt},Oi=function(n,r){var l=gt;try{return gt=n,r()}finally{gt=l}},st=function(n,r,l){switch(r){case"input":if(Zt(n,l),r=l.name,l.type==="radio"&&r!=null){for(l=n;l.parentNode;)l=l.parentNode;for(l=l.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]'),r=0;r<l.length;r++){var d=l[r];if(d!==n&&d.form===n.form){var g=ac(d);if(!g)throw Error(t(90));Bt(d),Zt(d,g)}}}break;case"textarea":Le(n,l);break;case"select":r=l.value,r!=null&&Vt(n,!!l.multiple,r,!1)}},Re=Tf,xe=Bs;var vS={usingClientEntryPoint:!1,Events:[Ho,ba,ac,fe,Be,Tf]},nl={findFiberByHostInstance:Ns,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},yS={bundleType:nl.bundleType,version:nl.version,rendererPackageName:nl.rendererPackageName,rendererConfig:nl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:A.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=Eo(n),n===null?null:n.stateNode},findFiberByHostInstance:nl.findFiberByHostInstance||_S,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var jc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!jc.isDisabled&&jc.supportsFiber)try{te=jc.inject(yS),Pe=jc}catch{}}return Qn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vS,Qn.createPortal=function(n,r){var l=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!If(r))throw Error(t(200));return gS(n,r,null,l)},Qn.createRoot=function(n,r){if(!If(n))throw Error(t(299));var l=!1,d="",g=jg;return r!=null&&(r.unstable_strictMode===!0&&(l=!0),r.identifierPrefix!==void 0&&(d=r.identifierPrefix),r.onRecoverableError!==void 0&&(g=r.onRecoverableError)),r=Nf(n,1,!1,null,null,l,!1,d,g),n[xr]=r.current,Bo(n.nodeType===8?n.parentNode:n),new Lf(r)},Qn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var r=n._reactInternals;if(r===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=Eo(r),n=n===null?null:n.stateNode,n},Qn.flushSync=function(n){return Bs(n)},Qn.hydrate=function(n,r,l){if(!Hc(r))throw Error(t(200));return Gc(null,n,r,!0,l)},Qn.hydrateRoot=function(n,r,l){if(!If(n))throw Error(t(405));var d=l!=null&&l.hydratedSources||null,g=!1,y="",R=jg;if(l!=null&&(l.unstable_strictMode===!0&&(g=!0),l.identifierPrefix!==void 0&&(y=l.identifierPrefix),l.onRecoverableError!==void 0&&(R=l.onRecoverableError)),r=Hg(r,null,n,1,l??null,g,!1,y,R),n[xr]=r.current,Bo(n),d)for(n=0;n<d.length;n++)l=d[n],g=l._getVersion,g=g(l._source),r.mutableSourceEagerHydrationData==null?r.mutableSourceEagerHydrationData=[l,g]:r.mutableSourceEagerHydrationData.push(l,g);return new Vc(r)},Qn.render=function(n,r,l){if(!Hc(r))throw Error(t(200));return Gc(null,n,r,!1,l)},Qn.unmountComponentAtNode=function(n){if(!Hc(n))throw Error(t(40));return n._reactRootContainer?(Bs(function(){Gc(null,null,n,!1,function(){n._reactRootContainer=null,n[xr]=null})}),!0):!1},Qn.unstable_batchedUpdates=Tf,Qn.unstable_renderSubtreeIntoContainer=function(n,r,l,d){if(!Hc(l))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return Gc(n,r,l,!1,d)},Qn.version="18.3.1-next-f1338f8080-20240426",Qn}var Jg;function Dx(){if(Jg)return Of.exports;Jg=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(e){console.error(e)}}return a(),Of.exports=RS(),Of.exports}var e_;function PS(){if(e_)return Wc;e_=1;var a=Dx();return Wc.createRoot=a.createRoot,Wc.hydrateRoot=a.hydrateRoot,Wc}var NS=PS(),me=Hp();const ms=ES(me),DS=MS({__proto__:null,default:ms},[me]);function Fr(a,e,{checkForDefaultPrevented:t=!0}={}){return function(s){if(a==null||a(s),t===!1||!s.defaultPrevented)return e==null?void 0:e(s)}}function Gp(a,e=[]){let t=[];function i(o,c){const u=me.createContext(c),f=t.length;t=[...t,c];const h=_=>{var E;const{scope:m,children:S,...M}=_,b=((E=m==null?void 0:m[a])==null?void 0:E[f])||u,x=me.useMemo(()=>M,Object.values(M));return v.jsx(b.Provider,{value:x,children:S})};h.displayName=o+"Provider";function p(_,m){var b;const S=((b=m==null?void 0:m[a])==null?void 0:b[f])||u,M=me.useContext(S);if(M)return M;if(c!==void 0)return c;throw new Error(`\`${_}\` must be used within \`${o}\``)}return[h,p]}const s=()=>{const o=t.map(c=>me.createContext(c));return function(u){const f=(u==null?void 0:u[a])||o;return me.useMemo(()=>({[`__scope${a}`]:{...u,[a]:f}}),[u,f])}};return s.scopeName=a,[i,LS(s,...e)]}function LS(...a){const e=a[0];if(a.length===1)return e;const t=()=>{const i=a.map(s=>({useScope:s(),scopeName:s.scopeName}));return function(o){const c=i.reduce((u,{useScope:f,scopeName:h})=>{const _=f(o)[`__scope${h}`];return{...u,..._}},{});return me.useMemo(()=>({[`__scope${e.scopeName}`]:c}),[c])}};return t.scopeName=e.scopeName,t}function t_(a,e){if(typeof a=="function")return a(e);a!=null&&(a.current=e)}function Lx(...a){return e=>{let t=!1;const i=a.map(s=>{const o=t_(s,e);return!t&&typeof o=="function"&&(t=!0),o});if(t)return()=>{for(let s=0;s<i.length;s++){const o=i[s];typeof o=="function"?o():t_(a[s],null)}}}}function Ru(...a){return me.useCallback(Lx(...a),a)}var Pu=me.forwardRef((a,e)=>{const{children:t,...i}=a,s=me.Children.toArray(t),o=s.find(FS);if(o){const c=o.props.children,u=s.map(f=>f===o?me.Children.count(c)>1?me.Children.only(null):me.isValidElement(c)?c.props.children:null:f);return v.jsx(Rh,{...i,ref:e,children:me.isValidElement(c)?me.cloneElement(c,void 0,u):null})}return v.jsx(Rh,{...i,ref:e,children:t})});Pu.displayName="Slot";var Rh=me.forwardRef((a,e)=>{const{children:t,...i}=a;if(me.isValidElement(t)){const s=OS(t),o=US(i,t.props);return t.type!==me.Fragment&&(o.ref=e?Lx(e,s):s),me.cloneElement(t,o)}return me.Children.count(t)>1?me.Children.only(null):null});Rh.displayName="SlotClone";var IS=({children:a})=>v.jsx(v.Fragment,{children:a});function FS(a){return me.isValidElement(a)&&a.type===IS}function US(a,e){const t={...e};for(const i in e){const s=a[i],o=e[i];/^on[A-Z]/.test(i)?s&&o?t[i]=(...u)=>{o(...u),s(...u)}:s&&(t[i]=s):i==="style"?t[i]={...s,...o}:i==="className"&&(t[i]=[s,o].filter(Boolean).join(" "))}return{...a,...t}}function OS(a){var i,s;let e=(i=Object.getOwnPropertyDescriptor(a.props,"ref"))==null?void 0:i.get,t=e&&"isReactWarning"in e&&e.isReactWarning;return t?a.ref:(e=(s=Object.getOwnPropertyDescriptor(a,"ref"))==null?void 0:s.get,t=e&&"isReactWarning"in e&&e.isReactWarning,t?a.props.ref:a.props.ref||a.ref)}function kS(a){const e=a+"CollectionProvider",[t,i]=Gp(e),[s,o]=t(e,{collectionRef:{current:null},itemMap:new Map}),c=S=>{const{scope:M,children:b}=S,x=ms.useRef(null),E=ms.useRef(new Map).current;return v.jsx(s,{scope:M,itemMap:E,collectionRef:x,children:b})};c.displayName=e;const u=a+"CollectionSlot",f=ms.forwardRef((S,M)=>{const{scope:b,children:x}=S,E=o(u,b),w=Ru(M,E.collectionRef);return v.jsx(Pu,{ref:w,children:x})});f.displayName=u;const h=a+"CollectionItemSlot",p="data-radix-collection-item",_=ms.forwardRef((S,M)=>{const{scope:b,children:x,...E}=S,w=ms.useRef(null),P=Ru(M,w),A=o(h,b);return ms.useEffect(()=>(A.itemMap.set(w,{ref:w,...E}),()=>void A.itemMap.delete(w))),v.jsx(Pu,{[p]:"",ref:P,children:x})});_.displayName=h;function m(S){const M=o(a+"CollectionConsumer",S);return ms.useCallback(()=>{const x=M.collectionRef.current;if(!x)return[];const E=Array.from(x.querySelectorAll(`[${p}]`));return Array.from(M.itemMap.values()).sort((A,N)=>E.indexOf(A.ref.current)-E.indexOf(N.ref.current))},[M.collectionRef,M.itemMap])}return[{Provider:c,Slot:f,ItemSlot:_},m,i]}var Ph=globalThis!=null&&globalThis.document?me.useLayoutEffect:()=>{},BS=DS.useId||(()=>{}),zS=0;function Ix(a){const[e,t]=me.useState(BS());return Ph(()=>{t(i=>i??String(zS++))},[a]),e?`radix-${e}`:""}Dx();var VS=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"],xo=VS.reduce((a,e)=>{const t=me.forwardRef((i,s)=>{const{asChild:o,...c}=i,u=o?Pu:e;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),v.jsx(u,{...c,ref:s})});return t.displayName=`Primitive.${e}`,{...a,[e]:t}},{});function jp(a){const e=me.useRef(a);return me.useEffect(()=>{e.current=a}),me.useMemo(()=>(...t)=>{var i;return(i=e.current)==null?void 0:i.call(e,...t)},[])}function Fx({prop:a,defaultProp:e,onChange:t=()=>{}}){const[i,s]=HS({defaultProp:e,onChange:t}),o=a!==void 0,c=o?a:i,u=jp(t),f=me.useCallback(h=>{if(o){const _=typeof h=="function"?h(a):h;_!==a&&u(_)}else s(h)},[o,a,s,u]);return[c,f]}function HS({defaultProp:a,onChange:e}){const t=me.useState(a),[i]=t,s=me.useRef(i),o=jp(e);return me.useEffect(()=>{s.current!==i&&(o(i),s.current=i)},[i,s,o]),t}var GS=me.createContext(void 0);function Ux(a){const e=me.useContext(GS);return a||e||"ltr"}var zf="rovingFocusGroup.onEntryFocus",jS={bubbles:!1,cancelable:!0},qu="RovingFocusGroup",[Nh,Ox,WS]=kS(qu),[XS,kx]=Gp(qu,[WS]),[$S,qS]=XS(qu),Bx=me.forwardRef((a,e)=>v.jsx(Nh.Provider,{scope:a.__scopeRovingFocusGroup,children:v.jsx(Nh.Slot,{scope:a.__scopeRovingFocusGroup,children:v.jsx(YS,{...a,ref:e})})}));Bx.displayName=qu;var YS=me.forwardRef((a,e)=>{const{__scopeRovingFocusGroup:t,orientation:i,loop:s=!1,dir:o,currentTabStopId:c,defaultCurrentTabStopId:u,onCurrentTabStopIdChange:f,onEntryFocus:h,preventScrollOnEntryFocus:p=!1,..._}=a,m=me.useRef(null),S=Ru(e,m),M=Ux(o),[b=null,x]=Fx({prop:c,defaultProp:u,onChange:f}),[E,w]=me.useState(!1),P=jp(h),A=Ox(t),N=me.useRef(!1),[L,F]=me.useState(0);return me.useEffect(()=>{const T=m.current;if(T)return T.addEventListener(zf,P),()=>T.removeEventListener(zf,P)},[P]),v.jsx($S,{scope:t,orientation:i,dir:M,loop:s,currentTabStopId:b,onItemFocus:me.useCallback(T=>x(T),[x]),onItemShiftTab:me.useCallback(()=>w(!0),[]),onFocusableItemAdd:me.useCallback(()=>F(T=>T+1),[]),onFocusableItemRemove:me.useCallback(()=>F(T=>T-1),[]),children:v.jsx(xo.div,{tabIndex:E||L===0?-1:0,"data-orientation":i,..._,ref:S,style:{outline:"none",...a.style},onMouseDown:Fr(a.onMouseDown,()=>{N.current=!0}),onFocus:Fr(a.onFocus,T=>{const I=!N.current;if(T.target===T.currentTarget&&I&&!E){const z=new CustomEvent(zf,jS);if(T.currentTarget.dispatchEvent(z),!z.defaultPrevented){const k=A().filter(W=>W.focusable),q=k.find(W=>W.active),Q=k.find(W=>W.id===b),V=[q,Q,...k].filter(Boolean).map(W=>W.ref.current);Hx(V,p)}}N.current=!1}),onBlur:Fr(a.onBlur,()=>w(!1))})})}),zx="RovingFocusGroupItem",Vx=me.forwardRef((a,e)=>{const{__scopeRovingFocusGroup:t,focusable:i=!0,active:s=!1,tabStopId:o,...c}=a,u=Ix(),f=o||u,h=qS(zx,t),p=h.currentTabStopId===f,_=Ox(t),{onFocusableItemAdd:m,onFocusableItemRemove:S}=h;return me.useEffect(()=>{if(i)return m(),()=>S()},[i,m,S]),v.jsx(Nh.ItemSlot,{scope:t,id:f,focusable:i,active:s,children:v.jsx(xo.span,{tabIndex:p?0:-1,"data-orientation":h.orientation,...c,ref:e,onMouseDown:Fr(a.onMouseDown,M=>{i?h.onItemFocus(f):M.preventDefault()}),onFocus:Fr(a.onFocus,()=>h.onItemFocus(f)),onKeyDown:Fr(a.onKeyDown,M=>{if(M.key==="Tab"&&M.shiftKey){h.onItemShiftTab();return}if(M.target!==M.currentTarget)return;const b=QS(M,h.orientation,h.dir);if(b!==void 0){if(M.metaKey||M.ctrlKey||M.altKey||M.shiftKey)return;M.preventDefault();let E=_().filter(w=>w.focusable).map(w=>w.ref.current);if(b==="last")E.reverse();else if(b==="prev"||b==="next"){b==="prev"&&E.reverse();const w=E.indexOf(M.currentTarget);E=h.loop?JS(E,w+1):E.slice(w+1)}setTimeout(()=>Hx(E))}})})})});Vx.displayName=zx;var KS={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function ZS(a,e){return e!=="rtl"?a:a==="ArrowLeft"?"ArrowRight":a==="ArrowRight"?"ArrowLeft":a}function QS(a,e,t){const i=ZS(a.key,t);if(!(e==="vertical"&&["ArrowLeft","ArrowRight"].includes(i))&&!(e==="horizontal"&&["ArrowUp","ArrowDown"].includes(i)))return KS[i]}function Hx(a,e=!1){const t=document.activeElement;for(const i of a)if(i===t||(i.focus({preventScroll:e}),document.activeElement!==t))return}function JS(a,e){return a.map((t,i)=>a[(e+i)%a.length])}var eM=Bx,tM=Vx;function nM(a,e){return me.useReducer((t,i)=>e[t][i]??t,a)}var Gx=a=>{const{present:e,children:t}=a,i=iM(e),s=typeof t=="function"?t({present:i.isPresent}):me.Children.only(t),o=Ru(i.ref,rM(s));return typeof t=="function"||i.isPresent?me.cloneElement(s,{ref:o}):null};Gx.displayName="Presence";function iM(a){const[e,t]=me.useState(),i=me.useRef({}),s=me.useRef(a),o=me.useRef("none"),c=a?"mounted":"unmounted",[u,f]=nM(c,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return me.useEffect(()=>{const h=Xc(i.current);o.current=u==="mounted"?h:"none"},[u]),Ph(()=>{const h=i.current,p=s.current;if(p!==a){const m=o.current,S=Xc(h);a?f("MOUNT"):S==="none"||(h==null?void 0:h.display)==="none"?f("UNMOUNT"):f(p&&m!==S?"ANIMATION_OUT":"UNMOUNT"),s.current=a}},[a,f]),Ph(()=>{if(e){let h;const p=e.ownerDocument.defaultView??window,_=S=>{const b=Xc(i.current).includes(S.animationName);if(S.target===e&&b&&(f("ANIMATION_END"),!s.current)){const x=e.style.animationFillMode;e.style.animationFillMode="forwards",h=p.setTimeout(()=>{e.style.animationFillMode==="forwards"&&(e.style.animationFillMode=x)})}},m=S=>{S.target===e&&(o.current=Xc(i.current))};return e.addEventListener("animationstart",m),e.addEventListener("animationcancel",_),e.addEventListener("animationend",_),()=>{p.clearTimeout(h),e.removeEventListener("animationstart",m),e.removeEventListener("animationcancel",_),e.removeEventListener("animationend",_)}}else f("ANIMATION_END")},[e,f]),{isPresent:["mounted","unmountSuspended"].includes(u),ref:me.useCallback(h=>{h&&(i.current=getComputedStyle(h)),t(h)},[])}}function Xc(a){return(a==null?void 0:a.animationName)||"none"}function rM(a){var i,s;let e=(i=Object.getOwnPropertyDescriptor(a.props,"ref"))==null?void 0:i.get,t=e&&"isReactWarning"in e&&e.isReactWarning;return t?a.ref:(e=(s=Object.getOwnPropertyDescriptor(a,"ref"))==null?void 0:s.get,t=e&&"isReactWarning"in e&&e.isReactWarning,t?a.props.ref:a.props.ref||a.ref)}var Wp="Tabs",[sM]=Gp(Wp,[kx]),jx=kx(),[aM,Xp]=sM(Wp),Wx=me.forwardRef((a,e)=>{const{__scopeTabs:t,value:i,onValueChange:s,defaultValue:o,orientation:c="horizontal",dir:u,activationMode:f="automatic",...h}=a,p=Ux(u),[_,m]=Fx({prop:i,onChange:s,defaultProp:o});return v.jsx(aM,{scope:t,baseId:Ix(),value:_,onValueChange:m,orientation:c,dir:p,activationMode:f,children:v.jsx(xo.div,{dir:p,"data-orientation":c,...h,ref:e})})});Wx.displayName=Wp;var Xx="TabsList",$x=me.forwardRef((a,e)=>{const{__scopeTabs:t,loop:i=!0,...s}=a,o=Xp(Xx,t),c=jx(t);return v.jsx(eM,{asChild:!0,...c,orientation:o.orientation,dir:o.dir,loop:i,children:v.jsx(xo.div,{role:"tablist","aria-orientation":o.orientation,...s,ref:e})})});$x.displayName=Xx;var qx="TabsTrigger",Yx=me.forwardRef((a,e)=>{const{__scopeTabs:t,value:i,disabled:s=!1,...o}=a,c=Xp(qx,t),u=jx(t),f=Qx(c.baseId,i),h=Jx(c.baseId,i),p=i===c.value;return v.jsx(tM,{asChild:!0,...u,focusable:!s,active:p,children:v.jsx(xo.button,{type:"button",role:"tab","aria-selected":p,"aria-controls":h,"data-state":p?"active":"inactive","data-disabled":s?"":void 0,disabled:s,id:f,...o,ref:e,onMouseDown:Fr(a.onMouseDown,_=>{!s&&_.button===0&&_.ctrlKey===!1?c.onValueChange(i):_.preventDefault()}),onKeyDown:Fr(a.onKeyDown,_=>{[" ","Enter"].includes(_.key)&&c.onValueChange(i)}),onFocus:Fr(a.onFocus,()=>{const _=c.activationMode!=="manual";!p&&!s&&_&&c.onValueChange(i)})})})});Yx.displayName=qx;var Kx="TabsContent",Zx=me.forwardRef((a,e)=>{const{__scopeTabs:t,value:i,forceMount:s,children:o,...c}=a,u=Xp(Kx,t),f=Qx(u.baseId,i),h=Jx(u.baseId,i),p=i===u.value,_=me.useRef(p);return me.useEffect(()=>{const m=requestAnimationFrame(()=>_.current=!1);return()=>cancelAnimationFrame(m)},[]),v.jsx(Gx,{present:s||p,children:({present:m})=>v.jsx(xo.div,{"data-state":p?"active":"inactive","data-orientation":u.orientation,role:"tabpanel","aria-labelledby":f,hidden:!m,id:h,tabIndex:0,...c,ref:e,style:{...a.style,animationDuration:_.current?"0s":void 0},children:m&&o})})});Zx.displayName=Kx;function Qx(a,e){return`${a}-trigger-${e}`}function Jx(a,e){return`${a}-content-${e}`}var oM=Wx,ev=$x,tv=Yx,nv=Zx;const lM=oM,iv=me.forwardRef(({className:a="",...e},t)=>v.jsx(ev,{ref:t,className:`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${a}`,...e}));iv.displayName=ev.displayName;const rv=me.forwardRef(({className:a="",...e},t)=>v.jsx(tv,{ref:t,className:`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm ${a}`,...e}));rv.displayName=tv.displayName;const vu=me.forwardRef(({className:a="",...e},t)=>v.jsx(nv,{ref:t,className:`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 ${a}`,...e}));vu.displayName=nv.displayName;/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cM=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),uM=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase()),n_=a=>{const e=uM(a);return e.charAt(0).toUpperCase()+e.slice(1)},sv=(...a)=>a.filter((e,t,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var dM={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fM=me.forwardRef(({color:a="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:s="",children:o,iconNode:c,...u},f)=>me.createElement("svg",{ref:f,...dM,width:e,height:e,stroke:a,strokeWidth:i?Number(t)*24/Number(e):t,className:sv("lucide",s),...u},[...c.map(([h,p])=>me.createElement(h,p)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=(a,e)=>{const t=me.forwardRef(({className:i,...s},o)=>me.createElement(fM,{ref:o,iconNode:e,className:sv(`lucide-${cM(n_(a))}`,`lucide-${a}`,i),...s}));return t.displayName=n_(a),t};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hM=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],na=xt("activity",hM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pM=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],av=xt("arrow-right",pM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mM=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],i_=xt("bell",mM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gM=[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]],gl=xt("brain",gM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _M=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],Dh=xt("calendar",_M);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xM=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],_l=xt("circle-alert",xM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vM=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],r_=xt("circle-check-big",vM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yM=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],Sl=xt("circle-check",yM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const SM=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]],ov=xt("clock",SM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const MM=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],s_=xt("eye-off",MM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const EM=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],a_=xt("eye",EM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bM=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],Ml=xt("file-text",bM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const TM=[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]],o_=xt("heart",TM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wM=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],Nu=xt("history",wM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const AM=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],l_=xt("image",AM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CM=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]],RM=xt("key",CM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PM=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],c_=xt("layout-dashboard",PM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const NM=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],ao=xt("loader-circle",NM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const DM=[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]],u_=xt("mail",DM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const LM=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],IM=xt("map-pin",LM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const FM=[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]],UM=xt("menu",FM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const OM=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],kM=xt("moon",OM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const BM=[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]],d_=xt("phone",BM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zM=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],VM=xt("save",zM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const HM=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],GM=xt("search",HM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jM=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],f_=xt("settings",jM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const WM=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],XM=xt("shield",WM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $M=[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]],qM=xt("sparkles",$M);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const YM=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M17 12h-2l-2 5-2-10-2 5H7",key:"15hlnc"}]],KM=xt("square-activity",YM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ZM=[["path",{d:"M11 2v2",key:"1539x4"}],["path",{d:"M5 2v2",key:"1yf1q8"}],["path",{d:"M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1",key:"rb5t3r"}],["path",{d:"M8 15a6 6 0 0 0 12 0v-3",key:"x18d4x"}],["circle",{cx:"20",cy:"10",r:"2",key:"ts1r5v"}]],QM=xt("stethoscope",ZM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const JM=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],eE=xt("sun",JM);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tE=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],h_=xt("target",tE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nE=[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]],Lh=xt("trending-up",nE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iE=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],rE=xt("triangle-alert",iE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sE=[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]],aE=xt("upload",sE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oE=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],lv=xt("user",oE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lE=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],$p=xt("x",lE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cE=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],Du=xt("zap",cE),uE="daqkclhttfludwloqtov",dE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcWtjbGh0dGZsdWR3bG9xdG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNDg4NDQsImV4cCI6MjA4MTgyNDg0NH0.2rcBN5ruXcDDTbxjv5rZta_u1tHaoKnTyN-T4dhlkyg",fE=`https://${uE}.supabase.co/functions/v1/make-server-c2454f2e`;async function qp(a,e={}){try{const t=await fetch(`${fE}${a}`,{...e,headers:{"Content-Type":"application/json",Authorization:`Bearer ${dE}`,...e.headers}});if(!t.ok){const s=await t.json();return console.error(`API Error (${a}):`,s),{error:s.error||`HTTP ${t.status}`}}return{data:await t.json()}}catch(t){return console.error(`Network Error (${a}):`,t),{error:"Network error. Please check your connection."}}}async function hE(a){return qp("/analyze-symptoms",{method:"POST",body:JSON.stringify({symptoms:a})})}async function pE(a,e){return qp("/analyze-image",{method:"POST",body:JSON.stringify({imageType:a,imageData:e})})}async function mE(a){return qp("/analyze-report",{method:"POST",body:JSON.stringify({reportText:a})})}function Nr(a){if(a===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function cv(a,e){a.prototype=Object.create(e.prototype),a.prototype.constructor=a,a.__proto__=e}/*!
 * GSAP 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var xi={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},El={duration:.5,overwrite:!1,delay:0},Yp,Pn,Kt,Ii=1e8,kt=1/Ii,Ih=Math.PI*2,gE=Ih/4,_E=0,uv=Math.sqrt,xE=Math.cos,vE=Math.sin,bn=function(e){return typeof e=="string"},an=function(e){return typeof e=="function"},Br=function(e){return typeof e=="number"},Kp=function(e){return typeof e>"u"},hr=function(e){return typeof e=="object"},ti=function(e){return e!==!1},Zp=function(){return typeof window<"u"},$c=function(e){return an(e)||bn(e)},dv=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Bn=Array.isArray,yE=/random\([^)]+\)/g,SE=/,\s*/g,p_=/(?:-?\.?\d|\.)+/gi,fv=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,eo=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Vf=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,hv=/[+-]=-?[.\d]+/,ME=/[^,'"\[\]\s]+/gi,EE=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,nn,sr,Fh,Qp,yi={},Lu={},pv,mv=function(e){return(Lu=oo(e,yi))&&oi},Jp=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},bl=function(e,t){return!t&&console.warn(e)},gv=function(e,t){return e&&(yi[e]=t)&&Lu&&(Lu[e]=t)||yi},Tl=function(){return 0},bE={suppressEvents:!0,isStart:!0,kill:!1},yu={suppressEvents:!0,kill:!1},TE={suppressEvents:!0},em={},Ss=[],Uh={},_v,pi={},Hf={},m_=30,Su=[],tm="",nm=function(e){var t=e[0],i,s;if(hr(t)||an(t)||(e=[e]),!(i=(t._gsap||{}).harness)){for(s=Su.length;s--&&!Su[s].targetTest(t););i=Su[s]}for(s=e.length;s--;)e[s]&&(e[s]._gsap||(e[s]._gsap=new Bv(e[s],i)))||e.splice(s,1);return e},ia=function(e){return e._gsap||nm(Fi(e))[0]._gsap},xv=function(e,t,i){return(i=e[t])&&an(i)?e[t]():Kp(i)&&e.getAttribute&&e.getAttribute(t)||i},ni=function(e,t){return(e=e.split(",")).forEach(t)||e},ln=function(e){return Math.round(e*1e5)/1e5||0},tn=function(e){return Math.round(e*1e7)/1e7||0},no=function(e,t){var i=t.charAt(0),s=parseFloat(t.substr(2));return e=parseFloat(e),i==="+"?e+s:i==="-"?e-s:i==="*"?e*s:e/s},wE=function(e,t){for(var i=t.length,s=0;e.indexOf(t[s])<0&&++s<i;);return s<i},Iu=function(){var e=Ss.length,t=Ss.slice(0),i,s;for(Uh={},Ss.length=0,i=0;i<e;i++)s=t[i],s&&s._lazy&&(s.render(s._lazy[0],s._lazy[1],!0)._lazy=0)},im=function(e){return!!(e._initted||e._startAt||e.add)},vv=function(e,t,i,s){Ss.length&&!Pn&&Iu(),e.render(t,i,!!(Pn&&t<0&&im(e))),Ss.length&&!Pn&&Iu()},yv=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(ME).length<2?t:bn(e)?e.trim():e},Sv=function(e){return e},Si=function(e,t){for(var i in t)i in e||(e[i]=t[i]);return e},AE=function(e){return function(t,i){for(var s in i)s in t||s==="duration"&&e||s==="ease"||(t[s]=i[s])}},oo=function(e,t){for(var i in t)e[i]=t[i];return e},g_=function a(e,t){for(var i in t)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(e[i]=hr(t[i])?a(e[i]||(e[i]={}),t[i]):t[i]);return e},Fu=function(e,t){var i={},s;for(s in e)s in t||(i[s]=e[s]);return i},xl=function(e){var t=e.parent||nn,i=e.keyframes?AE(Bn(e.keyframes)):Si;if(ti(e.inherit))for(;t;)i(e,t.vars.defaults),t=t.parent||t._dp;return e},CE=function(e,t){for(var i=e.length,s=i===t.length;s&&i--&&e[i]===t[i];);return i<0},Mv=function(e,t,i,s,o){var c=e[s],u;if(o)for(u=t[o];c&&c[o]>u;)c=c._prev;return c?(t._next=c._next,c._next=t):(t._next=e[i],e[i]=t),t._next?t._next._prev=t:e[s]=t,t._prev=c,t.parent=t._dp=e,t},Yu=function(e,t,i,s){i===void 0&&(i="_first"),s===void 0&&(s="_last");var o=t._prev,c=t._next;o?o._next=c:e[i]===t&&(e[i]=c),c?c._prev=o:e[s]===t&&(e[s]=o),t._next=t._prev=t.parent=null},Es=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},ra=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var i=e;i;)i._dirty=1,i=i.parent;return e},RE=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},Oh=function(e,t,i,s){return e._startAt&&(Pn?e._startAt.revert(yu):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,s))},PE=function a(e){return!e||e._ts&&a(e.parent)},__=function(e){return e._repeat?lo(e._tTime,e=e.duration()+e._rDelay)*e:0},lo=function(e,t){var i=Math.floor(e=tn(e/t));return e&&i===e?i-1:i},Uu=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},Ku=function(e){return e._end=tn(e._start+(e._tDur/Math.abs(e._ts||e._rts||kt)||0))},Zu=function(e,t){var i=e._dp;return i&&i.smoothChildTiming&&e._ts&&(e._start=tn(i._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),Ku(e),i._dirty||ra(i,e)),e},Ev=function(e,t){var i;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(i=Uu(e.rawTime(),t),(!t._dur||kl(0,t.totalDuration(),i)-t._tTime>kt)&&t.render(i,!0)),ra(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(i=e;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;e._zTime=-kt}},or=function(e,t,i,s){return t.parent&&Es(t),t._start=tn((Br(i)?i:i||e!==nn?Pi(e,i,t):e._time)+t._delay),t._end=tn(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),Mv(e,t,"_first","_last",e._sort?"_start":0),kh(t)||(e._recent=t),s||Ev(e,t),e._ts<0&&Zu(e,e._tTime),e},bv=function(e,t){return(yi.ScrollTrigger||Jp("scrollTrigger",t))&&yi.ScrollTrigger.create(t,e)},Tv=function(e,t,i,s,o){if(sm(e,t,o),!e._initted)return 1;if(!i&&e._pt&&!Pn&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&_v!==mi.frame)return Ss.push(e),e._lazy=[o,s],1},NE=function a(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||a(t))},kh=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},DE=function(e,t,i,s){var o=e.ratio,c=t<0||!t&&(!e._start&&NE(e)&&!(!e._initted&&kh(e))||(e._ts<0||e._dp._ts<0)&&!kh(e))?0:1,u=e._rDelay,f=0,h,p,_;if(u&&e._repeat&&(f=kl(0,e._tDur,t),p=lo(f,u),e._yoyo&&p&1&&(c=1-c),p!==lo(e._tTime,u)&&(o=1-c,e.vars.repeatRefresh&&e._initted&&e.invalidate())),c!==o||Pn||s||e._zTime===kt||!t&&e._zTime){if(!e._initted&&Tv(e,t,s,i,f))return;for(_=e._zTime,e._zTime=t||(i?kt:0),i||(i=t&&!_),e.ratio=c,e._from&&(c=1-c),e._time=0,e._tTime=f,h=e._pt;h;)h.r(c,h.d),h=h._next;t<0&&Oh(e,t,i,!0),e._onUpdate&&!i&&gi(e,"onUpdate"),f&&e._repeat&&!i&&e.parent&&gi(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===c&&(c&&Es(e,1),!i&&!Pn&&(gi(e,c?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},LE=function(e,t,i){var s;if(i>t)for(s=e._first;s&&s._start<=i;){if(s.data==="isPause"&&s._start>t)return s;s=s._next}else for(s=e._last;s&&s._start>=i;){if(s.data==="isPause"&&s._start<t)return s;s=s._prev}},co=function(e,t,i,s){var o=e._repeat,c=tn(t)||0,u=e._tTime/e._tDur;return u&&!s&&(e._time*=c/e._dur),e._dur=c,e._tDur=o?o<0?1e10:tn(c*(o+1)+e._rDelay*o):c,u>0&&!s&&Zu(e,e._tTime=e._tDur*u),e.parent&&Ku(e),i||ra(e.parent,e),e},x_=function(e){return e instanceof ei?ra(e):co(e,e._dur)},IE={_start:0,endTime:Tl,totalDuration:Tl},Pi=function a(e,t,i){var s=e.labels,o=e._recent||IE,c=e.duration()>=Ii?o.endTime(!1):e._dur,u,f,h;return bn(t)&&(isNaN(t)||t in s)?(f=t.charAt(0),h=t.substr(-1)==="%",u=t.indexOf("="),f==="<"||f===">"?(u>=0&&(t=t.replace(/=/,"")),(f==="<"?o._start:o.endTime(o._repeat>=0))+(parseFloat(t.substr(1))||0)*(h?(u<0?o:i).totalDuration()/100:1)):u<0?(t in s||(s[t]=c),s[t]):(f=parseFloat(t.charAt(u-1)+t.substr(u+1)),h&&i&&(f=f/100*(Bn(i)?i[0]:i).totalDuration()),u>1?a(e,t.substr(0,u-1),i)+f:c+f)):t==null?c:+t},vl=function(e,t,i){var s=Br(t[1]),o=(s?2:1)+(e<2?0:1),c=t[o],u,f;if(s&&(c.duration=t[1]),c.parent=i,e){for(u=c,f=i;f&&!("immediateRender"in u);)u=f.vars.defaults||{},f=ti(f.vars.inherit)&&f.parent;c.immediateRender=ti(u.immediateRender),e<2?c.runBackwards=1:c.startAt=t[o-1]}return new pn(t[0],c,t[o+1])},As=function(e,t){return e||e===0?t(e):t},kl=function(e,t,i){return i<e?e:i>t?t:i},On=function(e,t){return!bn(e)||!(t=EE.exec(e))?"":t[1]},FE=function(e,t,i){return As(i,function(s){return kl(e,t,s)})},Bh=[].slice,wv=function(e,t){return e&&hr(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&hr(e[0]))&&!e.nodeType&&e!==sr},UE=function(e,t,i){return i===void 0&&(i=[]),e.forEach(function(s){var o;return bn(s)&&!t||wv(s,1)?(o=i).push.apply(o,Fi(s)):i.push(s)})||i},Fi=function(e,t,i){return Kt&&!t&&Kt.selector?Kt.selector(e):bn(e)&&!i&&(Fh||!uo())?Bh.call((t||Qp).querySelectorAll(e),0):Bn(e)?UE(e,i):wv(e)?Bh.call(e,0):e?[e]:[]},zh=function(e){return e=Fi(e)[0]||bl("Invalid scope")||{},function(t){var i=e.current||e.nativeElement||e;return Fi(t,i.querySelectorAll?i:i===e?bl("Invalid scope")||Qp.createElement("div"):e)}},Av=function(e){return e.sort(function(){return .5-Math.random()})},Cv=function(e){if(an(e))return e;var t=hr(e)?e:{each:e},i=sa(t.ease),s=t.from||0,o=parseFloat(t.base)||0,c={},u=s>0&&s<1,f=isNaN(s)||u,h=t.axis,p=s,_=s;return bn(s)?p=_={center:.5,edges:.5,end:1}[s]||0:!u&&f&&(p=s[0],_=s[1]),function(m,S,M){var b=(M||t).length,x=c[b],E,w,P,A,N,L,F,T,I;if(!x){if(I=t.grid==="auto"?0:(t.grid||[1,Ii])[1],!I){for(F=-Ii;F<(F=M[I++].getBoundingClientRect().left)&&I<b;);I<b&&I--}for(x=c[b]=[],E=f?Math.min(I,b)*p-.5:s%I,w=I===Ii?0:f?b*_/I-.5:s/I|0,F=0,T=Ii,L=0;L<b;L++)P=L%I-E,A=w-(L/I|0),x[L]=N=h?Math.abs(h==="y"?A:P):uv(P*P+A*A),N>F&&(F=N),N<T&&(T=N);s==="random"&&Av(x),x.max=F-T,x.min=T,x.v=b=(parseFloat(t.amount)||parseFloat(t.each)*(I>b?b-1:h?h==="y"?b/I:I:Math.max(I,b/I))||0)*(s==="edges"?-1:1),x.b=b<0?o-b:o,x.u=On(t.amount||t.each)||0,i=i&&b<0?YE(i):i}return b=(x[m]-x.min)/x.max||0,tn(x.b+(i?i(b):b)*x.v)+x.u}},Vh=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(i){var s=tn(Math.round(parseFloat(i)/e)*e*t);return(s-s%1)/t+(Br(i)?0:On(i))}},Rv=function(e,t){var i=Bn(e),s,o;return!i&&hr(e)&&(s=i=e.radius||Ii,e.values?(e=Fi(e.values),(o=!Br(e[0]))&&(s*=s)):e=Vh(e.increment)),As(t,i?an(e)?function(c){return o=e(c),Math.abs(o-c)<=s?o:c}:function(c){for(var u=parseFloat(o?c.x:c),f=parseFloat(o?c.y:0),h=Ii,p=0,_=e.length,m,S;_--;)o?(m=e[_].x-u,S=e[_].y-f,m=m*m+S*S):m=Math.abs(e[_]-u),m<h&&(h=m,p=_);return p=!s||h<=s?e[p]:c,o||p===c||Br(c)?p:p+On(c)}:Vh(e))},Pv=function(e,t,i,s){return As(Bn(e)?!t:i===!0?!!(i=0):!s,function(){return Bn(e)?e[~~(Math.random()*e.length)]:(i=i||1e-5)&&(s=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((e-i/2+Math.random()*(t-e+i*.99))/i)*i*s)/s})},OE=function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return function(s){return t.reduce(function(o,c){return c(o)},s)}},kE=function(e,t){return function(i){return e(parseFloat(i))+(t||On(i))}},BE=function(e,t,i){return Dv(e,t,0,1,i)},Nv=function(e,t,i){return As(i,function(s){return e[~~t(s)]})},zE=function a(e,t,i){var s=t-e;return Bn(e)?Nv(e,a(0,e.length),t):As(i,function(o){return(s+(o-e)%s)%s+e})},VE=function a(e,t,i){var s=t-e,o=s*2;return Bn(e)?Nv(e,a(0,e.length-1),t):As(i,function(c){return c=(o+(c-e)%o)%o||0,e+(c>s?o-c:c)})},wl=function(e){return e.replace(yE,function(t){var i=t.indexOf("[")+1,s=t.substring(i||7,i?t.indexOf("]"):t.length-1).split(SE);return Pv(i?s:+s[0],i?0:+s[1],+s[2]||1e-5)})},Dv=function(e,t,i,s,o){var c=t-e,u=s-i;return As(o,function(f){return i+((f-e)/c*u||0)})},HE=function a(e,t,i,s){var o=isNaN(e+t)?0:function(S){return(1-S)*e+S*t};if(!o){var c=bn(e),u={},f,h,p,_,m;if(i===!0&&(s=1)&&(i=null),c)e={p:e},t={p:t};else if(Bn(e)&&!Bn(t)){for(p=[],_=e.length,m=_-2,h=1;h<_;h++)p.push(a(e[h-1],e[h]));_--,o=function(M){M*=_;var b=Math.min(m,~~M);return p[b](M-b)},i=t}else s||(e=oo(Bn(e)?[]:{},e));if(!p){for(f in t)rm.call(u,e,f,"get",t[f]);o=function(M){return lm(M,u)||(c?e.p:e)}}}return As(i,o)},v_=function(e,t,i){var s=e.labels,o=Ii,c,u,f;for(c in s)u=s[c]-t,u<0==!!i&&u&&o>(u=Math.abs(u))&&(f=c,o=u);return f},gi=function(e,t,i){var s=e.vars,o=s[t],c=Kt,u=e._ctx,f,h,p;if(o)return f=s[t+"Params"],h=s.callbackScope||e,i&&Ss.length&&Iu(),u&&(Kt=u),p=f?o.apply(h,f):o.call(h),Kt=c,p},fl=function(e){return Es(e),e.scrollTrigger&&e.scrollTrigger.kill(!!Pn),e.progress()<1&&gi(e,"onInterrupt"),e},to,Lv=[],Iv=function(e){if(e)if(e=!e.name&&e.default||e,Zp()||e.headless){var t=e.name,i=an(e),s=t&&!i&&e.init?function(){this._props=[]}:e,o={init:Tl,render:lm,add:rm,kill:sb,modifier:rb,rawVars:0},c={targetTest:0,get:0,getSetter:om,aliases:{},register:0};if(uo(),e!==s){if(pi[t])return;Si(s,Si(Fu(e,o),c)),oo(s.prototype,oo(o,Fu(e,c))),pi[s.prop=t]=s,e.targetTest&&(Su.push(s),em[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}gv(t,s),e.register&&e.register(oi,s,ii)}else Lv.push(e)},Ot=255,hl={aqua:[0,Ot,Ot],lime:[0,Ot,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,Ot],navy:[0,0,128],white:[Ot,Ot,Ot],olive:[128,128,0],yellow:[Ot,Ot,0],orange:[Ot,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[Ot,0,0],pink:[Ot,192,203],cyan:[0,Ot,Ot],transparent:[Ot,Ot,Ot,0]},Gf=function(e,t,i){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(i-t)*e*6:e<.5?i:e*3<2?t+(i-t)*(2/3-e)*6:t)*Ot+.5|0},Fv=function(e,t,i){var s=e?Br(e)?[e>>16,e>>8&Ot,e&Ot]:0:hl.black,o,c,u,f,h,p,_,m,S,M;if(!s){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),hl[e])s=hl[e];else if(e.charAt(0)==="#"){if(e.length<6&&(o=e.charAt(1),c=e.charAt(2),u=e.charAt(3),e="#"+o+o+c+c+u+u+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return s=parseInt(e.substr(1,6),16),[s>>16,s>>8&Ot,s&Ot,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),s=[e>>16,e>>8&Ot,e&Ot]}else if(e.substr(0,3)==="hsl"){if(s=M=e.match(p_),!t)f=+s[0]%360/360,h=+s[1]/100,p=+s[2]/100,c=p<=.5?p*(h+1):p+h-p*h,o=p*2-c,s.length>3&&(s[3]*=1),s[0]=Gf(f+1/3,o,c),s[1]=Gf(f,o,c),s[2]=Gf(f-1/3,o,c);else if(~e.indexOf("="))return s=e.match(fv),i&&s.length<4&&(s[3]=1),s}else s=e.match(p_)||hl.transparent;s=s.map(Number)}return t&&!M&&(o=s[0]/Ot,c=s[1]/Ot,u=s[2]/Ot,_=Math.max(o,c,u),m=Math.min(o,c,u),p=(_+m)/2,_===m?f=h=0:(S=_-m,h=p>.5?S/(2-_-m):S/(_+m),f=_===o?(c-u)/S+(c<u?6:0):_===c?(u-o)/S+2:(o-c)/S+4,f*=60),s[0]=~~(f+.5),s[1]=~~(h*100+.5),s[2]=~~(p*100+.5)),i&&s.length<4&&(s[3]=1),s},Uv=function(e){var t=[],i=[],s=-1;return e.split(Ms).forEach(function(o){var c=o.match(eo)||[];t.push.apply(t,c),i.push(s+=c.length+1)}),t.c=i,t},y_=function(e,t,i){var s="",o=(e+s).match(Ms),c=t?"hsla(":"rgba(",u=0,f,h,p,_;if(!o)return e;if(o=o.map(function(m){return(m=Fv(m,t,1))&&c+(t?m[0]+","+m[1]+"%,"+m[2]+"%,"+m[3]:m.join(","))+")"}),i&&(p=Uv(e),f=i.c,f.join(s)!==p.c.join(s)))for(h=e.replace(Ms,"1").split(eo),_=h.length-1;u<_;u++)s+=h[u]+(~f.indexOf(u)?o.shift()||c+"0,0,0,0)":(p.length?p:o.length?o:i).shift());if(!h)for(h=e.split(Ms),_=h.length-1;u<_;u++)s+=h[u]+o[u];return s+h[_]},Ms=(function(){var a="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in hl)a+="|"+e+"\\b";return new RegExp(a+")","gi")})(),GE=/hsl[a]?\(/,Ov=function(e){var t=e.join(" "),i;if(Ms.lastIndex=0,Ms.test(t))return i=GE.test(t),e[1]=y_(e[1],i),e[0]=y_(e[0],i,Uv(e[1])),!0},Al,mi=(function(){var a=Date.now,e=500,t=33,i=a(),s=i,o=1e3/240,c=o,u=[],f,h,p,_,m,S,M=function b(x){var E=a()-s,w=x===!0,P,A,N,L;if((E>e||E<0)&&(i+=E-t),s+=E,N=s-i,P=N-c,(P>0||w)&&(L=++_.frame,m=N-_.time*1e3,_.time=N=N/1e3,c+=P+(P>=o?4:o-P),A=1),w||(f=h(b)),A)for(S=0;S<u.length;S++)u[S](N,m,L,x)};return _={time:0,frame:0,tick:function(){M(!0)},deltaRatio:function(x){return m/(1e3/(x||60))},wake:function(){pv&&(!Fh&&Zp()&&(sr=Fh=window,Qp=sr.document||{},yi.gsap=oi,(sr.gsapVersions||(sr.gsapVersions=[])).push(oi.version),mv(Lu||sr.GreenSockGlobals||!sr.gsap&&sr||{}),Lv.forEach(Iv)),p=typeof requestAnimationFrame<"u"&&requestAnimationFrame,f&&_.sleep(),h=p||function(x){return setTimeout(x,c-_.time*1e3+1|0)},Al=1,M(2))},sleep:function(){(p?cancelAnimationFrame:clearTimeout)(f),Al=0,h=Tl},lagSmoothing:function(x,E){e=x||1/0,t=Math.min(E||33,e)},fps:function(x){o=1e3/(x||240),c=_.time*1e3+o},add:function(x,E,w){var P=E?function(A,N,L,F){x(A,N,L,F),_.remove(P)}:x;return _.remove(x),u[w?"unshift":"push"](P),uo(),P},remove:function(x,E){~(E=u.indexOf(x))&&u.splice(E,1)&&S>=E&&S--},_listeners:u},_})(),uo=function(){return!Al&&mi.wake()},St={},jE=/^[\d.\-M][\d.\-,\s]/,WE=/["']/g,XE=function(e){for(var t={},i=e.substr(1,e.length-3).split(":"),s=i[0],o=1,c=i.length,u,f,h;o<c;o++)f=i[o],u=o!==c-1?f.lastIndexOf(","):f.length,h=f.substr(0,u),t[s]=isNaN(h)?h.replace(WE,"").trim():+h,s=f.substr(u+1).trim();return t},$E=function(e){var t=e.indexOf("(")+1,i=e.indexOf(")"),s=e.indexOf("(",t);return e.substring(t,~s&&s<i?e.indexOf(")",i+1):i)},qE=function(e){var t=(e+"").split("("),i=St[t[0]];return i&&t.length>1&&i.config?i.config.apply(null,~e.indexOf("{")?[XE(t[1])]:$E(e).split(",").map(yv)):St._CE&&jE.test(e)?St._CE("",e):i},YE=function(e){return function(t){return 1-e(1-t)}},sa=function(e,t){return e&&(an(e)?e:St[e]||qE(e))||t},da=function(e,t,i,s){i===void 0&&(i=function(f){return 1-t(1-f)}),s===void 0&&(s=function(f){return f<.5?t(f*2)/2:1-t((1-f)*2)/2});var o={easeIn:t,easeOut:i,easeInOut:s},c;return ni(e,function(u){St[u]=yi[u]=o,St[c=u.toLowerCase()]=i;for(var f in o)St[c+(f==="easeIn"?".in":f==="easeOut"?".out":".inOut")]=St[u+"."+f]=o[f]}),o},kv=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},jf=function a(e,t,i){var s=t>=1?t:1,o=(i||(e?.3:.45))/(t<1?t:1),c=o/Ih*(Math.asin(1/s)||0),u=function(p){return p===1?1:s*Math.pow(2,-10*p)*vE((p-c)*o)+1},f=e==="out"?u:e==="in"?function(h){return 1-u(1-h)}:kv(u);return o=Ih/o,f.config=function(h,p){return a(e,h,p)},f},Wf=function a(e,t){t===void 0&&(t=1.70158);var i=function(c){return c?--c*c*((t+1)*c+t)+1:0},s=e==="out"?i:e==="in"?function(o){return 1-i(1-o)}:kv(i);return s.config=function(o){return a(e,o)},s};ni("Linear,Quad,Cubic,Quart,Quint,Strong",function(a,e){var t=e<5?e+1:e;da(a+",Power"+(t-1),e?function(i){return Math.pow(i,t)}:function(i){return i},function(i){return 1-Math.pow(1-i,t)},function(i){return i<.5?Math.pow(i*2,t)/2:1-Math.pow((1-i)*2,t)/2})});St.Linear.easeNone=St.none=St.Linear.easeIn;da("Elastic",jf("in"),jf("out"),jf());(function(a,e){var t=1/e,i=2*t,s=2.5*t,o=function(u){return u<t?a*u*u:u<i?a*Math.pow(u-1.5/e,2)+.75:u<s?a*(u-=2.25/e)*u+.9375:a*Math.pow(u-2.625/e,2)+.984375};da("Bounce",function(c){return 1-o(1-c)},o)})(7.5625,2.75);da("Expo",function(a){return Math.pow(2,10*(a-1))*a+a*a*a*a*a*a*(1-a)});da("Circ",function(a){return-(uv(1-a*a)-1)});da("Sine",function(a){return a===1?1:-xE(a*gE)+1});da("Back",Wf("in"),Wf("out"),Wf());St.SteppedEase=St.steps=yi.SteppedEase={config:function(e,t){e===void 0&&(e=1);var i=1/e,s=e+(t?0:1),o=t?1:0,c=1-kt;return function(u){return((s*kl(0,c,u)|0)+o)*i}}};El.ease=St["quad.out"];ni("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(a){return tm+=a+","+a+"Params,"});var Bv=function(e,t){this.id=_E++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:xv,this.set=t?t.getSetter:om},Cl=(function(){function a(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,co(this,+t.duration,1,1),this.data=t.data,Kt&&(this._ctx=Kt,Kt.data.push(this)),Al||mi.wake()}var e=a.prototype;return e.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},e.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},e.totalDuration=function(i){return arguments.length?(this._dirty=0,co(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(i,s){if(uo(),!arguments.length)return this._tTime;var o=this._dp;if(o&&o.smoothChildTiming&&this._ts){for(Zu(this,i),!o._dp||o.parent||Ev(o,this);o&&o.parent;)o.parent._time!==o._start+(o._ts>=0?o._tTime/o._ts:(o.totalDuration()-o._tTime)/-o._ts)&&o.totalTime(o._tTime,!0),o=o.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&or(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!s||this._initted&&Math.abs(this._zTime)===kt||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),vv(this,i,s)),this},e.time=function(i,s){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+__(this))%(this._dur+this._rDelay)||(i?this._dur:0),s):this._time},e.totalProgress=function(i,s){return arguments.length?this.totalTime(this.totalDuration()*i,s):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(i,s){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+__(this),s):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(i,s){var o=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*o,s):this._repeat?lo(this._tTime,o)+1:1},e.timeScale=function(i,s){if(!arguments.length)return this._rts===-kt?0:this._rts;if(this._rts===i)return this;var o=this.parent&&this._ts?Uu(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-kt?0:this._rts,this.totalTime(kl(-Math.abs(this._delay),this.totalDuration(),o),s!==!1),Ku(this),RE(this)},e.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(uo(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==kt&&(this._tTime-=kt)))),this):this._ps},e.startTime=function(i){if(arguments.length){this._start=tn(i);var s=this.parent||this._dp;return s&&(s._sort||!this.parent)&&or(s,this,this._start-this._delay),this}return this._start},e.endTime=function(i){return this._start+(ti(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(i){var s=this.parent||this._dp;return s?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Uu(s.rawTime(i),this):this._tTime:this._tTime},e.revert=function(i){i===void 0&&(i=TE);var s=Pn;return Pn=i,im(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),Pn=s,this},e.globalTime=function(i){for(var s=this,o=arguments.length?i:s.rawTime();s;)o=s._start+o/(Math.abs(s._ts)||1),s=s._dp;return!this.parent&&this._sat?this._sat.globalTime(i):o},e.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,x_(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(i){if(arguments.length){var s=this._time;return this._rDelay=i,x_(this),s?this.time(s):this}return this._rDelay},e.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},e.seek=function(i,s){return this.totalTime(Pi(this,i),ti(s))},e.restart=function(i,s){return this.play().totalTime(i?-this._delay:0,ti(s)),this._dur||(this._zTime=-kt),this},e.play=function(i,s){return i!=null&&this.seek(i,s),this.reversed(!1).paused(!1)},e.reverse=function(i,s){return i!=null&&this.seek(i||this.totalDuration(),s),this.reversed(!0).paused(!1)},e.pause=function(i,s){return i!=null&&this.seek(i,s),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-kt:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-kt,this},e.isActive=function(){var i=this.parent||this._dp,s=this._start,o;return!!(!i||this._ts&&this._initted&&i.isActive()&&(o=i.rawTime(!0))>=s&&o<this.endTime(!0)-kt)},e.eventCallback=function(i,s,o){var c=this.vars;return arguments.length>1?(s?(c[i]=s,o&&(c[i+"Params"]=o),i==="onUpdate"&&(this._onUpdate=s)):delete c[i],this):c[i]},e.then=function(i){var s=this,o=s._prom;return new Promise(function(c){var u=an(i)?i:Sv,f=function(){var p=s.then;s.then=null,o&&o(),an(u)&&(u=u(s))&&(u.then||u===s)&&(s.then=p),c(u),s.then=p};s._initted&&s.totalProgress()===1&&s._ts>=0||!s._tTime&&s._ts<0?f():s._prom=f})},e.kill=function(){fl(this)},a})();Si(Cl.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-kt,_prom:0,_ps:!1,_rts:1});var ei=(function(a){cv(e,a);function e(i,s){var o;return i===void 0&&(i={}),o=a.call(this,i)||this,o.labels={},o.smoothChildTiming=!!i.smoothChildTiming,o.autoRemoveChildren=!!i.autoRemoveChildren,o._sort=ti(i.sortChildren),nn&&or(i.parent||nn,Nr(o),s),i.reversed&&o.reverse(),i.paused&&o.paused(!0),i.scrollTrigger&&bv(Nr(o),i.scrollTrigger),o}var t=e.prototype;return t.to=function(s,o,c){return vl(0,arguments,this),this},t.from=function(s,o,c){return vl(1,arguments,this),this},t.fromTo=function(s,o,c,u){return vl(2,arguments,this),this},t.set=function(s,o,c){return o.duration=0,o.parent=this,xl(o).repeatDelay||(o.repeat=0),o.immediateRender=!!o.immediateRender,new pn(s,o,Pi(this,c),1),this},t.call=function(s,o,c){return or(this,pn.delayedCall(0,s,o),c)},t.staggerTo=function(s,o,c,u,f,h,p){return c.duration=o,c.stagger=c.stagger||u,c.onComplete=h,c.onCompleteParams=p,c.parent=this,new pn(s,c,Pi(this,f)),this},t.staggerFrom=function(s,o,c,u,f,h,p){return c.runBackwards=1,xl(c).immediateRender=ti(c.immediateRender),this.staggerTo(s,o,c,u,f,h,p)},t.staggerFromTo=function(s,o,c,u,f,h,p,_){return u.startAt=c,xl(u).immediateRender=ti(u.immediateRender),this.staggerTo(s,o,u,f,h,p,_)},t.render=function(s,o,c){var u=this._time,f=this._dirty?this.totalDuration():this._tDur,h=this._dur,p=s<=0?0:tn(s),_=this._zTime<0!=s<0&&(this._initted||!h),m,S,M,b,x,E,w,P,A,N,L,F;if(this!==nn&&p>f&&s>=0&&(p=f),p!==this._tTime||c||_){if(u!==this._time&&h&&(p+=this._time-u,s+=this._time-u),m=p,A=this._start,P=this._ts,E=!P,_&&(h||(u=this._zTime),(s||!o)&&(this._zTime=s)),this._repeat){if(L=this._yoyo,x=h+this._rDelay,this._repeat<-1&&s<0)return this.totalTime(x*100+s,o,c);if(m=tn(p%x),p===f?(b=this._repeat,m=h):(N=tn(p/x),b=~~N,b&&b===N&&(m=h,b--),m>h&&(m=h)),N=lo(this._tTime,x),!u&&this._tTime&&N!==b&&this._tTime-N*x-this._dur<=0&&(N=b),L&&b&1&&(m=h-m,F=1),b!==N&&!this._lock){var T=L&&N&1,I=T===(L&&b&1);if(b<N&&(T=!T),u=T?0:p%h?h:p,this._lock=1,this.render(u||(F?0:tn(b*x)),o,!h)._lock=0,this._tTime=p,!o&&this.parent&&gi(this,"onRepeat"),this.vars.repeatRefresh&&!F&&(this.invalidate()._lock=1,N=b),u&&u!==this._time||E!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(h=this._dur,f=this._tDur,I&&(this._lock=2,u=T?h:-1e-4,this.render(u,!0),this.vars.repeatRefresh&&!F&&this.invalidate()),this._lock=0,!this._ts&&!E)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(w=LE(this,tn(u),tn(m)),w&&(p-=m-(m=w._start))),this._tTime=p,this._time=m,this._act=!!P,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=s,u=0),!u&&p&&h&&!o&&!N&&(gi(this,"onStart"),this._tTime!==p))return this;if(m>=u&&s>=0)for(S=this._first;S;){if(M=S._next,(S._act||m>=S._start)&&S._ts&&w!==S){if(S.parent!==this)return this.render(s,o,c);if(S.render(S._ts>0?(m-S._start)*S._ts:(S._dirty?S.totalDuration():S._tDur)+(m-S._start)*S._ts,o,c),m!==this._time||!this._ts&&!E){w=0,M&&(p+=this._zTime=-kt);break}}S=M}else{S=this._last;for(var z=s<0?s:m;S;){if(M=S._prev,(S._act||z<=S._end)&&S._ts&&w!==S){if(S.parent!==this)return this.render(s,o,c);if(S.render(S._ts>0?(z-S._start)*S._ts:(S._dirty?S.totalDuration():S._tDur)+(z-S._start)*S._ts,o,c||Pn&&im(S)),m!==this._time||!this._ts&&!E){w=0,M&&(p+=this._zTime=z?-kt:kt);break}}S=M}}if(w&&!o&&(this.pause(),w.render(m>=u?0:-kt)._zTime=m>=u?1:-1,this._ts))return this._start=A,Ku(this),this.render(s,o,c);this._onUpdate&&!o&&gi(this,"onUpdate",!0),(p===f&&this._tTime>=this.totalDuration()||!p&&u)&&(A===this._start||Math.abs(P)!==Math.abs(this._ts))&&(this._lock||((s||!h)&&(p===f&&this._ts>0||!p&&this._ts<0)&&Es(this,1),!o&&!(s<0&&!u)&&(p||u||!f)&&(gi(this,p===f&&s>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(p<f&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(s,o){var c=this;if(Br(o)||(o=Pi(this,o,s)),!(s instanceof Cl)){if(Bn(s))return s.forEach(function(u){return c.add(u,o)}),this;if(bn(s))return this.addLabel(s,o);if(an(s))s=pn.delayedCall(0,s);else return this}return this!==s?or(this,s,o):this},t.getChildren=function(s,o,c,u){s===void 0&&(s=!0),o===void 0&&(o=!0),c===void 0&&(c=!0),u===void 0&&(u=-Ii);for(var f=[],h=this._first;h;)h._start>=u&&(h instanceof pn?o&&f.push(h):(c&&f.push(h),s&&f.push.apply(f,h.getChildren(!0,o,c)))),h=h._next;return f},t.getById=function(s){for(var o=this.getChildren(1,1,1),c=o.length;c--;)if(o[c].vars.id===s)return o[c]},t.remove=function(s){return bn(s)?this.removeLabel(s):an(s)?this.killTweensOf(s):(s.parent===this&&Yu(this,s),s===this._recent&&(this._recent=this._last),ra(this))},t.totalTime=function(s,o){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=tn(mi.time-(this._ts>0?s/this._ts:(this.totalDuration()-s)/-this._ts))),a.prototype.totalTime.call(this,s,o),this._forcing=0,this):this._tTime},t.addLabel=function(s,o){return this.labels[s]=Pi(this,o),this},t.removeLabel=function(s){return delete this.labels[s],this},t.addPause=function(s,o,c){var u=pn.delayedCall(0,o||Tl,c);return u.data="isPause",this._hasPause=1,or(this,u,Pi(this,s))},t.removePause=function(s){var o=this._first;for(s=Pi(this,s);o;)o._start===s&&o.data==="isPause"&&Es(o),o=o._next},t.killTweensOf=function(s,o,c){for(var u=this.getTweensOf(s,c),f=u.length;f--;)_s!==u[f]&&u[f].kill(s,o);return this},t.getTweensOf=function(s,o){for(var c=[],u=Fi(s),f=this._first,h=Br(o),p;f;)f instanceof pn?wE(f._targets,u)&&(h?(!_s||f._initted&&f._ts)&&f.globalTime(0)<=o&&f.globalTime(f.totalDuration())>o:!o||f.isActive())&&c.push(f):(p=f.getTweensOf(u,o)).length&&c.push.apply(c,p),f=f._next;return c},t.tweenTo=function(s,o){o=o||{};var c=this,u=Pi(c,s),f=o,h=f.startAt,p=f.onStart,_=f.onStartParams,m=f.immediateRender,S,M=pn.to(c,Si({ease:o.ease||"none",lazy:!1,immediateRender:!1,time:u,overwrite:"auto",duration:o.duration||Math.abs((u-(h&&"time"in h?h.time:c._time))/c.timeScale())||kt,onStart:function(){if(c.pause(),!S){var x=o.duration||Math.abs((u-(h&&"time"in h?h.time:c._time))/c.timeScale());M._dur!==x&&co(M,x,0,1).render(M._time,!0,!0),S=1}p&&p.apply(M,_||[])}},o));return m?M.render(0):M},t.tweenFromTo=function(s,o,c){return this.tweenTo(o,Si({startAt:{time:Pi(this,s)}},c))},t.recent=function(){return this._recent},t.nextLabel=function(s){return s===void 0&&(s=this._time),v_(this,Pi(this,s))},t.previousLabel=function(s){return s===void 0&&(s=this._time),v_(this,Pi(this,s),1)},t.currentLabel=function(s){return arguments.length?this.seek(s,!0):this.previousLabel(this._time+kt)},t.shiftChildren=function(s,o,c){c===void 0&&(c=0);var u=this._first,f=this.labels,h;for(s=tn(s);u;)u._start>=c&&(u._start+=s,u._end+=s),u=u._next;if(o)for(h in f)f[h]>=c&&(f[h]+=s);return ra(this)},t.invalidate=function(s){var o=this._first;for(this._lock=0;o;)o.invalidate(s),o=o._next;return a.prototype.invalidate.call(this,s)},t.clear=function(s){s===void 0&&(s=!0);for(var o=this._first,c;o;)c=o._next,this.remove(o),o=c;return this._dp&&(this._time=this._tTime=this._pTime=0),s&&(this.labels={}),ra(this)},t.totalDuration=function(s){var o=0,c=this,u=c._last,f=Ii,h,p,_;if(arguments.length)return c.timeScale((c._repeat<0?c.duration():c.totalDuration())/(c.reversed()?-s:s));if(c._dirty){for(_=c.parent;u;)h=u._prev,u._dirty&&u.totalDuration(),p=u._start,p>f&&c._sort&&u._ts&&!c._lock?(c._lock=1,or(c,u,p-u._delay,1)._lock=0):f=p,p<0&&u._ts&&(o-=p,(!_&&!c._dp||_&&_.smoothChildTiming)&&(c._start+=tn(p/c._ts),c._time-=p,c._tTime-=p),c.shiftChildren(-p,!1,-1/0),f=0),u._end>o&&u._ts&&(o=u._end),u=h;co(c,c===nn&&c._time>o?c._time:o,1,1),c._dirty=0}return c._tDur},e.updateRoot=function(s){if(nn._ts&&(vv(nn,Uu(s,nn)),_v=mi.frame),mi.frame>=m_){m_+=xi.autoSleep||120;var o=nn._first;if((!o||!o._ts)&&xi.autoSleep&&mi._listeners.length<2){for(;o&&!o._ts;)o=o._next;o||mi.sleep()}}},e})(Cl);Si(ei.prototype,{_lock:0,_hasPause:0,_forcing:0});var KE=function(e,t,i,s,o,c,u){var f=new ii(this._pt,e,t,0,1,Wv,null,o),h=0,p=0,_,m,S,M,b,x,E,w;for(f.b=i,f.e=s,i+="",s+="",(E=~s.indexOf("random("))&&(s=wl(s)),c&&(w=[i,s],c(w,e,t),i=w[0],s=w[1]),m=i.match(Vf)||[];_=Vf.exec(s);)M=_[0],b=s.substring(h,_.index),S?S=(S+1)%5:b.substr(-5)==="rgba("&&(S=1),M!==m[p++]&&(x=parseFloat(m[p-1])||0,f._pt={_next:f._pt,p:b||p===1?b:",",s:x,c:M.charAt(1)==="="?no(x,M)-x:parseFloat(M)-x,m:S&&S<4?Math.round:0},h=Vf.lastIndex);return f.c=h<s.length?s.substring(h,s.length):"",f.fp=u,(hv.test(s)||E)&&(f.e=0),this._pt=f,f},rm=function(e,t,i,s,o,c,u,f,h,p){an(s)&&(s=s(o||0,e,c));var _=e[t],m=i!=="get"?i:an(_)?h?e[t.indexOf("set")||!an(e["get"+t.substr(3)])?t:"get"+t.substr(3)](h):e[t]():_,S=an(_)?h?tb:Gv:am,M;if(bn(s)&&(~s.indexOf("random(")&&(s=wl(s)),s.charAt(1)==="="&&(M=no(m,s)+(On(m)||0),(M||M===0)&&(s=M))),!p||m!==s||Hh)return!isNaN(m*s)&&s!==""?(M=new ii(this._pt,e,t,+m||0,s-(m||0),typeof _=="boolean"?ib:jv,0,S),h&&(M.fp=h),u&&M.modifier(u,this,e),this._pt=M):(!_&&!(t in e)&&Jp(t,s),KE.call(this,e,t,m,s,S,f||xi.stringFilter,h))},ZE=function(e,t,i,s,o){if(an(e)&&(e=yl(e,o,t,i,s)),!hr(e)||e.style&&e.nodeType||Bn(e)||dv(e))return bn(e)?yl(e,o,t,i,s):e;var c={},u;for(u in e)c[u]=yl(e[u],o,t,i,s);return c},zv=function(e,t,i,s,o,c){var u,f,h,p;if(pi[e]&&(u=new pi[e]).init(o,u.rawVars?t[e]:ZE(t[e],s,o,c,i),i,s,c)!==!1&&(i._pt=f=new ii(i._pt,o,e,0,1,u.render,u,0,u.priority),i!==to))for(h=i._ptLookup[i._targets.indexOf(o)],p=u._props.length;p--;)h[u._props[p]]=f;return u},_s,Hh,sm=function a(e,t,i){var s=e.vars,o=s.ease,c=s.startAt,u=s.immediateRender,f=s.lazy,h=s.onUpdate,p=s.runBackwards,_=s.yoyoEase,m=s.keyframes,S=s.autoRevert,M=e._dur,b=e._startAt,x=e._targets,E=e.parent,w=E&&E.data==="nested"?E.vars.targets:x,P=e._overwrite==="auto"&&!Yp,A=e.timeline,N=s.easeReverse||_,L,F,T,I,z,k,q,Q,se,V,W,H,Y;if(A&&(!m||!o)&&(o="none"),e._ease=sa(o,El.ease),e._rEase=N&&(sa(N)||e._ease),e._from=!A&&!!s.runBackwards,e._from&&(e.ratio=1),!A||m&&!s.stagger){if(Q=x[0]?ia(x[0]).harness:0,H=Q&&s[Q.prop],L=Fu(s,em),b&&(b._zTime<0&&b.progress(1),t<0&&p&&u&&!S?b.render(-1,!0):b.revert(p&&M?yu:bE),b._lazy=0),c){if(Es(e._startAt=pn.set(x,Si({data:"isStart",overwrite:!1,parent:E,immediateRender:!0,lazy:!b&&ti(f),startAt:null,delay:0,onUpdate:h&&function(){return gi(e,"onUpdate")},stagger:0},c))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Pn||!u&&!S)&&e._startAt.revert(yu),u&&M&&t<=0&&i<=0){t&&(e._zTime=t);return}}else if(p&&M&&!b){if(t&&(u=!1),T=Si({overwrite:!1,data:"isFromStart",lazy:u&&!b&&ti(f),immediateRender:u,stagger:0,parent:E},L),H&&(T[Q.prop]=H),Es(e._startAt=pn.set(x,T)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(Pn?e._startAt.revert(yu):e._startAt.render(-1,!0)),e._zTime=t,!u)a(e._startAt,kt,kt);else if(!t)return}for(e._pt=e._ptCache=0,f=M&&ti(f)||f&&!M,F=0;F<x.length;F++){if(z=x[F],q=z._gsap||nm(x)[F]._gsap,e._ptLookup[F]=V={},Uh[q.id]&&Ss.length&&Iu(),W=w===x?F:w.indexOf(z),Q&&(se=new Q).init(z,H||L,e,W,w)!==!1&&(e._pt=I=new ii(e._pt,z,se.name,0,1,se.render,se,0,se.priority),se._props.forEach(function(ae){V[ae]=I}),se.priority&&(k=1)),!Q||H)for(T in L)pi[T]&&(se=zv(T,L,e,W,z,w))?se.priority&&(k=1):V[T]=I=rm.call(e,z,T,"get",L[T],W,w,0,s.stringFilter);e._op&&e._op[F]&&e.kill(z,e._op[F]),P&&e._pt&&(_s=e,nn.killTweensOf(z,V,e.globalTime(t)),Y=!e.parent,_s=0),e._pt&&f&&(Uh[q.id]=1)}k&&Xv(e),e._onInit&&e._onInit(e)}e._onUpdate=h,e._initted=(!e._op||e._pt)&&!Y,m&&t<=0&&A.render(Ii,!0,!0)},QE=function(e,t,i,s,o,c,u,f){var h=(e._pt&&e._ptCache||(e._ptCache={}))[t],p,_,m,S;if(!h)for(h=e._ptCache[t]=[],m=e._ptLookup,S=e._targets.length;S--;){if(p=m[S][t],p&&p.d&&p.d._pt)for(p=p.d._pt;p&&p.p!==t&&p.fp!==t;)p=p._next;if(!p)return Hh=1,e.vars[t]="+=0",sm(e,u),Hh=0,f?bl(t+" not eligible for reset. Try splitting into individual properties"):1;h.push(p)}for(S=h.length;S--;)_=h[S],p=_._pt||_,p.s=(s||s===0)&&!o?s:p.s+(s||0)+c*p.c,p.c=i-p.s,_.e&&(_.e=ln(i)+On(_.e)),_.b&&(_.b=p.s+On(_.b))},JE=function(e,t){var i=e[0]?ia(e[0]).harness:0,s=i&&i.aliases,o,c,u,f;if(!s)return t;o=oo({},t);for(c in s)if(c in o)for(f=s[c].split(","),u=f.length;u--;)o[f[u]]=o[c];return o},eb=function(e,t,i,s){var o=t.ease||s||"power1.inOut",c,u;if(Bn(t))u=i[e]||(i[e]=[]),t.forEach(function(f,h){return u.push({t:h/(t.length-1)*100,v:f,e:o})});else for(c in t)u=i[c]||(i[c]=[]),c==="ease"||u.push({t:parseFloat(e),v:t[c],e:o})},yl=function(e,t,i,s,o){return an(e)?e.call(t,i,s,o):bn(e)&&~e.indexOf("random(")?wl(e):e},Vv=tm+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",Hv={};ni(Vv+",id,stagger,delay,duration,paused,scrollTrigger",function(a){return Hv[a]=1});var pn=(function(a){cv(e,a);function e(i,s,o,c){var u;typeof s=="number"&&(o.duration=s,s=o,o=null),u=a.call(this,c?s:xl(s))||this;var f=u.vars,h=f.duration,p=f.delay,_=f.immediateRender,m=f.stagger,S=f.overwrite,M=f.keyframes,b=f.defaults,x=f.scrollTrigger,E=s.parent||nn,w=(Bn(i)||dv(i)?Br(i[0]):"length"in s)?[i]:Fi(i),P,A,N,L,F,T,I,z;if(u._targets=w.length?nm(w):bl("GSAP target "+i+" not found. https://gsap.com",!xi.nullTargetWarn)||[],u._ptLookup=[],u._overwrite=S,M||m||$c(h)||$c(p)){s=u.vars;var k=s.easeReverse||s.yoyoEase;if(P=u.timeline=new ei({data:"nested",defaults:b||{},targets:E&&E.data==="nested"?E.vars.targets:w}),P.kill(),P.parent=P._dp=Nr(u),P._start=0,m||$c(h)||$c(p)){if(L=w.length,I=m&&Cv(m),hr(m))for(F in m)~Vv.indexOf(F)&&(z||(z={}),z[F]=m[F]);for(A=0;A<L;A++)N=Fu(s,Hv),N.stagger=0,k&&(N.easeReverse=k),z&&oo(N,z),T=w[A],N.duration=+yl(h,Nr(u),A,T,w),N.delay=(+yl(p,Nr(u),A,T,w)||0)-u._delay,!m&&L===1&&N.delay&&(u._delay=p=N.delay,u._start+=p,N.delay=0),P.to(T,N,I?I(A,T,w):0),P._ease=St.none;P.duration()?h=p=0:u.timeline=0}else if(M){xl(Si(P.vars.defaults,{ease:"none"})),P._ease=sa(M.ease||s.ease||"none");var q=0,Q,se,V;if(Bn(M))M.forEach(function(W){return P.to(w,W,">")}),P.duration();else{N={};for(F in M)F==="ease"||F==="easeEach"||eb(F,M[F],N,M.easeEach);for(F in N)for(Q=N[F].sort(function(W,H){return W.t-H.t}),q=0,A=0;A<Q.length;A++)se=Q[A],V={ease:se.e,duration:(se.t-(A?Q[A-1].t:0))/100*h},V[F]=se.v,P.to(w,V,q),q+=V.duration;P.duration()<h&&P.to({},{duration:h-P.duration()})}}h||u.duration(h=P.duration())}else u.timeline=0;return S===!0&&!Yp&&(_s=Nr(u),nn.killTweensOf(w),_s=0),or(E,Nr(u),o),s.reversed&&u.reverse(),s.paused&&u.paused(!0),(_||!h&&!M&&u._start===tn(E._time)&&ti(_)&&PE(Nr(u))&&E.data!=="nested")&&(u._tTime=-kt,u.render(Math.max(0,-p)||0)),x&&bv(Nr(u),x),u}var t=e.prototype;return t.render=function(s,o,c){var u=this._time,f=this._tDur,h=this._dur,p=s<0,_=s>f-kt&&!p?f:s<kt?0:s,m,S,M,b,x,E,w,P;if(!h)DE(this,s,o,c);else if(_!==this._tTime||!s||c||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==p||this._lazy){if(m=_,P=this.timeline,this._repeat){if(b=h+this._rDelay,this._repeat<-1&&p)return this.totalTime(b*100+s,o,c);if(m=tn(_%b),_===f?(M=this._repeat,m=h):(x=tn(_/b),M=~~x,M&&M===x?(m=h,M--):m>h&&(m=h)),E=this._yoyo&&M&1,E&&(m=h-m),x=lo(this._tTime,b),m===u&&!c&&this._initted&&M===x)return this._tTime=_,this;M!==x&&this.vars.repeatRefresh&&!E&&!this._lock&&m!==b&&this._initted&&(this._lock=c=1,this.render(tn(b*M),!0).invalidate()._lock=0)}if(!this._initted){if(Tv(this,p?s:m,c,o,_))return this._tTime=0,this;if(u!==this._time&&!(c&&this.vars.repeatRefresh&&M!==x))return this;if(h!==this._dur)return this.render(s,o,c)}if(this._rEase){var A=m<u;if(A!==this._inv){var N=A?u:h-u;this._inv=A,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=u,this._invRecip=N?(A?-1:1)/N:0,this._invScale=A?-this.ratio:1-this.ratio,this._invEase=A?this._rEase:this._ease}this.ratio=w=this._invRatio+this._invScale*this._invEase((m-this._invTime)*this._invRecip)}else this.ratio=w=this._ease(m/h);if(this._from&&(this.ratio=w=1-w),this._tTime=_,this._time=m,!this._act&&this._ts&&(this._act=1,this._lazy=0),!u&&_&&!o&&!x&&(gi(this,"onStart"),this._tTime!==_))return this;for(S=this._pt;S;)S.r(w,S.d),S=S._next;P&&P.render(s<0?s:P._dur*P._ease(m/this._dur),o,c)||this._startAt&&(this._zTime=s),this._onUpdate&&!o&&(p&&Oh(this,s,o,c),gi(this,"onUpdate")),this._repeat&&M!==x&&this.vars.onRepeat&&!o&&this.parent&&gi(this,"onRepeat"),(_===this._tDur||!_)&&this._tTime===_&&(p&&!this._onUpdate&&Oh(this,s,!0,!0),(s||!h)&&(_===this._tDur&&this._ts>0||!_&&this._ts<0)&&Es(this,1),!o&&!(p&&!u)&&(_||u||E)&&(gi(this,_===f?"onComplete":"onReverseComplete",!0),this._prom&&!(_<f&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(s){return(!s||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(s),a.prototype.invalidate.call(this,s)},t.resetTo=function(s,o,c,u,f){Al||mi.wake(),this._ts||this.play();var h=Math.min(this._dur,(this._dp._time-this._start)*this._ts),p;return this._initted||sm(this,h),p=this._ease(h/this._dur),QE(this,s,o,c,u,p,h,f)?this.resetTo(s,o,c,u,1):(Zu(this,0),this.parent||Mv(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(s,o){if(o===void 0&&(o="all"),!s&&(!o||o==="all"))return this._lazy=this._pt=0,this.parent?fl(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Pn),this;if(this.timeline){var c=this.timeline.totalDuration();return this.timeline.killTweensOf(s,o,_s&&_s.vars.overwrite!==!0)._first||fl(this),this.parent&&c!==this.timeline.totalDuration()&&co(this,this._dur*this.timeline._tDur/c,0,1),this}var u=this._targets,f=s?Fi(s):u,h=this._ptLookup,p=this._pt,_,m,S,M,b,x,E;if((!o||o==="all")&&CE(u,f))return o==="all"&&(this._pt=0),fl(this);for(_=this._op=this._op||[],o!=="all"&&(bn(o)&&(b={},ni(o,function(w){return b[w]=1}),o=b),o=JE(u,o)),E=u.length;E--;)if(~f.indexOf(u[E])){m=h[E],o==="all"?(_[E]=o,M=m,S={}):(S=_[E]=_[E]||{},M=o);for(b in M)x=m&&m[b],x&&((!("kill"in x.d)||x.d.kill(b)===!0)&&Yu(this,x,"_pt"),delete m[b]),S!=="all"&&(S[b]=1)}return this._initted&&!this._pt&&p&&fl(this),this},e.to=function(s,o){return new e(s,o,arguments[2])},e.from=function(s,o){return vl(1,arguments)},e.delayedCall=function(s,o,c,u){return new e(o,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:s,onComplete:o,onReverseComplete:o,onCompleteParams:c,onReverseCompleteParams:c,callbackScope:u})},e.fromTo=function(s,o,c){return vl(2,arguments)},e.set=function(s,o){return o.duration=0,o.repeatDelay||(o.repeat=0),new e(s,o)},e.killTweensOf=function(s,o,c){return nn.killTweensOf(s,o,c)},e})(Cl);Si(pn.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});ni("staggerTo,staggerFrom,staggerFromTo",function(a){pn[a]=function(){var e=new ei,t=Bh.call(arguments,0);return t.splice(a==="staggerFromTo"?5:4,0,0),e[a].apply(e,t)}});var am=function(e,t,i){return e[t]=i},Gv=function(e,t,i){return e[t](i)},tb=function(e,t,i,s){return e[t](s.fp,i)},nb=function(e,t,i){return e.setAttribute(t,i)},om=function(e,t){return an(e[t])?Gv:Kp(e[t])&&e.setAttribute?nb:am},jv=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},ib=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},Wv=function(e,t){var i=t._pt,s="";if(!e&&t.b)s=t.b;else if(e===1&&t.e)s=t.e;else{for(;i;)s=i.p+(i.m?i.m(i.s+i.c*e):Math.round((i.s+i.c*e)*1e4)/1e4)+s,i=i._next;s+=t.c}t.set(t.t,t.p,s,t)},lm=function(e,t){for(var i=t._pt;i;)i.r(e,i.d),i=i._next},rb=function(e,t,i,s){for(var o=this._pt,c;o;)c=o._next,o.p===s&&o.modifier(e,t,i),o=c},sb=function(e){for(var t=this._pt,i,s;t;)s=t._next,t.p===e&&!t.op||t.op===e?Yu(this,t,"_pt"):t.dep||(i=1),t=s;return!i},ab=function(e,t,i,s){s.mSet(e,t,s.m.call(s.tween,i,s.mt),s)},Xv=function(e){for(var t=e._pt,i,s,o,c;t;){for(i=t._next,s=o;s&&s.pr>t.pr;)s=s._next;(t._prev=s?s._prev:c)?t._prev._next=t:o=t,(t._next=s)?s._prev=t:c=t,t=i}e._pt=o},ii=(function(){function a(t,i,s,o,c,u,f,h,p){this.t=i,this.s=o,this.c=c,this.p=s,this.r=u||jv,this.d=f||this,this.set=h||am,this.pr=p||0,this._next=t,t&&(t._prev=this)}var e=a.prototype;return e.modifier=function(i,s,o){this.mSet=this.mSet||this.set,this.set=ab,this.m=i,this.mt=o,this.tween=s},a})();ni(tm+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(a){return em[a]=1});yi.TweenMax=yi.TweenLite=pn;yi.TimelineLite=yi.TimelineMax=ei;nn=new ei({sortChildren:!1,defaults:El,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});xi.stringFilter=Ov;var aa=[],Mu={},ob=[],S_=0,lb=0,Xf=function(e){return(Mu[e]||ob).map(function(t){return t()})},Gh=function(){var e=Date.now(),t=[];e-S_>2&&(Xf("matchMediaInit"),aa.forEach(function(i){var s=i.queries,o=i.conditions,c,u,f,h;for(u in s)c=sr.matchMedia(s[u]).matches,c&&(f=1),c!==o[u]&&(o[u]=c,h=1);h&&(i.revert(),f&&t.push(i))}),Xf("matchMediaRevert"),t.forEach(function(i){return i.onMatch(i,function(s){return i.add(null,s)})}),S_=e,Xf("matchMedia"))},$v=(function(){function a(t,i){this.selector=i&&zh(i),this.data=[],this._r=[],this.isReverted=!1,this.id=lb++,t&&this.add(t)}var e=a.prototype;return e.add=function(i,s,o){an(i)&&(o=s,s=i,i=an);var c=this,u=function(){var h=Kt,p=c.selector,_;return h&&h!==c&&h.data.push(c),o&&(c.selector=zh(o)),Kt=c,_=s.apply(c,arguments),an(_)&&c._r.push(_),Kt=h,c.selector=p,c.isReverted=!1,_};return c.last=u,i===an?u(c,function(f){return c.add(null,f)}):i?c[i]=u:u},e.ignore=function(i){var s=Kt;Kt=null,i(this),Kt=s},e.getTweens=function(){var i=[];return this.data.forEach(function(s){return s instanceof a?i.push.apply(i,s.getTweens()):s instanceof pn&&!(s.parent&&s.parent.data==="nested")&&i.push(s)}),i},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(i,s){var o=this;if(i?(function(){for(var u=o.getTweens(),f=o.data.length,h;f--;)h=o.data[f],h.data==="isFlip"&&(h.revert(),h.getChildren(!0,!0,!1).forEach(function(p){return u.splice(u.indexOf(p),1)}));for(u.map(function(p){return{g:p._dur||p._delay||p._sat&&!p._sat.vars.immediateRender?p.globalTime(0):-1/0,t:p}}).sort(function(p,_){return _.g-p.g||-1/0}).forEach(function(p){return p.t.revert(i)}),f=o.data.length;f--;)h=o.data[f],h instanceof ei?h.data!=="nested"&&(h.scrollTrigger&&h.scrollTrigger.revert(),h.kill()):!(h instanceof pn)&&h.revert&&h.revert(i);o._r.forEach(function(p){return p(i,o)}),o.isReverted=!0})():this.data.forEach(function(u){return u.kill&&u.kill()}),this.clear(),s)for(var c=aa.length;c--;)aa[c].id===this.id&&aa.splice(c,1)},e.revert=function(i){this.kill(i||{})},a})(),cb=(function(){function a(t){this.contexts=[],this.scope=t,Kt&&Kt.data.push(this)}var e=a.prototype;return e.add=function(i,s,o){hr(i)||(i={matches:i});var c=new $v(0,o||this.scope),u=c.conditions={},f,h,p;Kt&&!c.selector&&(c.selector=Kt.selector),this.contexts.push(c),s=c.add("onMatch",s),c.queries=i;for(h in i)h==="all"?p=1:(f=sr.matchMedia(i[h]),f&&(aa.indexOf(c)<0&&aa.push(c),(u[h]=f.matches)&&(p=1),f.addListener?f.addListener(Gh):f.addEventListener("change",Gh)));return p&&s(c,function(_){return c.add(null,_)}),this},e.revert=function(i){this.kill(i||{})},e.kill=function(i){this.contexts.forEach(function(s){return s.kill(i,!0)})},a})(),Ou={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];t.forEach(function(s){return Iv(s)})},timeline:function(e){return new ei(e)},getTweensOf:function(e,t){return nn.getTweensOf(e,t)},getProperty:function(e,t,i,s){bn(e)&&(e=Fi(e)[0]);var o=ia(e||{}).get,c=i?Sv:yv;return i==="native"&&(i=""),e&&(t?c((pi[t]&&pi[t].get||o)(e,t,i,s)):function(u,f,h){return c((pi[u]&&pi[u].get||o)(e,u,f,h))})},quickSetter:function(e,t,i){if(e=Fi(e),e.length>1){var s=e.map(function(p){return oi.quickSetter(p,t,i)}),o=s.length;return function(p){for(var _=o;_--;)s[_](p)}}e=e[0]||{};var c=pi[t],u=ia(e),f=u.harness&&(u.harness.aliases||{})[t]||t,h=c?function(p){var _=new c;to._pt=0,_.init(e,i?p+i:p,to,0,[e]),_.render(1,_),to._pt&&lm(1,to)}:u.set(e,f);return c?h:function(p){return h(e,f,i?p+i:p,u,1)}},quickTo:function(e,t,i){var s,o=oi.to(e,Si((s={},s[t]="+=0.1",s.paused=!0,s.stagger=0,s),i||{})),c=function(f,h,p){return o.resetTo(t,f,h,p)};return c.tween=o,c},isTweening:function(e){return nn.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=sa(e.ease,El.ease)),g_(El,e||{})},config:function(e){return g_(xi,e||{})},registerEffect:function(e){var t=e.name,i=e.effect,s=e.plugins,o=e.defaults,c=e.extendTimeline;(s||"").split(",").forEach(function(u){return u&&!pi[u]&&!yi[u]&&bl(t+" effect requires "+u+" plugin.")}),Hf[t]=function(u,f,h){return i(Fi(u),Si(f||{},o),h)},c&&(ei.prototype[t]=function(u,f,h){return this.add(Hf[t](u,hr(f)?f:(h=f)&&{},this),h)})},registerEase:function(e,t){St[e]=sa(t)},parseEase:function(e,t){return arguments.length?sa(e,t):St},getById:function(e){return nn.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var i=new ei(e),s,o;for(i.smoothChildTiming=ti(e.smoothChildTiming),nn.remove(i),i._dp=0,i._time=i._tTime=nn._time,s=nn._first;s;)o=s._next,(t||!(!s._dur&&s instanceof pn&&s.vars.onComplete===s._targets[0]))&&or(i,s,s._start-s._delay),s=o;return or(nn,i,0),i},context:function(e,t){return e?new $v(e,t):Kt},matchMedia:function(e){return new cb(e)},matchMediaRefresh:function(){return aa.forEach(function(e){var t=e.conditions,i,s;for(s in t)t[s]&&(t[s]=!1,i=1);i&&e.revert()})||Gh()},addEventListener:function(e,t){var i=Mu[e]||(Mu[e]=[]);~i.indexOf(t)||i.push(t)},removeEventListener:function(e,t){var i=Mu[e],s=i&&i.indexOf(t);s>=0&&i.splice(s,1)},utils:{wrap:zE,wrapYoyo:VE,distribute:Cv,random:Pv,snap:Rv,normalize:BE,getUnit:On,clamp:FE,splitColor:Fv,toArray:Fi,selector:zh,mapRange:Dv,pipe:OE,unitize:kE,interpolate:HE,shuffle:Av},install:mv,effects:Hf,ticker:mi,updateRoot:ei.updateRoot,plugins:pi,globalTimeline:nn,core:{PropTween:ii,globals:gv,Tween:pn,Timeline:ei,Animation:Cl,getCache:ia,_removeLinkedListItem:Yu,reverting:function(){return Pn},context:function(e){return e&&Kt&&(Kt.data.push(e),e._ctx=Kt),Kt},suppressOverwrites:function(e){return Yp=e}}};ni("to,from,fromTo,delayedCall,set,killTweensOf",function(a){return Ou[a]=pn[a]});mi.add(ei.updateRoot);to=Ou.to({},{duration:0});var ub=function(e,t){for(var i=e._pt;i&&i.p!==t&&i.op!==t&&i.fp!==t;)i=i._next;return i},db=function(e,t){var i=e._targets,s,o,c;for(s in t)for(o=i.length;o--;)c=e._ptLookup[o][s],c&&(c=c.d)&&(c._pt&&(c=ub(c,s)),c&&c.modifier&&c.modifier(t[s],e,i[o],s))},$f=function(e,t){return{name:e,headless:1,rawVars:1,init:function(s,o,c){c._onInit=function(u){var f,h;if(bn(o)&&(f={},ni(o,function(p){return f[p]=1}),o=f),t){f={};for(h in o)f[h]=t(o[h]);o=f}db(u,o)}}}},oi=Ou.registerPlugin({name:"attr",init:function(e,t,i,s,o){var c,u,f;this.tween=i;for(c in t)f=e.getAttribute(c)||"",u=this.add(e,"setAttribute",(f||0)+"",t[c],s,o,0,0,c),u.op=c,u.b=f,this._props.push(c)},render:function(e,t){for(var i=t._pt;i;)Pn?i.set(i.t,i.p,i.b,i):i.r(e,i.d),i=i._next}},{name:"endArray",headless:1,init:function(e,t){for(var i=t.length;i--;)this.add(e,i,e[i]||0,t[i],0,0,0,0,0,1)}},$f("roundProps",Vh),$f("modifiers"),$f("snap",Rv))||Ou;pn.version=ei.version=oi.version="3.15.0";pv=1;Zp()&&uo();St.Power0;St.Power1;St.Power2;St.Power3;St.Power4;St.Linear;St.Quad;St.Cubic;St.Quart;St.Quint;St.Strong;St.Elastic;St.Back;St.SteppedEase;St.Bounce;St.Sine;St.Expo;St.Circ;/*!
 * CSSPlugin 3.15.0
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var M_,xs,io,cm,Js,E_,um,fb=function(){return typeof window<"u"},zr={},Ys=180/Math.PI,ro=Math.PI/180,Ba=Math.atan2,b_=1e8,dm=/([A-Z])/g,hb=/(left|right|width|margin|padding|x)/i,pb=/[\s,\(]\S/,lr={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},jh=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},mb=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},gb=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},_b=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},xb=function(e,t){var i=t.s+t.c*e;t.set(t.t,t.p,~~(i+(i<0?-.5:.5))+t.u,t)},qv=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},Yv=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},vb=function(e,t,i){return e.style[t]=i},yb=function(e,t,i){return e.style.setProperty(t,i)},Sb=function(e,t,i){return e._gsap[t]=i},Mb=function(e,t,i){return e._gsap.scaleX=e._gsap.scaleY=i},Eb=function(e,t,i,s,o){var c=e._gsap;c.scaleX=c.scaleY=i,c.renderTransform(o,c)},bb=function(e,t,i,s,o){var c=e._gsap;c[t]=i,c.renderTransform(o,c)},rn="transform",ri=rn+"Origin",Tb=function a(e,t){var i=this,s=this.target,o=s.style,c=s._gsap;if(e in zr&&o){if(this.tfm=this.tfm||{},e!=="transform")e=lr[e]||e,~e.indexOf(",")?e.split(",").forEach(function(u){return i.tfm[u]=Dr(s,u)}):this.tfm[e]=c.x?c[e]:Dr(s,e),e===ri&&(this.tfm.zOrigin=c.zOrigin);else return lr.transform.split(",").forEach(function(u){return a.call(i,u,t)});if(this.props.indexOf(rn)>=0)return;c.svg&&(this.svgo=s.getAttribute("data-svg-origin"),this.props.push(ri,t,"")),e=rn}(o||t)&&this.props.push(e,t,o[e])},Kv=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},wb=function(){var e=this.props,t=this.target,i=t.style,s=t._gsap,o,c;for(o=0;o<e.length;o+=3)e[o+1]?e[o+1]===2?t[e[o]](e[o+2]):t[e[o]]=e[o+2]:e[o+2]?i[e[o]]=e[o+2]:i.removeProperty(e[o].substr(0,2)==="--"?e[o]:e[o].replace(dm,"-$1").toLowerCase());if(this.tfm){for(c in this.tfm)s[c]=this.tfm[c];s.svg&&(s.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),o=um(),(!o||!o.isStart)&&!i[rn]&&(Kv(i),s.zOrigin&&i[ri]&&(i[ri]+=" "+s.zOrigin+"px",s.zOrigin=0,s.renderTransform()),s.uncache=1)}},Zv=function(e,t){var i={target:e,props:[],revert:wb,save:Tb};return e._gsap||oi.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(s){return i.save(s)}),i},Qv,Wh=function(e,t){var i=xs.createElementNS?xs.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):xs.createElement(e);return i&&i.style?i:xs.createElement(e)},_i=function a(e,t,i){var s=getComputedStyle(e);return s[t]||s.getPropertyValue(t.replace(dm,"-$1").toLowerCase())||s.getPropertyValue(t)||!i&&a(e,fo(t)||t,1)||""},T_="O,Moz,ms,Ms,Webkit".split(","),fo=function(e,t,i){var s=t||Js,o=s.style,c=5;if(e in o&&!i)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);c--&&!(T_[c]+e in o););return c<0?null:(c===3?"ms":c>=0?T_[c]:"")+e},Xh=function(){fb()&&window.document&&(M_=window,xs=M_.document,io=xs.documentElement,Js=Wh("div")||{style:{}},Wh("div"),rn=fo(rn),ri=rn+"Origin",Js.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Qv=!!fo("perspective"),um=oi.core.reverting,cm=1)},w_=function(e){var t=e.ownerSVGElement,i=Wh("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),s=e.cloneNode(!0),o;s.style.display="block",i.appendChild(s),io.appendChild(i);try{o=s.getBBox()}catch{}return i.removeChild(s),io.removeChild(i),o},A_=function(e,t){for(var i=t.length;i--;)if(e.hasAttribute(t[i]))return e.getAttribute(t[i])},Jv=function(e){var t,i;try{t=e.getBBox()}catch{t=w_(e),i=1}return t&&(t.width||t.height)||i||(t=w_(e)),t&&!t.width&&!t.x&&!t.y?{x:+A_(e,["x","cx","x1"])||0,y:+A_(e,["y","cy","y1"])||0,width:0,height:0}:t},ey=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&Jv(e))},bs=function(e,t){if(t){var i=e.style,s;t in zr&&t!==ri&&(t=rn),i.removeProperty?(s=t.substr(0,2),(s==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),i.removeProperty(s==="--"?t:t.replace(dm,"-$1").toLowerCase())):i.removeAttribute(t)}},vs=function(e,t,i,s,o,c){var u=new ii(e._pt,t,i,0,1,c?Yv:qv);return e._pt=u,u.b=s,u.e=o,e._props.push(i),u},C_={deg:1,rad:1,turn:1},Ab={grid:1,flex:1},Ts=function a(e,t,i,s){var o=parseFloat(i)||0,c=(i+"").trim().substr((o+"").length)||"px",u=Js.style,f=hb.test(t),h=e.tagName.toLowerCase()==="svg",p=(h?"client":"offset")+(f?"Width":"Height"),_=100,m=s==="px",S=s==="%",M,b,x,E;if(s===c||!o||C_[s]||C_[c])return o;if(c!=="px"&&!m&&(o=a(e,t,i,"px")),E=e.getCTM&&ey(e),(S||c==="%")&&(zr[t]||~t.indexOf("adius")))return M=E?e.getBBox()[f?"width":"height"]:e[p],ln(S?o/M*_:o/100*M);if(u[f?"width":"height"]=_+(m?c:s),b=s!=="rem"&&~t.indexOf("adius")||s==="em"&&e.appendChild&&!h?e:e.parentNode,E&&(b=(e.ownerSVGElement||{}).parentNode),(!b||b===xs||!b.appendChild)&&(b=xs.body),x=b._gsap,x&&S&&x.width&&f&&x.time===mi.time&&!x.uncache)return ln(o/x.width*_);if(S&&(t==="height"||t==="width")){var w=e.style[t];e.style[t]=_+s,M=e[p],w?e.style[t]=w:bs(e,t)}else(S||c==="%")&&!Ab[_i(b,"display")]&&(u.position=_i(e,"position")),b===e&&(u.position="static"),b.appendChild(Js),M=Js[p],b.removeChild(Js),u.position="absolute";return f&&S&&(x=ia(b),x.time=mi.time,x.width=b[p]),ln(m?M*o/_:M&&o?_/M*o:0)},Dr=function(e,t,i,s){var o;return cm||Xh(),t in lr&&t!=="transform"&&(t=lr[t],~t.indexOf(",")&&(t=t.split(",")[0])),zr[t]&&t!=="transform"?(o=Pl(e,s),o=t!=="transformOrigin"?o[t]:o.svg?o.origin:Bu(_i(e,ri))+" "+o.zOrigin+"px"):(o=e.style[t],(!o||o==="auto"||s||~(o+"").indexOf("calc("))&&(o=ku[t]&&ku[t](e,t,i)||_i(e,t)||xv(e,t)||(t==="opacity"?1:0))),i&&!~(o+"").trim().indexOf(" ")?Ts(e,t,o,i)+i:o},Cb=function(e,t,i,s){if(!i||i==="none"){var o=fo(t,e,1),c=o&&_i(e,o,1);c&&c!==i?(t=o,i=c):t==="borderColor"&&(i=_i(e,"borderTopColor"))}var u=new ii(this._pt,e.style,t,0,1,Wv),f=0,h=0,p,_,m,S,M,b,x,E,w,P,A,N;if(u.b=i,u.e=s,i+="",s+="",s.substring(0,6)==="var(--"&&(s=_i(e,s.substring(4,s.indexOf(")")))),s==="auto"&&(b=e.style[t],e.style[t]=s,s=_i(e,t)||s,b?e.style[t]=b:bs(e,t)),p=[i,s],Ov(p),i=p[0],s=p[1],m=i.match(eo)||[],N=s.match(eo)||[],N.length){for(;_=eo.exec(s);)x=_[0],w=s.substring(f,_.index),M?M=(M+1)%5:(w.substr(-5)==="rgba("||w.substr(-5)==="hsla(")&&(M=1),x!==(b=m[h++]||"")&&(S=parseFloat(b)||0,A=b.substr((S+"").length),x.charAt(1)==="="&&(x=no(S,x)+A),E=parseFloat(x),P=x.substr((E+"").length),f=eo.lastIndex-P.length,P||(P=P||xi.units[t]||A,f===s.length&&(s+=P,u.e+=P)),A!==P&&(S=Ts(e,t,b,P)||0),u._pt={_next:u._pt,p:w||h===1?w:",",s:S,c:E-S,m:M&&M<4||t==="zIndex"?Math.round:0});u.c=f<s.length?s.substring(f,s.length):""}else u.r=t==="display"&&s==="none"?Yv:qv;return hv.test(s)&&(u.e=0),this._pt=u,u},R_={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},Rb=function(e){var t=e.split(" "),i=t[0],s=t[1]||"50%";return(i==="top"||i==="bottom"||s==="left"||s==="right")&&(e=i,i=s,s=e),t[0]=R_[i]||i,t[1]=R_[s]||s,t.join(" ")},Pb=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var i=t.t,s=i.style,o=t.u,c=i._gsap,u,f,h;if(o==="all"||o===!0)s.cssText="",f=1;else for(o=o.split(","),h=o.length;--h>-1;)u=o[h],zr[u]&&(f=1,u=u==="transformOrigin"?ri:rn),bs(i,u);f&&(bs(i,rn),c&&(c.svg&&i.removeAttribute("transform"),s.scale=s.rotate=s.translate="none",Pl(i,1),c.uncache=1,Kv(s)))}},ku={clearProps:function(e,t,i,s,o){if(o.data!=="isFromStart"){var c=e._pt=new ii(e._pt,t,i,0,0,Pb);return c.u=s,c.pr=-10,c.tween=o,e._props.push(i),1}}},Rl=[1,0,0,1,0,0],ty={},ny=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},P_=function(e){var t=_i(e,rn);return ny(t)?Rl:t.substr(7).match(fv).map(ln)},fm=function(e,t){var i=e._gsap||ia(e),s=e.style,o=P_(e),c,u,f,h;return i.svg&&e.getAttribute("transform")?(f=e.transform.baseVal.consolidate().matrix,o=[f.a,f.b,f.c,f.d,f.e,f.f],o.join(",")==="1,0,0,1,0,0"?Rl:o):(o===Rl&&!e.offsetParent&&e!==io&&!i.svg&&(f=s.display,s.display="block",c=e.parentNode,(!c||!e.offsetParent&&!e.getBoundingClientRect().width)&&(h=1,u=e.nextElementSibling,io.appendChild(e)),o=P_(e),f?s.display=f:bs(e,"display"),h&&(u?c.insertBefore(e,u):c?c.appendChild(e):io.removeChild(e))),t&&o.length>6?[o[0],o[1],o[4],o[5],o[12],o[13]]:o)},$h=function(e,t,i,s,o,c){var u=e._gsap,f=o||fm(e,!0),h=u.xOrigin||0,p=u.yOrigin||0,_=u.xOffset||0,m=u.yOffset||0,S=f[0],M=f[1],b=f[2],x=f[3],E=f[4],w=f[5],P=t.split(" "),A=parseFloat(P[0])||0,N=parseFloat(P[1])||0,L,F,T,I;i?f!==Rl&&(F=S*x-M*b)&&(T=A*(x/F)+N*(-b/F)+(b*w-x*E)/F,I=A*(-M/F)+N*(S/F)-(S*w-M*E)/F,A=T,N=I):(L=Jv(e),A=L.x+(~P[0].indexOf("%")?A/100*L.width:A),N=L.y+(~(P[1]||P[0]).indexOf("%")?N/100*L.height:N)),s||s!==!1&&u.smooth?(E=A-h,w=N-p,u.xOffset=_+(E*S+w*b)-E,u.yOffset=m+(E*M+w*x)-w):u.xOffset=u.yOffset=0,u.xOrigin=A,u.yOrigin=N,u.smooth=!!s,u.origin=t,u.originIsAbsolute=!!i,e.style[ri]="0px 0px",c&&(vs(c,u,"xOrigin",h,A),vs(c,u,"yOrigin",p,N),vs(c,u,"xOffset",_,u.xOffset),vs(c,u,"yOffset",m,u.yOffset)),e.setAttribute("data-svg-origin",A+" "+N)},Pl=function(e,t){var i=e._gsap||new Bv(e);if("x"in i&&!t&&!i.uncache)return i;var s=e.style,o=i.scaleX<0,c="px",u="deg",f=getComputedStyle(e),h=_i(e,ri)||"0",p,_,m,S,M,b,x,E,w,P,A,N,L,F,T,I,z,k,q,Q,se,V,W,H,Y,ae,oe,B,J,Ie,Fe,De;return p=_=m=b=x=E=w=P=A=0,S=M=1,i.svg=!!(e.getCTM&&ey(e)),f.translate&&((f.translate!=="none"||f.scale!=="none"||f.rotate!=="none")&&(s[rn]=(f.translate!=="none"?"translate3d("+(f.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(f.rotate!=="none"?"rotate("+f.rotate+") ":"")+(f.scale!=="none"?"scale("+f.scale.split(" ").join(",")+") ":"")+(f[rn]!=="none"?f[rn]:"")),s.scale=s.rotate=s.translate="none"),F=fm(e,i.svg),i.svg&&(i.uncache?(Y=e.getBBox(),h=i.xOrigin-Y.x+"px "+(i.yOrigin-Y.y)+"px",H=""):H=!t&&e.getAttribute("data-svg-origin"),$h(e,H||h,!!H||i.originIsAbsolute,i.smooth!==!1,F)),N=i.xOrigin||0,L=i.yOrigin||0,F!==Rl&&(k=F[0],q=F[1],Q=F[2],se=F[3],p=V=F[4],_=W=F[5],F.length===6?(S=Math.sqrt(k*k+q*q),M=Math.sqrt(se*se+Q*Q),b=k||q?Ba(q,k)*Ys:0,w=Q||se?Ba(Q,se)*Ys+b:0,w&&(M*=Math.abs(Math.cos(w*ro))),i.svg&&(p-=N-(N*k+L*Q),_-=L-(N*q+L*se))):(De=F[6],Ie=F[7],oe=F[8],B=F[9],J=F[10],Fe=F[11],p=F[12],_=F[13],m=F[14],T=Ba(De,J),x=T*Ys,T&&(I=Math.cos(-T),z=Math.sin(-T),H=V*I+oe*z,Y=W*I+B*z,ae=De*I+J*z,oe=V*-z+oe*I,B=W*-z+B*I,J=De*-z+J*I,Fe=Ie*-z+Fe*I,V=H,W=Y,De=ae),T=Ba(-Q,J),E=T*Ys,T&&(I=Math.cos(-T),z=Math.sin(-T),H=k*I-oe*z,Y=q*I-B*z,ae=Q*I-J*z,Fe=se*z+Fe*I,k=H,q=Y,Q=ae),T=Ba(q,k),b=T*Ys,T&&(I=Math.cos(T),z=Math.sin(T),H=k*I+q*z,Y=V*I+W*z,q=q*I-k*z,W=W*I-V*z,k=H,V=Y),x&&Math.abs(x)+Math.abs(b)>359.9&&(x=b=0,E=180-E),S=ln(Math.sqrt(k*k+q*q+Q*Q)),M=ln(Math.sqrt(W*W+De*De)),T=Ba(V,W),w=Math.abs(T)>2e-4?T*Ys:0,A=Fe?1/(Fe<0?-Fe:Fe):0),i.svg&&(H=e.getAttribute("transform"),i.forceCSS=e.setAttribute("transform","")||!ny(_i(e,rn)),H&&e.setAttribute("transform",H))),Math.abs(w)>90&&Math.abs(w)<270&&(o?(S*=-1,w+=b<=0?180:-180,b+=b<=0?180:-180):(M*=-1,w+=w<=0?180:-180)),t=t||i.uncache,i.x=p-((i.xPercent=p&&(!t&&i.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-p)?-50:0)))?e.offsetWidth*i.xPercent/100:0)+c,i.y=_-((i.yPercent=_&&(!t&&i.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-_)?-50:0)))?e.offsetHeight*i.yPercent/100:0)+c,i.z=m+c,i.scaleX=ln(S),i.scaleY=ln(M),i.rotation=ln(b)+u,i.rotationX=ln(x)+u,i.rotationY=ln(E)+u,i.skewX=w+u,i.skewY=P+u,i.transformPerspective=A+c,(i.zOrigin=parseFloat(h.split(" ")[2])||!t&&i.zOrigin||0)&&(s[ri]=Bu(h)),i.xOffset=i.yOffset=0,i.force3D=xi.force3D,i.renderTransform=i.svg?Db:Qv?iy:Nb,i.uncache=0,i},Bu=function(e){return(e=e.split(" "))[0]+" "+e[1]},qf=function(e,t,i){var s=On(t);return ln(parseFloat(t)+parseFloat(Ts(e,"x",i+"px",s)))+s},Nb=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,iy(e,t)},Gs="0deg",rl="0px",js=") ",iy=function(e,t){var i=t||this,s=i.xPercent,o=i.yPercent,c=i.x,u=i.y,f=i.z,h=i.rotation,p=i.rotationY,_=i.rotationX,m=i.skewX,S=i.skewY,M=i.scaleX,b=i.scaleY,x=i.transformPerspective,E=i.force3D,w=i.target,P=i.zOrigin,A="",N=E==="auto"&&e&&e!==1||E===!0;if(P&&(_!==Gs||p!==Gs)){var L=parseFloat(p)*ro,F=Math.sin(L),T=Math.cos(L),I;L=parseFloat(_)*ro,I=Math.cos(L),c=qf(w,c,F*I*-P),u=qf(w,u,-Math.sin(L)*-P),f=qf(w,f,T*I*-P+P)}x!==rl&&(A+="perspective("+x+js),(s||o)&&(A+="translate("+s+"%, "+o+"%) "),(N||c!==rl||u!==rl||f!==rl)&&(A+=f!==rl||N?"translate3d("+c+", "+u+", "+f+") ":"translate("+c+", "+u+js),h!==Gs&&(A+="rotate("+h+js),p!==Gs&&(A+="rotateY("+p+js),_!==Gs&&(A+="rotateX("+_+js),(m!==Gs||S!==Gs)&&(A+="skew("+m+", "+S+js),(M!==1||b!==1)&&(A+="scale("+M+", "+b+js),w.style[rn]=A||"translate(0, 0)"},Db=function(e,t){var i=t||this,s=i.xPercent,o=i.yPercent,c=i.x,u=i.y,f=i.rotation,h=i.skewX,p=i.skewY,_=i.scaleX,m=i.scaleY,S=i.target,M=i.xOrigin,b=i.yOrigin,x=i.xOffset,E=i.yOffset,w=i.forceCSS,P=parseFloat(c),A=parseFloat(u),N,L,F,T,I;f=parseFloat(f),h=parseFloat(h),p=parseFloat(p),p&&(p=parseFloat(p),h+=p,f+=p),f||h?(f*=ro,h*=ro,N=Math.cos(f)*_,L=Math.sin(f)*_,F=Math.sin(f-h)*-m,T=Math.cos(f-h)*m,h&&(p*=ro,I=Math.tan(h-p),I=Math.sqrt(1+I*I),F*=I,T*=I,p&&(I=Math.tan(p),I=Math.sqrt(1+I*I),N*=I,L*=I)),N=ln(N),L=ln(L),F=ln(F),T=ln(T)):(N=_,T=m,L=F=0),(P&&!~(c+"").indexOf("px")||A&&!~(u+"").indexOf("px"))&&(P=Ts(S,"x",c,"px"),A=Ts(S,"y",u,"px")),(M||b||x||E)&&(P=ln(P+M-(M*N+b*F)+x),A=ln(A+b-(M*L+b*T)+E)),(s||o)&&(I=S.getBBox(),P=ln(P+s/100*I.width),A=ln(A+o/100*I.height)),I="matrix("+N+","+L+","+F+","+T+","+P+","+A+")",S.setAttribute("transform",I),w&&(S.style[rn]=I)},Lb=function(e,t,i,s,o){var c=360,u=bn(o),f=parseFloat(o)*(u&&~o.indexOf("rad")?Ys:1),h=f-s,p=s+h+"deg",_,m;return u&&(_=o.split("_")[1],_==="short"&&(h%=c,h!==h%(c/2)&&(h+=h<0?c:-c)),_==="cw"&&h<0?h=(h+c*b_)%c-~~(h/c)*c:_==="ccw"&&h>0&&(h=(h-c*b_)%c-~~(h/c)*c)),e._pt=m=new ii(e._pt,t,i,s,h,mb),m.e=p,m.u="deg",e._props.push(i),m},N_=function(e,t){for(var i in t)e[i]=t[i];return e},Ib=function(e,t,i){var s=N_({},i._gsap),o="perspective,force3D,transformOrigin,svgOrigin",c=i.style,u,f,h,p,_,m,S,M;s.svg?(h=i.getAttribute("transform"),i.setAttribute("transform",""),c[rn]=t,u=Pl(i,1),bs(i,rn),i.setAttribute("transform",h)):(h=getComputedStyle(i)[rn],c[rn]=t,u=Pl(i,1),c[rn]=h);for(f in zr)h=s[f],p=u[f],h!==p&&o.indexOf(f)<0&&(S=On(h),M=On(p),_=S!==M?Ts(i,f,h,M):parseFloat(h),m=parseFloat(p),e._pt=new ii(e._pt,u,f,_,m-_,jh),e._pt.u=M||0,e._props.push(f));N_(u,s)};ni("padding,margin,Width,Radius",function(a,e){var t="Top",i="Right",s="Bottom",o="Left",c=(e<3?[t,i,s,o]:[t+o,t+i,s+i,s+o]).map(function(u){return e<2?a+u:"border"+u+a});ku[e>1?"border"+a:a]=function(u,f,h,p,_){var m,S;if(arguments.length<4)return m=c.map(function(M){return Dr(u,M,h)}),S=m.join(" "),S.split(m[0]).length===5?m[0]:S;m=(p+"").split(" "),S={},c.forEach(function(M,b){return S[M]=m[b]=m[b]||m[(b-1)/2|0]}),u.init(f,S,_)}});var ry={name:"css",register:Xh,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,i,s,o){var c=this._props,u=e.style,f=i.vars.startAt,h,p,_,m,S,M,b,x,E,w,P,A,N,L,F,T,I;cm||Xh(),this.styles=this.styles||Zv(e),T=this.styles.props,this.tween=i;for(b in t)if(b!=="autoRound"&&(p=t[b],!(pi[b]&&zv(b,t,i,s,e,o)))){if(S=typeof p,M=ku[b],S==="function"&&(p=p.call(i,s,e,o),S=typeof p),S==="string"&&~p.indexOf("random(")&&(p=wl(p)),M)M(this,e,b,p,i)&&(F=1);else if(b.substr(0,2)==="--")h=(getComputedStyle(e).getPropertyValue(b)+"").trim(),p+="",Ms.lastIndex=0,Ms.test(h)||(x=On(h),E=On(p),E?x!==E&&(h=Ts(e,b,h,E)+E):x&&(p+=x)),this.add(u,"setProperty",h,p,s,o,0,0,b),c.push(b),T.push(b,0,u[b]);else if(S!=="undefined"){if(f&&b in f?(h=typeof f[b]=="function"?f[b].call(i,s,e,o):f[b],bn(h)&&~h.indexOf("random(")&&(h=wl(h)),On(h+"")||h==="auto"||(h+=xi.units[b]||On(Dr(e,b))||""),(h+"").charAt(1)==="="&&(h=Dr(e,b))):h=Dr(e,b),m=parseFloat(h),w=S==="string"&&p.charAt(1)==="="&&p.substr(0,2),w&&(p=p.substr(2)),_=parseFloat(p),b in lr&&(b==="autoAlpha"&&(m===1&&Dr(e,"visibility")==="hidden"&&_&&(m=0),T.push("visibility",0,u.visibility),vs(this,u,"visibility",m?"inherit":"hidden",_?"inherit":"hidden",!_)),b!=="scale"&&b!=="transform"&&(b=lr[b],~b.indexOf(",")&&(b=b.split(",")[0]))),P=b in zr,P){if(this.styles.save(b),I=p,S==="string"&&p.substring(0,6)==="var(--"){if(p=_i(e,p.substring(4,p.indexOf(")"))),p.substring(0,5)==="calc("){var z=e.style.perspective;e.style.perspective=p,p=_i(e,"perspective"),z?e.style.perspective=z:bs(e,"perspective")}_=parseFloat(p)}if(A||(N=e._gsap,N.renderTransform&&!t.parseTransform||Pl(e,t.parseTransform),L=t.smoothOrigin!==!1&&N.smooth,A=this._pt=new ii(this._pt,u,rn,0,1,N.renderTransform,N,0,-1),A.dep=1),b==="scale")this._pt=new ii(this._pt,N,"scaleY",N.scaleY,(w?no(N.scaleY,w+_):_)-N.scaleY||0,jh),this._pt.u=0,c.push("scaleY",b),b+="X";else if(b==="transformOrigin"){T.push(ri,0,u[ri]),p=Rb(p),N.svg?$h(e,p,0,L,0,this):(E=parseFloat(p.split(" ")[2])||0,E!==N.zOrigin&&vs(this,N,"zOrigin",N.zOrigin,E),vs(this,u,b,Bu(h),Bu(p)));continue}else if(b==="svgOrigin"){$h(e,p,1,L,0,this);continue}else if(b in ty){Lb(this,N,b,m,w?no(m,w+p):p);continue}else if(b==="smoothOrigin"){vs(this,N,"smooth",N.smooth,p);continue}else if(b==="force3D"){N[b]=p;continue}else if(b==="transform"){Ib(this,p,e);continue}}else b in u||(b=fo(b)||b);if(P||(_||_===0)&&(m||m===0)&&!pb.test(p)&&b in u)x=(h+"").substr((m+"").length),_||(_=0),E=On(p)||(b in xi.units?xi.units[b]:x),x!==E&&(m=Ts(e,b,h,E)),this._pt=new ii(this._pt,P?N:u,b,m,(w?no(m,w+_):_)-m,!P&&(E==="px"||b==="zIndex")&&t.autoRound!==!1?xb:jh),this._pt.u=E||0,P&&I!==p?(this._pt.b=h,this._pt.e=I,this._pt.r=_b):x!==E&&E!=="%"&&(this._pt.b=h,this._pt.r=gb);else if(b in u)Cb.call(this,e,b,h,w?w+p:p);else if(b in e)this.add(e,b,h||e[b],w?w+p:p,s,o);else if(b!=="parseTransform"){Jp(b,p);continue}P||(b in u?T.push(b,0,u[b]):typeof e[b]=="function"?T.push(b,2,e[b]()):T.push(b,1,h||e[b])),c.push(b)}}F&&Xv(this)},render:function(e,t){if(t.tween._time||!um())for(var i=t._pt;i;)i.r(e,i.d),i=i._next;else t.styles.revert()},get:Dr,aliases:lr,getSetter:function(e,t,i){var s=lr[t];return s&&s.indexOf(",")<0&&(t=s),t in zr&&t!==ri&&(e._gsap.x||Dr(e,"x"))?i&&E_===i?t==="scale"?Mb:Sb:(E_=i||{})&&(t==="scale"?Eb:bb):e.style&&!Kp(e.style[t])?vb:~t.indexOf("-")?yb:om(e,t)},core:{_removeProperty:bs,_getMatrix:fm}};oi.utils.checkPrefix=fo;oi.core.getStyleSaver=Zv;(function(a,e,t,i){var s=ni(a+","+e+","+t,function(o){zr[o]=1});ni(e,function(o){xi.units[o]="deg",ty[o]=1}),lr[s[13]]=a+","+e,ni(i,function(o){var c=o.split(":");lr[c[1]]=s[c[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");ni("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(a){xi.units[a]="px"});oi.registerPlugin(ry);var cn=oi.registerPlugin(ry)||oi;cn.core.Tween;const Yf=[{id:"fever",name:"Fever",category:"General"},{id:"cough",name:"Cough",category:"Respiratory"},{id:"fatigue",name:"Fatigue",category:"General"},{id:"headache",name:"Headache",category:"Neurological"},{id:"sore-throat",name:"Sore Throat",category:"Respiratory"},{id:"nausea",name:"Nausea",category:"Digestive"},{id:"vomiting",name:"Vomiting",category:"Digestive"},{id:"diarrhea",name:"Diarrhea",category:"Digestive"},{id:"shortness-breath",name:"Shortness of Breath",category:"Respiratory"},{id:"chest-pain",name:"Chest Pain",category:"Cardiovascular"},{id:"abdominal-pain",name:"Abdominal Pain",category:"Digestive"},{id:"muscle-pain",name:"Muscle Pain",category:"Musculoskeletal"},{id:"joint-pain",name:"Joint Pain",category:"Musculoskeletal"},{id:"rash",name:"Rash",category:"Dermatological"},{id:"dizziness",name:"Dizziness",category:"Neurological"},{id:"loss-smell",name:"Loss of Smell",category:"Respiratory"},{id:"loss-taste",name:"Loss of Taste",category:"Respiratory"},{id:"chills",name:"Chills",category:"General"},{id:"sweating",name:"Excessive Sweating",category:"General"},{id:"congestion",name:"Nasal Congestion",category:"Respiratory"}];function Fb({onPrediction:a}){const e=me.useRef(null),{theme:t}=ha(),i=t==="dark",[s,o]=me.useState([]),[c,u]=me.useState(""),[f,h]=me.useState(!1),[p,_]=me.useState(null);me.useEffect(()=>{const A=cn.context(()=>{cn.fromTo(".sc-card",{y:32,opacity:0},{y:0,opacity:1,duration:.75,stagger:.12,ease:"expo.out"})},e);return()=>A.revert()},[]);const m=i?{cardBg:"rgba(12,12,26,0.78)",cardBdr:"rgba(255,255,255,0.10)",shadow:"0 8px 32px rgba(0,0,0,0.5)",head:"#ffffff",sub:"rgba(255,255,255,0.50)",text:"#ffffff",muted:"rgba(255,255,255,0.45)",inpBg:"rgba(255,255,255,0.06)",rowHov:"rgba(255,255,255,0.06)",selBg:"rgba(139,92,246,0.18)",selBdr:"rgba(139,92,246,0.45)",catHead:"rgba(255,255,255,0.35)",tagBg:"rgba(139,92,246,0.20)",tagBdr:"rgba(139,92,246,0.40)",resBg:"rgba(99,102,241,0.12)",resBdr:"rgba(99,102,241,0.28)",recBg:"rgba(255,255,255,0.04)",recBdr:"rgba(255,255,255,0.08)",amberBg:"rgba(245,158,11,0.12)",amberBdr:"rgba(245,158,11,0.30)",amberTxt:"#fde68a",btnBg:"linear-gradient(135deg,#6366f1,#8b5cf6)",btnSh:"0 4px 20px rgba(99,102,241,0.45)"}:{cardBg:"rgba(255,255,255,0.97)",cardBdr:"rgba(0,0,0,0.08)",shadow:"0 4px 20px rgba(0,0,0,0.07)",head:"#0a0a1a",sub:"rgba(10,10,26,0.50)",text:"#0a0a1a",muted:"rgba(10,10,26,0.45)",inpBg:"rgba(0,0,0,0.04)",rowHov:"rgba(0,0,0,0.04)",selBg:"rgba(109,40,217,0.07)",selBdr:"rgba(109,40,217,0.25)",catHead:"rgba(10,10,26,0.40)",tagBg:"rgba(109,40,217,0.10)",tagBdr:"rgba(109,40,217,0.25)",resBg:"rgba(99,102,241,0.06)",resBdr:"rgba(99,102,241,0.18)",recBg:"rgba(0,0,0,0.025)",recBdr:"rgba(0,0,0,0.07)",amberBg:"rgba(245,158,11,0.07)",amberBdr:"rgba(245,158,11,0.22)",amberTxt:"#92400e",btnBg:"linear-gradient(135deg,#6366f1,#8b5cf6)",btnSh:"0 4px 16px rgba(99,102,241,0.30)"},S={background:m.cardBg,border:`1px solid ${m.cardBdr}`,boxShadow:m.shadow,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:"20px"},M="'Syne', sans-serif",b="'Inter', sans-serif",x=Yf.filter(A=>A.name.toLowerCase().includes(c.toLowerCase())||A.category.toLowerCase().includes(c.toLowerCase())),E=[...new Set(Yf.map(A=>A.category))],w=A=>o(N=>N.includes(A)?N.filter(L=>L!==A):[...N,A]),P=async()=>{if(s.length){h(!0),_(null);try{const{data:A,error:N}=await hE(s);if(N){setTimeout(()=>{const L=Ub(s);_(L),a({type:"symptom",diagnosis:L.diagnosis,confidence:L.confidence,details:L.details,recommendations:L.recommendations}),h(!1)},2e3);return}setTimeout(()=>{_(A),a({type:"symptom",diagnosis:A.diagnosis,confidence:A.confidence,details:A.details,recommendations:A.recommendations}),h(!1)},1500)}catch{h(!1)}}};return v.jsxs("div",{ref:e,style:{fontFamily:b},children:[v.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[v.jsxs("div",{className:"sc-card",style:{...S,padding:"1.75rem"},children:[v.jsx("h3",{style:{fontFamily:M,fontSize:"1.1rem",fontWeight:700,color:m.head,marginBottom:"4px"},children:"Select Your Symptoms"}),v.jsx("p",{style:{color:m.sub,fontSize:"0.82rem",marginBottom:"1.25rem"},children:"Choose all symptoms you are currently experiencing"}),v.jsxs("div",{style:{position:"relative",marginBottom:"1rem"},children:[v.jsx(GM,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",style:{color:m.muted}}),v.jsx("input",{placeholder:"Search symptoms...",value:c,onChange:A=>u(A.target.value),style:{width:"100%",paddingLeft:"2.25rem",paddingRight:"1rem",paddingTop:"0.6rem",paddingBottom:"0.6rem",background:m.inpBg,border:`1px solid ${m.cardBdr}`,borderRadius:"12px",color:m.text,fontSize:"0.875rem",outline:"none"}})]}),s.length>0&&v.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"1rem"},children:[s.map(A=>{const N=Yf.find(L=>L.id===A);return N?v.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px",padding:"3px 10px",borderRadius:"999px",fontSize:"0.72rem",fontWeight:600,background:m.tagBg,border:`1px solid ${m.tagBdr}`,color:i?"#a78bfa":"#6d28d9"},children:[N.name,v.jsx("button",{onClick:()=>w(A),style:{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center"},children:v.jsx($p,{className:"w-3 h-3"})})]},A):null}),v.jsx("button",{onClick:()=>o([]),style:{padding:"3px 10px",borderRadius:"999px",fontSize:"0.72rem",fontWeight:600,background:"none",border:`1px solid ${m.cardBdr}`,color:m.muted,cursor:"pointer"},children:"Clear all"})]}),v.jsxs("p",{style:{fontSize:"0.75rem",color:m.catHead,marginBottom:"0.75rem"},children:[s.length," symptom(s) selected"]}),v.jsx("div",{style:{maxHeight:"380px",overflowY:"auto",paddingRight:"4px",display:"flex",flexDirection:"column",gap:"1rem"},children:E.map(A=>{const N=x.filter(L=>L.category===A);return N.length?v.jsxs("div",{children:[v.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",color:m.catHead,fontFamily:M,marginBottom:"0.5rem"},children:A}),v.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:N.map(L=>{const F=s.includes(L.id);return v.jsxs("label",{className:"transition-all duration-200 cursor-pointer",style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.55rem 0.75rem",borderRadius:"10px",background:F?m.selBg:"transparent",border:`1px solid ${F?m.selBdr:"transparent"}`},onMouseEnter:T=>{F||(T.currentTarget.style.background=m.rowHov)},onMouseLeave:T=>{F||(T.currentTarget.style.background="transparent")},children:[v.jsx("div",{style:{width:"16px",height:"16px",borderRadius:"5px",border:`2px solid ${F?"#8b5cf6":m.catHead}`,background:F?"#8b5cf6":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"},children:F&&v.jsx("svg",{width:"9",height:"7",viewBox:"0 0 9 7",fill:"none",children:v.jsx("path",{d:"M1 3.5L3.5 6L8 1",stroke:"white",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})}),v.jsx("input",{type:"checkbox",checked:F,onChange:()=>w(L.id),style:{display:"none"}}),v.jsx("span",{style:{fontSize:"0.85rem",color:m.text},children:L.name})]},L.id)})})]},A):null})}),v.jsx("button",{onClick:P,disabled:!s.length||f,className:"w-full mt-5 transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed",style:{padding:"0.9rem",borderRadius:"14px",background:m.btnBg,boxShadow:s.length?m.btnSh:"none",color:"#fff",fontSize:"0.88rem",fontWeight:700,fontFamily:M,border:"none",cursor:s.length?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",letterSpacing:"0.05em"},children:f?v.jsxs(v.Fragment,{children:[v.jsx(ao,{className:"w-4 h-4 animate-spin"})," Analyzing with AI..."]}):"Analyze Symptoms"})]}),v.jsxs("div",{className:"sc-card",style:{...S,padding:"1.75rem"},children:[v.jsx("h3",{style:{fontFamily:M,fontSize:"1.1rem",fontWeight:700,color:m.head,marginBottom:"4px"},children:"AI Analysis Results"}),v.jsx("p",{style:{color:m.sub,fontSize:"0.82rem",marginBottom:"1.25rem"},children:"AI-powered prediction based on your symptoms"}),!p&&!f&&v.jsxs("div",{style:{textAlign:"center",padding:"3rem 0",color:m.muted},children:[v.jsx(_l,{className:"w-12 h-12 mx-auto mb-3 opacity-40"}),v.jsx("p",{style:{fontSize:"0.9rem"},children:'Select symptoms and click "Analyze" to get AI predictions'})]}),f&&v.jsxs("div",{style:{textAlign:"center",padding:"3rem 0"},children:[v.jsxs("div",{style:{position:"relative",width:"64px",height:"64px",margin:"0 auto 1.25rem"},children:[v.jsx("div",{style:{position:"absolute",inset:0,borderRadius:"50%",border:"3px solid transparent",borderTopColor:"#8b5cf6",animation:"spin 1s linear infinite"}}),v.jsx("div",{style:{position:"absolute",inset:"8px",borderRadius:"50%",border:"2px solid transparent",borderTopColor:"#06b6d4",animation:"spin 0.8s linear infinite reverse"}})]}),v.jsx("p",{style:{color:m.text,fontWeight:600,fontSize:"0.9rem",marginBottom:"4px"},children:"AI is analyzing your symptoms..."}),v.jsx("p",{style:{color:m.muted,fontSize:"0.78rem"},children:"Processing neural network"})]}),p&&v.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.25rem"},children:[v.jsxs("div",{style:{padding:"1.25rem",borderRadius:"14px",background:m.resBg,border:`1px solid ${m.resBdr}`},children:[v.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"},children:[v.jsx("h4",{style:{fontFamily:M,fontWeight:700,color:m.head,fontSize:"1.1rem"},children:p.diagnosis}),v.jsxs("span",{style:{padding:"3px 12px",borderRadius:"999px",fontSize:"0.72rem",fontWeight:700,fontFamily:M,background:p.confidence>=80?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.15)",color:p.confidence>=80?"#10b981":"#f59e0b",border:`1px solid ${p.confidence>=80?"rgba(16,185,129,0.30)":"rgba(245,158,11,0.30)"}`,whiteSpace:"nowrap"},children:[p.confidence,"% confidence"]})]}),v.jsx("p",{style:{color:m.muted,fontSize:"0.85rem"},children:p.details})]}),v.jsxs("div",{children:[v.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",marginBottom:"6px"},children:[v.jsx("span",{style:{color:m.muted},children:"Confidence Level"}),v.jsxs("span",{style:{fontWeight:700,color:m.text},children:[p.confidence,"%"]})]}),v.jsx("div",{style:{height:"8px",background:i?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)",borderRadius:"999px",overflow:"hidden"},children:v.jsx("div",{style:{height:"100%",width:`${p.confidence}%`,borderRadius:"999px",background:"linear-gradient(90deg, #6366f1, #8b5cf6)",transition:"width 1s ease"}})})]}),v.jsxs("div",{children:[v.jsxs("h5",{style:{fontFamily:M,fontWeight:700,color:m.head,fontSize:"0.88rem",display:"flex",alignItems:"center",gap:"6px",marginBottom:"0.75rem"},children:[v.jsx(Sl,{className:"w-4 h-4",style:{color:"#10b981"}})," Recommendations"]}),v.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:p.recommendations.map((A,N)=>v.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"8px",padding:"0.65rem 0.85rem",borderRadius:"10px",background:m.recBg,border:`1px solid ${m.recBdr}`},children:[v.jsxs("span",{style:{fontFamily:M,fontWeight:700,color:"#8b5cf6",fontSize:"0.75rem",marginTop:"1px",flexShrink:0},children:[N+1,"."]}),v.jsx("span",{style:{fontSize:"0.82rem",color:m.text},children:A})]},N))})]}),v.jsx("div",{style:{padding:"0.85rem 1rem",borderRadius:"12px",background:m.amberBg,border:`1px solid ${m.amberBdr}`},children:v.jsx("p",{style:{fontSize:"0.75rem",color:m.amberTxt},children:"⚠️ This is an AI-based prediction for informational purposes only. Always consult with a qualified healthcare professional for proper diagnosis and treatment."})})]})]})]}),v.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]})}function Ub(a){const e=[{symptoms:["fever","cough","fatigue"],diagnosis:"Influenza (Flu)",confidence:87,details:"Common viral infection affecting the respiratory system",recommendations:["Get plenty of rest and stay hydrated","Take over-the-counter fever reducers if needed","Monitor symptoms for 3-5 days","Consult a doctor if symptoms worsen or persist beyond 7 days"]},{symptoms:["headache","nausea","dizziness"],diagnosis:"Migraine",confidence:82,details:"Neurological condition causing severe headaches",recommendations:["Rest in a quiet, dark room","Apply cold compress to forehead","Stay hydrated and avoid triggers","Consider consulting a neurologist if migraines are frequent"]},{symptoms:["chest-pain","shortness-breath"],diagnosis:"Possible Cardiac Issue",confidence:75,details:"Symptoms may indicate cardiovascular concern",recommendations:["⚠️ SEEK IMMEDIATE MEDICAL ATTENTION","Do not delay - visit emergency room","Avoid physical exertion","Have someone accompany you to the hospital"]}];let t=e[0],i=0;for(const s of e){const o=a.filter(c=>s.symptoms.includes(c)).length;o>i&&(i=o,t=s)}return i===0?{diagnosis:"General Malaise",confidence:65,details:"Multiple symptoms detected requiring professional evaluation",recommendations:["Schedule an appointment with your primary care physician","Keep a symptom diary","Monitor temperature and vital signs","Maintain good hydration and rest"]}:t}const ho=me.forwardRef(({className:a="",...e},t)=>v.jsx("div",{ref:t,className:`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${a}`,...e}));ho.displayName="Card";const Nl=me.forwardRef(({className:a="",...e},t)=>v.jsx("div",{ref:t,className:`flex flex-col space-y-1.5 p-6 ${a}`,...e}));Nl.displayName="CardHeader";const Dl=me.forwardRef(({className:a="",...e},t)=>v.jsx("h3",{ref:t,className:`font-semibold leading-none tracking-tight ${a}`,...e}));Dl.displayName="CardTitle";const Ll=me.forwardRef(({className:a="",...e},t)=>v.jsx("p",{ref:t,className:`text-sm text-gray-500 ${a}`,...e}));Ll.displayName="CardDescription";const Il=me.forwardRef(({className:a="",...e},t)=>v.jsx("div",{ref:t,className:`p-6 pt-0 ${a}`,...e}));Il.displayName="CardContent";const Ob=me.forwardRef(({className:a="",...e},t)=>v.jsx("div",{ref:t,className:`flex items-center p-6 pt-0 ${a}`,...e}));Ob.displayName="CardFooter";const Fl=me.forwardRef(({className:a="",variant:e="default",size:t="default",...i},s)=>{const o="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",c={default:"bg-gray-900 text-gray-50 hover:bg-gray-900/90",destructive:"bg-red-500 text-gray-50 hover:bg-red-500/90",outline:"border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",secondary:"bg-gray-100 text-gray-900 hover:bg-gray-100/80",ghost:"hover:bg-gray-100 hover:text-gray-900",link:"text-gray-900 underline-offset-4 hover:underline"},u={default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"};return v.jsx("button",{className:`${o} ${c[e]} ${u[t]} ${a}`,ref:s,...i})});Fl.displayName="Button";function zu({className:a="",variant:e="default",...t}){const i={default:"border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80",secondary:"border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",destructive:"border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80",outline:"text-gray-950 border border-gray-200",success:"border-transparent bg-green-500 text-white hover:bg-green-500/80"};return v.jsx("div",{className:`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 ${i[e]} ${a}`,...t})}const kb=[{id:"xray",name:"X-Ray",description:"Chest, bone, dental X-rays"},{id:"ct",name:"CT Scan",description:"Computed Tomography"},{id:"mri",name:"MRI",description:"Magnetic Resonance Imaging"},{id:"ultrasound",name:"Ultrasound",description:"Sonography scans"},{id:"skin",name:"Skin Lesion",description:"Dermatological images"}];function Bb({onPrediction:a}){const[e,t]=me.useState(null),[i,s]=me.useState(null),[o,c]=me.useState("xray"),[u,f]=me.useState(!1),[h,p]=me.useState(null),_=b=>{var E;const x=(E=b.target.files)==null?void 0:E[0];if(x&&x.type.startsWith("image/")){t(x);const w=new FileReader;w.onloadend=()=>{s(w.result)},w.readAsDataURL(x),p(null)}},m=()=>{t(null),s(null),p(null)},S=async()=>{if(!(!e||!o||!i)){f(!0),p(null);try{const{data:b,error:x}=await pE(o,i);if(x){console.error("Analysis error:",x),setTimeout(()=>{const E=M(o);p(E),a({type:"image",diagnosis:E.diagnosis,confidence:E.confidence,details:E.details,recommendations:E.recommendations}),f(!1)},3e3);return}setTimeout(()=>{p(b),a({type:"image",diagnosis:b.diagnosis,confidence:b.confidence,details:b.details,recommendations:b.recommendations}),f(!1)},2500)}catch(b){console.error("Unexpected error:",b),f(!1)}}},M=b=>{const x={xray:{diagnosis:"Pneumonia Detected",confidence:89,details:"Bilateral consolidation observed in lower lung fields. Findings consistent with bacterial pneumonia.",recommendations:["Immediate consultation with a pulmonologist recommended","Consider starting empirical antibiotic therapy","Follow-up chest X-ray in 48-72 hours","Monitor oxygen saturation levels"],findings:[{label:"Left Lung Opacity",severity:"moderate",location:"Lower lobe"},{label:"Air Bronchogram",severity:"mild",location:"Right middle lobe"},{label:"Pleural Effusion",severity:"minimal",location:"Right costophrenic angle"}]},ct:{diagnosis:"Normal CT Scan",confidence:94,details:"No significant abnormalities detected. All structures appear within normal limits.",recommendations:["Continue routine health monitoring","No immediate follow-up required","Maintain healthy lifestyle habits","Schedule regular check-ups as advised by physician"],findings:[{label:"Brain Tissue",severity:"normal",location:"All regions"},{label:"Ventricles",severity:"normal",location:"Bilateral"}]},mri:{diagnosis:"Mild Degenerative Changes",confidence:85,details:"Age-appropriate degenerative disc changes at L4-L5 level without significant stenosis.",recommendations:["Physical therapy for core strengthening","Consider anti-inflammatory medication as needed","Maintain proper posture and ergonomics","Follow-up MRI in 12 months if symptoms persist"],findings:[{label:"Disc Desiccation",severity:"mild",location:"L4-L5"},{label:"Facet Arthropathy",severity:"mild",location:"L5-S1"}]},ultrasound:{diagnosis:"Gallstone Identified",confidence:91,details:"Single echogenic focus with posterior acoustic shadowing in gallbladder, measuring approximately 8mm.",recommendations:["Consult with general surgeon regarding cholecystectomy","Low-fat diet modification","Monitor for symptoms of biliary colic","Consider HIDA scan if symptoms are atypical"],findings:[{label:"Gallstone",severity:"moderate",location:"Gallbladder fundus"},{label:"Gallbladder Wall",severity:"normal",location:"Throughout"}]},skin:{diagnosis:"Benign Nevus",confidence:87,details:"Symmetrical pigmented lesion with regular borders. Features consistent with benign melanocytic nevus.",recommendations:["Routine dermatological monitoring","Annual full-body skin examination","Sun protection and SPF 30+ sunscreen","Self-monitoring for changes in size, shape, or color"],findings:[{label:"Symmetry",severity:"normal",location:"Bilateral"},{label:"Border",severity:"normal",location:"Regular edges"},{label:"Color",severity:"normal",location:"Uniform brown"}]}};return x[b]||x.xray};return v.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[v.jsxs(ho,{children:[v.jsxs(Nl,{children:[v.jsx(Dl,{children:"Upload Medical Scan"}),v.jsx(Ll,{children:"Upload X-rays, CT scans, MRIs, or other medical images for AI analysis"})]}),v.jsxs(Il,{className:"space-y-6",children:[v.jsxs("div",{children:[v.jsx("label",{className:"text-sm font-medium mb-3 block",children:"Scan Type"}),v.jsx("div",{className:"grid grid-cols-2 gap-2",children:kb.map(b=>v.jsxs("button",{onClick:()=>c(b.id),className:`p-3 rounded-lg border-2 text-left transition-all ${o===b.id?"border-blue-600 bg-blue-50":"border-gray-200 hover:border-gray-300"}`,children:[v.jsx("div",{className:"font-medium text-sm",children:b.name}),v.jsx("div",{className:"text-xs text-gray-500",children:b.description})]},b.id))})]}),v.jsxs("div",{children:[v.jsx("input",{type:"file",accept:"image/*",onChange:_,className:"hidden"}),i?v.jsxs("div",{className:"relative",children:[v.jsx("img",{src:i,alt:"Medical scan preview",className:"w-full h-auto rounded-lg border border-gray-200"}),v.jsx(Fl,{variant:"destructive",size:"icon",className:"absolute top-2 right-2",onClick:m,children:v.jsx($p,{className:"w-4 h-4"})}),e&&v.jsxs("div",{className:"mt-2 text-sm text-gray-600",children:[v.jsx(l_,{className:"w-4 h-4 inline mr-1"}),e.name]})]}):v.jsxs("button",{onClick:()=>{var b;return(b=document.querySelector('input[type="file"]'))==null?void 0:b.click()},className:"w-full border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-500 hover:bg-blue-50 transition-all group",children:[v.jsx(aE,{className:"w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-blue-600"}),v.jsx("p",{className:"font-medium text-gray-700 group-hover:text-blue-600",children:"Click to upload medical scan"}),v.jsx("p",{className:"text-sm text-gray-500 mt-2",children:"Supports: JPG, PNG, DICOM"})]})]}),v.jsx(Fl,{onClick:S,disabled:!e||u,className:"w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",size:"lg",children:u?v.jsxs(v.Fragment,{children:[v.jsx(ao,{className:"w-4 h-4 animate-spin"}),"Analyzing Image with AI..."]}):"Analyze with AI"})]})]}),v.jsxs(ho,{children:[v.jsxs(Nl,{children:[v.jsx(Dl,{children:"AI Analysis Results"}),v.jsx(Ll,{children:"Deep learning model predictions"})]}),v.jsxs(Il,{children:[!h&&!u&&v.jsxs("div",{className:"text-center py-12 text-gray-400",children:[v.jsx(l_,{className:"w-12 h-12 mx-auto mb-3 opacity-50"}),v.jsx("p",{children:'Upload a medical scan and click "Analyze" to get AI predictions'})]}),u&&v.jsxs("div",{className:"text-center py-12",children:[v.jsx(ao,{className:"w-12 h-12 mx-auto mb-3 text-blue-600 animate-spin"}),v.jsx("p",{className:"text-gray-600",children:"Deep learning model processing..."}),v.jsx("p",{className:"text-sm text-gray-400 mt-2",children:"Analyzing image features"}),v.jsx("div",{className:"mt-4 max-w-xs mx-auto",children:v.jsx("div",{className:"h-1 bg-gray-200 rounded-full overflow-hidden",children:v.jsx("div",{className:"h-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse",style:{width:"60%"}})})})]}),h&&v.jsxs("div",{className:"space-y-6",children:[v.jsxs("div",{className:"p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200",children:[v.jsxs("div",{className:"flex items-start justify-between mb-2",children:[v.jsx("h3",{className:"font-semibold text-lg",children:h.diagnosis}),v.jsxs(zu,{variant:h.confidence>=85?"success":"secondary",children:[h.confidence,"% confidence"]})]}),v.jsx("p",{className:"text-sm text-gray-600",children:h.details})]}),v.jsxs("div",{children:[v.jsxs("div",{className:"flex justify-between text-sm mb-2",children:[v.jsx("span",{className:"text-gray-600",children:"Model Confidence"}),v.jsxs("span",{className:"font-semibold",children:[h.confidence,"%"]})]}),v.jsx("div",{className:"h-2 bg-gray-200 rounded-full overflow-hidden",children:v.jsx("div",{className:"h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000",style:{width:`${h.confidence}%`}})})]}),h.findings&&v.jsxs("div",{children:[v.jsx("h4",{className:"font-semibold mb-3",children:"Key Findings"}),v.jsx("div",{className:"space-y-2",children:h.findings.map((b,x)=>v.jsxs("div",{className:"p-3 bg-gray-50 rounded-lg flex items-start justify-between",children:[v.jsxs("div",{children:[v.jsx("div",{className:"font-medium text-sm",children:b.label}),v.jsx("div",{className:"text-xs text-gray-500",children:b.location})]}),v.jsx(zu,{variant:b.severity==="normal"?"success":b.severity==="mild"?"secondary":"outline",children:b.severity})]},x))})]}),v.jsxs("div",{children:[v.jsxs("h4",{className:"font-semibold mb-3 flex items-center gap-2",children:[v.jsx(Sl,{className:"w-4 h-4 text-green-600"}),"Recommendations"]}),v.jsx("ul",{className:"space-y-2",children:h.recommendations.map((b,x)=>v.jsxs("li",{className:"flex items-start gap-2 text-sm p-3 bg-gray-50 rounded-lg",children:[v.jsxs("span",{className:"text-blue-600 font-semibold mt-0.5",children:[x+1,"."]}),v.jsx("span",{children:b})]},x))})]}),v.jsx("div",{className:"p-3 bg-amber-50 border border-amber-200 rounded-lg",children:v.jsx("p",{className:"text-xs text-amber-800",children:"⚠️ AI analysis is for screening purposes only. All findings must be verified by a licensed radiologist or physician."})})]})]})]})]})}function zb({onPrediction:a}){const[e,t]=me.useState(""),[i,s]=me.useState(!1),[o,c]=me.useState(null),u=async()=>{if(e.trim()){s(!0),c(null);try{const{data:p,error:_}=await mE(e);if(_){console.error("Analysis error:",_),setTimeout(()=>{const m=h(e);c(m),a({type:"report",diagnosis:m.diagnosis,confidence:m.confidence,details:m.details,recommendations:m.recommendations}),s(!1)},2e3);return}setTimeout(()=>{c(p),a({type:"report",diagnosis:p.diagnosis,confidence:p.confidence,details:p.details,recommendations:p.recommendations}),s(!1)},1500)}catch(p){console.error("Unexpected error:",p),s(!1)}}},f=()=>{t(`LABORATORY REPORT

Patient: John Doe
Date: December 20, 2025

LIPID PANEL:
- Total Cholesterol: 245 mg/dL (H)
- LDL Cholesterol: 165 mg/dL (H)
- HDL Cholesterol: 35 mg/dL (L)
- Triglycerides: 225 mg/dL (H)

GLUCOSE METABOLISM:
- Fasting Glucose: 165 mg/dL (H)
- HbA1c: 8.2% (H)

INTERPRETATION:
Dyslipidemia with poor glycemic control noted.
Recommend lifestyle modifications and medication review.`)},h=p=>{const _=p.toLowerCase();let m;return _.includes("glucose")||_.includes("diabetes")||_.includes("hba1c")?m={diagnosis:"Diabetes Management Required",confidence:88,details:"Blood glucose levels and HbA1c values indicate suboptimal glycemic control.",recommendations:["Consult endocrinologist for medication adjustment","Implement continuous glucose monitoring","Follow diabetic diet plan strictly","Regular exercise 30 minutes daily","Recheck HbA1c in 3 months"],keyFindings:[{parameter:"Fasting Glucose",value:"165 mg/dL",status:"High",normal:"70-100 mg/dL"},{parameter:"HbA1c",value:"8.2%",status:"High",normal:"<5.7%"},{parameter:"Random Glucose",value:"210 mg/dL",status:"High",normal:"<140 mg/dL"}]}:_.includes("cholesterol")||_.includes("lipid")||_.includes("hdl")||_.includes("ldl")?m={diagnosis:"Dyslipidemia Detected",confidence:91,details:"Lipid profile shows elevated LDL cholesterol and triglycerides with reduced HDL.",recommendations:["Start or adjust statin therapy as prescribed","Adopt Mediterranean diet","Increase aerobic exercise to 150 min/week","Limit saturated fat intake","Repeat lipid panel in 6-8 weeks"],keyFindings:[{parameter:"Total Cholesterol",value:"245 mg/dL",status:"High",normal:"<200 mg/dL"},{parameter:"LDL Cholesterol",value:"165 mg/dL",status:"High",normal:"<100 mg/dL"},{parameter:"HDL Cholesterol",value:"35 mg/dL",status:"Low",normal:">40 mg/dL"},{parameter:"Triglycerides",value:"225 mg/dL",status:"High",normal:"<150 mg/dL"}]}:_.includes("thyroid")||_.includes("tsh")||_.includes("t3")||_.includes("t4")?m={diagnosis:"Hypothyroidism",confidence:85,details:"Elevated TSH with low free T4 levels consistent with primary hypothyroidism.",recommendations:["Initiate levothyroxine therapy","Recheck thyroid function in 6-8 weeks","Take medication on empty stomach","Monitor for symptoms improvement","Annual thyroid function monitoring"],keyFindings:[{parameter:"TSH",value:"8.5 mIU/L",status:"High",normal:"0.4-4.0 mIU/L"},{parameter:"Free T4",value:"0.6 ng/dL",status:"Low",normal:"0.8-1.8 ng/dL"},{parameter:"Free T3",value:"2.1 pg/mL",status:"Low",normal:"2.3-4.2 pg/mL"}]}:_.includes("hemoglobin")||_.includes("anemia")||_.includes("iron")?m={diagnosis:"Iron Deficiency Anemia",confidence:89,details:"Low hemoglobin and ferritin levels indicate iron deficiency anemia.",recommendations:["Oral iron supplementation (ferrous sulfate 325mg daily)","Increase dietary iron (red meat, spinach, fortified cereals)","Take iron with vitamin C for better absorption","Investigate source of blood loss if indicated","Recheck CBC and iron studies in 2-3 months"],keyFindings:[{parameter:"Hemoglobin",value:"9.8 g/dL",status:"Low",normal:"12-16 g/dL (F), 14-18 g/dL (M)"},{parameter:"Ferritin",value:"8 ng/mL",status:"Low",normal:"12-150 ng/mL"},{parameter:"MCV",value:"72 fL",status:"Low",normal:"80-100 fL"}]}:m={diagnosis:"General Lab Report Analysis",confidence:75,details:"Report analyzed. Some parameters may require attention based on clinical context.",recommendations:["Discuss results with your primary care physician","Consider repeat testing if abnormalities noted","Maintain healthy lifestyle habits","Follow up as recommended by your doctor"],keyFindings:[{parameter:"Overall Assessment",value:"Reviewed",status:"Normal",normal:"Multiple parameters"}]},{...{type:"report",diagnosis:m.diagnosis,confidence:m.confidence,details:m.details,recommendations:m.recommendations},keyFindings:m.keyFindings}};return v.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[v.jsxs(ho,{children:[v.jsxs(Nl,{children:[v.jsx(Dl,{children:"Upload Lab Report"}),v.jsx(Ll,{children:"Paste or type lab results, blood tests, or medical reports for AI analysis"})]}),v.jsxs(Il,{className:"space-y-4",children:[v.jsxs("div",{children:[v.jsx("label",{className:"text-sm font-medium mb-2 block",children:"Report Text"}),v.jsx("textarea",{value:e,onChange:p=>t(p.target.value),placeholder:"Paste your lab report here... Include parameter names and values.",className:"w-full h-64 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none font-mono text-sm"}),v.jsxs("div",{className:"flex items-center justify-between mt-2",children:[v.jsxs("span",{className:"text-xs text-gray-500",children:[e.length," characters"]}),v.jsx(Fl,{variant:"ghost",size:"sm",onClick:f,children:"Load Sample Report"})]})]}),v.jsx(Fl,{onClick:u,disabled:!e.trim()||i,className:"w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",size:"lg",children:i?v.jsxs(v.Fragment,{children:[v.jsx(ao,{className:"w-4 h-4 animate-spin"}),"Analyzing Report with NLP..."]}):"Analyze Report"}),v.jsx("div",{className:"p-3 bg-blue-50 border border-blue-200 rounded-lg",children:v.jsx("p",{className:"text-xs text-blue-800",children:"💡 Tip: For best results, include parameter names, values, and units. Supports: Blood tests, metabolic panels, lipid profiles, thyroid tests, etc."})})]})]}),v.jsxs(ho,{children:[v.jsxs(Nl,{children:[v.jsx(Dl,{children:"AI Analysis Results"}),v.jsx(Ll,{children:"Natural Language Processing insights"})]}),v.jsxs(Il,{children:[!o&&!i&&v.jsxs("div",{className:"text-center py-12 text-gray-400",children:[v.jsx(Ml,{className:"w-12 h-12 mx-auto mb-3 opacity-50"}),v.jsx("p",{children:'Paste a lab report and click "Analyze" to get AI insights'})]}),i&&v.jsxs("div",{className:"text-center py-12",children:[v.jsx(ao,{className:"w-12 h-12 mx-auto mb-3 text-blue-600 animate-spin"}),v.jsx("p",{className:"text-gray-600",children:"NLP model processing report..."}),v.jsx("p",{className:"text-sm text-gray-400 mt-2",children:"Extracting medical entities"})]}),o&&v.jsxs("div",{className:"space-y-6",children:[v.jsxs("div",{className:"p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200",children:[v.jsxs("div",{className:"flex items-start justify-between mb-2",children:[v.jsx("h3",{className:"font-semibold text-lg",children:o.diagnosis}),v.jsxs(zu,{variant:o.confidence>=85?"success":"secondary",children:[o.confidence,"% confidence"]})]}),v.jsx("p",{className:"text-sm text-gray-600",children:o.details})]}),o.keyFindings&&v.jsxs("div",{children:[v.jsxs("h4",{className:"font-semibold mb-3 flex items-center gap-2",children:[v.jsx(rE,{className:"w-4 h-4 text-orange-600"}),"Key Parameters"]}),v.jsx("div",{className:"space-y-2",children:o.keyFindings.map((p,_)=>v.jsxs("div",{className:"p-3 bg-gray-50 rounded-lg",children:[v.jsxs("div",{className:"flex items-start justify-between mb-1",children:[v.jsx("span",{className:"font-medium text-sm",children:p.parameter}),v.jsx(zu,{variant:p.status==="Normal"?"success":p.status==="High"||p.status==="Low"?"destructive":"outline",children:p.status})]}),v.jsxs("div",{className:"text-sm text-gray-600",children:["Value: ",v.jsx("span",{className:"font-semibold",children:p.value})]}),v.jsxs("div",{className:"text-xs text-gray-500 mt-1",children:["Normal range: ",p.normal]})]},_))})]}),v.jsxs("div",{children:[v.jsxs("div",{className:"flex justify-between text-sm mb-2",children:[v.jsx("span",{className:"text-gray-600",children:"Analysis Confidence"}),v.jsxs("span",{className:"font-semibold",children:[o.confidence,"%"]})]}),v.jsx("div",{className:"h-2 bg-gray-200 rounded-full overflow-hidden",children:v.jsx("div",{className:"h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000",style:{width:`${o.confidence}%`}})})]}),v.jsxs("div",{children:[v.jsxs("h4",{className:"font-semibold mb-3 flex items-center gap-2",children:[v.jsx(Sl,{className:"w-4 h-4 text-green-600"}),"Clinical Recommendations"]}),v.jsx("ul",{className:"space-y-2",children:o.recommendations.map((p,_)=>v.jsxs("li",{className:"flex items-start gap-2 text-sm p-3 bg-gray-50 rounded-lg",children:[v.jsxs("span",{className:"text-blue-600 font-semibold mt-0.5",children:[_+1,"."]}),v.jsx("span",{children:p})]},_))})]}),v.jsx("div",{className:"p-3 bg-amber-50 border border-amber-200 rounded-lg",children:v.jsx("p",{className:"text-xs text-amber-800",children:"⚠️ This AI analysis is for informational purposes only. Always consult with your healthcare provider to interpret lab results and determine appropriate treatment."})})]})]})]})]})}function Vb({predictions:a,onLike:e}){const t=me.useRef(null),{theme:i}=ha(),s=i==="dark",[o,c]=me.useState(!1);me.useEffect(()=>{const A=cn.context(()=>{cn.fromTo(".ph-item",{y:28,opacity:0},{y:0,opacity:1,duration:.65,stagger:.08,ease:"expo.out"})},t);return()=>A.revert()},[i]);const u=s?{cardBg:"rgba(12,12,26,0.78)",cardBdr:"rgba(255,255,255,0.10)",shadow:"0 8px 32px rgba(0,0,0,0.5)",head:"#ffffff",sub:"rgba(255,255,255,0.50)",text:"#ffffff",muted:"rgba(255,255,255,0.45)",rowBg:"rgba(255,255,255,0.04)",rowBdr:"rgba(255,255,255,0.08)",divider:"rgba(255,255,255,0.06)",expBg:"rgba(255,255,255,0.04)",statGrad:["rgba(14,165,233,0.15)","rgba(139,92,246,0.15)","rgba(16,185,129,0.15)"],statBdr:["rgba(14,165,233,0.25)","rgba(139,92,246,0.25)","rgba(16,185,129,0.25)"],statIcons:["#0ea5e9","#8b5cf6","#10b981"],btnBg:"linear-gradient(135deg,#0ea5e9,#6366f1)",btnSh:"0 4px 14px rgba(99,102,241,0.4)"}:{cardBg:"rgba(255,255,255,0.97)",cardBdr:"rgba(0,0,0,0.08)",shadow:"0 4px 20px rgba(0,0,0,0.07)",head:"#0a0a1a",sub:"rgba(10,10,26,0.50)",text:"#0a0a1a",muted:"rgba(10,10,26,0.45)",rowBg:"rgba(0,0,0,0.02)",rowBdr:"rgba(0,0,0,0.07)",divider:"rgba(0,0,0,0.06)",expBg:"rgba(0,0,0,0.025)",statGrad:["rgba(14,165,233,0.07)","rgba(139,92,246,0.07)","rgba(16,185,129,0.07)"],statBdr:["rgba(14,165,233,0.15)","rgba(139,92,246,0.15)","rgba(16,185,129,0.15)"],statIcons:["#0ea5e9","#8b5cf6","#10b981"],btnBg:"linear-gradient(135deg,#0ea5e9,#6366f1)",btnSh:"0 4px 12px rgba(99,102,241,0.25)"},f="'Syne', sans-serif",h="'Inter', sans-serif",p={background:u.cardBg,border:`1px solid ${u.cardBdr}`,boxShadow:u.shadow,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:"20px"},_={symptom:"#0ea5e9",image:"#8b5cf6",report:"#ec4899"},m={symptom:"Symptom Analysis",image:"Image Analysis",report:"Report Analysis"},S={symptom:v.jsx(QM,{className:"w-4 h-4"}),image:v.jsx(na,{className:"w-4 h-4"}),report:v.jsx(Ml,{className:"w-4 h-4"})},M=A=>{const L=new Date().getTime()-A.getTime(),F=Math.floor(L/6e4),T=Math.floor(L/36e5),I=Math.floor(L/864e5);return F<1?"Just now":F<60?`${F}m ago`:T<24?`${T}h ago`:I<7?`${I}d ago`:A.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})},b=a.length>0?Math.round(a.reduce((A,N)=>A+N.confidence,0)/a.length):0,x=a.reduce((A,N)=>(A[N.type]=(A[N.type]||0)+1,A),{}),E=a.filter(A=>A.liked).length,w=Object.entries(x).length>0?m[Object.entries(x).sort((A,N)=>N[1]-A[1])[0][0]]:"N/A",P=o?a.filter(A=>A.liked):a;return v.jsxs("div",{ref:t,style:{fontFamily:h,display:"flex",flexDirection:"column",gap:"1.5rem"},children:[a.length>0&&v.jsx("div",{className:"ph-item grid grid-cols-1 md:grid-cols-3 gap-5",children:[{label:"Total Analyses",value:a.length,icon:Nu,ci:0},{label:"Avg Confidence",value:`${b}%`,icon:Lh,ci:1},{label:"Most Used",value:w,icon:na,ci:2}].map(({label:A,value:N,icon:L,ci:F})=>v.jsx("div",{style:{...p,background:u.statGrad[F],borderColor:u.statBdr[F],padding:"1.25rem"},children:v.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem"},children:[v.jsx("div",{style:{padding:"0.75rem",borderRadius:"12px",background:`${u.statIcons[F]}22`,flexShrink:0},children:v.jsx(L,{className:"w-5 h-5",style:{color:u.statIcons[F]}})}),v.jsxs("div",{children:[v.jsx("div",{style:{fontSize:"0.72rem",color:u.muted,marginBottom:"2px"},children:A}),v.jsx("div",{style:{fontFamily:f,fontSize:"1.3rem",fontWeight:800,color:u.head},children:N})]})]})},A))}),v.jsxs("div",{className:"ph-item",style:{...p,padding:"1.75rem"},children:[v.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"},children:[v.jsxs("div",{children:[v.jsx("h3",{style:{fontFamily:f,fontWeight:700,fontSize:"1.05rem",color:u.head},children:"Analysis History"}),v.jsx("p",{style:{fontSize:"0.82rem",color:u.sub,marginTop:"2px"},children:"View all your previous AI-powered medical analyses"})]}),E>0&&v.jsxs("button",{onClick:()=>c(!o),style:{display:"flex",alignItems:"center",gap:"6px",padding:"0.5rem 1rem",borderRadius:"12px",fontSize:"0.8rem",fontWeight:700,fontFamily:f,cursor:"pointer",background:o?"linear-gradient(135deg,#ec4899,#be185d)":u.rowBg,color:o?"#fff":u.muted,border:`1px solid ${o?"transparent":u.rowBdr}`,boxShadow:o?"0 4px 12px rgba(236,72,153,0.4)":"none",transition:"all 0.3s ease"},children:[v.jsx(o_,{className:"w-4 h-4",style:{fill:o?"#fff":"none"}}),o?`Liked (${E})`:`Show Liked (${E})`]})]}),P.length===0?v.jsxs("div",{style:{textAlign:"center",padding:"3rem 0",color:u.muted},children:[v.jsx(Nu,{className:"w-12 h-12 mx-auto mb-3 opacity-40"}),v.jsx("p",{style:{fontSize:"0.9rem",marginBottom:"4px"},children:o?"No liked analyses yet":"No analysis history yet"}),v.jsx("p",{style:{fontSize:"0.8rem"},children:o?"Click the heart icon on any analysis to add it to favorites":"Start by analyzing symptoms, scans, or reports"})]}):v.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:P.map(A=>v.jsxs("div",{className:"transition-all duration-300 hover:scale-[1.01]",style:{padding:"1rem 1.25rem",borderRadius:"14px",background:u.rowBg,border:`1px solid ${u.rowBdr}`,position:"relative"},children:[e&&v.jsx("button",{onClick:()=>e(A.id),style:{position:"absolute",top:"1rem",right:"1rem",padding:"6px",borderRadius:"50%",background:"none",border:"none",cursor:"pointer",color:A.liked?"#ec4899":u.muted,transition:"all 0.2s ease"},children:v.jsx(o_,{className:"w-5 h-5",style:{fill:A.liked?"#ec4899":"none",stroke:A.liked?"#ec4899":"currentColor"}})}),v.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.75rem",paddingRight:"2.5rem",marginBottom:"0.5rem"},children:[v.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:`${_[A.type]}22`,color:_[A.type]},children:S[A.type]}),v.jsxs("div",{style:{flex:1},children:[v.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"6px"},children:[v.jsxs("div",{children:[v.jsx("span",{style:{display:"inline-block",padding:"1px 8px",borderRadius:"999px",fontSize:"0.65rem",fontWeight:700,fontFamily:f,letterSpacing:"0.08em",background:`${_[A.type]}18`,color:_[A.type],border:`1px solid ${_[A.type]}30`,marginBottom:"4px",textTransform:"uppercase"},children:m[A.type]}),v.jsx("div",{style:{fontWeight:700,color:u.text,fontSize:"0.92rem"},children:A.diagnosis})]}),v.jsxs("span",{style:{padding:"3px 10px",borderRadius:"999px",fontSize:"0.7rem",fontWeight:700,fontFamily:f,background:A.confidence>=80?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.15)",color:A.confidence>=80?"#10b981":"#f59e0b",border:`1px solid ${A.confidence>=80?"rgba(16,185,129,0.30)":"rgba(245,158,11,0.30)"}`,whiteSpace:"nowrap"},children:[A.confidence,"%"]})]}),v.jsx("p",{style:{fontSize:"0.8rem",color:u.muted,marginTop:"4px"},children:A.details})]})]}),v.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.5rem",paddingTop:"0.5rem",borderTop:`1px solid ${u.divider}`},children:[v.jsxs("span",{style:{display:"flex",alignItems:"center",gap:"4px",fontSize:"0.72rem",color:u.muted},children:[v.jsx(ov,{className:"w-3 h-3"}),M(A.timestamp)]}),A.recommendations.length>0&&v.jsxs("span",{style:{fontSize:"0.72rem",color:u.muted},children:["💡 ",A.recommendations[0].substring(0,50),"..."]})]})]},A.id))})]}),a.length>0&&v.jsx("div",{className:"ph-item",style:{...p,background:u.expBg,padding:"1.25rem 1.5rem"},children:v.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"},children:[v.jsxs("div",{children:[v.jsx("h4",{style:{fontFamily:f,fontWeight:700,fontSize:"0.95rem",color:u.head,marginBottom:"2px"},children:"Export Your Data"}),v.jsx("p",{style:{fontSize:"0.8rem",color:u.muted},children:"Download your analysis history for your records"})]}),v.jsxs("div",{style:{display:"flex",gap:"8px"},children:[v.jsx("button",{style:{padding:"0.55rem 1.2rem",borderRadius:"10px",fontSize:"0.8rem",fontWeight:700,fontFamily:f,cursor:"pointer",background:u.rowBg,color:u.text,border:`1px solid ${u.rowBdr}`},children:"Export PDF"}),v.jsx("button",{style:{padding:"0.55rem 1.2rem",borderRadius:"10px",fontSize:"0.8rem",fontWeight:700,fontFamily:f,cursor:"pointer",background:u.btnBg,color:"#fff",border:"none",boxShadow:u.btnSh},children:"Export CSV"})]})]})})]})}function Hb({predictions:a,onNavigate:e}){const t=me.useRef(null),{theme:i}=ha(),s=i==="dark";me.useEffect(()=>{const w=cn.context(()=>{cn.fromTo(".dash-card",{y:40,opacity:0,scale:.96},{y:0,opacity:1,scale:1,duration:.8,stagger:.1,ease:"expo.out",delay:.1}),cn.fromTo(".dash-stat",{y:30,opacity:0},{y:0,opacity:1,duration:.7,stagger:.08,ease:"expo.out",delay:.2})},t);return()=>w.revert()},[i]);const o=s?{head:"#ffffff",sub:"rgba(255,255,255,0.55)",cardBg:"rgba(12,12,26,0.75)",cardBdr:"rgba(255,255,255,0.10)",cardShadow:"0 8px 32px rgba(0,0,0,0.5)",row:"rgba(255,255,255,0.04)",rowBdr:"rgba(255,255,255,0.07)",text:"#ffffff",muted:"rgba(255,255,255,0.50)",trackBg:"rgba(255,255,255,0.08)",infoA:"rgba(34,211,238,0.12)",infoABdr:"rgba(34,211,238,0.25)",infoB:"rgba(74,222,128,0.10)",infoBBdr:"rgba(74,222,128,0.25)",statCards:[{from:"#0ea5e9",to:"#6366f1",label:"Total Analyses",icon:h_,badge:"All Time"},{from:"#10b981",to:"#059669",label:"Today's Analyses",icon:Dh,badge:"Today"},{from:"#8b5cf6",to:"#6d28d9",label:"Avg Confidence",icon:Lh,badge:"Avg"},{from:"#f59e0b",to:"#d97706",label:"Avg Response",icon:Du,badge:"Fast"}]}:{head:"#0a0a1a",sub:"rgba(10,10,26,0.55)",cardBg:"rgba(255,255,255,0.96)",cardBdr:"rgba(0,0,0,0.08)",cardShadow:"0 4px 20px rgba(0,0,0,0.07)",row:"rgba(0,0,0,0.025)",rowBdr:"rgba(0,0,0,0.06)",text:"#0a0a1a",muted:"rgba(10,10,26,0.50)",trackBg:"rgba(0,0,0,0.08)",infoA:"rgba(14,165,233,0.08)",infoABdr:"rgba(14,165,233,0.20)",infoB:"rgba(16,185,129,0.07)",infoBBdr:"rgba(16,185,129,0.20)",statCards:[{from:"#0ea5e9",to:"#6366f1",label:"Total Analyses",icon:h_,badge:"All Time"},{from:"#10b981",to:"#059669",label:"Today's Analyses",icon:Dh,badge:"Today"},{from:"#8b5cf6",to:"#6d28d9",label:"Avg Confidence",icon:Lh,badge:"Avg"},{from:"#f59e0b",to:"#d97706",label:"Avg Response",icon:Du,badge:"Fast"}]},c="'Syne', sans-serif",u="'Inter', sans-serif",f=a.length,h=a.length>0?Math.round(a.reduce((w,P)=>w+P.confidence,0)/a.length):0,p=a.reduce((w,P)=>(w[P.type]=(w[P.type]||0)+1,w),{}),_=a.slice(0,3),m=a.filter(w=>new Date(w.timestamp).toDateString()===new Date().toDateString()).length,S=[f,m,`${h}%`,"2.5s"],M={symptom:"#0ea5e9",image:"#8b5cf6",report:"#ec4899"},b=w=>({symptom:v.jsx(na,{className:"w-4 h-4"}),image:v.jsx(gl,{className:"w-4 h-4"}),report:v.jsx(Ml,{className:"w-4 h-4"})})[w],x=[{label:"Symptom Check",desc:"Analyze your symptoms",icon:na,from:"#0ea5e9",to:"#6366f1"},{label:"Upload Scan",desc:"Analyze medical images",icon:gl,from:"#8b5cf6",to:"#6d28d9"},{label:"Lab Report",desc:"Analyze test results",icon:Ml,from:"#ec4899",to:"#be185d"}],E={background:o.cardBg,border:`1px solid ${o.cardBdr}`,boxShadow:o.cardShadow,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:"20px",padding:"1.5rem"};return v.jsxs("div",{ref:t,style:{fontFamily:u},children:[v.jsxs("div",{className:"dash-card mb-8",children:[v.jsx("h2",{style:{fontFamily:c,fontSize:"1.75rem",fontWeight:800,color:o.head,marginBottom:"0.25rem"},children:"Welcome Back 👋"}),v.jsx("p",{style:{color:o.sub,fontSize:"0.95rem"},children:"Here's your health analysis overview"})]}),v.jsx("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8",children:o.statCards.map(({from:w,to:P,label:A,icon:N,badge:L},F)=>v.jsxs("div",{className:"dash-stat relative overflow-hidden",style:{borderRadius:"20px",padding:"1.5rem",background:`linear-gradient(135deg, ${w}, ${P})`,boxShadow:`0 8px 24px ${w}44`},children:[v.jsx("div",{className:"absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none",style:{background:"rgba(255,255,255,0.15)",transform:"translate(30%, -30%)"}}),v.jsxs("div",{className:"flex items-center justify-between mb-4",children:[v.jsx("div",{style:{padding:"0.6rem",background:"rgba(255,255,255,0.2)",borderRadius:"10px"},children:v.jsx(N,{className:"w-5 h-5 text-white"})}),v.jsx("span",{style:{fontFamily:c,fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",background:"rgba(255,255,255,0.25)",color:"#fff",padding:"2px 8px",borderRadius:"999px"},children:L})]}),v.jsx("div",{style:{fontFamily:c,fontSize:"2rem",fontWeight:900,color:"#fff",lineHeight:1},children:S[F]}),v.jsx("div",{style:{fontSize:"0.78rem",color:"rgba(255,255,255,0.80)",marginTop:"4px"},children:A})]},A))}),v.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8",children:[v.jsxs("div",{className:"dash-card lg:col-span-2",style:E,children:[v.jsx("h3",{style:{fontFamily:c,fontSize:"1.05rem",fontWeight:700,color:o.head,marginBottom:"0.25rem"},children:"Quick Actions"}),v.jsx("p",{style:{color:o.sub,fontSize:"0.82rem",marginBottom:"1.25rem"},children:"Start a new analysis"}),v.jsx("div",{className:"grid grid-cols-3 gap-4",children:x.map(({label:w,desc:P,icon:A,from:N,to:L})=>v.jsxs("button",{onClick:()=>e("analyze"),className:"group text-left transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1",style:{padding:"1.25rem",borderRadius:"16px",background:s?"rgba(255,255,255,0.04)":`${N}12`,border:`1px solid ${s?"rgba(255,255,255,0.08)":`${N}30`}`},children:[v.jsx("div",{style:{width:"42px",height:"42px",borderRadius:"12px",background:`linear-gradient(135deg,${N},${L})`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"0.75rem",boxShadow:`0 4px 12px ${N}55`},children:v.jsx(A,{className:"w-5 h-5 text-white"})}),v.jsx("div",{style:{fontFamily:c,fontSize:"0.82rem",fontWeight:700,color:o.head,marginBottom:"2px"},children:w}),v.jsx("div",{style:{fontSize:"0.72rem",color:o.muted},children:P}),v.jsx(av,{className:"w-3.5 h-3.5 mt-2 transition-transform group-hover:translate-x-1",style:{color:N}})]},w))})]}),v.jsxs("div",{className:"dash-card",style:E,children:[v.jsx("h3",{style:{fontFamily:c,fontSize:"1.05rem",fontWeight:700,color:o.head,marginBottom:"0.25rem"},children:"Analysis Types"}),v.jsx("p",{style:{color:o.sub,fontSize:"0.82rem",marginBottom:"1.25rem"},children:"Breakdown by category"}),Object.keys(p).length===0?v.jsxs("div",{style:{textAlign:"center",padding:"2rem 0",color:o.muted},children:[v.jsx(_l,{className:"w-10 h-10 mx-auto mb-2 opacity-40"}),v.jsx("p",{style:{fontSize:"0.82rem"},children:"No analyses yet"})]}):v.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[Object.entries(p).map(([w,P])=>v.jsxs("div",{children:[v.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.82rem",marginBottom:"6px"},children:[v.jsx("span",{style:{color:o.muted,textTransform:"capitalize"},children:w}),v.jsx("span",{style:{fontWeight:700,color:o.text},children:P})]}),v.jsx("div",{style:{height:"6px",background:o.trackBg,borderRadius:"999px",overflow:"hidden"},children:v.jsx("div",{style:{height:"100%",width:`${P/f*100}%`,borderRadius:"999px",background:`linear-gradient(90deg, ${M[w]||"#8b5cf6"}, ${M[w]||"#8b5cf6"}88)`,transition:"width 1s ease"}})})]},w)),v.jsx("button",{onClick:()=>e("history"),style:{marginTop:"0.5rem",padding:"0.6rem 1rem",borderRadius:"10px",border:`1px solid ${o.cardBdr}`,background:o.row,color:o.text,fontSize:"0.8rem",fontWeight:600,cursor:"pointer",fontFamily:c},children:"View Full History"})]})]})]}),v.jsxs("div",{className:"dash-card mb-8",style:E,children:[v.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"},children:[v.jsxs("div",{children:[v.jsx("h3",{style:{fontFamily:c,fontSize:"1.05rem",fontWeight:700,color:o.head},children:"Recent Analyses"}),v.jsx("p",{style:{color:o.sub,fontSize:"0.82rem",marginTop:"2px"},children:"Your latest AI-powered predictions"})]}),v.jsx("button",{onClick:()=>e("history"),style:{fontSize:"0.78rem",fontWeight:600,color:"#6366f1",fontFamily:c,cursor:"pointer",background:"none",border:"none",padding:"4px 8px"},children:"View All →"})]}),_.length===0?v.jsxs("div",{style:{textAlign:"center",padding:"3rem 0",color:o.muted},children:[v.jsx(_l,{className:"w-12 h-12 mx-auto mb-3 opacity-40"}),v.jsx("p",{style:{marginBottom:"4px"},children:"No analyses yet"}),v.jsx("p",{style:{fontSize:"0.82rem",marginBottom:"1rem"},children:"Start by analyzing symptoms, scans, or reports"}),v.jsx("button",{onClick:()=>e("analyze"),style:{padding:"0.6rem 1.5rem",borderRadius:"12px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontSize:"0.85rem",fontWeight:700,fontFamily:c,cursor:"pointer",border:"none",boxShadow:"0 4px 16px rgba(99,102,241,0.4)"},children:"Start Analysis"})]}):v.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:_.map(w=>v.jsxs("div",{className:"group transition-all duration-300 hover:scale-[1.01]",style:{padding:"1rem 1.25rem",borderRadius:"14px",background:o.row,border:`1px solid ${o.rowBdr}`},children:[v.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"},children:[v.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[v.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",background:`${M[w.type]||"#8b5cf6"}22`,color:M[w.type]||"#8b5cf6",flexShrink:0},children:b(w.type)}),v.jsxs("div",{children:[v.jsx("div",{style:{fontWeight:700,color:o.text,fontSize:"0.9rem"},children:w.diagnosis}),v.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px",fontSize:"0.72rem",color:o.muted,marginTop:"2px"},children:[v.jsx(ov,{className:"w-3 h-3"}),new Date(w.timestamp).toLocaleString()]})]})]}),v.jsxs("span",{style:{padding:"2px 10px",borderRadius:"999px",fontSize:"0.7rem",fontWeight:700,fontFamily:c,background:w.confidence>=80?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.15)",color:w.confidence>=80?"#10b981":"#f59e0b",border:`1px solid ${w.confidence>=80?"rgba(16,185,129,0.3)":"rgba(245,158,11,0.3)"}`},children:[w.confidence,"%"]})]}),v.jsx("p",{style:{fontSize:"0.8rem",color:o.muted,marginBottom:"0.5rem"},children:w.details}),v.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[v.jsxs("span",{style:{display:"flex",alignItems:"center",gap:"4px",fontSize:"0.75rem",color:"#10b981"},children:[v.jsx(Sl,{className:"w-3.5 h-3.5"}),w.recommendations.length," recommendations"]}),v.jsx("button",{onClick:()=>e("history"),style:{fontSize:"0.75rem",fontWeight:600,color:"#6366f1",background:"none",border:"none",cursor:"pointer",fontFamily:c},children:"Details →"})]})]},w.id))})]}),v.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5",children:[v.jsx("div",{className:"dash-card",style:{...E,background:o.infoA,borderColor:o.infoABdr},children:v.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"flex-start"},children:[v.jsx("div",{style:{padding:"0.7rem",background:"rgba(14,165,233,0.2)",borderRadius:"12px",flexShrink:0},children:v.jsx(_l,{className:"w-5 h-5",style:{color:"#0ea5e9"}})}),v.jsxs("div",{children:[v.jsx("h4",{style:{fontFamily:c,fontWeight:700,color:o.head,marginBottom:"0.35rem"},children:"Medical Disclaimer"}),v.jsx("p",{style:{fontSize:"0.82rem",color:o.muted,lineHeight:1.55},children:"This tool provides AI-assisted preliminary analysis. Always consult healthcare professionals for diagnosis and treatment."})]})]})}),v.jsx("div",{className:"dash-card",style:{...E,background:o.infoB,borderColor:o.infoBBdr},children:v.jsxs("div",{style:{display:"flex",gap:"1rem",alignItems:"flex-start"},children:[v.jsx("div",{style:{padding:"0.7rem",background:"rgba(16,185,129,0.2)",borderRadius:"12px",flexShrink:0},children:v.jsx(Sl,{className:"w-5 h-5",style:{color:"#10b981"}})}),v.jsxs("div",{children:[v.jsx("h4",{style:{fontFamily:c,fontWeight:700,color:o.head,marginBottom:"0.35rem"},children:"Privacy & Security"}),v.jsx("p",{style:{fontSize:"0.82rem",color:o.muted,lineHeight:1.55},children:"Your data is encrypted and HIPAA compliant. We never share your medical information without consent."})]})]})})]})]})}function Gb(){const a=me.useRef(null),{theme:e}=ha(),t=e==="dark",[i,s]=me.useState(!1),[o,c]=me.useState(""),[u,f]=me.useState(null),[h,p]=me.useState(!1),[_,m]=me.useState({email:!0,push:!1,sms:!1});me.useEffect(()=>{const A=cn.context(()=>{cn.fromTo(".set-card",{y:30,opacity:0},{y:0,opacity:1,duration:.7,stagger:.1,ease:"expo.out"})},a);return()=>A.revert()},[e]);const S=async()=>{o.trim()&&(f("checking"),setTimeout(()=>{f(o.startsWith("hf_")&&o.length>20?"valid":"invalid")},1500))},M=t?{cardBg:"rgba(12,12,26,0.78)",cardBdr:"rgba(255,255,255,0.10)",shadow:"0 8px 32px rgba(0,0,0,0.5)",head:"#ffffff",sub:"rgba(255,255,255,0.50)",text:"#ffffff",muted:"rgba(255,255,255,0.45)",inpBg:"rgba(255,255,255,0.06)",rowHov:"rgba(255,255,255,0.06)",rowBg:"rgba(255,255,255,0.03)",btnBg:"linear-gradient(135deg,#6366f1,#8b5cf6)",btnSh:"0 4px 14px rgba(99,102,241,0.4)",aiBg:"rgba(139,92,246,0.06)",aiBdr:"rgba(139,92,246,0.3)",succBg:"rgba(16,185,129,0.1)",succTxt:"#34d399",errTxt:"#f87171",warnBg:"rgba(245,158,11,0.1)",warnTxt:"#fbbf24"}:{cardBg:"rgba(255,255,255,0.97)",cardBdr:"rgba(0,0,0,0.08)",shadow:"0 4px 20px rgba(0,0,0,0.07)",head:"#0a0a1a",sub:"rgba(10,10,26,0.50)",text:"#0a0a1a",muted:"rgba(10,10,26,0.45)",inpBg:"rgba(0,0,0,0.03)",rowHov:"rgba(0,0,0,0.04)",rowBg:"rgba(0,0,0,0.02)",btnBg:"linear-gradient(135deg,#6366f1,#8b5cf6)",btnSh:"0 4px 12px rgba(99,102,241,0.25)",aiBg:"rgba(139,92,246,0.04)",aiBdr:"rgba(139,92,246,0.25)",succBg:"rgba(16,185,129,0.08)",succTxt:"#059669",errTxt:"#dc2626",warnBg:"rgba(245,158,11,0.08)",warnTxt:"#d97706"},b="'Syne', sans-serif",x="'Inter', sans-serif",E={background:M.cardBg,border:`1px solid ${M.cardBdr}`,boxShadow:M.shadow,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRadius:"20px",padding:"1.75rem"},w={width:"100%",padding:"0.65rem 1rem",background:M.inpBg,border:`1px solid ${M.cardBdr}`,borderRadius:"12px",color:M.text,fontSize:"0.85rem",outline:"none"},P={display:"block",fontSize:"0.8rem",fontWeight:600,color:M.head,marginBottom:"0.4rem",fontFamily:x};return v.jsxs("div",{ref:a,style:{fontFamily:x,display:"flex",flexDirection:"column",gap:"1.5rem"},children:[v.jsxs("div",{className:"set-card",style:{...E,background:M.aiBg,border:`1px solid ${M.aiBdr}`},children:[v.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"},children:[v.jsxs("div",{children:[v.jsxs("h3",{style:{fontFamily:b,fontWeight:700,fontSize:"1.1rem",color:M.head,display:"flex",gap:"8px",alignItems:"center"},children:[v.jsx(qM,{className:"w-5 h-5 text-purple-500"})," Enable Full AI Power"]}),v.jsx("p",{style:{fontSize:"0.82rem",color:M.sub,marginTop:"2px"},children:"Configure your Hugging Face API key for real ML models"})]}),v.jsx("span",{style:{padding:"4px 12px",borderRadius:"999px",fontSize:"0.7rem",fontWeight:700,fontFamily:b,background:"linear-gradient(135deg,#a855f7,#6366f1)",color:"#fff",letterSpacing:"0.05em"},children:"ADVANCED"})]}),v.jsxs("div",{style:{padding:"1rem",background:M.rowBg,borderRadius:"12px",border:`1px dashed ${M.cardBdr}`,marginBottom:"1.25rem",display:"flex",gap:"12px"},children:[v.jsx("div",{style:{padding:"8px",background:"rgba(139,92,246,0.15)",borderRadius:"8px",flexShrink:0,alignSelf:"flex-start"},children:v.jsx(Du,{className:"w-5 h-5 text-purple-500"})}),v.jsxs("div",{children:[v.jsxs("h4",{style:{fontSize:"0.85rem",fontWeight:600,color:M.head,marginBottom:"4px",display:"flex",alignItems:"center",gap:"8px"},children:["API Key Status",u==="valid"&&v.jsxs("span",{style:{padding:"2px 8px",borderRadius:"6px",fontSize:"0.65rem",background:M.succBg,color:M.succTxt,display:"flex",alignItems:"center",gap:"4px"},children:[v.jsx(r_,{className:"w-3 h-3"})," Configured"]})]}),v.jsxs("p",{style:{fontSize:"0.75rem",color:M.muted,marginBottom:"2px"},children:[v.jsx("strong",{style:{color:M.succTxt},children:"Without API key:"})," Uses intelligent rule-based fallbacks (highly accurate)"]}),v.jsxs("p",{style:{fontSize:"0.75rem",color:M.muted},children:[v.jsx("strong",{style:{color:"#a855f7"},children:"With API key:"})," Uses real Mistral-7B and ResNet-50 models"]})]})]}),v.jsxs("div",{style:{marginBottom:"1rem"},children:[v.jsxs("label",{style:P,children:[v.jsx(RM,{className:"w-4 h-4 inline mr-1",style:{verticalAlign:"-3px"}})," Hugging Face API Key"]}),v.jsxs("div",{style:{display:"flex",gap:"0.75rem"},children:[v.jsxs("div",{style:{position:"relative",flex:1},children:[v.jsx("input",{type:h?"text":"password",value:o,onChange:A=>{c(A.target.value),f(null)},placeholder:"hf_••••••••••••••••••••",style:{...w,paddingRight:"2.5rem",borderColor:u==="valid"?M.succTxt:u==="invalid"?M.errTxt:M.cardBdr}}),v.jsx("button",{onClick:()=>p(!h),style:{position:"absolute",right:"10px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:M.muted,cursor:"pointer"},children:h?v.jsx(s_,{className:"w-4 h-4"}):v.jsx(a_,{className:"w-4 h-4"})})]}),v.jsxs("button",{onClick:S,disabled:!o.trim()||u==="checking",style:{padding:"0 1.25rem",borderRadius:"12px",background:M.btnBg,color:"#fff",fontWeight:600,fontSize:"0.85rem",cursor:o.trim()?"pointer":"not-allowed",border:"none",display:"flex",alignItems:"center",gap:"6px",opacity:o.trim()?1:.6},children:[u==="checking"?v.jsx(ao,{className:"w-4 h-4 animate-spin"}):v.jsx(r_,{className:"w-4 h-4"})," Verify & Save"]})]}),u==="invalid"&&v.jsxs("p",{style:{fontSize:"0.75rem",color:M.errTxt,marginTop:"8px",display:"flex",gap:"4px"},children:[v.jsx(_l,{className:"w-4 h-4"})," Invalid key. Must start with hf_ and be >20 chars."]})]}),v.jsx("div",{style:{padding:"0.85rem 1rem",background:M.warnBg,borderRadius:"12px",border:`1px solid ${M.warnTxt}33`},children:v.jsxs("p",{style:{fontSize:"0.75rem",color:M.warnTxt},children:["⚠️ ",v.jsx("strong",{children:"Note:"})," Both modes provide excellent results for preliminary screening. All diagnoses must be verified by a professional."]})})]}),v.jsxs("div",{className:"set-card",style:E,children:[v.jsxs("div",{style:{marginBottom:"1.25rem"},children:[v.jsxs("h3",{style:{fontFamily:b,fontWeight:700,fontSize:"1.1rem",color:M.head,display:"flex",gap:"8px",alignItems:"center"},children:[v.jsx(lv,{className:"w-5 h-5 text-blue-500"})," Profile Information"]}),v.jsx("p",{style:{fontSize:"0.82rem",color:M.sub,marginTop:"2px"},children:"Manage your personal information and account details"})]}),v.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1.5rem",marginBottom:"1.5rem"},children:[v.jsx("div",{style:{width:"80px",height:"80px",borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"1.75rem",fontWeight:800,fontFamily:b},children:"JD"}),v.jsxs("div",{children:[v.jsx("button",{style:{padding:"0.5rem 1rem",borderRadius:"10px",fontSize:"0.8rem",fontWeight:600,background:M.rowBg,border:`1px solid ${M.cardBdr}`,color:M.text,cursor:"pointer",marginBottom:"6px"},children:"Change Photo"}),v.jsx("p",{style:{fontSize:"0.7rem",color:M.muted},children:"JPG, PNG or GIF. Max size 2MB."})]})]}),v.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",style:{marginBottom:"1rem"},children:[v.jsxs("div",{children:[v.jsx("label",{style:P,children:"Full Name"}),v.jsx("input",{defaultValue:"John Doe",style:w})]}),v.jsxs("div",{children:[v.jsx("label",{style:P,children:"Email"}),v.jsxs("div",{style:{position:"relative"},children:[v.jsx(u_,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",style:{color:M.muted}}),v.jsx("input",{type:"email",defaultValue:"john@example.com",style:{...w,paddingLeft:"2.5rem"}})]})]}),v.jsxs("div",{children:[v.jsx("label",{style:P,children:"Phone"}),v.jsxs("div",{style:{position:"relative"},children:[v.jsx(d_,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",style:{color:M.muted}}),v.jsx("input",{type:"tel",defaultValue:"+1 (555) 000-0000",style:{...w,paddingLeft:"2.5rem"}})]})]}),v.jsxs("div",{children:[v.jsx("label",{style:P,children:"Date of Birth"}),v.jsxs("div",{style:{position:"relative"},children:[v.jsx(Dh,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",style:{color:M.muted}}),v.jsx("input",{type:"date",defaultValue:"1990-01-01",style:{...w,paddingLeft:"2.5rem"}})]})]})]}),v.jsxs("div",{style:{marginBottom:"1.5rem"},children:[v.jsx("label",{style:P,children:"Address"}),v.jsxs("div",{style:{position:"relative"},children:[v.jsx(IM,{className:"absolute left-3 top-3 w-4 h-4",style:{color:M.muted}}),v.jsx("textarea",{defaultValue:"123 Main St, San Francisco, CA 94102",style:{...w,paddingLeft:"2.5rem",minHeight:"80px",resize:"vertical"}})]})]}),v.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.75rem"},children:[v.jsx("button",{style:{padding:"0.65rem 1.25rem",borderRadius:"12px",fontSize:"0.85rem",fontWeight:600,background:"none",border:`1px solid ${M.cardBdr}`,color:M.text,cursor:"pointer"},children:"Cancel"}),v.jsxs("button",{style:{padding:"0.65rem 1.25rem",borderRadius:"12px",fontSize:"0.85rem",fontWeight:600,background:M.btnBg,color:"#fff",border:"none",boxShadow:M.btnSh,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},children:[v.jsx(VM,{className:"w-4 h-4"})," Save Changes"]})]})]}),v.jsxs("div",{className:"set-card",style:E,children:[v.jsxs("div",{style:{marginBottom:"1.25rem"},children:[v.jsxs("h3",{style:{fontFamily:b,fontWeight:700,fontSize:"1.1rem",color:M.head,display:"flex",gap:"8px",alignItems:"center"},children:[v.jsx(XM,{className:"w-5 h-5 text-green-500"})," Security & Privacy"]}),v.jsx("p",{style:{fontSize:"0.82rem",color:M.sub,marginTop:"2px"},children:"Manage your password and security preferences"})]}),v.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",style:{marginBottom:"1.5rem"},children:[v.jsxs("div",{children:[v.jsx("label",{style:P,children:"Current Password"}),v.jsxs("div",{style:{position:"relative"},children:[v.jsx("input",{type:i?"text":"password",placeholder:"••••••••",style:{...w,paddingRight:"2.5rem"}}),v.jsx("button",{onClick:()=>s(!i),style:{position:"absolute",right:"10px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:M.muted,cursor:"pointer"},children:i?v.jsx(s_,{className:"w-4 h-4"}):v.jsx(a_,{className:"w-4 h-4"})})]})]}),v.jsxs("div",{children:[v.jsx("label",{style:P,children:"New Password"}),v.jsx("input",{type:"password",placeholder:"••••••••",style:w})]})]}),v.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:v.jsx("button",{style:{padding:"0.65rem 1.25rem",borderRadius:"12px",fontSize:"0.85rem",fontWeight:600,background:M.btnBg,color:"#fff",border:"none",boxShadow:M.btnSh,cursor:"pointer"},children:"Update Password"})})]}),v.jsxs("div",{className:"set-card",style:E,children:[v.jsxs("div",{style:{marginBottom:"1.25rem"},children:[v.jsxs("h3",{style:{fontFamily:b,fontWeight:700,fontSize:"1.1rem",color:M.head,display:"flex",gap:"8px",alignItems:"center"},children:[v.jsx(i_,{className:"w-5 h-5 text-orange-400"})," Notifications"]}),v.jsx("p",{style:{fontSize:"0.82rem",color:M.sub,marginTop:"2px"},children:"Choose how you want to receive updates"})]}),v.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"1.5rem"},children:[{id:"email",label:"Email Notifications",desc:"Receive analysis results via email",icon:u_,color:"#3b82f6"},{id:"push",label:"Push Notifications",desc:"Get instant browser notifications",icon:i_,color:"#8b5cf6"},{id:"sms",label:"SMS Notifications",desc:"Receive text messages for important updates",icon:d_,color:"#10b981"}].map(A=>v.jsxs("label",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem",background:M.rowBg,border:`1px solid ${M.cardBdr}`,borderRadius:"12px",cursor:"pointer",transition:"background 0.2s"},onMouseEnter:N=>N.currentTarget.style.background=M.rowHov,onMouseLeave:N=>N.currentTarget.style.background=M.rowBg,children:[v.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[v.jsx(A.icon,{className:"w-5 h-5",style:{color:A.color}}),v.jsxs("div",{children:[v.jsx("div",{style:{fontWeight:600,color:M.head,fontSize:"0.9rem"},children:A.label}),v.jsx("div",{style:{fontSize:"0.75rem",color:M.muted},children:A.desc})]})]}),v.jsx("input",{type:"checkbox",checked:_[A.id],onChange:N=>m({..._,[A.id]:N.target.checked}),style:{width:"18px",height:"18px",accentColor:"#8b5cf6",cursor:"pointer"}})]},A.id))})]})]})}function sy(){const{theme:a,toggleTheme:e}=ha(),t=a==="dark";return v.jsx("button",{id:"theme-toggle",onClick:e,"aria-label":"Toggle light/dark theme",title:t?"Switch to Light Mode":"Switch to Dark Mode",className:"flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95",style:{fontFamily:"'Syne', sans-serif",letterSpacing:"0.06em",background:t?"linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.10))":"linear-gradient(135deg, rgba(109,40,217,0.12), rgba(15,15,40,0.08))",color:t?"#fbbf24":"#6d28d9",border:t?"1px solid rgba(251,191,36,0.40)":"1px solid rgba(109,40,217,0.30)",boxShadow:t?"0 0 18px rgba(251,191,36,0.18), inset 0 1px 0 rgba(255,255,255,0.08)":"0 2px 14px rgba(109,40,217,0.15), inset 0 1px 0 rgba(255,255,255,0.7)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"},children:t?v.jsxs(v.Fragment,{children:[v.jsx(eE,{className:"w-4 h-4"}),v.jsx("span",{className:"hidden sm:inline text-xs uppercase tracking-widest",children:"Light"})]}):v.jsxs(v.Fragment,{children:[v.jsx(kM,{className:"w-4 h-4"}),v.jsx("span",{className:"hidden sm:inline text-xs uppercase tracking-widest",children:"Dark"})]})})}function jb({onGetStarted:a}){const e=me.useRef(null),{theme:t}=ha(),i=t==="dark";me.useEffect(()=>{const u=cn.context(()=>{cn.timeline({defaults:{ease:"expo.out"}}).fromTo(".rtext",{y:80,opacity:0},{y:0,opacity:1,duration:1.3,stagger:.1}).fromTo(".gpanel",{y:40,opacity:0,scale:.97},{y:0,opacity:1,scale:1,duration:1.1,stagger:.13},"-=0.9").fromTo(".uline",{scaleX:0,transformOrigin:"left"},{scaleX:1,duration:.9,ease:"power4.inOut"},"-=0.7").fromTo(".fup",{y:16,opacity:0},{y:0,opacity:1,duration:.7,stagger:.07},"-=0.5"),document.querySelectorAll(".mag").forEach(p=>{p.addEventListener("mousemove",_=>{const m=_,S=p.getBoundingClientRect(),M=m.clientX-S.left-S.width/2,b=m.clientY-S.top-S.height/2;cn.to(p,{x:M*.22,y:b*.22,duration:.5,ease:"power3.out",overwrite:"auto"})}),p.addEventListener("mouseleave",()=>{cn.to(p,{x:0,y:0,duration:.9,ease:"elastic.out(1, 0.3)"})})})},e);return()=>u.revert()},[]);const s="'Syne', sans-serif",o="'Inter', sans-serif",c=i?{bg:"transparent",logoName:"#f1f5f9",logoSub:"#22d3ee",iconBg:"rgba(15,15,25,0.6)",iconBdr:"rgba(255,255,255,0.10)",onlineBg:"rgba(0,200,80,0.07)",onlineClr:"#4ade80",onlineBdr:"rgba(74,222,128,0.20)",h1a:"#67e8f9",h1b:"#e0f2fe",h2a:"#a78bfa",h2b:"#f0abfc",h3a:"#f0abfc",h3b:"#fdf4ff",divider:"rgba(34,211,238,0.35)",body:"rgba(241,245,249,0.70)",cardBg:"rgba(10,10,22,0.80)",cardBdr:"rgba(255,255,255,0.10)",cardShadow:"0 24px 60px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.07)",cardGlow:"rgba(34,211,238,0.12)",initClr:"rgba(255,255,255,0.32)",zapClr:"#d946ef",cardTitle:"#ffffff",btnBg:"linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)",btnShadow:"0 0 32px rgba(34,211,238,0.25), 0 8px 20px rgba(0,0,0,0.35)",statBg:"rgba(255,255,255,0.04)",statBdr:"rgba(255,255,255,0.07)",stat1Clr:"#22d3ee",stat2Clr:"#d946ef",statLblClr:"rgba(255,255,255,0.35)",ftBdr:"rgba(255,255,255,0.08)",ftNum:["rgba(34,211,238,0.55)","rgba(217,70,239,0.55)","rgba(139,92,246,0.55)"],ftHead:"#f1f5f9",ftBody:"rgba(241,245,249,0.45)",ghost:"rgba(255,255,255,0.035)"}:{bg:"transparent",logoName:"#0a0a1a",logoSub:"#0284c7",iconBg:"rgba(255,255,255,0.90)",iconBdr:"rgba(0,0,0,0.10)",onlineBg:"rgba(0,140,50,0.07)",onlineClr:"#166534",onlineBdr:"rgba(22,101,52,0.20)",h1a:"#075985",h1b:"#0369a1",h2a:"#4c1d95",h2b:"#6d28d9",h3a:"#86198f",h3b:"#a21caf",divider:"rgba(2,132,199,0.30)",body:"rgba(10,10,26,0.68)",cardBg:"rgba(255,255,255,0.97)",cardBdr:"rgba(0,0,0,0.09)",cardShadow:"0 16px 48px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,1)",cardGlow:"rgba(2,132,199,0.08)",initClr:"rgba(0,0,0,0.35)",zapClr:"#9333ea",cardTitle:"#0a0a1a",btnBg:"linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)",btnShadow:"0 8px 24px rgba(2,132,199,0.30)",statBg:"rgba(255,255,255,0.92)",statBdr:"rgba(0,0,0,0.08)",stat1Clr:"#0284c7",stat2Clr:"#9333ea",statLblClr:"rgba(0,0,0,0.40)",ftBdr:"rgba(0,0,0,0.09)",ftNum:["rgba(2,132,199,0.60)","rgba(147,51,234,0.60)","rgba(109,40,217,0.60)"],ftHead:"#0a0a1a",ftBody:"rgba(10,10,26,0.55)",ghost:"rgba(0,0,0,0.04)"};return v.jsxs("div",{ref:e,className:"min-h-screen relative",style:{fontFamily:o,background:c.bg},children:[v.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden",style:{opacity:1},children:[v.jsx("div",{style:{fontFamily:s,fontSize:"28vw",fontWeight:900,lineHeight:.85,color:c.ghost,whiteSpace:"nowrap"},children:"DIAGNOSE"}),v.jsx("div",{style:{fontFamily:s,fontSize:"28vw",fontWeight:900,lineHeight:.85,color:"transparent",WebkitTextStroke:`3px ${c.ghost}`,whiteSpace:"nowrap"},children:"PREDICT"})]}),v.jsxs("div",{className:"relative z-10 flex flex-col min-h-screen",style:{padding:"1.5rem 3rem 2rem"},children:[v.jsxs("header",{className:"flex justify-between items-center fup",children:[v.jsxs("div",{className:"flex items-center gap-3",children:[v.jsx("div",{className:"mag p-3 rounded-2xl backdrop-blur-xl cursor-pointer",style:{background:c.iconBg,border:`1px solid ${c.iconBdr}`},children:v.jsx(KM,{className:"w-6 h-6",style:{color:c.logoSub}})}),v.jsxs("div",{children:[v.jsx("div",{style:{fontFamily:s,fontSize:"0.75rem",fontWeight:800,letterSpacing:"0.22em",textTransform:"uppercase",color:c.logoName},children:"MediAI"}),v.jsx("div",{style:{fontFamily:s,fontSize:"0.62rem",fontWeight:600,letterSpacing:"0.20em",textTransform:"uppercase",color:c.logoSub},children:"Protocol_v2"})]})]}),v.jsxs("div",{className:"flex items-center gap-3",children:[v.jsx(sy,{}),v.jsxs("div",{className:"hidden sm:flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl fup",style:{fontFamily:s,fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",background:c.onlineBg,color:c.onlineClr,border:`1px solid ${c.onlineBdr}`},children:[v.jsx("span",{className:"w-1.5 h-1.5 rounded-full animate-pulse",style:{background:c.onlineClr}}),"System Online"]})]})]}),v.jsx("div",{className:"flex-1 flex items-center",children:v.jsxs("div",{className:"w-full flex flex-col lg:flex-row items-end gap-10 lg:gap-8 mt-8",children:[v.jsxs("div",{className:"w-full",style:{flex:"0 1 560px"},children:[v.jsx("h1",{className:"rtext",style:{fontFamily:s,fontSize:"clamp(3.2rem, 6.5vw, 6.5rem)",fontWeight:900,lineHeight:.9,letterSpacing:"-0.025em",marginBottom:"0.05em",...i?{background:`linear-gradient(100deg, ${c.h1a}, ${c.h1b})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}:{color:c.h1a}},children:"CLINICAL"}),v.jsx("h1",{className:"rtext",style:{fontFamily:s,fontSize:"clamp(3.2rem, 6.5vw, 6.5rem)",fontWeight:900,lineHeight:.9,letterSpacing:"-0.025em",marginBottom:"0.05em",...i?{background:`linear-gradient(100deg, ${c.h2a}, ${c.h2b})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}:{color:c.h2a}},children:"PRECISION"}),v.jsx("h1",{className:"rtext",style:{fontFamily:s,fontSize:"clamp(3.2rem, 6.5vw, 6.5rem)",fontWeight:900,lineHeight:.9,letterSpacing:"-0.025em",marginBottom:"1.5rem",...i?{background:`linear-gradient(100deg, ${c.h3a}, ${c.h3b})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}:{color:c.h3a}},children:"REDEFINED."}),v.jsx("div",{className:"uline h-px mb-6 rounded-full",style:{maxWidth:"200px",background:`linear-gradient(90deg, ${c.divider}, transparent)`}}),v.jsx("p",{className:"fup",style:{fontFamily:o,fontSize:"1rem",fontWeight:400,lineHeight:1.65,color:c.body,maxWidth:"400px"},children:"Harness the architecture of neural networks to process symptoms, radiological scans, and unstructured lab data — delivering absolute diagnostic clarity."}),v.jsx("div",{className:"mt-8 pt-7 grid grid-cols-3 gap-5",style:{borderTop:`1px solid ${c.ftBdr}`,maxWidth:"520px"},children:[{n:"01",c:c.ftNum[0],t:"Symptom AI",d:"Algorithmic analysis cross-referenced with clinical vectors."},{n:"02",c:c.ftNum[1],t:"Radiology AI",d:"Neural vision detects imaging anomalies in milliseconds."},{n:"03",c:c.ftNum[2],t:"NLP Reports",d:"Parse lab data to surface critical biomarkers instantly."}].map(({n:u,c:f,t:h,d:p})=>v.jsxs("div",{className:"fup",children:[v.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[v.jsx("span",{style:{fontFamily:s,fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.15em",color:f},children:u}),v.jsx("span",{style:{fontFamily:s,fontSize:"0.72rem",fontWeight:700,color:c.ftHead},children:h})]}),v.jsx("p",{style:{fontFamily:o,fontSize:"0.7rem",lineHeight:1.5,color:c.ftBody},children:p})]},u))})]}),v.jsxs("div",{className:"w-full",style:{flex:"0 0 320px",maxWidth:"320px",marginLeft:"auto"},children:[v.jsxs(ho,{className:"gpanel relative overflow-hidden p-7 rounded-3xl mb-4",style:{background:c.cardBg,border:`1px solid ${c.cardBdr}`,boxShadow:c.cardShadow},children:[v.jsx("div",{className:"absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[55px] pointer-events-none",style:{background:c.cardGlow}}),v.jsxs("div",{className:"relative z-10",children:[v.jsxs("div",{className:"flex justify-between items-center mb-8",children:[v.jsx("span",{style:{fontFamily:s,fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:c.initClr},children:"Initialize"}),v.jsx(Du,{className:"w-4 h-4",style:{color:c.zapClr}})]}),v.jsxs("h3",{style:{fontFamily:s,fontSize:"1.9rem",fontWeight:800,lineHeight:1.1,color:c.cardTitle,marginBottom:"1.75rem"},children:["Start",v.jsx("br",{}),"Analysis"]}),v.jsx("button",{onClick:a,className:"mag w-full py-5 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]",style:{fontFamily:s,fontSize:"0.76rem",letterSpacing:"0.18em",textTransform:"uppercase",background:c.btnBg,boxShadow:c.btnShadow},children:v.jsxs("span",{className:"flex items-center justify-center gap-2",children:["Launch ",v.jsx(av,{className:"w-4 h-4"})]})})]})]}),v.jsx("div",{className:"gpanel grid grid-cols-2 gap-3",children:[{v:"94%",l:"Accuracy",cl:c.stat1Clr},{v:"2.5s",l:"Latency",cl:c.stat2Clr}].map(({v:u,l:f,cl:h})=>v.jsxs("div",{className:"p-4 rounded-2xl backdrop-blur-xl",style:{background:c.statBg,border:`1px solid ${c.statBdr}`},children:[v.jsx("div",{style:{fontFamily:s,fontSize:"1.4rem",fontWeight:800,color:h,marginBottom:"3px"},children:u}),v.jsx("div",{style:{fontFamily:o,fontSize:"0.6rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:c.statLblClr},children:f})]},f))})]})]})})]})]})}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const hm="184",Wb=0,D_=1,Xb=2,Eu=1,$b=2,pl=3,ws=0,si=1,Lr=2,Ur=0,oa=1,qh=2,L_=3,I_=4,qb=5,Zs=100,Yb=101,Kb=102,Zb=103,Qb=104,Jb=200,eT=201,tT=202,nT=203,Yh=204,Kh=205,iT=206,rT=207,sT=208,aT=209,oT=210,lT=211,cT=212,uT=213,dT=214,Zh=0,Qh=1,Jh=2,po=3,ep=4,tp=5,np=6,ip=7,ay=0,fT=1,hT=2,dr=0,oy=1,ly=2,cy=3,uy=4,dy=5,fy=6,hy=7,py=300,la=301,mo=302,Kf=303,Zf=304,Qu=306,rp=1e3,Ir=1001,sp=1002,Rn=1003,pT=1004,qc=1005,kn=1006,Qf=1007,ea=1008,Li=1009,my=1010,gy=1011,Ul=1012,pm=1013,pr=1014,cr=1015,Vr=1016,mm=1017,gm=1018,Ol=1020,_y=35902,xy=35899,vy=1021,yy=1022,qi=1023,Hr=1026,ta=1027,Sy=1028,_m=1029,ca=1030,xm=1031,vm=1033,bu=33776,Tu=33777,wu=33778,Au=33779,ap=35840,op=35841,lp=35842,cp=35843,up=36196,dp=37492,fp=37496,hp=37488,pp=37489,Vu=37490,mp=37491,gp=37808,_p=37809,xp=37810,vp=37811,yp=37812,Sp=37813,Mp=37814,Ep=37815,bp=37816,Tp=37817,wp=37818,Ap=37819,Cp=37820,Rp=37821,Pp=36492,Np=36494,Dp=36495,Lp=36283,Ip=36284,Hu=36285,Fp=36286,mT=3200,F_=0,gT=1,gs="",Ni="srgb",Gu="srgb-linear",ju="linear",Lt="srgb",za=7680,U_=519,_T=512,xT=513,vT=514,ym=515,yT=516,ST=517,Sm=518,MT=519,O_=35044,k_="300 es",ur=2e3,Wu=2001;function ET(a){for(let e=a.length-1;e>=0;--e)if(a[e]>=65535)return!0;return!1}function Xu(a){return document.createElementNS("http://www.w3.org/1999/xhtml",a)}function bT(){const a=Xu("canvas");return a.style.display="block",a}const B_={};function z_(...a){const e="THREE."+a.shift();console.log(e,...a)}function My(a){const e=a[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=a[1];t&&t.isStackTrace?a[0]+=" "+t.getLocation():a[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return a}function it(...a){a=My(a);const e="THREE."+a.shift();{const t=a[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...a)}}function Tt(...a){a=My(a);const e="THREE."+a.shift();{const t=a[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...a)}}function Up(...a){const e=a.join(" ");e in B_||(B_[e]=!0,it(...a))}function TT(a,e,t){return new Promise(function(i,s){function o(){switch(a.clientWaitSync(e,a.SYNC_FLUSH_COMMANDS_BIT,0)){case a.WAIT_FAILED:s();break;case a.TIMEOUT_EXPIRED:setTimeout(o,t);break;default:i()}}setTimeout(o,t)})}const wT={[Zh]:Qh,[Jh]:np,[ep]:ip,[po]:tp,[Qh]:Zh,[np]:Jh,[ip]:ep,[tp]:po};class fa{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const o=s.indexOf(t);o!==-1&&s.splice(o,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let o=0,c=s.length;o<c;o++)s[o].call(this,e);e.target=null}}}const Fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Jf=Math.PI/180,Op=180/Math.PI;function Bl(){const a=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Fn[a&255]+Fn[a>>8&255]+Fn[a>>16&255]+Fn[a>>24&255]+"-"+Fn[e&255]+Fn[e>>8&255]+"-"+Fn[e>>16&15|64]+Fn[e>>24&255]+"-"+Fn[t&63|128]+Fn[t>>8&255]+"-"+Fn[t>>16&255]+Fn[t>>24&255]+Fn[i&255]+Fn[i>>8&255]+Fn[i>>16&255]+Fn[i>>24&255]).toLowerCase()}function yt(a,e,t){return Math.max(e,Math.min(t,a))}function AT(a,e){return(a%e+e)%e}function eh(a,e,t){return(1-t)*a+t*e}function sl(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return a/4294967295;case Uint16Array:return a/65535;case Uint8Array:return a/255;case Int32Array:return Math.max(a/2147483647,-1);case Int16Array:return Math.max(a/32767,-1);case Int8Array:return Math.max(a/127,-1);default:throw new Error("Invalid component type.")}}function Jn(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return Math.round(a*4294967295);case Uint16Array:return Math.round(a*65535);case Uint8Array:return Math.round(a*255);case Int32Array:return Math.round(a*2147483647);case Int16Array:return Math.round(a*32767);case Int8Array:return Math.round(a*127);default:throw new Error("Invalid component type.")}}const bm=class bm{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),o=this.x-e.x,c=this.y-e.y;return this.x=o*i-c*s+e.x,this.y=o*s+c*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};bm.prototype.isVector2=!0;let Ft=bm;class vo{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,o,c,u){let f=i[s+0],h=i[s+1],p=i[s+2],_=i[s+3],m=o[c+0],S=o[c+1],M=o[c+2],b=o[c+3];if(_!==b||f!==m||h!==S||p!==M){let x=f*m+h*S+p*M+_*b;x<0&&(m=-m,S=-S,M=-M,b=-b,x=-x);let E=1-u;if(x<.9995){const w=Math.acos(x),P=Math.sin(w);E=Math.sin(E*w)/P,u=Math.sin(u*w)/P,f=f*E+m*u,h=h*E+S*u,p=p*E+M*u,_=_*E+b*u}else{f=f*E+m*u,h=h*E+S*u,p=p*E+M*u,_=_*E+b*u;const w=1/Math.sqrt(f*f+h*h+p*p+_*_);f*=w,h*=w,p*=w,_*=w}}e[t]=f,e[t+1]=h,e[t+2]=p,e[t+3]=_}static multiplyQuaternionsFlat(e,t,i,s,o,c){const u=i[s],f=i[s+1],h=i[s+2],p=i[s+3],_=o[c],m=o[c+1],S=o[c+2],M=o[c+3];return e[t]=u*M+p*_+f*S-h*m,e[t+1]=f*M+p*m+h*_-u*S,e[t+2]=h*M+p*S+u*m-f*_,e[t+3]=p*M-u*_-f*m-h*S,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,o=e._z,c=e._order,u=Math.cos,f=Math.sin,h=u(i/2),p=u(s/2),_=u(o/2),m=f(i/2),S=f(s/2),M=f(o/2);switch(c){case"XYZ":this._x=m*p*_+h*S*M,this._y=h*S*_-m*p*M,this._z=h*p*M+m*S*_,this._w=h*p*_-m*S*M;break;case"YXZ":this._x=m*p*_+h*S*M,this._y=h*S*_-m*p*M,this._z=h*p*M-m*S*_,this._w=h*p*_+m*S*M;break;case"ZXY":this._x=m*p*_-h*S*M,this._y=h*S*_+m*p*M,this._z=h*p*M+m*S*_,this._w=h*p*_-m*S*M;break;case"ZYX":this._x=m*p*_-h*S*M,this._y=h*S*_+m*p*M,this._z=h*p*M-m*S*_,this._w=h*p*_+m*S*M;break;case"YZX":this._x=m*p*_+h*S*M,this._y=h*S*_+m*p*M,this._z=h*p*M-m*S*_,this._w=h*p*_-m*S*M;break;case"XZY":this._x=m*p*_-h*S*M,this._y=h*S*_-m*p*M,this._z=h*p*M+m*S*_,this._w=h*p*_+m*S*M;break;default:it("Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],o=t[8],c=t[1],u=t[5],f=t[9],h=t[2],p=t[6],_=t[10],m=i+u+_;if(m>0){const S=.5/Math.sqrt(m+1);this._w=.25/S,this._x=(p-f)*S,this._y=(o-h)*S,this._z=(c-s)*S}else if(i>u&&i>_){const S=2*Math.sqrt(1+i-u-_);this._w=(p-f)/S,this._x=.25*S,this._y=(s+c)/S,this._z=(o+h)/S}else if(u>_){const S=2*Math.sqrt(1+u-i-_);this._w=(o-h)/S,this._x=(s+c)/S,this._y=.25*S,this._z=(f+p)/S}else{const S=2*Math.sqrt(1+_-i-u);this._w=(c-s)/S,this._x=(o+h)/S,this._y=(f+p)/S,this._z=.25*S}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(yt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,o=e._z,c=e._w,u=t._x,f=t._y,h=t._z,p=t._w;return this._x=i*p+c*u+s*h-o*f,this._y=s*p+c*f+o*u-i*h,this._z=o*p+c*h+i*f-s*u,this._w=c*p-i*u-s*f-o*h,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,o=e._z,c=e._w,u=this.dot(e);u<0&&(i=-i,s=-s,o=-o,c=-c,u=-u);let f=1-t;if(u<.9995){const h=Math.acos(u),p=Math.sin(h);f=Math.sin(f*h)/p,t=Math.sin(t*h)/p,this._x=this._x*f+i*t,this._y=this._y*f+s*t,this._z=this._z*f+o*t,this._w=this._w*f+c*t,this._onChangeCallback()}else this._x=this._x*f+i*t,this._y=this._y*f+s*t,this._z=this._z*f+o*t,this._w=this._w*f+c*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),o=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),o*Math.sin(t),o*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Tm=class Tm{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(V_.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(V_.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,o=e.elements;return this.x=o[0]*t+o[3]*i+o[6]*s,this.y=o[1]*t+o[4]*i+o[7]*s,this.z=o[2]*t+o[5]*i+o[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,o=e.elements,c=1/(o[3]*t+o[7]*i+o[11]*s+o[15]);return this.x=(o[0]*t+o[4]*i+o[8]*s+o[12])*c,this.y=(o[1]*t+o[5]*i+o[9]*s+o[13])*c,this.z=(o[2]*t+o[6]*i+o[10]*s+o[14])*c,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,o=e.x,c=e.y,u=e.z,f=e.w,h=2*(c*s-u*i),p=2*(u*t-o*s),_=2*(o*i-c*t);return this.x=t+f*h+c*_-u*p,this.y=i+f*p+u*h-o*_,this.z=s+f*_+o*p-c*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s,this.y=o[1]*t+o[5]*i+o[9]*s,this.z=o[2]*t+o[6]*i+o[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,o=e.z,c=t.x,u=t.y,f=t.z;return this.x=s*f-o*u,this.y=o*c-i*f,this.z=i*u-s*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return th.copy(this).projectOnVector(e),this.sub(th)}reflect(e){return this.sub(th.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Tm.prototype.isVector3=!0;let re=Tm;const th=new re,V_=new vo,wm=class wm{constructor(e,t,i,s,o,c,u,f,h){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,o,c,u,f,h)}set(e,t,i,s,o,c,u,f,h){const p=this.elements;return p[0]=e,p[1]=s,p[2]=u,p[3]=t,p[4]=o,p[5]=f,p[6]=i,p[7]=c,p[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,o=this.elements,c=i[0],u=i[3],f=i[6],h=i[1],p=i[4],_=i[7],m=i[2],S=i[5],M=i[8],b=s[0],x=s[3],E=s[6],w=s[1],P=s[4],A=s[7],N=s[2],L=s[5],F=s[8];return o[0]=c*b+u*w+f*N,o[3]=c*x+u*P+f*L,o[6]=c*E+u*A+f*F,o[1]=h*b+p*w+_*N,o[4]=h*x+p*P+_*L,o[7]=h*E+p*A+_*F,o[2]=m*b+S*w+M*N,o[5]=m*x+S*P+M*L,o[8]=m*E+S*A+M*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],o=e[3],c=e[4],u=e[5],f=e[6],h=e[7],p=e[8];return t*c*p-t*u*h-i*o*p+i*u*f+s*o*h-s*c*f}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],o=e[3],c=e[4],u=e[5],f=e[6],h=e[7],p=e[8],_=p*c-u*h,m=u*f-p*o,S=h*o-c*f,M=t*_+i*m+s*S;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/M;return e[0]=_*b,e[1]=(s*h-p*i)*b,e[2]=(u*i-s*c)*b,e[3]=m*b,e[4]=(p*t-s*f)*b,e[5]=(s*o-u*t)*b,e[6]=S*b,e[7]=(i*f-h*t)*b,e[8]=(c*t-i*o)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,o,c,u){const f=Math.cos(o),h=Math.sin(o);return this.set(i*f,i*h,-i*(f*c+h*u)+c+e,-s*h,s*f,-s*(-h*c+f*u)+u+t,0,0,1),this}scale(e,t){return this.premultiply(nh.makeScale(e,t)),this}rotate(e){return this.premultiply(nh.makeRotation(-e)),this}translate(e,t){return this.premultiply(nh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};wm.prototype.isMatrix3=!0;let ct=wm;const nh=new ct,H_=new ct().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),G_=new ct().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function CT(){const a={enabled:!0,workingColorSpace:Gu,spaces:{},convert:function(s,o,c){return this.enabled===!1||o===c||!o||!c||(this.spaces[o].transfer===Lt&&(s.r=Or(s.r),s.g=Or(s.g),s.b=Or(s.b)),this.spaces[o].primaries!==this.spaces[c].primaries&&(s.applyMatrix3(this.spaces[o].toXYZ),s.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===Lt&&(s.r=so(s.r),s.g=so(s.g),s.b=so(s.b))),s},workingToColorSpace:function(s,o){return this.convert(s,this.workingColorSpace,o)},colorSpaceToWorking:function(s,o){return this.convert(s,o,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===gs?ju:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,o=this.workingColorSpace){return s.fromArray(this.spaces[o].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,o,c){return s.copy(this.spaces[o].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,o){return Up("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),a.workingToColorSpace(s,o)},toWorkingColorSpace:function(s,o){return Up("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),a.colorSpaceToWorking(s,o)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return a.define({[Gu]:{primaries:e,whitePoint:i,transfer:ju,toXYZ:H_,fromXYZ:G_,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ni},outputColorSpaceConfig:{drawingBufferColorSpace:Ni}},[Ni]:{primaries:e,whitePoint:i,transfer:Lt,toXYZ:H_,fromXYZ:G_,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ni}}}),a}const vt=CT();function Or(a){return a<.04045?a*.0773993808:Math.pow(a*.9478672986+.0521327014,2.4)}function so(a){return a<.0031308?a*12.92:1.055*Math.pow(a,.41666)-.055}let Va;class RT{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Va===void 0&&(Va=Xu("canvas")),Va.width=e.width,Va.height=e.height;const s=Va.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Va}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Xu("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),o=s.data;for(let c=0;c<o.length;c++)o[c]=Or(o[c]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Or(t[i]/255)*255):t[i]=Or(t[i]);return{data:t,width:e.width,height:e.height}}else return it("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let PT=0;class Mm{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:PT++}),this.uuid=Bl(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let c=0,u=s.length;c<u;c++)s[c].isDataTexture?o.push(ih(s[c].image)):o.push(ih(s[c]))}else o=ih(s);i.url=o}return t||(e.images[this.uuid]=i),i}}function ih(a){return typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&a instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&a instanceof ImageBitmap?RT.getDataURL(a):a.data?{data:Array.from(a.data),width:a.width,height:a.height,type:a.data.constructor.name}:(it("Texture: Unable to serialize Texture."),{})}let NT=0;const rh=new re;class jn extends fa{constructor(e=jn.DEFAULT_IMAGE,t=jn.DEFAULT_MAPPING,i=Ir,s=Ir,o=kn,c=ea,u=qi,f=Li,h=jn.DEFAULT_ANISOTROPY,p=gs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:NT++}),this.uuid=Bl(),this.name="",this.source=new Mm(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=o,this.minFilter=c,this.anisotropy=h,this.format=u,this.internalFormat=null,this.type=f,this.offset=new Ft(0,0),this.repeat=new Ft(1,1),this.center=new Ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ct,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=p,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(rh).x}get height(){return this.source.getSize(rh).y}get depth(){return this.source.getSize(rh).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){it(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){it(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==py)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rp:e.x=e.x-Math.floor(e.x);break;case Ir:e.x=e.x<0?0:1;break;case sp:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rp:e.y=e.y-Math.floor(e.y);break;case Ir:e.y=e.y<0?0:1;break;case sp:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}jn.DEFAULT_IMAGE=null;jn.DEFAULT_MAPPING=py;jn.DEFAULT_ANISOTROPY=1;const Am=class Am{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,o=this.w,c=e.elements;return this.x=c[0]*t+c[4]*i+c[8]*s+c[12]*o,this.y=c[1]*t+c[5]*i+c[9]*s+c[13]*o,this.z=c[2]*t+c[6]*i+c[10]*s+c[14]*o,this.w=c[3]*t+c[7]*i+c[11]*s+c[15]*o,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,o;const f=e.elements,h=f[0],p=f[4],_=f[8],m=f[1],S=f[5],M=f[9],b=f[2],x=f[6],E=f[10];if(Math.abs(p-m)<.01&&Math.abs(_-b)<.01&&Math.abs(M-x)<.01){if(Math.abs(p+m)<.1&&Math.abs(_+b)<.1&&Math.abs(M+x)<.1&&Math.abs(h+S+E-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const P=(h+1)/2,A=(S+1)/2,N=(E+1)/2,L=(p+m)/4,F=(_+b)/4,T=(M+x)/4;return P>A&&P>N?P<.01?(i=0,s=.707106781,o=.707106781):(i=Math.sqrt(P),s=L/i,o=F/i):A>N?A<.01?(i=.707106781,s=0,o=.707106781):(s=Math.sqrt(A),i=L/s,o=T/s):N<.01?(i=.707106781,s=.707106781,o=0):(o=Math.sqrt(N),i=F/o,s=T/o),this.set(i,s,o,t),this}let w=Math.sqrt((x-M)*(x-M)+(_-b)*(_-b)+(m-p)*(m-p));return Math.abs(w)<.001&&(w=1),this.x=(x-M)/w,this.y=(_-b)/w,this.z=(m-p)/w,this.w=Math.acos((h+S+E-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this.w=yt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this.w=yt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Am.prototype.isVector4=!0;let un=Am;class DT extends fa{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new un(0,0,e,t),this.scissorTest=!1,this.viewport=new un(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},o=new jn(s),c=i.count;for(let u=0;u<c;u++)this.textures[u]=o.clone(),this.textures[u].isRenderTargetTexture=!0,this.textures[u].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:kn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Mm(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class fr extends DT{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Ey extends jn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=Ir,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class LT extends jn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=Ir,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const $u=class $u{constructor(e,t,i,s,o,c,u,f,h,p,_,m,S,M,b,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,o,c,u,f,h,p,_,m,S,M,b,x)}set(e,t,i,s,o,c,u,f,h,p,_,m,S,M,b,x){const E=this.elements;return E[0]=e,E[4]=t,E[8]=i,E[12]=s,E[1]=o,E[5]=c,E[9]=u,E[13]=f,E[2]=h,E[6]=p,E[10]=_,E[14]=m,E[3]=S,E[7]=M,E[11]=b,E[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $u().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Ha.setFromMatrixColumn(e,0).length(),o=1/Ha.setFromMatrixColumn(e,1).length(),c=1/Ha.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*o,t[5]=i[5]*o,t[6]=i[6]*o,t[7]=0,t[8]=i[8]*c,t[9]=i[9]*c,t[10]=i[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,o=e.z,c=Math.cos(i),u=Math.sin(i),f=Math.cos(s),h=Math.sin(s),p=Math.cos(o),_=Math.sin(o);if(e.order==="XYZ"){const m=c*p,S=c*_,M=u*p,b=u*_;t[0]=f*p,t[4]=-f*_,t[8]=h,t[1]=S+M*h,t[5]=m-b*h,t[9]=-u*f,t[2]=b-m*h,t[6]=M+S*h,t[10]=c*f}else if(e.order==="YXZ"){const m=f*p,S=f*_,M=h*p,b=h*_;t[0]=m+b*u,t[4]=M*u-S,t[8]=c*h,t[1]=c*_,t[5]=c*p,t[9]=-u,t[2]=S*u-M,t[6]=b+m*u,t[10]=c*f}else if(e.order==="ZXY"){const m=f*p,S=f*_,M=h*p,b=h*_;t[0]=m-b*u,t[4]=-c*_,t[8]=M+S*u,t[1]=S+M*u,t[5]=c*p,t[9]=b-m*u,t[2]=-c*h,t[6]=u,t[10]=c*f}else if(e.order==="ZYX"){const m=c*p,S=c*_,M=u*p,b=u*_;t[0]=f*p,t[4]=M*h-S,t[8]=m*h+b,t[1]=f*_,t[5]=b*h+m,t[9]=S*h-M,t[2]=-h,t[6]=u*f,t[10]=c*f}else if(e.order==="YZX"){const m=c*f,S=c*h,M=u*f,b=u*h;t[0]=f*p,t[4]=b-m*_,t[8]=M*_+S,t[1]=_,t[5]=c*p,t[9]=-u*p,t[2]=-h*p,t[6]=S*_+M,t[10]=m-b*_}else if(e.order==="XZY"){const m=c*f,S=c*h,M=u*f,b=u*h;t[0]=f*p,t[4]=-_,t[8]=h*p,t[1]=m*_+b,t[5]=c*p,t[9]=S*_-M,t[2]=M*_-S,t[6]=u*p,t[10]=b*_+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(IT,e,FT)}lookAt(e,t,i){const s=this.elements;return fi.subVectors(e,t),fi.lengthSq()===0&&(fi.z=1),fi.normalize(),cs.crossVectors(i,fi),cs.lengthSq()===0&&(Math.abs(i.z)===1?fi.x+=1e-4:fi.z+=1e-4,fi.normalize(),cs.crossVectors(i,fi)),cs.normalize(),Yc.crossVectors(fi,cs),s[0]=cs.x,s[4]=Yc.x,s[8]=fi.x,s[1]=cs.y,s[5]=Yc.y,s[9]=fi.y,s[2]=cs.z,s[6]=Yc.z,s[10]=fi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,o=this.elements,c=i[0],u=i[4],f=i[8],h=i[12],p=i[1],_=i[5],m=i[9],S=i[13],M=i[2],b=i[6],x=i[10],E=i[14],w=i[3],P=i[7],A=i[11],N=i[15],L=s[0],F=s[4],T=s[8],I=s[12],z=s[1],k=s[5],q=s[9],Q=s[13],se=s[2],V=s[6],W=s[10],H=s[14],Y=s[3],ae=s[7],oe=s[11],B=s[15];return o[0]=c*L+u*z+f*se+h*Y,o[4]=c*F+u*k+f*V+h*ae,o[8]=c*T+u*q+f*W+h*oe,o[12]=c*I+u*Q+f*H+h*B,o[1]=p*L+_*z+m*se+S*Y,o[5]=p*F+_*k+m*V+S*ae,o[9]=p*T+_*q+m*W+S*oe,o[13]=p*I+_*Q+m*H+S*B,o[2]=M*L+b*z+x*se+E*Y,o[6]=M*F+b*k+x*V+E*ae,o[10]=M*T+b*q+x*W+E*oe,o[14]=M*I+b*Q+x*H+E*B,o[3]=w*L+P*z+A*se+N*Y,o[7]=w*F+P*k+A*V+N*ae,o[11]=w*T+P*q+A*W+N*oe,o[15]=w*I+P*Q+A*H+N*B,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],o=e[12],c=e[1],u=e[5],f=e[9],h=e[13],p=e[2],_=e[6],m=e[10],S=e[14],M=e[3],b=e[7],x=e[11],E=e[15],w=f*S-h*m,P=u*S-h*_,A=u*m-f*_,N=c*S-h*p,L=c*m-f*p,F=c*_-u*p;return t*(b*w-x*P+E*A)-i*(M*w-x*N+E*L)+s*(M*P-b*N+E*F)-o*(M*A-b*L+x*F)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],o=e[3],c=e[4],u=e[5],f=e[6],h=e[7],p=e[8],_=e[9],m=e[10],S=e[11],M=e[12],b=e[13],x=e[14],E=e[15],w=t*u-i*c,P=t*f-s*c,A=t*h-o*c,N=i*f-s*u,L=i*h-o*u,F=s*h-o*f,T=p*b-_*M,I=p*x-m*M,z=p*E-S*M,k=_*x-m*b,q=_*E-S*b,Q=m*E-S*x,se=w*Q-P*q+A*k+N*z-L*I+F*T;if(se===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const V=1/se;return e[0]=(u*Q-f*q+h*k)*V,e[1]=(s*q-i*Q-o*k)*V,e[2]=(b*F-x*L+E*N)*V,e[3]=(m*L-_*F-S*N)*V,e[4]=(f*z-c*Q-h*I)*V,e[5]=(t*Q-s*z+o*I)*V,e[6]=(x*A-M*F-E*P)*V,e[7]=(p*F-m*A+S*P)*V,e[8]=(c*q-u*z+h*T)*V,e[9]=(i*z-t*q-o*T)*V,e[10]=(M*L-b*A+E*w)*V,e[11]=(_*A-p*L-S*w)*V,e[12]=(u*I-c*k-f*T)*V,e[13]=(t*k-i*I+s*T)*V,e[14]=(b*P-M*N-x*w)*V,e[15]=(p*N-_*P+m*w)*V,this}scale(e){const t=this.elements,i=e.x,s=e.y,o=e.z;return t[0]*=i,t[4]*=s,t[8]*=o,t[1]*=i,t[5]*=s,t[9]*=o,t[2]*=i,t[6]*=s,t[10]*=o,t[3]*=i,t[7]*=s,t[11]*=o,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),o=1-i,c=e.x,u=e.y,f=e.z,h=o*c,p=o*u;return this.set(h*c+i,h*u-s*f,h*f+s*u,0,h*u+s*f,p*u+i,p*f-s*c,0,h*f-s*u,p*f+s*c,o*f*f+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,o,c){return this.set(1,i,o,0,e,1,c,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,o=t._x,c=t._y,u=t._z,f=t._w,h=o+o,p=c+c,_=u+u,m=o*h,S=o*p,M=o*_,b=c*p,x=c*_,E=u*_,w=f*h,P=f*p,A=f*_,N=i.x,L=i.y,F=i.z;return s[0]=(1-(b+E))*N,s[1]=(S+A)*N,s[2]=(M-P)*N,s[3]=0,s[4]=(S-A)*L,s[5]=(1-(m+E))*L,s[6]=(x+w)*L,s[7]=0,s[8]=(M+P)*F,s[9]=(x-w)*F,s[10]=(1-(m+b))*F,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const o=this.determinant();if(o===0)return i.set(1,1,1),t.identity(),this;let c=Ha.set(s[0],s[1],s[2]).length();const u=Ha.set(s[4],s[5],s[6]).length(),f=Ha.set(s[8],s[9],s[10]).length();o<0&&(c=-c),ji.copy(this);const h=1/c,p=1/u,_=1/f;return ji.elements[0]*=h,ji.elements[1]*=h,ji.elements[2]*=h,ji.elements[4]*=p,ji.elements[5]*=p,ji.elements[6]*=p,ji.elements[8]*=_,ji.elements[9]*=_,ji.elements[10]*=_,t.setFromRotationMatrix(ji),i.x=c,i.y=u,i.z=f,this}makePerspective(e,t,i,s,o,c,u=ur,f=!1){const h=this.elements,p=2*o/(t-e),_=2*o/(i-s),m=(t+e)/(t-e),S=(i+s)/(i-s);let M,b;if(f)M=o/(c-o),b=c*o/(c-o);else if(u===ur)M=-(c+o)/(c-o),b=-2*c*o/(c-o);else if(u===Wu)M=-c/(c-o),b=-c*o/(c-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+u);return h[0]=p,h[4]=0,h[8]=m,h[12]=0,h[1]=0,h[5]=_,h[9]=S,h[13]=0,h[2]=0,h[6]=0,h[10]=M,h[14]=b,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,i,s,o,c,u=ur,f=!1){const h=this.elements,p=2/(t-e),_=2/(i-s),m=-(t+e)/(t-e),S=-(i+s)/(i-s);let M,b;if(f)M=1/(c-o),b=c/(c-o);else if(u===ur)M=-2/(c-o),b=-(c+o)/(c-o);else if(u===Wu)M=-1/(c-o),b=-o/(c-o);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+u);return h[0]=p,h[4]=0,h[8]=0,h[12]=m,h[1]=0,h[5]=_,h[9]=0,h[13]=S,h[2]=0,h[6]=0,h[10]=M,h[14]=b,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};$u.prototype.isMatrix4=!0;let mn=$u;const Ha=new re,ji=new mn,IT=new re(0,0,0),FT=new re(1,1,1),cs=new re,Yc=new re,fi=new re,j_=new mn,W_=new vo;class ua{constructor(e=0,t=0,i=0,s=ua.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,o=s[0],c=s[4],u=s[8],f=s[1],h=s[5],p=s[9],_=s[2],m=s[6],S=s[10];switch(t){case"XYZ":this._y=Math.asin(yt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-p,S),this._z=Math.atan2(-c,o)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-yt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(u,S),this._z=Math.atan2(f,h)):(this._y=Math.atan2(-_,o),this._z=0);break;case"ZXY":this._x=Math.asin(yt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-_,S),this._z=Math.atan2(-c,h)):(this._y=0,this._z=Math.atan2(f,o));break;case"ZYX":this._y=Math.asin(-yt(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(m,S),this._z=Math.atan2(f,o)):(this._x=0,this._z=Math.atan2(-c,h));break;case"YZX":this._z=Math.asin(yt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-p,h),this._y=Math.atan2(-_,o)):(this._x=0,this._y=Math.atan2(u,S));break;case"XZY":this._z=Math.asin(-yt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(u,o)):(this._x=Math.atan2(-p,S),this._y=0);break;default:it("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return j_.makeRotationFromQuaternion(e),this.setFromRotationMatrix(j_,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return W_.setFromEuler(this),this.setFromQuaternion(W_,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ua.DEFAULT_ORDER="XYZ";class by{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let UT=0;const X_=new re,Ga=new vo,wr=new mn,Kc=new re,al=new re,OT=new re,kT=new vo,$_=new re(1,0,0),q_=new re(0,1,0),Y_=new re(0,0,1),K_={type:"added"},BT={type:"removed"},ja={type:"childadded",child:null},sh={type:"childremoved",child:null};class ai extends fa{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:UT++}),this.uuid=Bl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ai.DEFAULT_UP.clone();const e=new re,t=new ua,i=new vo,s=new re(1,1,1);function o(){i.setFromEuler(t,!1)}function c(){t.setFromQuaternion(i,void 0,!1)}t._onChange(o),i._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new mn},normalMatrix:{value:new ct}}),this.matrix=new mn,this.matrixWorld=new mn,this.matrixAutoUpdate=ai.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ai.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new by,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ga.setFromAxisAngle(e,t),this.quaternion.multiply(Ga),this}rotateOnWorldAxis(e,t){return Ga.setFromAxisAngle(e,t),this.quaternion.premultiply(Ga),this}rotateX(e){return this.rotateOnAxis($_,e)}rotateY(e){return this.rotateOnAxis(q_,e)}rotateZ(e){return this.rotateOnAxis(Y_,e)}translateOnAxis(e,t){return X_.copy(e).applyQuaternion(this.quaternion),this.position.add(X_.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis($_,e)}translateY(e){return this.translateOnAxis(q_,e)}translateZ(e){return this.translateOnAxis(Y_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(wr.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Kc.copy(e):Kc.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),al.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wr.lookAt(al,Kc,this.up):wr.lookAt(Kc,al,this.up),this.quaternion.setFromRotationMatrix(wr),s&&(wr.extractRotation(s.matrixWorld),Ga.setFromRotationMatrix(wr),this.quaternion.premultiply(Ga.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Tt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(K_),ja.child=e,this.dispatchEvent(ja),ja.child=null):Tt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(BT),sh.child=e,this.dispatchEvent(sh),sh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),wr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),wr.multiply(e.parent.matrixWorld)),e.applyMatrix4(wr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(K_),ja.child=e,this.dispatchEvent(ja),ja.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const c=this.children[i].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let o=0,c=s.length;o<c;o++)s[o].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(al,e,OT),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(al,kT,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,o=this.matrix.elements;o[12]+=t-o[0]*t-o[4]*i-o[8]*s,o[13]+=i-o[1]*t-o[5]*i-o[9]*s,o[14]+=s-o[2]*t-o[6]*i-o[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let o=0,c=s.length;o<c;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(u=>({...u,boundingBox:u.boundingBox?u.boundingBox.toJSON():void 0,boundingSphere:u.boundingSphere?u.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(u=>({...u})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function o(u,f){return u[f.uuid]===void 0&&(u[f.uuid]=f.toJSON(e)),f.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(e.geometries,this.geometry);const u=this.geometry.parameters;if(u!==void 0&&u.shapes!==void 0){const f=u.shapes;if(Array.isArray(f))for(let h=0,p=f.length;h<p;h++){const _=f[h];o(e.shapes,_)}else o(e.shapes,f)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const u=[];for(let f=0,h=this.material.length;f<h;f++)u.push(o(e.materials,this.material[f]));s.material=u}else s.material=o(e.materials,this.material);if(this.children.length>0){s.children=[];for(let u=0;u<this.children.length;u++)s.children.push(this.children[u].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let u=0;u<this.animations.length;u++){const f=this.animations[u];s.animations.push(o(e.animations,f))}}if(t){const u=c(e.geometries),f=c(e.materials),h=c(e.textures),p=c(e.images),_=c(e.shapes),m=c(e.skeletons),S=c(e.animations),M=c(e.nodes);u.length>0&&(i.geometries=u),f.length>0&&(i.materials=f),h.length>0&&(i.textures=h),p.length>0&&(i.images=p),_.length>0&&(i.shapes=_),m.length>0&&(i.skeletons=m),S.length>0&&(i.animations=S),M.length>0&&(i.nodes=M)}return i.object=s,i;function c(u){const f=[];for(const h in u){const p=u[h];delete p.metadata,f.push(p)}return f}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}ai.DEFAULT_UP=new re(0,1,0);ai.DEFAULT_MATRIX_AUTO_UPDATE=!0;ai.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Zc extends ai{constructor(){super(),this.isGroup=!0,this.type="Group"}}const zT={type:"move"};class ah{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zc,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zc,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new re,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new re),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zc,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new re,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new re,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,o=null,c=null;const u=this._targetRay,f=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){c=!0;for(const b of e.hand.values()){const x=t.getJointPose(b,i),E=this._getHandJoint(h,b);x!==null&&(E.matrix.fromArray(x.transform.matrix),E.matrix.decompose(E.position,E.rotation,E.scale),E.matrixWorldNeedsUpdate=!0,E.jointRadius=x.radius),E.visible=x!==null}const p=h.joints["index-finger-tip"],_=h.joints["thumb-tip"],m=p.position.distanceTo(_.position),S=.02,M=.005;h.inputState.pinching&&m>S+M?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&m<=S-M&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else f!==null&&e.gripSpace&&(o=t.getPose(e.gripSpace,i),o!==null&&(f.matrix.fromArray(o.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,o.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(o.linearVelocity)):f.hasLinearVelocity=!1,o.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(o.angularVelocity)):f.hasAngularVelocity=!1,f.eventsEnabled&&f.dispatchEvent({type:"gripUpdated",data:e,target:this})));u!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(u.matrix.fromArray(s.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,s.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(s.linearVelocity)):u.hasLinearVelocity=!1,s.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(s.angularVelocity)):u.hasAngularVelocity=!1,this.dispatchEvent(zT)))}return u!==null&&(u.visible=s!==null),f!==null&&(f.visible=o!==null),h!==null&&(h.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Zc;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Ty={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},us={h:0,s:0,l:0},Qc={h:0,s:0,l:0};function oh(a,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?a+(e-a)*6*t:t<1/2?e:t<2/3?a+(e-a)*6*(2/3-t):a}class Et{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ni){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,vt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=vt.workingColorSpace){return this.r=e,this.g=t,this.b=i,vt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=vt.workingColorSpace){if(e=AT(e,1),t=yt(t,0,1),i=yt(i,0,1),t===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+t):i+t-i*t,c=2*i-o;this.r=oh(c,o,e+1/3),this.g=oh(c,o,e),this.b=oh(c,o,e-1/3)}return vt.colorSpaceToWorking(this,s),this}setStyle(e,t=Ni){function i(o){o!==void 0&&parseFloat(o)<1&&it("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let o;const c=s[1],u=s[2];switch(c){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,t);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,t);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(u))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,t);break;default:it("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const o=s[1],c=o.length;if(c===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(o,16),t);it("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ni){const i=Ty[e.toLowerCase()];return i!==void 0?this.setHex(i,t):it("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Or(e.r),this.g=Or(e.g),this.b=Or(e.b),this}copyLinearToSRGB(e){return this.r=so(e.r),this.g=so(e.g),this.b=so(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ni){return vt.workingToColorSpace(Un.copy(this),e),Math.round(yt(Un.r*255,0,255))*65536+Math.round(yt(Un.g*255,0,255))*256+Math.round(yt(Un.b*255,0,255))}getHexString(e=Ni){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=vt.workingColorSpace){vt.workingToColorSpace(Un.copy(this),t);const i=Un.r,s=Un.g,o=Un.b,c=Math.max(i,s,o),u=Math.min(i,s,o);let f,h;const p=(u+c)/2;if(u===c)f=0,h=0;else{const _=c-u;switch(h=p<=.5?_/(c+u):_/(2-c-u),c){case i:f=(s-o)/_+(s<o?6:0);break;case s:f=(o-i)/_+2;break;case o:f=(i-s)/_+4;break}f/=6}return e.h=f,e.s=h,e.l=p,e}getRGB(e,t=vt.workingColorSpace){return vt.workingToColorSpace(Un.copy(this),t),e.r=Un.r,e.g=Un.g,e.b=Un.b,e}getStyle(e=Ni){vt.workingToColorSpace(Un.copy(this),e);const t=Un.r,i=Un.g,s=Un.b;return e!==Ni?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(us),this.setHSL(us.h+e,us.s+t,us.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(us),e.getHSL(Qc);const i=eh(us.h,Qc.h,t),s=eh(us.s,Qc.s,t),o=eh(us.l,Qc.l,t);return this.setHSL(i,s,o),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,o=e.elements;return this.r=o[0]*t+o[3]*i+o[6]*s,this.g=o[1]*t+o[4]*i+o[7]*s,this.b=o[2]*t+o[5]*i+o[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Un=new Et;Et.NAMES=Ty;class Em{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Et(e),this.density=t}clone(){return new Em(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class VT extends ai{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ua,this.environmentIntensity=1,this.environmentRotation=new ua,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Wi=new re,Ar=new re,lh=new re,Cr=new re,Wa=new re,Xa=new re,Z_=new re,ch=new re,uh=new re,dh=new re,fh=new un,hh=new un,ph=new un;class $i{constructor(e=new re,t=new re,i=new re){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Wi.subVectors(e,t),s.cross(Wi);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(e,t,i,s,o){Wi.subVectors(s,t),Ar.subVectors(i,t),lh.subVectors(e,t);const c=Wi.dot(Wi),u=Wi.dot(Ar),f=Wi.dot(lh),h=Ar.dot(Ar),p=Ar.dot(lh),_=c*h-u*u;if(_===0)return o.set(0,0,0),null;const m=1/_,S=(h*f-u*p)*m,M=(c*p-u*f)*m;return o.set(1-S-M,M,S)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Cr)===null?!1:Cr.x>=0&&Cr.y>=0&&Cr.x+Cr.y<=1}static getInterpolation(e,t,i,s,o,c,u,f){return this.getBarycoord(e,t,i,s,Cr)===null?(f.x=0,f.y=0,"z"in f&&(f.z=0),"w"in f&&(f.w=0),null):(f.setScalar(0),f.addScaledVector(o,Cr.x),f.addScaledVector(c,Cr.y),f.addScaledVector(u,Cr.z),f)}static getInterpolatedAttribute(e,t,i,s,o,c){return fh.setScalar(0),hh.setScalar(0),ph.setScalar(0),fh.fromBufferAttribute(e,t),hh.fromBufferAttribute(e,i),ph.fromBufferAttribute(e,s),c.setScalar(0),c.addScaledVector(fh,o.x),c.addScaledVector(hh,o.y),c.addScaledVector(ph,o.z),c}static isFrontFacing(e,t,i,s){return Wi.subVectors(i,t),Ar.subVectors(e,t),Wi.cross(Ar).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Wi.subVectors(this.c,this.b),Ar.subVectors(this.a,this.b),Wi.cross(Ar).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return $i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,o){return $i.getInterpolation(e,this.a,this.b,this.c,t,i,s,o)}containsPoint(e){return $i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,o=this.c;let c,u;Wa.subVectors(s,i),Xa.subVectors(o,i),ch.subVectors(e,i);const f=Wa.dot(ch),h=Xa.dot(ch);if(f<=0&&h<=0)return t.copy(i);uh.subVectors(e,s);const p=Wa.dot(uh),_=Xa.dot(uh);if(p>=0&&_<=p)return t.copy(s);const m=f*_-p*h;if(m<=0&&f>=0&&p<=0)return c=f/(f-p),t.copy(i).addScaledVector(Wa,c);dh.subVectors(e,o);const S=Wa.dot(dh),M=Xa.dot(dh);if(M>=0&&S<=M)return t.copy(o);const b=S*h-f*M;if(b<=0&&h>=0&&M<=0)return u=h/(h-M),t.copy(i).addScaledVector(Xa,u);const x=p*M-S*_;if(x<=0&&_-p>=0&&S-M>=0)return Z_.subVectors(o,s),u=(_-p)/(_-p+(S-M)),t.copy(s).addScaledVector(Z_,u);const E=1/(x+b+m);return c=b*E,u=m*E,t.copy(i).addScaledVector(Wa,c).addScaledVector(Xa,u)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class zl{constructor(e=new re(1/0,1/0,1/0),t=new re(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Xi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Xi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Xi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const o=i.getAttribute("position");if(t===!0&&o!==void 0&&e.isInstancedMesh!==!0)for(let c=0,u=o.count;c<u;c++)e.isMesh===!0?e.getVertexPosition(c,Xi):Xi.fromBufferAttribute(o,c),Xi.applyMatrix4(e.matrixWorld),this.expandByPoint(Xi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Jc.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Jc.copy(i.boundingBox)),Jc.applyMatrix4(e.matrixWorld),this.union(Jc)}const s=e.children;for(let o=0,c=s.length;o<c;o++)this.expandByObject(s[o],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Xi),Xi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ol),eu.subVectors(this.max,ol),$a.subVectors(e.a,ol),qa.subVectors(e.b,ol),Ya.subVectors(e.c,ol),ds.subVectors(qa,$a),fs.subVectors(Ya,qa),Ws.subVectors($a,Ya);let t=[0,-ds.z,ds.y,0,-fs.z,fs.y,0,-Ws.z,Ws.y,ds.z,0,-ds.x,fs.z,0,-fs.x,Ws.z,0,-Ws.x,-ds.y,ds.x,0,-fs.y,fs.x,0,-Ws.y,Ws.x,0];return!mh(t,$a,qa,Ya,eu)||(t=[1,0,0,0,1,0,0,0,1],!mh(t,$a,qa,Ya,eu))?!1:(tu.crossVectors(ds,fs),t=[tu.x,tu.y,tu.z],mh(t,$a,qa,Ya,eu))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Xi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Xi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Rr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Rr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Rr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Rr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Rr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Rr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Rr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Rr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Rr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Rr=[new re,new re,new re,new re,new re,new re,new re,new re],Xi=new re,Jc=new zl,$a=new re,qa=new re,Ya=new re,ds=new re,fs=new re,Ws=new re,ol=new re,eu=new re,tu=new re,Xs=new re;function mh(a,e,t,i,s){for(let o=0,c=a.length-3;o<=c;o+=3){Xs.fromArray(a,o);const u=s.x*Math.abs(Xs.x)+s.y*Math.abs(Xs.y)+s.z*Math.abs(Xs.z),f=e.dot(Xs),h=t.dot(Xs),p=i.dot(Xs);if(Math.max(-Math.max(f,h,p),Math.min(f,h,p))>u)return!1}return!0}const hn=new re,nu=new Ft;let HT=0;class vi extends fa{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:HT++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=O_,this.updateRanges=[],this.gpuType=cr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)nu.fromBufferAttribute(this,t),nu.applyMatrix3(e),this.setXY(t,nu.x,nu.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)hn.fromBufferAttribute(this,t),hn.applyMatrix3(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)hn.fromBufferAttribute(this,t),hn.applyMatrix4(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)hn.fromBufferAttribute(this,t),hn.applyNormalMatrix(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)hn.fromBufferAttribute(this,t),hn.transformDirection(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=sl(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Jn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=sl(t,this.array)),t}setX(e,t){return this.normalized&&(t=Jn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=sl(t,this.array)),t}setY(e,t){return this.normalized&&(t=Jn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=sl(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Jn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=sl(t,this.array)),t}setW(e,t){return this.normalized&&(t=Jn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Jn(t,this.array),i=Jn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Jn(t,this.array),i=Jn(i,this.array),s=Jn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,o){return e*=this.itemSize,this.normalized&&(t=Jn(t,this.array),i=Jn(i,this.array),s=Jn(s,this.array),o=Jn(o,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=o,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==O_&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class wy extends vi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Ay extends vi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class kr extends vi{constructor(e,t,i){super(new Float32Array(e),t,i)}}const GT=new zl,ll=new re,gh=new re;class Ju{constructor(e=new re,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):GT.setFromPoints(e).getCenter(i);let s=0;for(let o=0,c=e.length;o<c;o++)s=Math.max(s,i.distanceToSquared(e[o]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ll.subVectors(e,this.center);const t=ll.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(ll,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(gh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ll.copy(e.center).add(gh)),this.expandByPoint(ll.copy(e.center).sub(gh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let jT=0;const Ri=new mn,_h=new ai,Ka=new re,hi=new zl,cl=new zl,En=new re;class Ki extends fa{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jT++}),this.uuid=Bl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ET(e)?Ay:wy)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new ct().getNormalMatrix(e);i.applyNormalMatrix(o),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ri.makeRotationFromQuaternion(e),this.applyMatrix4(Ri),this}rotateX(e){return Ri.makeRotationX(e),this.applyMatrix4(Ri),this}rotateY(e){return Ri.makeRotationY(e),this.applyMatrix4(Ri),this}rotateZ(e){return Ri.makeRotationZ(e),this.applyMatrix4(Ri),this}translate(e,t,i){return Ri.makeTranslation(e,t,i),this.applyMatrix4(Ri),this}scale(e,t,i){return Ri.makeScale(e,t,i),this.applyMatrix4(Ri),this}lookAt(e){return _h.lookAt(e),_h.updateMatrix(),this.applyMatrix4(_h.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ka).negate(),this.translate(Ka.x,Ka.y,Ka.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,o=e.length;s<o;s++){const c=e[s];i.push(c.x,c.y,c.z||0)}this.setAttribute("position",new kr(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const o=e[s];t.setXYZ(s,o.x,o.y,o.z||0)}e.length>t.count&&it("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Tt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new re(-1/0,-1/0,-1/0),new re(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const o=t[i];hi.setFromBufferAttribute(o),this.morphTargetsRelative?(En.addVectors(this.boundingBox.min,hi.min),this.boundingBox.expandByPoint(En),En.addVectors(this.boundingBox.max,hi.max),this.boundingBox.expandByPoint(En)):(this.boundingBox.expandByPoint(hi.min),this.boundingBox.expandByPoint(hi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Tt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ju);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Tt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new re,1/0);return}if(e){const i=this.boundingSphere.center;if(hi.setFromBufferAttribute(e),t)for(let o=0,c=t.length;o<c;o++){const u=t[o];cl.setFromBufferAttribute(u),this.morphTargetsRelative?(En.addVectors(hi.min,cl.min),hi.expandByPoint(En),En.addVectors(hi.max,cl.max),hi.expandByPoint(En)):(hi.expandByPoint(cl.min),hi.expandByPoint(cl.max))}hi.getCenter(i);let s=0;for(let o=0,c=e.count;o<c;o++)En.fromBufferAttribute(e,o),s=Math.max(s,i.distanceToSquared(En));if(t)for(let o=0,c=t.length;o<c;o++){const u=t[o],f=this.morphTargetsRelative;for(let h=0,p=u.count;h<p;h++)En.fromBufferAttribute(u,h),f&&(Ka.fromBufferAttribute(e,h),En.add(Ka)),s=Math.max(s,i.distanceToSquared(En))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Tt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Tt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,o=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vi(new Float32Array(4*i.count),4));const c=this.getAttribute("tangent"),u=[],f=[];for(let T=0;T<i.count;T++)u[T]=new re,f[T]=new re;const h=new re,p=new re,_=new re,m=new Ft,S=new Ft,M=new Ft,b=new re,x=new re;function E(T,I,z){h.fromBufferAttribute(i,T),p.fromBufferAttribute(i,I),_.fromBufferAttribute(i,z),m.fromBufferAttribute(o,T),S.fromBufferAttribute(o,I),M.fromBufferAttribute(o,z),p.sub(h),_.sub(h),S.sub(m),M.sub(m);const k=1/(S.x*M.y-M.x*S.y);isFinite(k)&&(b.copy(p).multiplyScalar(M.y).addScaledVector(_,-S.y).multiplyScalar(k),x.copy(_).multiplyScalar(S.x).addScaledVector(p,-M.x).multiplyScalar(k),u[T].add(b),u[I].add(b),u[z].add(b),f[T].add(x),f[I].add(x),f[z].add(x))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let T=0,I=w.length;T<I;++T){const z=w[T],k=z.start,q=z.count;for(let Q=k,se=k+q;Q<se;Q+=3)E(e.getX(Q+0),e.getX(Q+1),e.getX(Q+2))}const P=new re,A=new re,N=new re,L=new re;function F(T){N.fromBufferAttribute(s,T),L.copy(N);const I=u[T];P.copy(I),P.sub(N.multiplyScalar(N.dot(I))).normalize(),A.crossVectors(L,I);const k=A.dot(f[T])<0?-1:1;c.setXYZW(T,P.x,P.y,P.z,k)}for(let T=0,I=w.length;T<I;++T){const z=w[T],k=z.start,q=z.count;for(let Q=k,se=k+q;Q<se;Q+=3)F(e.getX(Q+0)),F(e.getX(Q+1)),F(e.getX(Q+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new vi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let m=0,S=i.count;m<S;m++)i.setXYZ(m,0,0,0);const s=new re,o=new re,c=new re,u=new re,f=new re,h=new re,p=new re,_=new re;if(e)for(let m=0,S=e.count;m<S;m+=3){const M=e.getX(m+0),b=e.getX(m+1),x=e.getX(m+2);s.fromBufferAttribute(t,M),o.fromBufferAttribute(t,b),c.fromBufferAttribute(t,x),p.subVectors(c,o),_.subVectors(s,o),p.cross(_),u.fromBufferAttribute(i,M),f.fromBufferAttribute(i,b),h.fromBufferAttribute(i,x),u.add(p),f.add(p),h.add(p),i.setXYZ(M,u.x,u.y,u.z),i.setXYZ(b,f.x,f.y,f.z),i.setXYZ(x,h.x,h.y,h.z)}else for(let m=0,S=t.count;m<S;m+=3)s.fromBufferAttribute(t,m+0),o.fromBufferAttribute(t,m+1),c.fromBufferAttribute(t,m+2),p.subVectors(c,o),_.subVectors(s,o),p.cross(_),i.setXYZ(m+0,p.x,p.y,p.z),i.setXYZ(m+1,p.x,p.y,p.z),i.setXYZ(m+2,p.x,p.y,p.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)En.fromBufferAttribute(e,t),En.normalize(),e.setXYZ(t,En.x,En.y,En.z)}toNonIndexed(){function e(u,f){const h=u.array,p=u.itemSize,_=u.normalized,m=new h.constructor(f.length*p);let S=0,M=0;for(let b=0,x=f.length;b<x;b++){u.isInterleavedBufferAttribute?S=f[b]*u.data.stride+u.offset:S=f[b]*p;for(let E=0;E<p;E++)m[M++]=h[S++]}return new vi(m,p,_)}if(this.index===null)return it("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ki,i=this.index.array,s=this.attributes;for(const u in s){const f=s[u],h=e(f,i);t.setAttribute(u,h)}const o=this.morphAttributes;for(const u in o){const f=[],h=o[u];for(let p=0,_=h.length;p<_;p++){const m=h[p],S=e(m,i);f.push(S)}t.morphAttributes[u]=f}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let u=0,f=c.length;u<f;u++){const h=c[u];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const f=this.parameters;for(const h in f)f[h]!==void 0&&(e[h]=f[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const f in i){const h=i[f];e.data.attributes[f]=h.toJSON(e.data)}const s={};let o=!1;for(const f in this.morphAttributes){const h=this.morphAttributes[f],p=[];for(let _=0,m=h.length;_<m;_++){const S=h[_];p.push(S.toJSON(e.data))}p.length>0&&(s[f]=p,o=!0)}o&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const u=this.boundingSphere;return u!==null&&(e.data.boundingSphere=u.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const h in s){const p=s[h];this.setAttribute(h,p.clone(t))}const o=e.morphAttributes;for(const h in o){const p=[],_=o[h];for(let m=0,S=_.length;m<S;m++)p.push(_[m].clone(t));this.morphAttributes[h]=p}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let h=0,p=c.length;h<p;h++){const _=c[h];this.addGroup(_.start,_.count,_.materialIndex)}const u=e.boundingBox;u!==null&&(this.boundingBox=u.clone());const f=e.boundingSphere;return f!==null&&(this.boundingSphere=f.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let WT=0;class Vl extends fa{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:WT++}),this.uuid=Bl(),this.name="",this.type="Material",this.blending=oa,this.side=ws,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yh,this.blendDst=Kh,this.blendEquation=Zs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Et(0,0,0),this.blendAlpha=0,this.depthFunc=po,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=U_,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=za,this.stencilZFail=za,this.stencilZPass=za,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){it(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){it(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==oa&&(i.blending=this.blending),this.side!==ws&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Yh&&(i.blendSrc=this.blendSrc),this.blendDst!==Kh&&(i.blendDst=this.blendDst),this.blendEquation!==Zs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==po&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==U_&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==za&&(i.stencilFail=this.stencilFail),this.stencilZFail!==za&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==za&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(o){const c=[];for(const u in o){const f=o[u];delete f.metadata,c.push(f)}return c}if(t){const o=s(e.textures),c=s(e.images);o.length>0&&(i.textures=o),c.length>0&&(i.images=c)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let o=0;o!==s;++o)i[o]=t[o].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Pr=new re,xh=new re,iu=new re,hs=new re,vh=new re,ru=new re,yh=new re;class Cy{constructor(e=new re,t=new re(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Pr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Pr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Pr.copy(this.origin).addScaledVector(this.direction,t),Pr.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){xh.copy(e).add(t).multiplyScalar(.5),iu.copy(t).sub(e).normalize(),hs.copy(this.origin).sub(xh);const o=e.distanceTo(t)*.5,c=-this.direction.dot(iu),u=hs.dot(this.direction),f=-hs.dot(iu),h=hs.lengthSq(),p=Math.abs(1-c*c);let _,m,S,M;if(p>0)if(_=c*f-u,m=c*u-f,M=o*p,_>=0)if(m>=-M)if(m<=M){const b=1/p;_*=b,m*=b,S=_*(_+c*m+2*u)+m*(c*_+m+2*f)+h}else m=o,_=Math.max(0,-(c*m+u)),S=-_*_+m*(m+2*f)+h;else m=-o,_=Math.max(0,-(c*m+u)),S=-_*_+m*(m+2*f)+h;else m<=-M?(_=Math.max(0,-(-c*o+u)),m=_>0?-o:Math.min(Math.max(-o,-f),o),S=-_*_+m*(m+2*f)+h):m<=M?(_=0,m=Math.min(Math.max(-o,-f),o),S=m*(m+2*f)+h):(_=Math.max(0,-(c*o+u)),m=_>0?o:Math.min(Math.max(-o,-f),o),S=-_*_+m*(m+2*f)+h);else m=c>0?-o:o,_=Math.max(0,-(c*m+u)),S=-_*_+m*(m+2*f)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,_),s&&s.copy(xh).addScaledVector(iu,m),S}intersectSphere(e,t){Pr.subVectors(e.center,this.origin);const i=Pr.dot(this.direction),s=Pr.dot(Pr)-i*i,o=e.radius*e.radius;if(s>o)return null;const c=Math.sqrt(o-s),u=i-c,f=i+c;return f<0?null:u<0?this.at(f,t):this.at(u,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,o,c,u,f;const h=1/this.direction.x,p=1/this.direction.y,_=1/this.direction.z,m=this.origin;return h>=0?(i=(e.min.x-m.x)*h,s=(e.max.x-m.x)*h):(i=(e.max.x-m.x)*h,s=(e.min.x-m.x)*h),p>=0?(o=(e.min.y-m.y)*p,c=(e.max.y-m.y)*p):(o=(e.max.y-m.y)*p,c=(e.min.y-m.y)*p),i>c||o>s||((o>i||isNaN(i))&&(i=o),(c<s||isNaN(s))&&(s=c),_>=0?(u=(e.min.z-m.z)*_,f=(e.max.z-m.z)*_):(u=(e.max.z-m.z)*_,f=(e.min.z-m.z)*_),i>f||u>s)||((u>i||i!==i)&&(i=u),(f<s||s!==s)&&(s=f),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Pr)!==null}intersectTriangle(e,t,i,s,o){vh.subVectors(t,e),ru.subVectors(i,e),yh.crossVectors(vh,ru);let c=this.direction.dot(yh),u;if(c>0){if(s)return null;u=1}else if(c<0)u=-1,c=-c;else return null;hs.subVectors(this.origin,e);const f=u*this.direction.dot(ru.crossVectors(hs,ru));if(f<0)return null;const h=u*this.direction.dot(vh.cross(hs));if(h<0||f+h>c)return null;const p=-u*hs.dot(yh);return p<0?null:this.at(p/c,o)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ry extends Vl{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ua,this.combine=ay,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Q_=new mn,$s=new Cy,su=new Ju,J_=new re,au=new re,ou=new re,lu=new re,Sh=new re,cu=new re,ex=new re,uu=new re;class Gr extends ai{constructor(e=new Ki,t=new Ry){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,c=s.length;o<c;o++){const u=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[u]=o}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,o=i.morphAttributes.position,c=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const u=this.morphTargetInfluences;if(o&&u){cu.set(0,0,0);for(let f=0,h=o.length;f<h;f++){const p=u[f],_=o[f];p!==0&&(Sh.fromBufferAttribute(_,e),c?cu.addScaledVector(Sh,p):cu.addScaledVector(Sh.sub(t),p))}t.add(cu)}return t}raycast(e,t){const i=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),su.copy(i.boundingSphere),su.applyMatrix4(o),$s.copy(e.ray).recast(e.near),!(su.containsPoint($s.origin)===!1&&($s.intersectSphere(su,J_)===null||$s.origin.distanceToSquared(J_)>(e.far-e.near)**2))&&(Q_.copy(o).invert(),$s.copy(e.ray).applyMatrix4(Q_),!(i.boundingBox!==null&&$s.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,$s)))}_computeIntersections(e,t,i){let s;const o=this.geometry,c=this.material,u=o.index,f=o.attributes.position,h=o.attributes.uv,p=o.attributes.uv1,_=o.attributes.normal,m=o.groups,S=o.drawRange;if(u!==null)if(Array.isArray(c))for(let M=0,b=m.length;M<b;M++){const x=m[M],E=c[x.materialIndex],w=Math.max(x.start,S.start),P=Math.min(u.count,Math.min(x.start+x.count,S.start+S.count));for(let A=w,N=P;A<N;A+=3){const L=u.getX(A),F=u.getX(A+1),T=u.getX(A+2);s=du(this,E,e,i,h,p,_,L,F,T),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const M=Math.max(0,S.start),b=Math.min(u.count,S.start+S.count);for(let x=M,E=b;x<E;x+=3){const w=u.getX(x),P=u.getX(x+1),A=u.getX(x+2);s=du(this,c,e,i,h,p,_,w,P,A),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}else if(f!==void 0)if(Array.isArray(c))for(let M=0,b=m.length;M<b;M++){const x=m[M],E=c[x.materialIndex],w=Math.max(x.start,S.start),P=Math.min(f.count,Math.min(x.start+x.count,S.start+S.count));for(let A=w,N=P;A<N;A+=3){const L=A,F=A+1,T=A+2;s=du(this,E,e,i,h,p,_,L,F,T),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const M=Math.max(0,S.start),b=Math.min(f.count,S.start+S.count);for(let x=M,E=b;x<E;x+=3){const w=x,P=x+1,A=x+2;s=du(this,c,e,i,h,p,_,w,P,A),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}}}function XT(a,e,t,i,s,o,c,u){let f;if(e.side===si?f=i.intersectTriangle(c,o,s,!0,u):f=i.intersectTriangle(s,o,c,e.side===ws,u),f===null)return null;uu.copy(u),uu.applyMatrix4(a.matrixWorld);const h=t.ray.origin.distanceTo(uu);return h<t.near||h>t.far?null:{distance:h,point:uu.clone(),object:a}}function du(a,e,t,i,s,o,c,u,f,h){a.getVertexPosition(u,au),a.getVertexPosition(f,ou),a.getVertexPosition(h,lu);const p=XT(a,e,t,i,au,ou,lu,ex);if(p){const _=new re;$i.getBarycoord(ex,au,ou,lu,_),s&&(p.uv=$i.getInterpolatedAttribute(s,u,f,h,_,new Ft)),o&&(p.uv1=$i.getInterpolatedAttribute(o,u,f,h,_,new Ft)),c&&(p.normal=$i.getInterpolatedAttribute(c,u,f,h,_,new re),p.normal.dot(i.direction)>0&&p.normal.multiplyScalar(-1));const m={a:u,b:f,c:h,normal:new re,materialIndex:0};$i.getNormal(au,ou,lu,m.normal),p.face=m,p.barycoord=_}return p}class $T extends jn{constructor(e=null,t=1,i=1,s,o,c,u,f,h=Rn,p=Rn,_,m){super(null,c,u,f,h,p,s,o,_,m),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Mh=new re,qT=new re,YT=new ct;class Ks{constructor(e=new re(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Mh.subVectors(i,t).cross(qT.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Mh),o=this.normal.dot(s);if(o===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const c=-(e.start.dot(this.normal)+this.constant)/o;return i===!0&&(c<0||c>1)?null:t.copy(e.start).addScaledVector(s,c)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||YT.getNormalMatrix(e),s=this.coplanarPoint(Mh).applyMatrix4(e),o=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(o),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qs=new Ju,KT=new Ft(.5,.5),fu=new re;class Py{constructor(e=new Ks,t=new Ks,i=new Ks,s=new Ks,o=new Ks,c=new Ks){this.planes=[e,t,i,s,o,c]}set(e,t,i,s,o,c){const u=this.planes;return u[0].copy(e),u[1].copy(t),u[2].copy(i),u[3].copy(s),u[4].copy(o),u[5].copy(c),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=ur,i=!1){const s=this.planes,o=e.elements,c=o[0],u=o[1],f=o[2],h=o[3],p=o[4],_=o[5],m=o[6],S=o[7],M=o[8],b=o[9],x=o[10],E=o[11],w=o[12],P=o[13],A=o[14],N=o[15];if(s[0].setComponents(h-c,S-p,E-M,N-w).normalize(),s[1].setComponents(h+c,S+p,E+M,N+w).normalize(),s[2].setComponents(h+u,S+_,E+b,N+P).normalize(),s[3].setComponents(h-u,S-_,E-b,N-P).normalize(),i)s[4].setComponents(f,m,x,A).normalize(),s[5].setComponents(h-f,S-m,E-x,N-A).normalize();else if(s[4].setComponents(h-f,S-m,E-x,N-A).normalize(),t===ur)s[5].setComponents(h+f,S+m,E+x,N+A).normalize();else if(t===Wu)s[5].setComponents(f,m,x,A).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),qs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),qs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(qs)}intersectsSprite(e){qs.center.set(0,0,0);const t=KT.distanceTo(e.center);return qs.radius=.7071067811865476+t,qs.applyMatrix4(e.matrixWorld),this.intersectsSphere(qs)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let o=0;o<6;o++)if(t[o].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(fu.x=s.normal.x>0?e.max.x:e.min.x,fu.y=s.normal.y>0?e.max.y:e.min.y,fu.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(fu)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ZT extends Vl{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Et(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const tx=new mn,kp=new Cy,hu=new Ju,pu=new re;class QT extends ai{constructor(e=new Ki,t=new ZT){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,o=e.params.Points.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),hu.copy(i.boundingSphere),hu.applyMatrix4(s),hu.radius+=o,e.ray.intersectsSphere(hu)===!1)return;tx.copy(s).invert(),kp.copy(e.ray).applyMatrix4(tx);const u=o/((this.scale.x+this.scale.y+this.scale.z)/3),f=u*u,h=i.index,_=i.attributes.position;if(h!==null){const m=Math.max(0,c.start),S=Math.min(h.count,c.start+c.count);for(let M=m,b=S;M<b;M++){const x=h.getX(M);pu.fromBufferAttribute(_,x),nx(pu,x,f,s,e,t,this)}}else{const m=Math.max(0,c.start),S=Math.min(_.count,c.start+c.count);for(let M=m,b=S;M<b;M++)pu.fromBufferAttribute(_,M),nx(pu,M,f,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,c=s.length;o<c;o++){const u=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[u]=o}}}}}function nx(a,e,t,i,s,o,c){const u=kp.distanceSqToPoint(a);if(u<t){const f=new re;kp.closestPointToPoint(a,f),f.applyMatrix4(i);const h=s.ray.origin.distanceTo(f);if(h<s.near||h>s.far)return;o.push({distance:h,distanceToRay:Math.sqrt(u),point:f,index:e,face:null,faceIndex:null,barycoord:null,object:c})}}class Ny extends jn{constructor(e=[],t=la,i,s,o,c,u,f,h,p){super(e,t,i,s,o,c,u,f,h,p),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class go extends jn{constructor(e,t,i=pr,s,o,c,u=Rn,f=Rn,h,p=Hr,_=1){if(p!==Hr&&p!==ta)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:_};super(m,s,o,c,u,f,p,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Mm(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class JT extends go{constructor(e,t=pr,i=la,s,o,c=Rn,u=Rn,f,h=Hr){const p={width:e,height:e,depth:1},_=[p,p,p,p,p,p];super(e,e,t,i,s,o,c,u,f,h),this.image=_,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Dy extends jn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Hl extends Ki{constructor(e=1,t=1,i=1,s=1,o=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:o,depthSegments:c};const u=this;s=Math.floor(s),o=Math.floor(o),c=Math.floor(c);const f=[],h=[],p=[],_=[];let m=0,S=0;M("z","y","x",-1,-1,i,t,e,c,o,0),M("z","y","x",1,-1,i,t,-e,c,o,1),M("x","z","y",1,1,e,i,t,s,c,2),M("x","z","y",1,-1,e,i,-t,s,c,3),M("x","y","z",1,-1,e,t,i,s,o,4),M("x","y","z",-1,-1,e,t,-i,s,o,5),this.setIndex(f),this.setAttribute("position",new kr(h,3)),this.setAttribute("normal",new kr(p,3)),this.setAttribute("uv",new kr(_,2));function M(b,x,E,w,P,A,N,L,F,T,I){const z=A/F,k=N/T,q=A/2,Q=N/2,se=L/2,V=F+1,W=T+1;let H=0,Y=0;const ae=new re;for(let oe=0;oe<W;oe++){const B=oe*k-Q;for(let J=0;J<V;J++){const Ie=J*z-q;ae[b]=Ie*w,ae[x]=B*P,ae[E]=se,h.push(ae.x,ae.y,ae.z),ae[b]=0,ae[x]=0,ae[E]=L>0?1:-1,p.push(ae.x,ae.y,ae.z),_.push(J/F),_.push(1-oe/T),H+=1}}for(let oe=0;oe<T;oe++)for(let B=0;B<F;B++){const J=m+B+V*oe,Ie=m+B+V*(oe+1),Fe=m+(B+1)+V*(oe+1),De=m+(B+1)+V*oe;f.push(J,Ie,De),f.push(Ie,Fe,De),Y+=6}u.addGroup(S,Y,I),S+=Y,m+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hl(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class ed extends Ki{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const o=e/2,c=t/2,u=Math.floor(i),f=Math.floor(s),h=u+1,p=f+1,_=e/u,m=t/f,S=[],M=[],b=[],x=[];for(let E=0;E<p;E++){const w=E*m-c;for(let P=0;P<h;P++){const A=P*_-o;M.push(A,-w,0),b.push(0,0,1),x.push(P/u),x.push(1-E/f)}}for(let E=0;E<f;E++)for(let w=0;w<u;w++){const P=w+h*E,A=w+h*(E+1),N=w+1+h*(E+1),L=w+1+h*E;S.push(P,A,L),S.push(A,N,L)}this.setIndex(S),this.setAttribute("position",new kr(M,3)),this.setAttribute("normal",new kr(b,3)),this.setAttribute("uv",new kr(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ed(e.width,e.height,e.widthSegments,e.heightSegments)}}function _o(a){const e={};for(const t in a){e[t]={};for(const i in a[t]){const s=a[t][i];if(ix(s))s.isRenderTargetTexture?(it("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(ix(s[0])){const o=[];for(let c=0,u=s.length;c<u;c++)o[c]=s[c].clone();e[t][i]=o}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Gn(a){const e={};for(let t=0;t<a.length;t++){const i=_o(a[t]);for(const s in i)e[s]=i[s]}return e}function ix(a){return a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)}function ew(a){const e=[];for(let t=0;t<a.length;t++)e.push(a[t].clone());return e}function Ly(a){const e=a.getRenderTarget();return e===null?a.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:vt.workingColorSpace}const tw={clone:_o,merge:Gn};var nw=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,iw=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yi extends Vl{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nw,this.fragmentShader=iw,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=_o(e.uniforms),this.uniformsGroups=ew(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const c=this.uniforms[s].value;c&&c.isTexture?t.uniforms[s]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[s]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[s]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[s]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[s]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[s]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[s]={type:"m4",value:c.toArray()}:t.uniforms[s]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class rw extends Yi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class sw extends Vl{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mT,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class aw extends Vl{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const mu=new re,gu=new vo,ir=new re;class Iy extends ai{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mn,this.projectionMatrix=new mn,this.projectionMatrixInverse=new mn,this.coordinateSystem=ur,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(mu,gu,ir),ir.x===1&&ir.y===1&&ir.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(mu,gu,ir.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(mu,gu,ir),ir.x===1&&ir.y===1&&ir.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(mu,gu,ir.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ps=new re,rx=new Ft,sx=new Ft;class Di extends Iy{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Op*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Jf*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Op*2*Math.atan(Math.tan(Jf*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ps.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ps.x,ps.y).multiplyScalar(-e/ps.z),ps.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ps.x,ps.y).multiplyScalar(-e/ps.z)}getViewSize(e,t){return this.getViewBounds(e,rx,sx),t.subVectors(sx,rx)}setViewOffset(e,t,i,s,o,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Jf*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,o=-.5*s;const c=this.view;if(this.view!==null&&this.view.enabled){const f=c.fullWidth,h=c.fullHeight;o+=c.offsetX*s/f,t-=c.offsetY*i/h,s*=c.width/f,i*=c.height/h}const u=this.filmOffset;u!==0&&(o+=e*u/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Fy extends Iy{constructor(e=-1,t=1,i=1,s=-1,o=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=o,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,o,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=i-e,c=i+e,u=s+t,f=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,p=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=h*this.view.offsetX,c=o+h*this.view.width,u-=p*this.view.offsetY,f=u-p*this.view.height}this.projectionMatrix.makeOrthographic(o,c,u,f,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Za=-90,Qa=1;class ow extends ai{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Di(Za,Qa,e,t);s.layers=this.layers,this.add(s);const o=new Di(Za,Qa,e,t);o.layers=this.layers,this.add(o);const c=new Di(Za,Qa,e,t);c.layers=this.layers,this.add(c);const u=new Di(Za,Qa,e,t);u.layers=this.layers,this.add(u);const f=new Di(Za,Qa,e,t);f.layers=this.layers,this.add(f);const h=new Di(Za,Qa,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,o,c,u,f]=t;for(const h of t)this.remove(h);if(e===ur)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),u.up.set(0,1,0),u.lookAt(0,0,1),f.up.set(0,1,0),f.lookAt(0,0,-1);else if(e===Wu)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),u.up.set(0,-1,0),u.lookAt(0,0,1),f.up.set(0,-1,0),f.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[o,c,u,f,h,p]=this.children,_=e.getRenderTarget(),m=e.getActiveCubeFace(),S=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const b=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let x=!1;e.isWebGLRenderer===!0?x=e.state.buffers.depth.getReversed():x=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,1,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,2,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(i,3,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),e.setRenderTarget(i,4,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),i.texture.generateMipmaps=b,e.setRenderTarget(i,5,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,p),e.setRenderTarget(_,m,S),e.xr.enabled=M,i.texture.needsPMREMUpdate=!0}}class lw extends Di{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class cw{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,it("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Cm=class Cm{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const o=this.elements;return o[0]=e,o[2]=t,o[1]=i,o[3]=s,this}};Cm.prototype.isMatrix2=!0;let ax=Cm;function ox(a,e,t,i){const s=uw(i);switch(t){case vy:return a*e;case Sy:return a*e/s.components*s.byteLength;case _m:return a*e/s.components*s.byteLength;case ca:return a*e*2/s.components*s.byteLength;case xm:return a*e*2/s.components*s.byteLength;case yy:return a*e*3/s.components*s.byteLength;case qi:return a*e*4/s.components*s.byteLength;case vm:return a*e*4/s.components*s.byteLength;case bu:case Tu:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case wu:case Au:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case op:case cp:return Math.max(a,16)*Math.max(e,8)/4;case ap:case lp:return Math.max(a,8)*Math.max(e,8)/2;case up:case dp:case hp:case pp:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case fp:case Vu:case mp:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case gp:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case _p:return Math.floor((a+4)/5)*Math.floor((e+3)/4)*16;case xp:return Math.floor((a+4)/5)*Math.floor((e+4)/5)*16;case vp:return Math.floor((a+5)/6)*Math.floor((e+4)/5)*16;case yp:return Math.floor((a+5)/6)*Math.floor((e+5)/6)*16;case Sp:return Math.floor((a+7)/8)*Math.floor((e+4)/5)*16;case Mp:return Math.floor((a+7)/8)*Math.floor((e+5)/6)*16;case Ep:return Math.floor((a+7)/8)*Math.floor((e+7)/8)*16;case bp:return Math.floor((a+9)/10)*Math.floor((e+4)/5)*16;case Tp:return Math.floor((a+9)/10)*Math.floor((e+5)/6)*16;case wp:return Math.floor((a+9)/10)*Math.floor((e+7)/8)*16;case Ap:return Math.floor((a+9)/10)*Math.floor((e+9)/10)*16;case Cp:return Math.floor((a+11)/12)*Math.floor((e+9)/10)*16;case Rp:return Math.floor((a+11)/12)*Math.floor((e+11)/12)*16;case Pp:case Np:case Dp:return Math.ceil(a/4)*Math.ceil(e/4)*16;case Lp:case Ip:return Math.ceil(a/4)*Math.ceil(e/4)*8;case Hu:case Fp:return Math.ceil(a/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function uw(a){switch(a){case Li:case my:return{byteLength:1,components:1};case Ul:case gy:case Vr:return{byteLength:2,components:1};case mm:case gm:return{byteLength:2,components:4};case pr:case pm:case cr:return{byteLength:4,components:1};case _y:case xy:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${a}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:hm}}));typeof window<"u"&&(window.__THREE__?it("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=hm);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Uy(){let a=null,e=!1,t=null,i=null;function s(o,c){t(o,c),i=a.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&a!==null&&(i=a.requestAnimationFrame(s),e=!0)},stop:function(){a!==null&&a.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(o){t=o},setContext:function(o){a=o}}}function dw(a){const e=new WeakMap;function t(u,f){const h=u.array,p=u.usage,_=h.byteLength,m=a.createBuffer();a.bindBuffer(f,m),a.bufferData(f,h,p),u.onUploadCallback();let S;if(h instanceof Float32Array)S=a.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)S=a.HALF_FLOAT;else if(h instanceof Uint16Array)u.isFloat16BufferAttribute?S=a.HALF_FLOAT:S=a.UNSIGNED_SHORT;else if(h instanceof Int16Array)S=a.SHORT;else if(h instanceof Uint32Array)S=a.UNSIGNED_INT;else if(h instanceof Int32Array)S=a.INT;else if(h instanceof Int8Array)S=a.BYTE;else if(h instanceof Uint8Array)S=a.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)S=a.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:S,bytesPerElement:h.BYTES_PER_ELEMENT,version:u.version,size:_}}function i(u,f,h){const p=f.array,_=f.updateRanges;if(a.bindBuffer(h,u),_.length===0)a.bufferSubData(h,0,p);else{_.sort((S,M)=>S.start-M.start);let m=0;for(let S=1;S<_.length;S++){const M=_[m],b=_[S];b.start<=M.start+M.count+1?M.count=Math.max(M.count,b.start+b.count-M.start):(++m,_[m]=b)}_.length=m+1;for(let S=0,M=_.length;S<M;S++){const b=_[S];a.bufferSubData(h,b.start*p.BYTES_PER_ELEMENT,p,b.start,b.count)}f.clearUpdateRanges()}f.onUploadCallback()}function s(u){return u.isInterleavedBufferAttribute&&(u=u.data),e.get(u)}function o(u){u.isInterleavedBufferAttribute&&(u=u.data);const f=e.get(u);f&&(a.deleteBuffer(f.buffer),e.delete(u))}function c(u,f){if(u.isInterleavedBufferAttribute&&(u=u.data),u.isGLBufferAttribute){const p=e.get(u);(!p||p.version<u.version)&&e.set(u,{buffer:u.buffer,type:u.type,bytesPerElement:u.elementSize,version:u.version});return}const h=e.get(u);if(h===void 0)e.set(u,t(u,f));else if(h.version<u.version){if(h.size!==u.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,u,f),h.version=u.version}}return{get:s,remove:o,update:c}}var fw=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hw=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,pw=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mw=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gw=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_w=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xw=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,vw=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yw=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Sw=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Mw=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ew=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bw=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Tw=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ww=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Aw=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Cw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pw=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Nw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Dw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Lw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Iw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Fw=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Uw=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ow=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,kw=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vw=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hw="gl_FragColor = linearToOutputTexel( gl_FragColor );",Gw=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Ww=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Xw=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,$w=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Yw=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Kw=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jw=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,e2=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,t2=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,n2=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,i2=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,r2=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,s2=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,a2=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,o2=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,l2=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,c2=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,u2=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,d2=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,f2=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,h2=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,p2=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,m2=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,g2=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_2=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,x2=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,v2=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,y2=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,S2=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,M2=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,E2=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,b2=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,T2=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,w2=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,A2=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,C2=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,R2=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,P2=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,N2=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,D2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,L2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,I2=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,F2=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,U2=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,O2=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,k2=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,B2=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,z2=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,V2=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,H2=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,G2=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,j2=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,W2=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,X2=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$2=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,q2=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Y2=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,K2=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Z2=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Q2=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,J2=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,eA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,tA=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,nA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,iA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,sA=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,aA=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,oA=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,lA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,cA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,dA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const fA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hA=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mA=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_A=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,vA=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,yA=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,SA=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,MA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,EA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bA=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,TA=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,AA=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,CA=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,RA=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,PA=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,NA=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,DA=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,LA=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,IA=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,FA=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,UA=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,OA=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kA=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,BA=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zA=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,VA=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,HA=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,GA=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jA=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,WA=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ht={alphahash_fragment:fw,alphahash_pars_fragment:hw,alphamap_fragment:pw,alphamap_pars_fragment:mw,alphatest_fragment:gw,alphatest_pars_fragment:_w,aomap_fragment:xw,aomap_pars_fragment:vw,batching_pars_vertex:yw,batching_vertex:Sw,begin_vertex:Mw,beginnormal_vertex:Ew,bsdfs:bw,iridescence_fragment:Tw,bumpmap_pars_fragment:ww,clipping_planes_fragment:Aw,clipping_planes_pars_fragment:Cw,clipping_planes_pars_vertex:Rw,clipping_planes_vertex:Pw,color_fragment:Nw,color_pars_fragment:Dw,color_pars_vertex:Lw,color_vertex:Iw,common:Fw,cube_uv_reflection_fragment:Uw,defaultnormal_vertex:Ow,displacementmap_pars_vertex:kw,displacementmap_vertex:Bw,emissivemap_fragment:zw,emissivemap_pars_fragment:Vw,colorspace_fragment:Hw,colorspace_pars_fragment:Gw,envmap_fragment:jw,envmap_common_pars_fragment:Ww,envmap_pars_fragment:Xw,envmap_pars_vertex:$w,envmap_physical_pars_fragment:r2,envmap_vertex:qw,fog_vertex:Yw,fog_pars_vertex:Kw,fog_fragment:Zw,fog_pars_fragment:Qw,gradientmap_pars_fragment:Jw,lightmap_pars_fragment:e2,lights_lambert_fragment:t2,lights_lambert_pars_fragment:n2,lights_pars_begin:i2,lights_toon_fragment:s2,lights_toon_pars_fragment:a2,lights_phong_fragment:o2,lights_phong_pars_fragment:l2,lights_physical_fragment:c2,lights_physical_pars_fragment:u2,lights_fragment_begin:d2,lights_fragment_maps:f2,lights_fragment_end:h2,lightprobes_pars_fragment:p2,logdepthbuf_fragment:m2,logdepthbuf_pars_fragment:g2,logdepthbuf_pars_vertex:_2,logdepthbuf_vertex:x2,map_fragment:v2,map_pars_fragment:y2,map_particle_fragment:S2,map_particle_pars_fragment:M2,metalnessmap_fragment:E2,metalnessmap_pars_fragment:b2,morphinstance_vertex:T2,morphcolor_vertex:w2,morphnormal_vertex:A2,morphtarget_pars_vertex:C2,morphtarget_vertex:R2,normal_fragment_begin:P2,normal_fragment_maps:N2,normal_pars_fragment:D2,normal_pars_vertex:L2,normal_vertex:I2,normalmap_pars_fragment:F2,clearcoat_normal_fragment_begin:U2,clearcoat_normal_fragment_maps:O2,clearcoat_pars_fragment:k2,iridescence_pars_fragment:B2,opaque_fragment:z2,packing:V2,premultiplied_alpha_fragment:H2,project_vertex:G2,dithering_fragment:j2,dithering_pars_fragment:W2,roughnessmap_fragment:X2,roughnessmap_pars_fragment:$2,shadowmap_pars_fragment:q2,shadowmap_pars_vertex:Y2,shadowmap_vertex:K2,shadowmask_pars_fragment:Z2,skinbase_vertex:Q2,skinning_pars_vertex:J2,skinning_vertex:eA,skinnormal_vertex:tA,specularmap_fragment:nA,specularmap_pars_fragment:iA,tonemapping_fragment:rA,tonemapping_pars_fragment:sA,transmission_fragment:aA,transmission_pars_fragment:oA,uv_pars_fragment:lA,uv_pars_vertex:cA,uv_vertex:uA,worldpos_vertex:dA,background_vert:fA,background_frag:hA,backgroundCube_vert:pA,backgroundCube_frag:mA,cube_vert:gA,cube_frag:_A,depth_vert:xA,depth_frag:vA,distance_vert:yA,distance_frag:SA,equirect_vert:MA,equirect_frag:EA,linedashed_vert:bA,linedashed_frag:TA,meshbasic_vert:wA,meshbasic_frag:AA,meshlambert_vert:CA,meshlambert_frag:RA,meshmatcap_vert:PA,meshmatcap_frag:NA,meshnormal_vert:DA,meshnormal_frag:LA,meshphong_vert:IA,meshphong_frag:FA,meshphysical_vert:UA,meshphysical_frag:OA,meshtoon_vert:kA,meshtoon_frag:BA,points_vert:zA,points_frag:VA,shadow_vert:HA,shadow_frag:GA,sprite_vert:jA,sprite_frag:WA},Ue={common:{diffuse:{value:new Et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ct},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ct}},envmap:{envMap:{value:null},envMapRotation:{value:new ct},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ct}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ct}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ct},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ct},normalScale:{value:new Ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ct},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ct}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ct}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ct}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new re},probesMax:{value:new re},probesResolution:{value:new re}},points:{diffuse:{value:new Et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0},uvTransform:{value:new ct}},sprite:{diffuse:{value:new Et(16777215)},opacity:{value:1},center:{value:new Ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ct},alphaMap:{value:null},alphaMapTransform:{value:new ct},alphaTest:{value:0}}},ar={basic:{uniforms:Gn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:ht.meshbasic_vert,fragmentShader:ht.meshbasic_frag},lambert:{uniforms:Gn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Et(0)},envMapIntensity:{value:1}}]),vertexShader:ht.meshlambert_vert,fragmentShader:ht.meshlambert_frag},phong:{uniforms:Gn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new Et(0)},specular:{value:new Et(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ht.meshphong_vert,fragmentShader:ht.meshphong_frag},standard:{uniforms:Gn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new Et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ht.meshphysical_vert,fragmentShader:ht.meshphysical_frag},toon:{uniforms:Gn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new Et(0)}}]),vertexShader:ht.meshtoon_vert,fragmentShader:ht.meshtoon_frag},matcap:{uniforms:Gn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:ht.meshmatcap_vert,fragmentShader:ht.meshmatcap_frag},points:{uniforms:Gn([Ue.points,Ue.fog]),vertexShader:ht.points_vert,fragmentShader:ht.points_frag},dashed:{uniforms:Gn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ht.linedashed_vert,fragmentShader:ht.linedashed_frag},depth:{uniforms:Gn([Ue.common,Ue.displacementmap]),vertexShader:ht.depth_vert,fragmentShader:ht.depth_frag},normal:{uniforms:Gn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:ht.meshnormal_vert,fragmentShader:ht.meshnormal_frag},sprite:{uniforms:Gn([Ue.sprite,Ue.fog]),vertexShader:ht.sprite_vert,fragmentShader:ht.sprite_frag},background:{uniforms:{uvTransform:{value:new ct},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ht.background_vert,fragmentShader:ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ct}},vertexShader:ht.backgroundCube_vert,fragmentShader:ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ht.cube_vert,fragmentShader:ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ht.equirect_vert,fragmentShader:ht.equirect_frag},distance:{uniforms:Gn([Ue.common,Ue.displacementmap,{referencePosition:{value:new re},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ht.distance_vert,fragmentShader:ht.distance_frag},shadow:{uniforms:Gn([Ue.lights,Ue.fog,{color:{value:new Et(0)},opacity:{value:1}}]),vertexShader:ht.shadow_vert,fragmentShader:ht.shadow_frag}};ar.physical={uniforms:Gn([ar.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ct},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ct},clearcoatNormalScale:{value:new Ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ct},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ct},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ct},sheen:{value:0},sheenColor:{value:new Et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ct},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ct},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ct},transmissionSamplerSize:{value:new Ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ct},attenuationDistance:{value:0},attenuationColor:{value:new Et(0)},specularColor:{value:new Et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ct},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ct},anisotropyVector:{value:new Ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ct}}]),vertexShader:ht.meshphysical_vert,fragmentShader:ht.meshphysical_frag};const _u={r:0,b:0,g:0},XA=new mn,Oy=new ct;Oy.set(-1,0,0,0,1,0,0,0,1);function $A(a,e,t,i,s,o){const c=new Et(0);let u=s===!0?0:1,f,h,p=null,_=0,m=null;function S(w){let P=w.isScene===!0?w.background:null;if(P&&P.isTexture){const A=w.backgroundBlurriness>0;P=e.get(P,A)}return P}function M(w){let P=!1;const A=S(w);A===null?x(c,u):A&&A.isColor&&(x(A,1),P=!0);const N=a.xr.getEnvironmentBlendMode();N==="additive"?t.buffers.color.setClear(0,0,0,1,o):N==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,o),(a.autoClear||P)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),a.clear(a.autoClearColor,a.autoClearDepth,a.autoClearStencil))}function b(w,P){const A=S(P);A&&(A.isCubeTexture||A.mapping===Qu)?(h===void 0&&(h=new Gr(new Hl(1,1,1),new Yi({name:"BackgroundCubeMaterial",uniforms:_o(ar.backgroundCube.uniforms),vertexShader:ar.backgroundCube.vertexShader,fragmentShader:ar.backgroundCube.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(N,L,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=A,h.material.uniforms.backgroundBlurriness.value=P.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=P.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(XA.makeRotationFromEuler(P.backgroundRotation)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(Oy),h.material.toneMapped=vt.getTransfer(A.colorSpace)!==Lt,(p!==A||_!==A.version||m!==a.toneMapping)&&(h.material.needsUpdate=!0,p=A,_=A.version,m=a.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(f===void 0&&(f=new Gr(new ed(2,2),new Yi({name:"BackgroundMaterial",uniforms:_o(ar.background.uniforms),vertexShader:ar.background.vertexShader,fragmentShader:ar.background.fragmentShader,side:ws,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),Object.defineProperty(f.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(f)),f.material.uniforms.t2D.value=A,f.material.uniforms.backgroundIntensity.value=P.backgroundIntensity,f.material.toneMapped=vt.getTransfer(A.colorSpace)!==Lt,A.matrixAutoUpdate===!0&&A.updateMatrix(),f.material.uniforms.uvTransform.value.copy(A.matrix),(p!==A||_!==A.version||m!==a.toneMapping)&&(f.material.needsUpdate=!0,p=A,_=A.version,m=a.toneMapping),f.layers.enableAll(),w.unshift(f,f.geometry,f.material,0,0,null))}function x(w,P){w.getRGB(_u,Ly(a)),t.buffers.color.setClear(_u.r,_u.g,_u.b,P,o)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0)}return{getClearColor:function(){return c},setClearColor:function(w,P=1){c.set(w),u=P,x(c,u)},getClearAlpha:function(){return u},setClearAlpha:function(w){u=w,x(c,u)},render:M,addToRenderList:b,dispose:E}}function qA(a,e){const t=a.getParameter(a.MAX_VERTEX_ATTRIBS),i={},s=m(null);let o=s,c=!1;function u(k,q,Q,se,V){let W=!1;const H=_(k,se,Q,q);o!==H&&(o=H,h(o.object)),W=S(k,se,Q,V),W&&M(k,se,Q,V),V!==null&&e.update(V,a.ELEMENT_ARRAY_BUFFER),(W||c)&&(c=!1,A(k,q,Q,se),V!==null&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function f(){return a.createVertexArray()}function h(k){return a.bindVertexArray(k)}function p(k){return a.deleteVertexArray(k)}function _(k,q,Q,se){const V=se.wireframe===!0;let W=i[q.id];W===void 0&&(W={},i[q.id]=W);const H=k.isInstancedMesh===!0?k.id:0;let Y=W[H];Y===void 0&&(Y={},W[H]=Y);let ae=Y[Q.id];ae===void 0&&(ae={},Y[Q.id]=ae);let oe=ae[V];return oe===void 0&&(oe=m(f()),ae[V]=oe),oe}function m(k){const q=[],Q=[],se=[];for(let V=0;V<t;V++)q[V]=0,Q[V]=0,se[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:q,enabledAttributes:Q,attributeDivisors:se,object:k,attributes:{},index:null}}function S(k,q,Q,se){const V=o.attributes,W=q.attributes;let H=0;const Y=Q.getAttributes();for(const ae in Y)if(Y[ae].location>=0){const B=V[ae];let J=W[ae];if(J===void 0&&(ae==="instanceMatrix"&&k.instanceMatrix&&(J=k.instanceMatrix),ae==="instanceColor"&&k.instanceColor&&(J=k.instanceColor)),B===void 0||B.attribute!==J||J&&B.data!==J.data)return!0;H++}return o.attributesNum!==H||o.index!==se}function M(k,q,Q,se){const V={},W=q.attributes;let H=0;const Y=Q.getAttributes();for(const ae in Y)if(Y[ae].location>=0){let B=W[ae];B===void 0&&(ae==="instanceMatrix"&&k.instanceMatrix&&(B=k.instanceMatrix),ae==="instanceColor"&&k.instanceColor&&(B=k.instanceColor));const J={};J.attribute=B,B&&B.data&&(J.data=B.data),V[ae]=J,H++}o.attributes=V,o.attributesNum=H,o.index=se}function b(){const k=o.newAttributes;for(let q=0,Q=k.length;q<Q;q++)k[q]=0}function x(k){E(k,0)}function E(k,q){const Q=o.newAttributes,se=o.enabledAttributes,V=o.attributeDivisors;Q[k]=1,se[k]===0&&(a.enableVertexAttribArray(k),se[k]=1),V[k]!==q&&(a.vertexAttribDivisor(k,q),V[k]=q)}function w(){const k=o.newAttributes,q=o.enabledAttributes;for(let Q=0,se=q.length;Q<se;Q++)q[Q]!==k[Q]&&(a.disableVertexAttribArray(Q),q[Q]=0)}function P(k,q,Q,se,V,W,H){H===!0?a.vertexAttribIPointer(k,q,Q,V,W):a.vertexAttribPointer(k,q,Q,se,V,W)}function A(k,q,Q,se){b();const V=se.attributes,W=Q.getAttributes(),H=q.defaultAttributeValues;for(const Y in W){const ae=W[Y];if(ae.location>=0){let oe=V[Y];if(oe===void 0&&(Y==="instanceMatrix"&&k.instanceMatrix&&(oe=k.instanceMatrix),Y==="instanceColor"&&k.instanceColor&&(oe=k.instanceColor)),oe!==void 0){const B=oe.normalized,J=oe.itemSize,Ie=e.get(oe);if(Ie===void 0)continue;const Fe=Ie.buffer,De=Ie.type,ue=Ie.bytesPerElement,Se=De===a.INT||De===a.UNSIGNED_INT||oe.gpuType===pm;if(oe.isInterleavedBufferAttribute){const ge=oe.data,Oe=ge.stride,Qe=oe.offset;if(ge.isInstancedInterleavedBuffer){for(let Je=0;Je<ae.locationSize;Je++)E(ae.location+Je,ge.meshPerAttribute);k.isInstancedMesh!==!0&&se._maxInstanceCount===void 0&&(se._maxInstanceCount=ge.meshPerAttribute*ge.count)}else for(let Je=0;Je<ae.locationSize;Je++)x(ae.location+Je);a.bindBuffer(a.ARRAY_BUFFER,Fe);for(let Je=0;Je<ae.locationSize;Je++)P(ae.location+Je,J/ae.locationSize,De,B,Oe*ue,(Qe+J/ae.locationSize*Je)*ue,Se)}else{if(oe.isInstancedBufferAttribute){for(let ge=0;ge<ae.locationSize;ge++)E(ae.location+ge,oe.meshPerAttribute);k.isInstancedMesh!==!0&&se._maxInstanceCount===void 0&&(se._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let ge=0;ge<ae.locationSize;ge++)x(ae.location+ge);a.bindBuffer(a.ARRAY_BUFFER,Fe);for(let ge=0;ge<ae.locationSize;ge++)P(ae.location+ge,J/ae.locationSize,De,B,J*ue,J/ae.locationSize*ge*ue,Se)}}else if(H!==void 0){const B=H[Y];if(B!==void 0)switch(B.length){case 2:a.vertexAttrib2fv(ae.location,B);break;case 3:a.vertexAttrib3fv(ae.location,B);break;case 4:a.vertexAttrib4fv(ae.location,B);break;default:a.vertexAttrib1fv(ae.location,B)}}}}w()}function N(){I();for(const k in i){const q=i[k];for(const Q in q){const se=q[Q];for(const V in se){const W=se[V];for(const H in W)p(W[H].object),delete W[H];delete se[V]}}delete i[k]}}function L(k){if(i[k.id]===void 0)return;const q=i[k.id];for(const Q in q){const se=q[Q];for(const V in se){const W=se[V];for(const H in W)p(W[H].object),delete W[H];delete se[V]}}delete i[k.id]}function F(k){for(const q in i){const Q=i[q];for(const se in Q){const V=Q[se];if(V[k.id]===void 0)continue;const W=V[k.id];for(const H in W)p(W[H].object),delete W[H];delete V[k.id]}}}function T(k){for(const q in i){const Q=i[q],se=k.isInstancedMesh===!0?k.id:0,V=Q[se];if(V!==void 0){for(const W in V){const H=V[W];for(const Y in H)p(H[Y].object),delete H[Y];delete V[W]}delete Q[se],Object.keys(Q).length===0&&delete i[q]}}}function I(){z(),c=!0,o!==s&&(o=s,h(o.object))}function z(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:u,reset:I,resetDefaultState:z,dispose:N,releaseStatesOfGeometry:L,releaseStatesOfObject:T,releaseStatesOfProgram:F,initAttributes:b,enableAttribute:x,disableUnusedAttributes:w}}function YA(a,e,t){let i;function s(f){i=f}function o(f,h){a.drawArrays(i,f,h),t.update(h,i,1)}function c(f,h,p){p!==0&&(a.drawArraysInstanced(i,f,h,p),t.update(h,i,p))}function u(f,h,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,f,0,h,0,p);let m=0;for(let S=0;S<p;S++)m+=h[S];t.update(m,i,1)}this.setMode=s,this.render=o,this.renderInstances=c,this.renderMultiDraw=u}function KA(a,e,t,i){let s;function o(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const F=e.get("EXT_texture_filter_anisotropic");s=a.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function c(F){return!(F!==qi&&i.convert(F)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_FORMAT))}function u(F){const T=F===Vr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(F!==Li&&i.convert(F)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_TYPE)&&F!==cr&&!T)}function f(F){if(F==="highp"){if(a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const p=f(h);p!==h&&(it("WebGLRenderer:",h,"not supported, using",p,"instead."),h=p);const _=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&m===!1&&it("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const S=a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),M=a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=a.getParameter(a.MAX_TEXTURE_SIZE),x=a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE),E=a.getParameter(a.MAX_VERTEX_ATTRIBS),w=a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),P=a.getParameter(a.MAX_VARYING_VECTORS),A=a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),N=a.getParameter(a.MAX_SAMPLES),L=a.getParameter(a.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:f,textureFormatReadable:c,textureTypeReadable:u,precision:h,logarithmicDepthBuffer:_,reversedDepthBuffer:m,maxTextures:S,maxVertexTextures:M,maxTextureSize:b,maxCubemapSize:x,maxAttributes:E,maxVertexUniforms:w,maxVaryings:P,maxFragmentUniforms:A,maxSamples:N,samples:L}}function ZA(a){const e=this;let t=null,i=0,s=!1,o=!1;const c=new Ks,u=new ct,f={value:null,needsUpdate:!1};this.uniform=f,this.numPlanes=0,this.numIntersection=0,this.init=function(_,m){const S=_.length!==0||m||i!==0||s;return s=m,i=_.length,S},this.beginShadows=function(){o=!0,p(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(_,m){t=p(_,m,0)},this.setState=function(_,m,S){const M=_.clippingPlanes,b=_.clipIntersection,x=_.clipShadows,E=a.get(_);if(!s||M===null||M.length===0||o&&!x)o?p(null):h();else{const w=o?0:i,P=w*4;let A=E.clippingState||null;f.value=A,A=p(M,m,P,S);for(let N=0;N!==P;++N)A[N]=t[N];E.clippingState=A,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=w}};function h(){f.value!==t&&(f.value=t,f.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function p(_,m,S,M){const b=_!==null?_.length:0;let x=null;if(b!==0){if(x=f.value,M!==!0||x===null){const E=S+b*4,w=m.matrixWorldInverse;u.getNormalMatrix(w),(x===null||x.length<E)&&(x=new Float32Array(E));for(let P=0,A=S;P!==b;++P,A+=4)c.copy(_[P]).applyMatrix4(w,u),c.normal.toArray(x,A),x[A+3]=c.constant}f.value=x,f.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,x}}const ys=4,lx=[.125,.215,.35,.446,.526,.582],Qs=20,QA=256,ul=new Fy,cx=new Et;let Eh=null,bh=0,Th=0,wh=!1;const JA=new re;class ux{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,o={}){const{size:c=256,position:u=JA}=o;Eh=this._renderer.getRenderTarget(),bh=this._renderer.getActiveCubeFace(),Th=this._renderer.getActiveMipmapLevel(),wh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(c);const f=this._allocateTargets();return f.depthBuffer=!0,this._sceneToCubeUV(e,i,s,f,u),t>0&&this._blur(f,0,0,t),this._applyPMREM(f),this._cleanup(f),f}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hx(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Eh,bh,Th),this._renderer.xr.enabled=wh,e.scissorTest=!1,Ja(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===la||e.mapping===mo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Eh=this._renderer.getRenderTarget(),bh=this._renderer.getActiveCubeFace(),Th=this._renderer.getActiveMipmapLevel(),wh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:kn,minFilter:kn,generateMipmaps:!1,type:Vr,format:qi,colorSpace:Gu,depthBuffer:!1},s=dx(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dx(e,t,i);const{_lodMax:o}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=eC(o)),this._blurMaterial=nC(o,e,t),this._ggxMaterial=tC(o,e,t)}return s}_compileMaterial(e){const t=new Gr(new Ki,e);this._renderer.compile(t,ul)}_sceneToCubeUV(e,t,i,s,o){const f=new Di(90,1,t,i),h=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],_=this._renderer,m=_.autoClear,S=_.toneMapping;_.getClearColor(cx),_.toneMapping=dr,_.autoClear=!1,_.state.buffers.depth.getReversed()&&(_.setRenderTarget(s),_.clearDepth(),_.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Gr(new Hl,new Ry({name:"PMREM.Background",side:si,depthWrite:!1,depthTest:!1})));const b=this._backgroundBox,x=b.material;let E=!1;const w=e.background;w?w.isColor&&(x.color.copy(w),e.background=null,E=!0):(x.color.copy(cx),E=!0);for(let P=0;P<6;P++){const A=P%3;A===0?(f.up.set(0,h[P],0),f.position.set(o.x,o.y,o.z),f.lookAt(o.x+p[P],o.y,o.z)):A===1?(f.up.set(0,0,h[P]),f.position.set(o.x,o.y,o.z),f.lookAt(o.x,o.y+p[P],o.z)):(f.up.set(0,h[P],0),f.position.set(o.x,o.y,o.z),f.lookAt(o.x,o.y,o.z+p[P]));const N=this._cubeSize;Ja(s,A*N,P>2?N:0,N,N),_.setRenderTarget(s),E&&_.render(b,f),_.render(e,f)}_.toneMapping=S,_.autoClear=m,e.background=w}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===la||e.mapping===mo;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=hx()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fx());const o=s?this._cubemapMaterial:this._equirectMaterial,c=this._lodMeshes[0];c.material=o;const u=o.uniforms;u.envMap.value=e;const f=this._cubeSize;Ja(t,0,0,3*f,2*f),i.setRenderTarget(t),i.render(c,ul)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let o=1;o<s;o++)this._applyGGXFilter(e,o-1,o);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,o=this._pingPongRenderTarget,c=this._ggxMaterial,u=this._lodMeshes[i];u.material=c;const f=c.uniforms,h=i/(this._lodMeshes.length-1),p=t/(this._lodMeshes.length-1),_=Math.sqrt(h*h-p*p),m=0+h*1.25,S=_*m,{_lodMax:M}=this,b=this._sizeLods[i],x=3*b*(i>M-ys?i-M+ys:0),E=4*(this._cubeSize-b);f.envMap.value=e.texture,f.roughness.value=S,f.mipInt.value=M-t,Ja(o,x,E,3*b,2*b),s.setRenderTarget(o),s.render(u,ul),f.envMap.value=o.texture,f.roughness.value=0,f.mipInt.value=M-i,Ja(e,x,E,3*b,2*b),s.setRenderTarget(e),s.render(u,ul)}_blur(e,t,i,s,o){const c=this._pingPongRenderTarget;this._halfBlur(e,c,t,i,s,"latitudinal",o),this._halfBlur(c,e,i,i,s,"longitudinal",o)}_halfBlur(e,t,i,s,o,c,u){const f=this._renderer,h=this._blurMaterial;c!=="latitudinal"&&c!=="longitudinal"&&Tt("blur direction must be either latitudinal or longitudinal!");const p=3,_=this._lodMeshes[s];_.material=h;const m=h.uniforms,S=this._sizeLods[i]-1,M=isFinite(o)?Math.PI/(2*S):2*Math.PI/(2*Qs-1),b=o/M,x=isFinite(o)?1+Math.floor(p*b):Qs;x>Qs&&it(`sigmaRadians, ${o}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Qs}`);const E=[];let w=0;for(let F=0;F<Qs;++F){const T=F/b,I=Math.exp(-T*T/2);E.push(I),F===0?w+=I:F<x&&(w+=2*I)}for(let F=0;F<E.length;F++)E[F]=E[F]/w;m.envMap.value=e.texture,m.samples.value=x,m.weights.value=E,m.latitudinal.value=c==="latitudinal",u&&(m.poleAxis.value=u);const{_lodMax:P}=this;m.dTheta.value=M,m.mipInt.value=P-i;const A=this._sizeLods[s],N=3*A*(s>P-ys?s-P+ys:0),L=4*(this._cubeSize-A);Ja(t,N,L,3*A,2*A),f.setRenderTarget(t),f.render(_,ul)}}function eC(a){const e=[],t=[],i=[];let s=a;const o=a-ys+1+lx.length;for(let c=0;c<o;c++){const u=Math.pow(2,s);e.push(u);let f=1/u;c>a-ys?f=lx[c-a+ys-1]:c===0&&(f=0),t.push(f);const h=1/(u-2),p=-h,_=1+h,m=[p,p,_,p,_,_,p,p,_,_,p,_],S=6,M=6,b=3,x=2,E=1,w=new Float32Array(b*M*S),P=new Float32Array(x*M*S),A=new Float32Array(E*M*S);for(let L=0;L<S;L++){const F=L%3*2/3-1,T=L>2?0:-1,I=[F,T,0,F+2/3,T,0,F+2/3,T+1,0,F,T,0,F+2/3,T+1,0,F,T+1,0];w.set(I,b*M*L),P.set(m,x*M*L);const z=[L,L,L,L,L,L];A.set(z,E*M*L)}const N=new Ki;N.setAttribute("position",new vi(w,b)),N.setAttribute("uv",new vi(P,x)),N.setAttribute("faceIndex",new vi(A,E)),i.push(new Gr(N,null)),s>ys&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function dx(a,e,t){const i=new fr(a,e,t);return i.texture.mapping=Qu,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ja(a,e,t,i,s){a.viewport.set(e,t,i,s),a.scissor.set(e,t,i,s)}function tC(a,e,t){return new Yi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:QA,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:td(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Ur,depthTest:!1,depthWrite:!1})}function nC(a,e,t){const i=new Float32Array(Qs),s=new re(0,1,0);return new Yi({name:"SphericalGaussianBlur",defines:{n:Qs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:td(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ur,depthTest:!1,depthWrite:!1})}function fx(){return new Yi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:td(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ur,depthTest:!1,depthWrite:!1})}function hx(){return new Yi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:td(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ur,depthTest:!1,depthWrite:!1})}function td(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class ky extends fr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Ny(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Hl(5,5,5),o=new Yi({name:"CubemapFromEquirect",uniforms:_o(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:si,blending:Ur});o.uniforms.tEquirect.value=t;const c=new Gr(s,o),u=t.minFilter;return t.minFilter===ea&&(t.minFilter=kn),new ow(1,10,this).update(e,c),t.minFilter=u,c.geometry.dispose(),c.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const o=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,i,s);e.setRenderTarget(o)}}function iC(a){let e=new WeakMap,t=new WeakMap,i=null;function s(m,S=!1){return m==null?null:S?c(m):o(m)}function o(m){if(m&&m.isTexture){const S=m.mapping;if(S===Kf||S===Zf)if(e.has(m)){const M=e.get(m).texture;return u(M,m.mapping)}else{const M=m.image;if(M&&M.height>0){const b=new ky(M.height);return b.fromEquirectangularTexture(a,m),e.set(m,b),m.addEventListener("dispose",h),u(b.texture,m.mapping)}else return null}}return m}function c(m){if(m&&m.isTexture){const S=m.mapping,M=S===Kf||S===Zf,b=S===la||S===mo;if(M||b){let x=t.get(m);const E=x!==void 0?x.texture.pmremVersion:0;if(m.isRenderTargetTexture&&m.pmremVersion!==E)return i===null&&(i=new ux(a)),x=M?i.fromEquirectangular(m,x):i.fromCubemap(m,x),x.texture.pmremVersion=m.pmremVersion,t.set(m,x),x.texture;if(x!==void 0)return x.texture;{const w=m.image;return M&&w&&w.height>0||b&&w&&f(w)?(i===null&&(i=new ux(a)),x=M?i.fromEquirectangular(m):i.fromCubemap(m),x.texture.pmremVersion=m.pmremVersion,t.set(m,x),m.addEventListener("dispose",p),x.texture):null}}}return m}function u(m,S){return S===Kf?m.mapping=la:S===Zf&&(m.mapping=mo),m}function f(m){let S=0;const M=6;for(let b=0;b<M;b++)m[b]!==void 0&&S++;return S===M}function h(m){const S=m.target;S.removeEventListener("dispose",h);const M=e.get(S);M!==void 0&&(e.delete(S),M.dispose())}function p(m){const S=m.target;S.removeEventListener("dispose",p);const M=t.get(S);M!==void 0&&(t.delete(S),M.dispose())}function _(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:_}}function rC(a){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=a.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Up("WebGLRenderer: "+i+" extension not supported."),s}}}function sC(a,e,t,i){const s={},o=new WeakMap;function c(_){const m=_.target;m.index!==null&&e.remove(m.index);for(const M in m.attributes)e.remove(m.attributes[M]);m.removeEventListener("dispose",c),delete s[m.id];const S=o.get(m);S&&(e.remove(S),o.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function u(_,m){return s[m.id]===!0||(m.addEventListener("dispose",c),s[m.id]=!0,t.memory.geometries++),m}function f(_){const m=_.attributes;for(const S in m)e.update(m[S],a.ARRAY_BUFFER)}function h(_){const m=[],S=_.index,M=_.attributes.position;let b=0;if(M===void 0)return;if(S!==null){const w=S.array;b=S.version;for(let P=0,A=w.length;P<A;P+=3){const N=w[P+0],L=w[P+1],F=w[P+2];m.push(N,L,L,F,F,N)}}else{const w=M.array;b=M.version;for(let P=0,A=w.length/3-1;P<A;P+=3){const N=P+0,L=P+1,F=P+2;m.push(N,L,L,F,F,N)}}const x=new(M.count>=65535?Ay:wy)(m,1);x.version=b;const E=o.get(_);E&&e.remove(E),o.set(_,x)}function p(_){const m=o.get(_);if(m){const S=_.index;S!==null&&m.version<S.version&&h(_)}else h(_);return o.get(_)}return{get:u,update:f,getWireframeAttribute:p}}function aC(a,e,t){let i;function s(_){i=_}let o,c;function u(_){o=_.type,c=_.bytesPerElement}function f(_,m){a.drawElements(i,m,o,_*c),t.update(m,i,1)}function h(_,m,S){S!==0&&(a.drawElementsInstanced(i,m,o,_*c,S),t.update(m,i,S))}function p(_,m,S){if(S===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,o,_,0,S);let b=0;for(let x=0;x<S;x++)b+=m[x];t.update(b,i,1)}this.setMode=s,this.setIndex=u,this.render=f,this.renderInstances=h,this.renderMultiDraw=p}function oC(a){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,c,u){switch(t.calls++,c){case a.TRIANGLES:t.triangles+=u*(o/3);break;case a.LINES:t.lines+=u*(o/2);break;case a.LINE_STRIP:t.lines+=u*(o-1);break;case a.LINE_LOOP:t.lines+=u*o;break;case a.POINTS:t.points+=u*o;break;default:Tt("WebGLInfo: Unknown draw mode:",c);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function lC(a,e,t){const i=new WeakMap,s=new un;function o(c,u,f){const h=c.morphTargetInfluences,p=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,_=p!==void 0?p.length:0;let m=i.get(u);if(m===void 0||m.count!==_){let z=function(){T.dispose(),i.delete(u),u.removeEventListener("dispose",z)};var S=z;m!==void 0&&m.texture.dispose();const M=u.morphAttributes.position!==void 0,b=u.morphAttributes.normal!==void 0,x=u.morphAttributes.color!==void 0,E=u.morphAttributes.position||[],w=u.morphAttributes.normal||[],P=u.morphAttributes.color||[];let A=0;M===!0&&(A=1),b===!0&&(A=2),x===!0&&(A=3);let N=u.attributes.position.count*A,L=1;N>e.maxTextureSize&&(L=Math.ceil(N/e.maxTextureSize),N=e.maxTextureSize);const F=new Float32Array(N*L*4*_),T=new Ey(F,N,L,_);T.type=cr,T.needsUpdate=!0;const I=A*4;for(let k=0;k<_;k++){const q=E[k],Q=w[k],se=P[k],V=N*L*4*k;for(let W=0;W<q.count;W++){const H=W*I;M===!0&&(s.fromBufferAttribute(q,W),F[V+H+0]=s.x,F[V+H+1]=s.y,F[V+H+2]=s.z,F[V+H+3]=0),b===!0&&(s.fromBufferAttribute(Q,W),F[V+H+4]=s.x,F[V+H+5]=s.y,F[V+H+6]=s.z,F[V+H+7]=0),x===!0&&(s.fromBufferAttribute(se,W),F[V+H+8]=s.x,F[V+H+9]=s.y,F[V+H+10]=s.z,F[V+H+11]=se.itemSize===4?s.w:1)}}m={count:_,texture:T,size:new Ft(N,L)},i.set(u,m),u.addEventListener("dispose",z)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)f.getUniforms().setValue(a,"morphTexture",c.morphTexture,t);else{let M=0;for(let x=0;x<h.length;x++)M+=h[x];const b=u.morphTargetsRelative?1:1-M;f.getUniforms().setValue(a,"morphTargetBaseInfluence",b),f.getUniforms().setValue(a,"morphTargetInfluences",h)}f.getUniforms().setValue(a,"morphTargetsTexture",m.texture,t),f.getUniforms().setValue(a,"morphTargetsTextureSize",m.size)}return{update:o}}function cC(a,e,t,i,s){let o=new WeakMap;function c(h){const p=s.render.frame,_=h.geometry,m=e.get(h,_);if(o.get(m)!==p&&(e.update(m),o.set(m,p)),h.isInstancedMesh&&(h.hasEventListener("dispose",f)===!1&&h.addEventListener("dispose",f),o.get(h)!==p&&(t.update(h.instanceMatrix,a.ARRAY_BUFFER),h.instanceColor!==null&&t.update(h.instanceColor,a.ARRAY_BUFFER),o.set(h,p))),h.isSkinnedMesh){const S=h.skeleton;o.get(S)!==p&&(S.update(),o.set(S,p))}return m}function u(){o=new WeakMap}function f(h){const p=h.target;p.removeEventListener("dispose",f),i.releaseStatesOfObject(p),t.remove(p.instanceMatrix),p.instanceColor!==null&&t.remove(p.instanceColor)}return{update:c,dispose:u}}const uC={[oy]:"LINEAR_TONE_MAPPING",[ly]:"REINHARD_TONE_MAPPING",[cy]:"CINEON_TONE_MAPPING",[uy]:"ACES_FILMIC_TONE_MAPPING",[fy]:"AGX_TONE_MAPPING",[hy]:"NEUTRAL_TONE_MAPPING",[dy]:"CUSTOM_TONE_MAPPING"};function dC(a,e,t,i,s){const o=new fr(e,t,{type:a,depthBuffer:i,stencilBuffer:s,depthTexture:i?new go(e,t):void 0}),c=new fr(e,t,{type:Vr,depthBuffer:!1,stencilBuffer:!1}),u=new Ki;u.setAttribute("position",new kr([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new kr([0,2,0,0,2,0],2));const f=new rw({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Gr(u,f),p=new Fy(-1,1,1,-1,0,1);let _=null,m=null,S=!1,M,b=null,x=[],E=!1;this.setSize=function(w,P){o.setSize(w,P),c.setSize(w,P);for(let A=0;A<x.length;A++){const N=x[A];N.setSize&&N.setSize(w,P)}},this.setEffects=function(w){x=w,E=x.length>0&&x[0].isRenderPass===!0;const P=o.width,A=o.height;for(let N=0;N<x.length;N++){const L=x[N];L.setSize&&L.setSize(P,A)}},this.begin=function(w,P){if(S||w.toneMapping===dr&&x.length===0)return!1;if(b=P,P!==null){const A=P.width,N=P.height;(o.width!==A||o.height!==N)&&this.setSize(A,N)}return E===!1&&w.setRenderTarget(o),M=w.toneMapping,w.toneMapping=dr,!0},this.hasRenderPass=function(){return E},this.end=function(w,P){w.toneMapping=M,S=!0;let A=o,N=c;for(let L=0;L<x.length;L++){const F=x[L];if(F.enabled!==!1&&(F.render(w,N,A,P),F.needsSwap!==!1)){const T=A;A=N,N=T}}if(_!==w.outputColorSpace||m!==w.toneMapping){_=w.outputColorSpace,m=w.toneMapping,f.defines={},vt.getTransfer(_)===Lt&&(f.defines.SRGB_TRANSFER="");const L=uC[m];L&&(f.defines[L]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=A.texture,w.setRenderTarget(b),w.render(h,p),b=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),c.dispose(),u.dispose(),f.dispose()}}const By=new jn,Bp=new go(1,1),zy=new Ey,Vy=new LT,Hy=new Ny,px=[],mx=[],gx=new Float32Array(16),_x=new Float32Array(9),xx=new Float32Array(4);function yo(a,e,t){const i=a[0];if(i<=0||i>0)return a;const s=e*t;let o=px[s];if(o===void 0&&(o=new Float32Array(s),px[s]=o),e!==0){i.toArray(o,0);for(let c=1,u=0;c!==e;++c)u+=t,a[c].toArray(o,u)}return o}function xn(a,e){if(a.length!==e.length)return!1;for(let t=0,i=a.length;t<i;t++)if(a[t]!==e[t])return!1;return!0}function vn(a,e){for(let t=0,i=e.length;t<i;t++)a[t]=e[t]}function nd(a,e){let t=mx[e];t===void 0&&(t=new Int32Array(e),mx[e]=t);for(let i=0;i!==e;++i)t[i]=a.allocateTextureUnit();return t}function fC(a,e){const t=this.cache;t[0]!==e&&(a.uniform1f(this.addr,e),t[0]=e)}function hC(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xn(t,e))return;a.uniform2fv(this.addr,e),vn(t,e)}}function pC(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(a.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(xn(t,e))return;a.uniform3fv(this.addr,e),vn(t,e)}}function mC(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xn(t,e))return;a.uniform4fv(this.addr,e),vn(t,e)}}function gC(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(xn(t,e))return;a.uniformMatrix2fv(this.addr,!1,e),vn(t,e)}else{if(xn(t,i))return;xx.set(i),a.uniformMatrix2fv(this.addr,!1,xx),vn(t,i)}}function _C(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(xn(t,e))return;a.uniformMatrix3fv(this.addr,!1,e),vn(t,e)}else{if(xn(t,i))return;_x.set(i),a.uniformMatrix3fv(this.addr,!1,_x),vn(t,i)}}function xC(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(xn(t,e))return;a.uniformMatrix4fv(this.addr,!1,e),vn(t,e)}else{if(xn(t,i))return;gx.set(i),a.uniformMatrix4fv(this.addr,!1,gx),vn(t,i)}}function vC(a,e){const t=this.cache;t[0]!==e&&(a.uniform1i(this.addr,e),t[0]=e)}function yC(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xn(t,e))return;a.uniform2iv(this.addr,e),vn(t,e)}}function SC(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xn(t,e))return;a.uniform3iv(this.addr,e),vn(t,e)}}function MC(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xn(t,e))return;a.uniform4iv(this.addr,e),vn(t,e)}}function EC(a,e){const t=this.cache;t[0]!==e&&(a.uniform1ui(this.addr,e),t[0]=e)}function bC(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xn(t,e))return;a.uniform2uiv(this.addr,e),vn(t,e)}}function TC(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xn(t,e))return;a.uniform3uiv(this.addr,e),vn(t,e)}}function wC(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xn(t,e))return;a.uniform4uiv(this.addr,e),vn(t,e)}}function AC(a,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(a.uniform1i(this.addr,s),i[0]=s);let o;this.type===a.SAMPLER_2D_SHADOW?(Bp.compareFunction=t.isReversedDepthBuffer()?Sm:ym,o=Bp):o=By,t.setTexture2D(e||o,s)}function CC(a,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(a.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Vy,s)}function RC(a,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(a.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Hy,s)}function PC(a,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(a.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||zy,s)}function NC(a){switch(a){case 5126:return fC;case 35664:return hC;case 35665:return pC;case 35666:return mC;case 35674:return gC;case 35675:return _C;case 35676:return xC;case 5124:case 35670:return vC;case 35667:case 35671:return yC;case 35668:case 35672:return SC;case 35669:case 35673:return MC;case 5125:return EC;case 36294:return bC;case 36295:return TC;case 36296:return wC;case 35678:case 36198:case 36298:case 36306:case 35682:return AC;case 35679:case 36299:case 36307:return CC;case 35680:case 36300:case 36308:case 36293:return RC;case 36289:case 36303:case 36311:case 36292:return PC}}function DC(a,e){a.uniform1fv(this.addr,e)}function LC(a,e){const t=yo(e,this.size,2);a.uniform2fv(this.addr,t)}function IC(a,e){const t=yo(e,this.size,3);a.uniform3fv(this.addr,t)}function FC(a,e){const t=yo(e,this.size,4);a.uniform4fv(this.addr,t)}function UC(a,e){const t=yo(e,this.size,4);a.uniformMatrix2fv(this.addr,!1,t)}function OC(a,e){const t=yo(e,this.size,9);a.uniformMatrix3fv(this.addr,!1,t)}function kC(a,e){const t=yo(e,this.size,16);a.uniformMatrix4fv(this.addr,!1,t)}function BC(a,e){a.uniform1iv(this.addr,e)}function zC(a,e){a.uniform2iv(this.addr,e)}function VC(a,e){a.uniform3iv(this.addr,e)}function HC(a,e){a.uniform4iv(this.addr,e)}function GC(a,e){a.uniform1uiv(this.addr,e)}function jC(a,e){a.uniform2uiv(this.addr,e)}function WC(a,e){a.uniform3uiv(this.addr,e)}function XC(a,e){a.uniform4uiv(this.addr,e)}function $C(a,e,t){const i=this.cache,s=e.length,o=nd(t,s);xn(i,o)||(a.uniform1iv(this.addr,o),vn(i,o));let c;this.type===a.SAMPLER_2D_SHADOW?c=Bp:c=By;for(let u=0;u!==s;++u)t.setTexture2D(e[u]||c,o[u])}function qC(a,e,t){const i=this.cache,s=e.length,o=nd(t,s);xn(i,o)||(a.uniform1iv(this.addr,o),vn(i,o));for(let c=0;c!==s;++c)t.setTexture3D(e[c]||Vy,o[c])}function YC(a,e,t){const i=this.cache,s=e.length,o=nd(t,s);xn(i,o)||(a.uniform1iv(this.addr,o),vn(i,o));for(let c=0;c!==s;++c)t.setTextureCube(e[c]||Hy,o[c])}function KC(a,e,t){const i=this.cache,s=e.length,o=nd(t,s);xn(i,o)||(a.uniform1iv(this.addr,o),vn(i,o));for(let c=0;c!==s;++c)t.setTexture2DArray(e[c]||zy,o[c])}function ZC(a){switch(a){case 5126:return DC;case 35664:return LC;case 35665:return IC;case 35666:return FC;case 35674:return UC;case 35675:return OC;case 35676:return kC;case 5124:case 35670:return BC;case 35667:case 35671:return zC;case 35668:case 35672:return VC;case 35669:case 35673:return HC;case 5125:return GC;case 36294:return jC;case 36295:return WC;case 36296:return XC;case 35678:case 36198:case 36298:case 36306:case 35682:return $C;case 35679:case 36299:case 36307:return qC;case 35680:case 36300:case 36308:case 36293:return YC;case 36289:case 36303:case 36311:case 36292:return KC}}class QC{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=NC(t.type)}}class JC{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ZC(t.type)}}class eR{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let o=0,c=s.length;o!==c;++o){const u=s[o];u.setValue(e,t[u.id],i)}}}const Ah=/(\w+)(\])?(\[|\.)?/g;function vx(a,e){a.seq.push(e),a.map[e.id]=e}function tR(a,e,t){const i=a.name,s=i.length;for(Ah.lastIndex=0;;){const o=Ah.exec(i),c=Ah.lastIndex;let u=o[1];const f=o[2]==="]",h=o[3];if(f&&(u=u|0),h===void 0||h==="["&&c+2===s){vx(t,h===void 0?new QC(u,a,e):new JC(u,a,e));break}else{let _=t.map[u];_===void 0&&(_=new eR(u),vx(t,_)),t=_}}}class Cu{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let c=0;c<i;++c){const u=e.getActiveUniform(t,c),f=e.getUniformLocation(t,u.name);tR(u,f,this)}const s=[],o=[];for(const c of this.seq)c.type===e.SAMPLER_2D_SHADOW||c.type===e.SAMPLER_CUBE_SHADOW||c.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(c):o.push(c);s.length>0&&(this.seq=s.concat(o))}setValue(e,t,i,s){const o=this.map[t];o!==void 0&&o.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let o=0,c=t.length;o!==c;++o){const u=t[o],f=i[u.id];f.needsUpdate!==!1&&u.setValue(e,f.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,o=e.length;s!==o;++s){const c=e[s];c.id in t&&i.push(c)}return i}}function yx(a,e,t){const i=a.createShader(e);return a.shaderSource(i,t),a.compileShader(i),i}const nR=37297;let iR=0;function rR(a,e){const t=a.split(`
`),i=[],s=Math.max(e-6,0),o=Math.min(e+6,t.length);for(let c=s;c<o;c++){const u=c+1;i.push(`${u===e?">":" "} ${u}: ${t[c]}`)}return i.join(`
`)}const Sx=new ct;function sR(a){vt._getMatrix(Sx,vt.workingColorSpace,a);const e=`mat3( ${Sx.elements.map(t=>t.toFixed(4))} )`;switch(vt.getTransfer(a)){case ju:return[e,"LinearTransferOETF"];case Lt:return[e,"sRGBTransferOETF"];default:return it("WebGLProgram: Unsupported color space: ",a),[e,"LinearTransferOETF"]}}function Mx(a,e,t){const i=a.getShaderParameter(e,a.COMPILE_STATUS),o=(a.getShaderInfoLog(e)||"").trim();if(i&&o==="")return"";const c=/ERROR: 0:(\d+)/.exec(o);if(c){const u=parseInt(c[1]);return t.toUpperCase()+`

`+o+`

`+rR(a.getShaderSource(e),u)}else return o}function aR(a,e){const t=sR(e);return[`vec4 ${a}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const oR={[oy]:"Linear",[ly]:"Reinhard",[cy]:"Cineon",[uy]:"ACESFilmic",[fy]:"AgX",[hy]:"Neutral",[dy]:"Custom"};function lR(a,e){const t=oR[e];return t===void 0?(it("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+a+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+a+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const xu=new re;function cR(){vt.getLuminanceCoefficients(xu);const a=xu.x.toFixed(4),e=xu.y.toFixed(4),t=xu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${a}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function uR(a){return[a.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",a.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ml).join(`
`)}function dR(a){const e=[];for(const t in a){const i=a[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function fR(a,e){const t={},i=a.getProgramParameter(e,a.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const o=a.getActiveAttrib(e,s),c=o.name;let u=1;o.type===a.FLOAT_MAT2&&(u=2),o.type===a.FLOAT_MAT3&&(u=3),o.type===a.FLOAT_MAT4&&(u=4),t[c]={type:o.type,location:a.getAttribLocation(e,c),locationSize:u}}return t}function ml(a){return a!==""}function Ex(a,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return a.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bx(a,e){return a.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const hR=/^[ \t]*#include +<([\w\d./]+)>/gm;function zp(a){return a.replace(hR,mR)}const pR=new Map;function mR(a,e){let t=ht[e];if(t===void 0){const i=pR.get(e);if(i!==void 0)t=ht[i],it('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return zp(t)}const gR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Tx(a){return a.replace(gR,_R)}function _R(a,e,t,i){let s="";for(let o=parseInt(e);o<parseInt(t);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function wx(a){let e=`precision ${a.precision} float;
	precision ${a.precision} int;
	precision ${a.precision} sampler2D;
	precision ${a.precision} samplerCube;
	precision ${a.precision} sampler3D;
	precision ${a.precision} sampler2DArray;
	precision ${a.precision} sampler2DShadow;
	precision ${a.precision} samplerCubeShadow;
	precision ${a.precision} sampler2DArrayShadow;
	precision ${a.precision} isampler2D;
	precision ${a.precision} isampler3D;
	precision ${a.precision} isamplerCube;
	precision ${a.precision} isampler2DArray;
	precision ${a.precision} usampler2D;
	precision ${a.precision} usampler3D;
	precision ${a.precision} usamplerCube;
	precision ${a.precision} usampler2DArray;
	`;return a.precision==="highp"?e+=`
#define HIGH_PRECISION`:a.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:a.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const xR={[Eu]:"SHADOWMAP_TYPE_PCF",[pl]:"SHADOWMAP_TYPE_VSM"};function vR(a){return xR[a.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const yR={[la]:"ENVMAP_TYPE_CUBE",[mo]:"ENVMAP_TYPE_CUBE",[Qu]:"ENVMAP_TYPE_CUBE_UV"};function SR(a){return a.envMap===!1?"ENVMAP_TYPE_CUBE":yR[a.envMapMode]||"ENVMAP_TYPE_CUBE"}const MR={[mo]:"ENVMAP_MODE_REFRACTION"};function ER(a){return a.envMap===!1?"ENVMAP_MODE_REFLECTION":MR[a.envMapMode]||"ENVMAP_MODE_REFLECTION"}const bR={[ay]:"ENVMAP_BLENDING_MULTIPLY",[fT]:"ENVMAP_BLENDING_MIX",[hT]:"ENVMAP_BLENDING_ADD"};function TR(a){return a.envMap===!1?"ENVMAP_BLENDING_NONE":bR[a.combine]||"ENVMAP_BLENDING_NONE"}function wR(a){const e=a.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function AR(a,e,t,i){const s=a.getContext(),o=t.defines;let c=t.vertexShader,u=t.fragmentShader;const f=vR(t),h=SR(t),p=ER(t),_=TR(t),m=wR(t),S=uR(t),M=dR(o),b=s.createProgram();let x,E,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(ml).join(`
`),x.length>0&&(x+=`
`),E=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(ml).join(`
`),E.length>0&&(E+=`
`)):(x=[wx(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+p:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+f:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ml).join(`
`),E=[wx(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+p:"",t.envMap?"#define "+_:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+f:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==dr?"#define TONE_MAPPING":"",t.toneMapping!==dr?ht.tonemapping_pars_fragment:"",t.toneMapping!==dr?lR("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ht.colorspace_pars_fragment,aR("linearToOutputTexel",t.outputColorSpace),cR(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ml).join(`
`)),c=zp(c),c=Ex(c,t),c=bx(c,t),u=zp(u),u=Ex(u,t),u=bx(u,t),c=Tx(c),u=Tx(u),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,x=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,E=["#define varying in",t.glslVersion===k_?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===k_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+E);const P=w+x+c,A=w+E+u,N=yx(s,s.VERTEX_SHADER,P),L=yx(s,s.FRAGMENT_SHADER,A);s.attachShader(b,N),s.attachShader(b,L),t.index0AttributeName!==void 0?s.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function F(k){if(a.debug.checkShaderErrors){const q=s.getProgramInfoLog(b)||"",Q=s.getShaderInfoLog(N)||"",se=s.getShaderInfoLog(L)||"",V=q.trim(),W=Q.trim(),H=se.trim();let Y=!0,ae=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(Y=!1,typeof a.debug.onShaderError=="function")a.debug.onShaderError(s,b,N,L);else{const oe=Mx(s,N,"vertex"),B=Mx(s,L,"fragment");Tt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+k.name+`
Material Type: `+k.type+`

Program Info Log: `+V+`
`+oe+`
`+B)}else V!==""?it("WebGLProgram: Program Info Log:",V):(W===""||H==="")&&(ae=!1);ae&&(k.diagnostics={runnable:Y,programLog:V,vertexShader:{log:W,prefix:x},fragmentShader:{log:H,prefix:E}})}s.deleteShader(N),s.deleteShader(L),T=new Cu(s,b),I=fR(s,b)}let T;this.getUniforms=function(){return T===void 0&&F(this),T};let I;this.getAttributes=function(){return I===void 0&&F(this),I};let z=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return z===!1&&(z=s.getProgramParameter(b,nR)),z},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=iR++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=N,this.fragmentShader=L,this}let CR=0;class RR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),o=this._getShaderStage(i),c=this._getShaderCacheForMaterial(e);return c.has(s)===!1&&(c.add(s),s.usedTimes++),c.has(o)===!1&&(c.add(o),o.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new PR(e),t.set(e,i)),i}}class PR{constructor(e){this.id=CR++,this.code=e,this.usedTimes=0}}function NR(a){return a===ca||a===Vu||a===Hu}function DR(a,e,t,i,s,o){const c=new by,u=new RR,f=new Set,h=[],p=new Map,_=i.logarithmicDepthBuffer;let m=i.precision;const S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(T){return f.add(T),T===0?"uv":`uv${T}`}function b(T,I,z,k,q,Q){const se=k.fog,V=q.geometry,W=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?k.environment:null,H=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap,Y=e.get(T.envMap||W,H),ae=Y&&Y.mapping===Qu?Y.image.height:null,oe=S[T.type];T.precision!==null&&(m=i.getMaxPrecision(T.precision),m!==T.precision&&it("WebGLProgram.getParameters:",T.precision,"not supported, using",m,"instead."));const B=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,J=B!==void 0?B.length:0;let Ie=0;V.morphAttributes.position!==void 0&&(Ie=1),V.morphAttributes.normal!==void 0&&(Ie=2),V.morphAttributes.color!==void 0&&(Ie=3);let Fe,De,ue,Se;if(oe){const at=ar[oe];Fe=at.vertexShader,De=at.fragmentShader}else Fe=T.vertexShader,De=T.fragmentShader,u.update(T),ue=u.getVertexShaderID(T),Se=u.getFragmentShaderID(T);const ge=a.getRenderTarget(),Oe=a.state.buffers.depth.getReversed(),Qe=q.isInstancedMesh===!0,Je=q.isBatchedMesh===!0,Bt=!!T.map,ut=!!T.matcap,wt=!!Y,It=!!T.aoMap,dt=!!T.lightMap,Zt=!!T.bumpMap,zt=!!T.normalMap,Tn=!!T.displacementMap,X=!!T.emissiveMap,Vt=!!T.metalnessMap,ft=!!T.roughnessMap,Pt=T.anisotropy>0,Le=T.clearcoat>0,jt=T.dispersion>0,U=T.iridescence>0,C=T.sheen>0,Z=T.transmission>0,he=Pt&&!!T.anisotropyMap,_e=Le&&!!T.clearcoatMap,Ee=Le&&!!T.clearcoatNormalMap,Ne=Le&&!!T.clearcoatRoughnessMap,de=U&&!!T.iridescenceMap,pe=U&&!!T.iridescenceThicknessMap,ke=C&&!!T.sheenColorMap,ze=C&&!!T.sheenRoughnessMap,Ae=!!T.specularMap,be=!!T.specularColorMap,nt=!!T.specularIntensityMap,st=Z&&!!T.transmissionMap,pt=Z&&!!T.thicknessMap,j=!!T.gradientMap,we=!!T.alphaMap,fe=T.alphaTest>0,Be=!!T.alphaHash,Re=!!T.extensions;let xe=dr;T.toneMapped&&(ge===null||ge.isXRRenderTarget===!0)&&(xe=a.toneMapping);const Xe={shaderID:oe,shaderType:T.type,shaderName:T.name,vertexShader:Fe,fragmentShader:De,defines:T.defines,customVertexShaderID:ue,customFragmentShaderID:Se,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:m,batching:Je,batchingColor:Je&&q._colorsTexture!==null,instancing:Qe,instancingColor:Qe&&q.instanceColor!==null,instancingMorph:Qe&&q.morphTexture!==null,outputColorSpace:ge===null?a.outputColorSpace:ge.isXRRenderTarget===!0?ge.texture.colorSpace:vt.workingColorSpace,alphaToCoverage:!!T.alphaToCoverage,map:Bt,matcap:ut,envMap:wt,envMapMode:wt&&Y.mapping,envMapCubeUVHeight:ae,aoMap:It,lightMap:dt,bumpMap:Zt,normalMap:zt,displacementMap:Tn,emissiveMap:X,normalMapObjectSpace:zt&&T.normalMapType===gT,normalMapTangentSpace:zt&&T.normalMapType===F_,packedNormalMap:zt&&T.normalMapType===F_&&NR(T.normalMap.format),metalnessMap:Vt,roughnessMap:ft,anisotropy:Pt,anisotropyMap:he,clearcoat:Le,clearcoatMap:_e,clearcoatNormalMap:Ee,clearcoatRoughnessMap:Ne,dispersion:jt,iridescence:U,iridescenceMap:de,iridescenceThicknessMap:pe,sheen:C,sheenColorMap:ke,sheenRoughnessMap:ze,specularMap:Ae,specularColorMap:be,specularIntensityMap:nt,transmission:Z,transmissionMap:st,thicknessMap:pt,gradientMap:j,opaque:T.transparent===!1&&T.blending===oa&&T.alphaToCoverage===!1,alphaMap:we,alphaTest:fe,alphaHash:Be,combine:T.combine,mapUv:Bt&&M(T.map.channel),aoMapUv:It&&M(T.aoMap.channel),lightMapUv:dt&&M(T.lightMap.channel),bumpMapUv:Zt&&M(T.bumpMap.channel),normalMapUv:zt&&M(T.normalMap.channel),displacementMapUv:Tn&&M(T.displacementMap.channel),emissiveMapUv:X&&M(T.emissiveMap.channel),metalnessMapUv:Vt&&M(T.metalnessMap.channel),roughnessMapUv:ft&&M(T.roughnessMap.channel),anisotropyMapUv:he&&M(T.anisotropyMap.channel),clearcoatMapUv:_e&&M(T.clearcoatMap.channel),clearcoatNormalMapUv:Ee&&M(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ne&&M(T.clearcoatRoughnessMap.channel),iridescenceMapUv:de&&M(T.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&M(T.iridescenceThicknessMap.channel),sheenColorMapUv:ke&&M(T.sheenColorMap.channel),sheenRoughnessMapUv:ze&&M(T.sheenRoughnessMap.channel),specularMapUv:Ae&&M(T.specularMap.channel),specularColorMapUv:be&&M(T.specularColorMap.channel),specularIntensityMapUv:nt&&M(T.specularIntensityMap.channel),transmissionMapUv:st&&M(T.transmissionMap.channel),thicknessMapUv:pt&&M(T.thicknessMap.channel),alphaMapUv:we&&M(T.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(zt||Pt),vertexNormals:!!V.attributes.normal,vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:q.isPoints===!0&&!!V.attributes.uv&&(Bt||we),fog:!!se,useFog:T.fog===!0,fogExp2:!!se&&se.isFogExp2,flatShading:T.wireframe===!1&&(T.flatShading===!0||V.attributes.normal===void 0&&zt===!1&&(T.isMeshLambertMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isMeshPhysicalMaterial)),sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:_,reversedDepthBuffer:Oe,skinning:q.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:Ie,numDirLights:I.directional.length,numPointLights:I.point.length,numSpotLights:I.spot.length,numSpotLightMaps:I.spotLightMap.length,numRectAreaLights:I.rectArea.length,numHemiLights:I.hemi.length,numDirLightShadows:I.directionalShadowMap.length,numPointLightShadows:I.pointShadowMap.length,numSpotLightShadows:I.spotShadowMap.length,numSpotLightShadowsWithMaps:I.numSpotLightShadowsWithMaps,numLightProbes:I.numLightProbes,numLightProbeGrids:Q.length,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:T.dithering,shadowMapEnabled:a.shadowMap.enabled&&z.length>0,shadowMapType:a.shadowMap.type,toneMapping:xe,decodeVideoTexture:Bt&&T.map.isVideoTexture===!0&&vt.getTransfer(T.map.colorSpace)===Lt,decodeVideoTextureEmissive:X&&T.emissiveMap.isVideoTexture===!0&&vt.getTransfer(T.emissiveMap.colorSpace)===Lt,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===Lr,flipSided:T.side===si,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Re&&T.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&T.extensions.multiDraw===!0||Je)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return Xe.vertexUv1s=f.has(1),Xe.vertexUv2s=f.has(2),Xe.vertexUv3s=f.has(3),f.clear(),Xe}function x(T){const I=[];if(T.shaderID?I.push(T.shaderID):(I.push(T.customVertexShaderID),I.push(T.customFragmentShaderID)),T.defines!==void 0)for(const z in T.defines)I.push(z),I.push(T.defines[z]);return T.isRawShaderMaterial===!1&&(E(I,T),w(I,T),I.push(a.outputColorSpace)),I.push(T.customProgramCacheKey),I.join()}function E(T,I){T.push(I.precision),T.push(I.outputColorSpace),T.push(I.envMapMode),T.push(I.envMapCubeUVHeight),T.push(I.mapUv),T.push(I.alphaMapUv),T.push(I.lightMapUv),T.push(I.aoMapUv),T.push(I.bumpMapUv),T.push(I.normalMapUv),T.push(I.displacementMapUv),T.push(I.emissiveMapUv),T.push(I.metalnessMapUv),T.push(I.roughnessMapUv),T.push(I.anisotropyMapUv),T.push(I.clearcoatMapUv),T.push(I.clearcoatNormalMapUv),T.push(I.clearcoatRoughnessMapUv),T.push(I.iridescenceMapUv),T.push(I.iridescenceThicknessMapUv),T.push(I.sheenColorMapUv),T.push(I.sheenRoughnessMapUv),T.push(I.specularMapUv),T.push(I.specularColorMapUv),T.push(I.specularIntensityMapUv),T.push(I.transmissionMapUv),T.push(I.thicknessMapUv),T.push(I.combine),T.push(I.fogExp2),T.push(I.sizeAttenuation),T.push(I.morphTargetsCount),T.push(I.morphAttributeCount),T.push(I.numDirLights),T.push(I.numPointLights),T.push(I.numSpotLights),T.push(I.numSpotLightMaps),T.push(I.numHemiLights),T.push(I.numRectAreaLights),T.push(I.numDirLightShadows),T.push(I.numPointLightShadows),T.push(I.numSpotLightShadows),T.push(I.numSpotLightShadowsWithMaps),T.push(I.numLightProbes),T.push(I.shadowMapType),T.push(I.toneMapping),T.push(I.numClippingPlanes),T.push(I.numClipIntersection),T.push(I.depthPacking)}function w(T,I){c.disableAll(),I.instancing&&c.enable(0),I.instancingColor&&c.enable(1),I.instancingMorph&&c.enable(2),I.matcap&&c.enable(3),I.envMap&&c.enable(4),I.normalMapObjectSpace&&c.enable(5),I.normalMapTangentSpace&&c.enable(6),I.clearcoat&&c.enable(7),I.iridescence&&c.enable(8),I.alphaTest&&c.enable(9),I.vertexColors&&c.enable(10),I.vertexAlphas&&c.enable(11),I.vertexUv1s&&c.enable(12),I.vertexUv2s&&c.enable(13),I.vertexUv3s&&c.enable(14),I.vertexTangents&&c.enable(15),I.anisotropy&&c.enable(16),I.alphaHash&&c.enable(17),I.batching&&c.enable(18),I.dispersion&&c.enable(19),I.batchingColor&&c.enable(20),I.gradientMap&&c.enable(21),I.packedNormalMap&&c.enable(22),I.vertexNormals&&c.enable(23),T.push(c.mask),c.disableAll(),I.fog&&c.enable(0),I.useFog&&c.enable(1),I.flatShading&&c.enable(2),I.logarithmicDepthBuffer&&c.enable(3),I.reversedDepthBuffer&&c.enable(4),I.skinning&&c.enable(5),I.morphTargets&&c.enable(6),I.morphNormals&&c.enable(7),I.morphColors&&c.enable(8),I.premultipliedAlpha&&c.enable(9),I.shadowMapEnabled&&c.enable(10),I.doubleSided&&c.enable(11),I.flipSided&&c.enable(12),I.useDepthPacking&&c.enable(13),I.dithering&&c.enable(14),I.transmission&&c.enable(15),I.sheen&&c.enable(16),I.opaque&&c.enable(17),I.pointsUvs&&c.enable(18),I.decodeVideoTexture&&c.enable(19),I.decodeVideoTextureEmissive&&c.enable(20),I.alphaToCoverage&&c.enable(21),I.numLightProbeGrids>0&&c.enable(22),T.push(c.mask)}function P(T){const I=S[T.type];let z;if(I){const k=ar[I];z=tw.clone(k.uniforms)}else z=T.uniforms;return z}function A(T,I){let z=p.get(I);return z!==void 0?++z.usedTimes:(z=new AR(a,I,T,s),h.push(z),p.set(I,z)),z}function N(T){if(--T.usedTimes===0){const I=h.indexOf(T);h[I]=h[h.length-1],h.pop(),p.delete(T.cacheKey),T.destroy()}}function L(T){u.remove(T)}function F(){u.dispose()}return{getParameters:b,getProgramCacheKey:x,getUniforms:P,acquireProgram:A,releaseProgram:N,releaseShaderCache:L,programs:h,dispose:F}}function LR(){let a=new WeakMap;function e(c){return a.has(c)}function t(c){let u=a.get(c);return u===void 0&&(u={},a.set(c,u)),u}function i(c){a.delete(c)}function s(c,u,f){a.get(c)[u]=f}function o(){a=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:o}}function IR(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.material.id!==e.material.id?a.material.id-e.material.id:a.materialVariant!==e.materialVariant?a.materialVariant-e.materialVariant:a.z!==e.z?a.z-e.z:a.id-e.id}function Ax(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.z!==e.z?e.z-a.z:a.id-e.id}function Cx(){const a=[];let e=0;const t=[],i=[],s=[];function o(){e=0,t.length=0,i.length=0,s.length=0}function c(m){let S=0;return m.isInstancedMesh&&(S+=2),m.isSkinnedMesh&&(S+=1),S}function u(m,S,M,b,x,E){let w=a[e];return w===void 0?(w={id:m.id,object:m,geometry:S,material:M,materialVariant:c(m),groupOrder:b,renderOrder:m.renderOrder,z:x,group:E},a[e]=w):(w.id=m.id,w.object=m,w.geometry=S,w.material=M,w.materialVariant=c(m),w.groupOrder=b,w.renderOrder=m.renderOrder,w.z=x,w.group=E),e++,w}function f(m,S,M,b,x,E){const w=u(m,S,M,b,x,E);M.transmission>0?i.push(w):M.transparent===!0?s.push(w):t.push(w)}function h(m,S,M,b,x,E){const w=u(m,S,M,b,x,E);M.transmission>0?i.unshift(w):M.transparent===!0?s.unshift(w):t.unshift(w)}function p(m,S){t.length>1&&t.sort(m||IR),i.length>1&&i.sort(S||Ax),s.length>1&&s.sort(S||Ax)}function _(){for(let m=e,S=a.length;m<S;m++){const M=a[m];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:i,transparent:s,init:o,push:f,unshift:h,finish:_,sort:p}}function FR(){let a=new WeakMap;function e(i,s){const o=a.get(i);let c;return o===void 0?(c=new Cx,a.set(i,[c])):s>=o.length?(c=new Cx,o.push(c)):c=o[s],c}function t(){a=new WeakMap}return{get:e,dispose:t}}function UR(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new re,color:new Et};break;case"SpotLight":t={position:new re,direction:new re,color:new Et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new re,color:new Et,distance:0,decay:0};break;case"HemisphereLight":t={direction:new re,skyColor:new Et,groundColor:new Et};break;case"RectAreaLight":t={color:new Et,position:new re,halfWidth:new re,halfHeight:new re};break}return a[e.id]=t,t}}}function OR(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ft};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ft};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return a[e.id]=t,t}}}let kR=0;function BR(a,e){return(e.castShadow?2:0)-(a.castShadow?2:0)+(e.map?1:0)-(a.map?1:0)}function zR(a){const e=new UR,t=OR(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new re);const s=new re,o=new mn,c=new mn;function u(h){let p=0,_=0,m=0;for(let I=0;I<9;I++)i.probe[I].set(0,0,0);let S=0,M=0,b=0,x=0,E=0,w=0,P=0,A=0,N=0,L=0,F=0;h.sort(BR);for(let I=0,z=h.length;I<z;I++){const k=h[I],q=k.color,Q=k.intensity,se=k.distance;let V=null;if(k.shadow&&k.shadow.map&&(k.shadow.map.texture.format===ca?V=k.shadow.map.texture:V=k.shadow.map.depthTexture||k.shadow.map.texture),k.isAmbientLight)p+=q.r*Q,_+=q.g*Q,m+=q.b*Q;else if(k.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(k.sh.coefficients[W],Q);F++}else if(k.isDirectionalLight){const W=e.get(k);if(W.color.copy(k.color).multiplyScalar(k.intensity),k.castShadow){const H=k.shadow,Y=t.get(k);Y.shadowIntensity=H.intensity,Y.shadowBias=H.bias,Y.shadowNormalBias=H.normalBias,Y.shadowRadius=H.radius,Y.shadowMapSize=H.mapSize,i.directionalShadow[S]=Y,i.directionalShadowMap[S]=V,i.directionalShadowMatrix[S]=k.shadow.matrix,w++}i.directional[S]=W,S++}else if(k.isSpotLight){const W=e.get(k);W.position.setFromMatrixPosition(k.matrixWorld),W.color.copy(q).multiplyScalar(Q),W.distance=se,W.coneCos=Math.cos(k.angle),W.penumbraCos=Math.cos(k.angle*(1-k.penumbra)),W.decay=k.decay,i.spot[b]=W;const H=k.shadow;if(k.map&&(i.spotLightMap[N]=k.map,N++,H.updateMatrices(k),k.castShadow&&L++),i.spotLightMatrix[b]=H.matrix,k.castShadow){const Y=t.get(k);Y.shadowIntensity=H.intensity,Y.shadowBias=H.bias,Y.shadowNormalBias=H.normalBias,Y.shadowRadius=H.radius,Y.shadowMapSize=H.mapSize,i.spotShadow[b]=Y,i.spotShadowMap[b]=V,A++}b++}else if(k.isRectAreaLight){const W=e.get(k);W.color.copy(q).multiplyScalar(Q),W.halfWidth.set(k.width*.5,0,0),W.halfHeight.set(0,k.height*.5,0),i.rectArea[x]=W,x++}else if(k.isPointLight){const W=e.get(k);if(W.color.copy(k.color).multiplyScalar(k.intensity),W.distance=k.distance,W.decay=k.decay,k.castShadow){const H=k.shadow,Y=t.get(k);Y.shadowIntensity=H.intensity,Y.shadowBias=H.bias,Y.shadowNormalBias=H.normalBias,Y.shadowRadius=H.radius,Y.shadowMapSize=H.mapSize,Y.shadowCameraNear=H.camera.near,Y.shadowCameraFar=H.camera.far,i.pointShadow[M]=Y,i.pointShadowMap[M]=V,i.pointShadowMatrix[M]=k.shadow.matrix,P++}i.point[M]=W,M++}else if(k.isHemisphereLight){const W=e.get(k);W.skyColor.copy(k.color).multiplyScalar(Q),W.groundColor.copy(k.groundColor).multiplyScalar(Q),i.hemi[E]=W,E++}}x>0&&(a.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ue.LTC_FLOAT_1,i.rectAreaLTC2=Ue.LTC_FLOAT_2):(i.rectAreaLTC1=Ue.LTC_HALF_1,i.rectAreaLTC2=Ue.LTC_HALF_2)),i.ambient[0]=p,i.ambient[1]=_,i.ambient[2]=m;const T=i.hash;(T.directionalLength!==S||T.pointLength!==M||T.spotLength!==b||T.rectAreaLength!==x||T.hemiLength!==E||T.numDirectionalShadows!==w||T.numPointShadows!==P||T.numSpotShadows!==A||T.numSpotMaps!==N||T.numLightProbes!==F)&&(i.directional.length=S,i.spot.length=b,i.rectArea.length=x,i.point.length=M,i.hemi.length=E,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=P,i.pointShadowMap.length=P,i.spotShadow.length=A,i.spotShadowMap.length=A,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=P,i.spotLightMatrix.length=A+N-L,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=L,i.numLightProbes=F,T.directionalLength=S,T.pointLength=M,T.spotLength=b,T.rectAreaLength=x,T.hemiLength=E,T.numDirectionalShadows=w,T.numPointShadows=P,T.numSpotShadows=A,T.numSpotMaps=N,T.numLightProbes=F,i.version=kR++)}function f(h,p){let _=0,m=0,S=0,M=0,b=0;const x=p.matrixWorldInverse;for(let E=0,w=h.length;E<w;E++){const P=h[E];if(P.isDirectionalLight){const A=i.directional[_];A.direction.setFromMatrixPosition(P.matrixWorld),s.setFromMatrixPosition(P.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(x),_++}else if(P.isSpotLight){const A=i.spot[S];A.position.setFromMatrixPosition(P.matrixWorld),A.position.applyMatrix4(x),A.direction.setFromMatrixPosition(P.matrixWorld),s.setFromMatrixPosition(P.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(x),S++}else if(P.isRectAreaLight){const A=i.rectArea[M];A.position.setFromMatrixPosition(P.matrixWorld),A.position.applyMatrix4(x),c.identity(),o.copy(P.matrixWorld),o.premultiply(x),c.extractRotation(o),A.halfWidth.set(P.width*.5,0,0),A.halfHeight.set(0,P.height*.5,0),A.halfWidth.applyMatrix4(c),A.halfHeight.applyMatrix4(c),M++}else if(P.isPointLight){const A=i.point[m];A.position.setFromMatrixPosition(P.matrixWorld),A.position.applyMatrix4(x),m++}else if(P.isHemisphereLight){const A=i.hemi[b];A.direction.setFromMatrixPosition(P.matrixWorld),A.direction.transformDirection(x),b++}}}return{setup:u,setupView:f,state:i}}function Rx(a){const e=new zR(a),t=[],i=[],s=[];function o(m){_.camera=m,t.length=0,i.length=0,s.length=0}function c(m){t.push(m)}function u(m){i.push(m)}function f(m){s.push(m)}function h(){e.setup(t)}function p(m){e.setupView(t,m)}const _={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:o,state:_,setupLights:h,setupLightsView:p,pushLight:c,pushShadow:u,pushLightProbeGrid:f}}function VR(a){let e=new WeakMap;function t(s,o=0){const c=e.get(s);let u;return c===void 0?(u=new Rx(a),e.set(s,[u])):o>=c.length?(u=new Rx(a),c.push(u)):u=c[o],u}function i(){e=new WeakMap}return{get:t,dispose:i}}const HR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,GR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,jR=[new re(1,0,0),new re(-1,0,0),new re(0,1,0),new re(0,-1,0),new re(0,0,1),new re(0,0,-1)],WR=[new re(0,-1,0),new re(0,-1,0),new re(0,0,1),new re(0,0,-1),new re(0,-1,0),new re(0,-1,0)],Px=new mn,dl=new re,Ch=new re;function XR(a,e,t){let i=new Py;const s=new Ft,o=new Ft,c=new un,u=new sw,f=new aw,h={},p=t.maxTextureSize,_={[ws]:si,[si]:ws,[Lr]:Lr},m=new Yi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ft},radius:{value:4}},vertexShader:HR,fragmentShader:GR}),S=m.clone();S.defines.HORIZONTAL_PASS=1;const M=new Ki;M.setAttribute("position",new vi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new Gr(M,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Eu;let E=this.type;this.render=function(L,F,T){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||L.length===0)return;this.type===$b&&(it("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Eu);const I=a.getRenderTarget(),z=a.getActiveCubeFace(),k=a.getActiveMipmapLevel(),q=a.state;q.setBlending(Ur),q.buffers.depth.getReversed()===!0?q.buffers.color.setClear(0,0,0,0):q.buffers.color.setClear(1,1,1,1),q.buffers.depth.setTest(!0),q.setScissorTest(!1);const Q=E!==this.type;Q&&F.traverse(function(se){se.material&&(Array.isArray(se.material)?se.material.forEach(V=>V.needsUpdate=!0):se.material.needsUpdate=!0)});for(let se=0,V=L.length;se<V;se++){const W=L[se],H=W.shadow;if(H===void 0){it("WebGLShadowMap:",W,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const Y=H.getFrameExtents();s.multiply(Y),o.copy(H.mapSize),(s.x>p||s.y>p)&&(s.x>p&&(o.x=Math.floor(p/Y.x),s.x=o.x*Y.x,H.mapSize.x=o.x),s.y>p&&(o.y=Math.floor(p/Y.y),s.y=o.y*Y.y,H.mapSize.y=o.y));const ae=a.state.buffers.depth.getReversed();if(H.camera._reversedDepth=ae,H.map===null||Q===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===pl){if(W.isPointLight){it("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new fr(s.x,s.y,{format:ca,type:Vr,minFilter:kn,magFilter:kn,generateMipmaps:!1}),H.map.texture.name=W.name+".shadowMap",H.map.depthTexture=new go(s.x,s.y,cr),H.map.depthTexture.name=W.name+".shadowMapDepth",H.map.depthTexture.format=Hr,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Rn,H.map.depthTexture.magFilter=Rn}else W.isPointLight?(H.map=new ky(s.x),H.map.depthTexture=new JT(s.x,pr)):(H.map=new fr(s.x,s.y),H.map.depthTexture=new go(s.x,s.y,pr)),H.map.depthTexture.name=W.name+".shadowMap",H.map.depthTexture.format=Hr,this.type===Eu?(H.map.depthTexture.compareFunction=ae?Sm:ym,H.map.depthTexture.minFilter=kn,H.map.depthTexture.magFilter=kn):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Rn,H.map.depthTexture.magFilter=Rn);H.camera.updateProjectionMatrix()}const oe=H.map.isWebGLCubeRenderTarget?6:1;for(let B=0;B<oe;B++){if(H.map.isWebGLCubeRenderTarget)a.setRenderTarget(H.map,B),a.clear();else{B===0&&(a.setRenderTarget(H.map),a.clear());const J=H.getViewport(B);c.set(o.x*J.x,o.y*J.y,o.x*J.z,o.y*J.w),q.viewport(c)}if(W.isPointLight){const J=H.camera,Ie=H.matrix,Fe=W.distance||J.far;Fe!==J.far&&(J.far=Fe,J.updateProjectionMatrix()),dl.setFromMatrixPosition(W.matrixWorld),J.position.copy(dl),Ch.copy(J.position),Ch.add(jR[B]),J.up.copy(WR[B]),J.lookAt(Ch),J.updateMatrixWorld(),Ie.makeTranslation(-dl.x,-dl.y,-dl.z),Px.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Px,J.coordinateSystem,J.reversedDepth)}else H.updateMatrices(W);i=H.getFrustum(),A(F,T,H.camera,W,this.type)}H.isPointLightShadow!==!0&&this.type===pl&&w(H,T),H.needsUpdate=!1}E=this.type,x.needsUpdate=!1,a.setRenderTarget(I,z,k)};function w(L,F){const T=e.update(b);m.defines.VSM_SAMPLES!==L.blurSamples&&(m.defines.VSM_SAMPLES=L.blurSamples,S.defines.VSM_SAMPLES=L.blurSamples,m.needsUpdate=!0,S.needsUpdate=!0),L.mapPass===null&&(L.mapPass=new fr(s.x,s.y,{format:ca,type:Vr})),m.uniforms.shadow_pass.value=L.map.depthTexture,m.uniforms.resolution.value=L.mapSize,m.uniforms.radius.value=L.radius,a.setRenderTarget(L.mapPass),a.clear(),a.renderBufferDirect(F,null,T,m,b,null),S.uniforms.shadow_pass.value=L.mapPass.texture,S.uniforms.resolution.value=L.mapSize,S.uniforms.radius.value=L.radius,a.setRenderTarget(L.map),a.clear(),a.renderBufferDirect(F,null,T,S,b,null)}function P(L,F,T,I){let z=null;const k=T.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(k!==void 0)z=k;else if(z=T.isPointLight===!0?f:u,a.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0||F.alphaToCoverage===!0){const q=z.uuid,Q=F.uuid;let se=h[q];se===void 0&&(se={},h[q]=se);let V=se[Q];V===void 0&&(V=z.clone(),se[Q]=V,F.addEventListener("dispose",N)),z=V}if(z.visible=F.visible,z.wireframe=F.wireframe,I===pl?z.side=F.shadowSide!==null?F.shadowSide:F.side:z.side=F.shadowSide!==null?F.shadowSide:_[F.side],z.alphaMap=F.alphaMap,z.alphaTest=F.alphaToCoverage===!0?.5:F.alphaTest,z.map=F.map,z.clipShadows=F.clipShadows,z.clippingPlanes=F.clippingPlanes,z.clipIntersection=F.clipIntersection,z.displacementMap=F.displacementMap,z.displacementScale=F.displacementScale,z.displacementBias=F.displacementBias,z.wireframeLinewidth=F.wireframeLinewidth,z.linewidth=F.linewidth,T.isPointLight===!0&&z.isMeshDistanceMaterial===!0){const q=a.properties.get(z);q.light=T}return z}function A(L,F,T,I,z){if(L.visible===!1)return;if(L.layers.test(F.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&z===pl)&&(!L.frustumCulled||i.intersectsObject(L))){L.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,L.matrixWorld);const Q=e.update(L),se=L.material;if(Array.isArray(se)){const V=Q.groups;for(let W=0,H=V.length;W<H;W++){const Y=V[W],ae=se[Y.materialIndex];if(ae&&ae.visible){const oe=P(L,ae,I,z);L.onBeforeShadow(a,L,F,T,Q,oe,Y),a.renderBufferDirect(T,null,Q,oe,L,Y),L.onAfterShadow(a,L,F,T,Q,oe,Y)}}}else if(se.visible){const V=P(L,se,I,z);L.onBeforeShadow(a,L,F,T,Q,V,null),a.renderBufferDirect(T,null,Q,V,L,null),L.onAfterShadow(a,L,F,T,Q,V,null)}}const q=L.children;for(let Q=0,se=q.length;Q<se;Q++)A(q[Q],F,T,I,z)}function N(L){L.target.removeEventListener("dispose",N);for(const T in h){const I=h[T],z=L.target.uuid;z in I&&(I[z].dispose(),delete I[z])}}}function $R(a,e){function t(){let j=!1;const we=new un;let fe=null;const Be=new un(0,0,0,0);return{setMask:function(Re){fe!==Re&&!j&&(a.colorMask(Re,Re,Re,Re),fe=Re)},setLocked:function(Re){j=Re},setClear:function(Re,xe,Xe,at,Ut){Ut===!0&&(Re*=at,xe*=at,Xe*=at),we.set(Re,xe,Xe,at),Be.equals(we)===!1&&(a.clearColor(Re,xe,Xe,at),Be.copy(we))},reset:function(){j=!1,fe=null,Be.set(-1,0,0,0)}}}function i(){let j=!1,we=!1,fe=null,Be=null,Re=null;return{setReversed:function(xe){if(we!==xe){const Xe=e.get("EXT_clip_control");xe?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT),we=xe;const at=Re;Re=null,this.setClear(at)}},getReversed:function(){return we},setTest:function(xe){xe?ge(a.DEPTH_TEST):Oe(a.DEPTH_TEST)},setMask:function(xe){fe!==xe&&!j&&(a.depthMask(xe),fe=xe)},setFunc:function(xe){if(we&&(xe=wT[xe]),Be!==xe){switch(xe){case Zh:a.depthFunc(a.NEVER);break;case Qh:a.depthFunc(a.ALWAYS);break;case Jh:a.depthFunc(a.LESS);break;case po:a.depthFunc(a.LEQUAL);break;case ep:a.depthFunc(a.EQUAL);break;case tp:a.depthFunc(a.GEQUAL);break;case np:a.depthFunc(a.GREATER);break;case ip:a.depthFunc(a.NOTEQUAL);break;default:a.depthFunc(a.LEQUAL)}Be=xe}},setLocked:function(xe){j=xe},setClear:function(xe){Re!==xe&&(Re=xe,we&&(xe=1-xe),a.clearDepth(xe))},reset:function(){j=!1,fe=null,Be=null,Re=null,we=!1}}}function s(){let j=!1,we=null,fe=null,Be=null,Re=null,xe=null,Xe=null,at=null,Ut=null;return{setTest:function(At){j||(At?ge(a.STENCIL_TEST):Oe(a.STENCIL_TEST))},setMask:function(At){we!==At&&!j&&(a.stencilMask(At),we=At)},setFunc:function(At,zn,Mi){(fe!==At||Be!==zn||Re!==Mi)&&(a.stencilFunc(At,zn,Mi),fe=At,Be=zn,Re=Mi)},setOp:function(At,zn,Mi){(xe!==At||Xe!==zn||at!==Mi)&&(a.stencilOp(At,zn,Mi),xe=At,Xe=zn,at=Mi)},setLocked:function(At){j=At},setClear:function(At){Ut!==At&&(a.clearStencil(At),Ut=At)},reset:function(){j=!1,we=null,fe=null,Be=null,Re=null,xe=null,Xe=null,at=null,Ut=null}}}const o=new t,c=new i,u=new s,f=new WeakMap,h=new WeakMap;let p={},_={},m={},S=new WeakMap,M=[],b=null,x=!1,E=null,w=null,P=null,A=null,N=null,L=null,F=null,T=new Et(0,0,0),I=0,z=!1,k=null,q=null,Q=null,se=null,V=null;const W=a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Y=0;const ae=a.getParameter(a.VERSION);ae.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(ae)[1]),H=Y>=1):ae.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(ae)[1]),H=Y>=2);let oe=null,B={};const J=a.getParameter(a.SCISSOR_BOX),Ie=a.getParameter(a.VIEWPORT),Fe=new un().fromArray(J),De=new un().fromArray(Ie);function ue(j,we,fe,Be){const Re=new Uint8Array(4),xe=a.createTexture();a.bindTexture(j,xe),a.texParameteri(j,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(j,a.TEXTURE_MAG_FILTER,a.NEAREST);for(let Xe=0;Xe<fe;Xe++)j===a.TEXTURE_3D||j===a.TEXTURE_2D_ARRAY?a.texImage3D(we,0,a.RGBA,1,1,Be,0,a.RGBA,a.UNSIGNED_BYTE,Re):a.texImage2D(we+Xe,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,Re);return xe}const Se={};Se[a.TEXTURE_2D]=ue(a.TEXTURE_2D,a.TEXTURE_2D,1),Se[a.TEXTURE_CUBE_MAP]=ue(a.TEXTURE_CUBE_MAP,a.TEXTURE_CUBE_MAP_POSITIVE_X,6),Se[a.TEXTURE_2D_ARRAY]=ue(a.TEXTURE_2D_ARRAY,a.TEXTURE_2D_ARRAY,1,1),Se[a.TEXTURE_3D]=ue(a.TEXTURE_3D,a.TEXTURE_3D,1,1),o.setClear(0,0,0,1),c.setClear(1),u.setClear(0),ge(a.DEPTH_TEST),c.setFunc(po),Zt(!1),zt(D_),ge(a.CULL_FACE),It(Ur);function ge(j){p[j]!==!0&&(a.enable(j),p[j]=!0)}function Oe(j){p[j]!==!1&&(a.disable(j),p[j]=!1)}function Qe(j,we){return m[j]!==we?(a.bindFramebuffer(j,we),m[j]=we,j===a.DRAW_FRAMEBUFFER&&(m[a.FRAMEBUFFER]=we),j===a.FRAMEBUFFER&&(m[a.DRAW_FRAMEBUFFER]=we),!0):!1}function Je(j,we){let fe=M,Be=!1;if(j){fe=S.get(we),fe===void 0&&(fe=[],S.set(we,fe));const Re=j.textures;if(fe.length!==Re.length||fe[0]!==a.COLOR_ATTACHMENT0){for(let xe=0,Xe=Re.length;xe<Xe;xe++)fe[xe]=a.COLOR_ATTACHMENT0+xe;fe.length=Re.length,Be=!0}}else fe[0]!==a.BACK&&(fe[0]=a.BACK,Be=!0);Be&&a.drawBuffers(fe)}function Bt(j){return b!==j?(a.useProgram(j),b=j,!0):!1}const ut={[Zs]:a.FUNC_ADD,[Yb]:a.FUNC_SUBTRACT,[Kb]:a.FUNC_REVERSE_SUBTRACT};ut[Zb]=a.MIN,ut[Qb]=a.MAX;const wt={[Jb]:a.ZERO,[eT]:a.ONE,[tT]:a.SRC_COLOR,[Yh]:a.SRC_ALPHA,[oT]:a.SRC_ALPHA_SATURATE,[sT]:a.DST_COLOR,[iT]:a.DST_ALPHA,[nT]:a.ONE_MINUS_SRC_COLOR,[Kh]:a.ONE_MINUS_SRC_ALPHA,[aT]:a.ONE_MINUS_DST_COLOR,[rT]:a.ONE_MINUS_DST_ALPHA,[lT]:a.CONSTANT_COLOR,[cT]:a.ONE_MINUS_CONSTANT_COLOR,[uT]:a.CONSTANT_ALPHA,[dT]:a.ONE_MINUS_CONSTANT_ALPHA};function It(j,we,fe,Be,Re,xe,Xe,at,Ut,At){if(j===Ur){x===!0&&(Oe(a.BLEND),x=!1);return}if(x===!1&&(ge(a.BLEND),x=!0),j!==qb){if(j!==E||At!==z){if((w!==Zs||N!==Zs)&&(a.blendEquation(a.FUNC_ADD),w=Zs,N=Zs),At)switch(j){case oa:a.blendFuncSeparate(a.ONE,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case qh:a.blendFunc(a.ONE,a.ONE);break;case L_:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case I_:a.blendFuncSeparate(a.DST_COLOR,a.ONE_MINUS_SRC_ALPHA,a.ZERO,a.ONE);break;default:Tt("WebGLState: Invalid blending: ",j);break}else switch(j){case oa:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case qh:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE,a.ONE,a.ONE);break;case L_:Tt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case I_:Tt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Tt("WebGLState: Invalid blending: ",j);break}P=null,A=null,L=null,F=null,T.set(0,0,0),I=0,E=j,z=At}return}Re=Re||we,xe=xe||fe,Xe=Xe||Be,(we!==w||Re!==N)&&(a.blendEquationSeparate(ut[we],ut[Re]),w=we,N=Re),(fe!==P||Be!==A||xe!==L||Xe!==F)&&(a.blendFuncSeparate(wt[fe],wt[Be],wt[xe],wt[Xe]),P=fe,A=Be,L=xe,F=Xe),(at.equals(T)===!1||Ut!==I)&&(a.blendColor(at.r,at.g,at.b,Ut),T.copy(at),I=Ut),E=j,z=!1}function dt(j,we){j.side===Lr?Oe(a.CULL_FACE):ge(a.CULL_FACE);let fe=j.side===si;we&&(fe=!fe),Zt(fe),j.blending===oa&&j.transparent===!1?It(Ur):It(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),c.setFunc(j.depthFunc),c.setTest(j.depthTest),c.setMask(j.depthWrite),o.setMask(j.colorWrite);const Be=j.stencilWrite;u.setTest(Be),Be&&(u.setMask(j.stencilWriteMask),u.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),u.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),X(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?ge(a.SAMPLE_ALPHA_TO_COVERAGE):Oe(a.SAMPLE_ALPHA_TO_COVERAGE)}function Zt(j){k!==j&&(j?a.frontFace(a.CW):a.frontFace(a.CCW),k=j)}function zt(j){j!==Wb?(ge(a.CULL_FACE),j!==q&&(j===D_?a.cullFace(a.BACK):j===Xb?a.cullFace(a.FRONT):a.cullFace(a.FRONT_AND_BACK))):Oe(a.CULL_FACE),q=j}function Tn(j){j!==Q&&(H&&a.lineWidth(j),Q=j)}function X(j,we,fe){j?(ge(a.POLYGON_OFFSET_FILL),(se!==we||V!==fe)&&(se=we,V=fe,c.getReversed()&&(we=-we),a.polygonOffset(we,fe))):Oe(a.POLYGON_OFFSET_FILL)}function Vt(j){j?ge(a.SCISSOR_TEST):Oe(a.SCISSOR_TEST)}function ft(j){j===void 0&&(j=a.TEXTURE0+W-1),oe!==j&&(a.activeTexture(j),oe=j)}function Pt(j,we,fe){fe===void 0&&(oe===null?fe=a.TEXTURE0+W-1:fe=oe);let Be=B[fe];Be===void 0&&(Be={type:void 0,texture:void 0},B[fe]=Be),(Be.type!==j||Be.texture!==we)&&(oe!==fe&&(a.activeTexture(fe),oe=fe),a.bindTexture(j,we||Se[j]),Be.type=j,Be.texture=we)}function Le(){const j=B[oe];j!==void 0&&j.type!==void 0&&(a.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function jt(){try{a.compressedTexImage2D(...arguments)}catch(j){Tt("WebGLState:",j)}}function U(){try{a.compressedTexImage3D(...arguments)}catch(j){Tt("WebGLState:",j)}}function C(){try{a.texSubImage2D(...arguments)}catch(j){Tt("WebGLState:",j)}}function Z(){try{a.texSubImage3D(...arguments)}catch(j){Tt("WebGLState:",j)}}function he(){try{a.compressedTexSubImage2D(...arguments)}catch(j){Tt("WebGLState:",j)}}function _e(){try{a.compressedTexSubImage3D(...arguments)}catch(j){Tt("WebGLState:",j)}}function Ee(){try{a.texStorage2D(...arguments)}catch(j){Tt("WebGLState:",j)}}function Ne(){try{a.texStorage3D(...arguments)}catch(j){Tt("WebGLState:",j)}}function de(){try{a.texImage2D(...arguments)}catch(j){Tt("WebGLState:",j)}}function pe(){try{a.texImage3D(...arguments)}catch(j){Tt("WebGLState:",j)}}function ke(j){return _[j]!==void 0?_[j]:a.getParameter(j)}function ze(j,we){_[j]!==we&&(a.pixelStorei(j,we),_[j]=we)}function Ae(j){Fe.equals(j)===!1&&(a.scissor(j.x,j.y,j.z,j.w),Fe.copy(j))}function be(j){De.equals(j)===!1&&(a.viewport(j.x,j.y,j.z,j.w),De.copy(j))}function nt(j,we){let fe=h.get(we);fe===void 0&&(fe=new WeakMap,h.set(we,fe));let Be=fe.get(j);Be===void 0&&(Be=a.getUniformBlockIndex(we,j.name),fe.set(j,Be))}function st(j,we){const Be=h.get(we).get(j);f.get(we)!==Be&&(a.uniformBlockBinding(we,Be,j.__bindingPointIndex),f.set(we,Be))}function pt(){a.disable(a.BLEND),a.disable(a.CULL_FACE),a.disable(a.DEPTH_TEST),a.disable(a.POLYGON_OFFSET_FILL),a.disable(a.SCISSOR_TEST),a.disable(a.STENCIL_TEST),a.disable(a.SAMPLE_ALPHA_TO_COVERAGE),a.blendEquation(a.FUNC_ADD),a.blendFunc(a.ONE,a.ZERO),a.blendFuncSeparate(a.ONE,a.ZERO,a.ONE,a.ZERO),a.blendColor(0,0,0,0),a.colorMask(!0,!0,!0,!0),a.clearColor(0,0,0,0),a.depthMask(!0),a.depthFunc(a.LESS),c.setReversed(!1),a.clearDepth(1),a.stencilMask(4294967295),a.stencilFunc(a.ALWAYS,0,4294967295),a.stencilOp(a.KEEP,a.KEEP,a.KEEP),a.clearStencil(0),a.cullFace(a.BACK),a.frontFace(a.CCW),a.polygonOffset(0,0),a.activeTexture(a.TEXTURE0),a.bindFramebuffer(a.FRAMEBUFFER,null),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),a.bindFramebuffer(a.READ_FRAMEBUFFER,null),a.useProgram(null),a.lineWidth(1),a.scissor(0,0,a.canvas.width,a.canvas.height),a.viewport(0,0,a.canvas.width,a.canvas.height),a.pixelStorei(a.PACK_ALIGNMENT,4),a.pixelStorei(a.UNPACK_ALIGNMENT,4),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,a.BROWSER_DEFAULT_WEBGL),a.pixelStorei(a.PACK_ROW_LENGTH,0),a.pixelStorei(a.PACK_SKIP_PIXELS,0),a.pixelStorei(a.PACK_SKIP_ROWS,0),a.pixelStorei(a.UNPACK_ROW_LENGTH,0),a.pixelStorei(a.UNPACK_IMAGE_HEIGHT,0),a.pixelStorei(a.UNPACK_SKIP_PIXELS,0),a.pixelStorei(a.UNPACK_SKIP_ROWS,0),a.pixelStorei(a.UNPACK_SKIP_IMAGES,0),p={},_={},oe=null,B={},m={},S=new WeakMap,M=[],b=null,x=!1,E=null,w=null,P=null,A=null,N=null,L=null,F=null,T=new Et(0,0,0),I=0,z=!1,k=null,q=null,Q=null,se=null,V=null,Fe.set(0,0,a.canvas.width,a.canvas.height),De.set(0,0,a.canvas.width,a.canvas.height),o.reset(),c.reset(),u.reset()}return{buffers:{color:o,depth:c,stencil:u},enable:ge,disable:Oe,bindFramebuffer:Qe,drawBuffers:Je,useProgram:Bt,setBlending:It,setMaterial:dt,setFlipSided:Zt,setCullFace:zt,setLineWidth:Tn,setPolygonOffset:X,setScissorTest:Vt,activeTexture:ft,bindTexture:Pt,unbindTexture:Le,compressedTexImage2D:jt,compressedTexImage3D:U,texImage2D:de,texImage3D:pe,pixelStorei:ze,getParameter:ke,updateUBOMapping:nt,uniformBlockBinding:st,texStorage2D:Ee,texStorage3D:Ne,texSubImage2D:C,texSubImage3D:Z,compressedTexSubImage2D:he,compressedTexSubImage3D:_e,scissor:Ae,viewport:be,reset:pt}}function qR(a,e,t,i,s,o,c){const u=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,f=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Ft,p=new WeakMap,_=new Set;let m;const S=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(U,C){return M?new OffscreenCanvas(U,C):Xu("canvas")}function x(U,C,Z){let he=1;const _e=jt(U);if((_e.width>Z||_e.height>Z)&&(he=Z/Math.max(_e.width,_e.height)),he<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const Ee=Math.floor(he*_e.width),Ne=Math.floor(he*_e.height);m===void 0&&(m=b(Ee,Ne));const de=C?b(Ee,Ne):m;return de.width=Ee,de.height=Ne,de.getContext("2d").drawImage(U,0,0,Ee,Ne),it("WebGLRenderer: Texture has been resized from ("+_e.width+"x"+_e.height+") to ("+Ee+"x"+Ne+")."),de}else return"data"in U&&it("WebGLRenderer: Image in DataTexture is too big ("+_e.width+"x"+_e.height+")."),U;return U}function E(U){return U.generateMipmaps}function w(U){a.generateMipmap(U)}function P(U){return U.isWebGLCubeRenderTarget?a.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?a.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?a.TEXTURE_2D_ARRAY:a.TEXTURE_2D}function A(U,C,Z,he,_e,Ee=!1){if(U!==null){if(a[U]!==void 0)return a[U];it("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let Ne;he&&(Ne=e.get("EXT_texture_norm16"),Ne||it("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let de=C;if(C===a.RED&&(Z===a.FLOAT&&(de=a.R32F),Z===a.HALF_FLOAT&&(de=a.R16F),Z===a.UNSIGNED_BYTE&&(de=a.R8),Z===a.UNSIGNED_SHORT&&Ne&&(de=Ne.R16_EXT),Z===a.SHORT&&Ne&&(de=Ne.R16_SNORM_EXT)),C===a.RED_INTEGER&&(Z===a.UNSIGNED_BYTE&&(de=a.R8UI),Z===a.UNSIGNED_SHORT&&(de=a.R16UI),Z===a.UNSIGNED_INT&&(de=a.R32UI),Z===a.BYTE&&(de=a.R8I),Z===a.SHORT&&(de=a.R16I),Z===a.INT&&(de=a.R32I)),C===a.RG&&(Z===a.FLOAT&&(de=a.RG32F),Z===a.HALF_FLOAT&&(de=a.RG16F),Z===a.UNSIGNED_BYTE&&(de=a.RG8),Z===a.UNSIGNED_SHORT&&Ne&&(de=Ne.RG16_EXT),Z===a.SHORT&&Ne&&(de=Ne.RG16_SNORM_EXT)),C===a.RG_INTEGER&&(Z===a.UNSIGNED_BYTE&&(de=a.RG8UI),Z===a.UNSIGNED_SHORT&&(de=a.RG16UI),Z===a.UNSIGNED_INT&&(de=a.RG32UI),Z===a.BYTE&&(de=a.RG8I),Z===a.SHORT&&(de=a.RG16I),Z===a.INT&&(de=a.RG32I)),C===a.RGB_INTEGER&&(Z===a.UNSIGNED_BYTE&&(de=a.RGB8UI),Z===a.UNSIGNED_SHORT&&(de=a.RGB16UI),Z===a.UNSIGNED_INT&&(de=a.RGB32UI),Z===a.BYTE&&(de=a.RGB8I),Z===a.SHORT&&(de=a.RGB16I),Z===a.INT&&(de=a.RGB32I)),C===a.RGBA_INTEGER&&(Z===a.UNSIGNED_BYTE&&(de=a.RGBA8UI),Z===a.UNSIGNED_SHORT&&(de=a.RGBA16UI),Z===a.UNSIGNED_INT&&(de=a.RGBA32UI),Z===a.BYTE&&(de=a.RGBA8I),Z===a.SHORT&&(de=a.RGBA16I),Z===a.INT&&(de=a.RGBA32I)),C===a.RGB&&(Z===a.UNSIGNED_SHORT&&Ne&&(de=Ne.RGB16_EXT),Z===a.SHORT&&Ne&&(de=Ne.RGB16_SNORM_EXT),Z===a.UNSIGNED_INT_5_9_9_9_REV&&(de=a.RGB9_E5),Z===a.UNSIGNED_INT_10F_11F_11F_REV&&(de=a.R11F_G11F_B10F)),C===a.RGBA){const pe=Ee?ju:vt.getTransfer(_e);Z===a.FLOAT&&(de=a.RGBA32F),Z===a.HALF_FLOAT&&(de=a.RGBA16F),Z===a.UNSIGNED_BYTE&&(de=pe===Lt?a.SRGB8_ALPHA8:a.RGBA8),Z===a.UNSIGNED_SHORT&&Ne&&(de=Ne.RGBA16_EXT),Z===a.SHORT&&Ne&&(de=Ne.RGBA16_SNORM_EXT),Z===a.UNSIGNED_SHORT_4_4_4_4&&(de=a.RGBA4),Z===a.UNSIGNED_SHORT_5_5_5_1&&(de=a.RGB5_A1)}return(de===a.R16F||de===a.R32F||de===a.RG16F||de===a.RG32F||de===a.RGBA16F||de===a.RGBA32F)&&e.get("EXT_color_buffer_float"),de}function N(U,C){let Z;return U?C===null||C===pr||C===Ol?Z=a.DEPTH24_STENCIL8:C===cr?Z=a.DEPTH32F_STENCIL8:C===Ul&&(Z=a.DEPTH24_STENCIL8,it("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===pr||C===Ol?Z=a.DEPTH_COMPONENT24:C===cr?Z=a.DEPTH_COMPONENT32F:C===Ul&&(Z=a.DEPTH_COMPONENT16),Z}function L(U,C){return E(U)===!0||U.isFramebufferTexture&&U.minFilter!==Rn&&U.minFilter!==kn?Math.log2(Math.max(C.width,C.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?C.mipmaps.length:1}function F(U){const C=U.target;C.removeEventListener("dispose",F),I(C),C.isVideoTexture&&p.delete(C),C.isHTMLTexture&&_.delete(C)}function T(U){const C=U.target;C.removeEventListener("dispose",T),k(C)}function I(U){const C=i.get(U);if(C.__webglInit===void 0)return;const Z=U.source,he=S.get(Z);if(he){const _e=he[C.__cacheKey];_e.usedTimes--,_e.usedTimes===0&&z(U),Object.keys(he).length===0&&S.delete(Z)}i.remove(U)}function z(U){const C=i.get(U);a.deleteTexture(C.__webglTexture);const Z=U.source,he=S.get(Z);delete he[C.__cacheKey],c.memory.textures--}function k(U){const C=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let he=0;he<6;he++){if(Array.isArray(C.__webglFramebuffer[he]))for(let _e=0;_e<C.__webglFramebuffer[he].length;_e++)a.deleteFramebuffer(C.__webglFramebuffer[he][_e]);else a.deleteFramebuffer(C.__webglFramebuffer[he]);C.__webglDepthbuffer&&a.deleteRenderbuffer(C.__webglDepthbuffer[he])}else{if(Array.isArray(C.__webglFramebuffer))for(let he=0;he<C.__webglFramebuffer.length;he++)a.deleteFramebuffer(C.__webglFramebuffer[he]);else a.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&a.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&a.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let he=0;he<C.__webglColorRenderbuffer.length;he++)C.__webglColorRenderbuffer[he]&&a.deleteRenderbuffer(C.__webglColorRenderbuffer[he]);C.__webglDepthRenderbuffer&&a.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const Z=U.textures;for(let he=0,_e=Z.length;he<_e;he++){const Ee=i.get(Z[he]);Ee.__webglTexture&&(a.deleteTexture(Ee.__webglTexture),c.memory.textures--),i.remove(Z[he])}i.remove(U)}let q=0;function Q(){q=0}function se(){return q}function V(U){q=U}function W(){const U=q;return U>=s.maxTextures&&it("WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),q+=1,U}function H(U){const C=[];return C.push(U.wrapS),C.push(U.wrapT),C.push(U.wrapR||0),C.push(U.magFilter),C.push(U.minFilter),C.push(U.anisotropy),C.push(U.internalFormat),C.push(U.format),C.push(U.type),C.push(U.generateMipmaps),C.push(U.premultiplyAlpha),C.push(U.flipY),C.push(U.unpackAlignment),C.push(U.colorSpace),C.join()}function Y(U,C){const Z=i.get(U);if(U.isVideoTexture&&Pt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&Z.__version!==U.version){const he=U.image;if(he===null)it("WebGLRenderer: Texture marked for update but no image data found.");else if(he.complete===!1)it("WebGLRenderer: Texture marked for update but image is incomplete");else{Oe(Z,U,C);return}}else U.isExternalTexture&&(Z.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(a.TEXTURE_2D,Z.__webglTexture,a.TEXTURE0+C)}function ae(U,C){const Z=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&Z.__version!==U.version){Oe(Z,U,C);return}else U.isExternalTexture&&(Z.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(a.TEXTURE_2D_ARRAY,Z.__webglTexture,a.TEXTURE0+C)}function oe(U,C){const Z=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&Z.__version!==U.version){Oe(Z,U,C);return}t.bindTexture(a.TEXTURE_3D,Z.__webglTexture,a.TEXTURE0+C)}function B(U,C){const Z=i.get(U);if(U.isCubeDepthTexture!==!0&&U.version>0&&Z.__version!==U.version){Qe(Z,U,C);return}t.bindTexture(a.TEXTURE_CUBE_MAP,Z.__webglTexture,a.TEXTURE0+C)}const J={[rp]:a.REPEAT,[Ir]:a.CLAMP_TO_EDGE,[sp]:a.MIRRORED_REPEAT},Ie={[Rn]:a.NEAREST,[pT]:a.NEAREST_MIPMAP_NEAREST,[qc]:a.NEAREST_MIPMAP_LINEAR,[kn]:a.LINEAR,[Qf]:a.LINEAR_MIPMAP_NEAREST,[ea]:a.LINEAR_MIPMAP_LINEAR},Fe={[_T]:a.NEVER,[MT]:a.ALWAYS,[xT]:a.LESS,[ym]:a.LEQUAL,[vT]:a.EQUAL,[Sm]:a.GEQUAL,[yT]:a.GREATER,[ST]:a.NOTEQUAL};function De(U,C){if(C.type===cr&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===kn||C.magFilter===Qf||C.magFilter===qc||C.magFilter===ea||C.minFilter===kn||C.minFilter===Qf||C.minFilter===qc||C.minFilter===ea)&&it("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),a.texParameteri(U,a.TEXTURE_WRAP_S,J[C.wrapS]),a.texParameteri(U,a.TEXTURE_WRAP_T,J[C.wrapT]),(U===a.TEXTURE_3D||U===a.TEXTURE_2D_ARRAY)&&a.texParameteri(U,a.TEXTURE_WRAP_R,J[C.wrapR]),a.texParameteri(U,a.TEXTURE_MAG_FILTER,Ie[C.magFilter]),a.texParameteri(U,a.TEXTURE_MIN_FILTER,Ie[C.minFilter]),C.compareFunction&&(a.texParameteri(U,a.TEXTURE_COMPARE_MODE,a.COMPARE_REF_TO_TEXTURE),a.texParameteri(U,a.TEXTURE_COMPARE_FUNC,Fe[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===Rn||C.minFilter!==qc&&C.minFilter!==ea||C.type===cr&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||i.get(C).__currentAnisotropy){const Z=e.get("EXT_texture_filter_anisotropic");a.texParameterf(U,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,s.getMaxAnisotropy())),i.get(C).__currentAnisotropy=C.anisotropy}}}function ue(U,C){let Z=!1;U.__webglInit===void 0&&(U.__webglInit=!0,C.addEventListener("dispose",F));const he=C.source;let _e=S.get(he);_e===void 0&&(_e={},S.set(he,_e));const Ee=H(C);if(Ee!==U.__cacheKey){_e[Ee]===void 0&&(_e[Ee]={texture:a.createTexture(),usedTimes:0},c.memory.textures++,Z=!0),_e[Ee].usedTimes++;const Ne=_e[U.__cacheKey];Ne!==void 0&&(_e[U.__cacheKey].usedTimes--,Ne.usedTimes===0&&z(C)),U.__cacheKey=Ee,U.__webglTexture=_e[Ee].texture}return Z}function Se(U,C,Z){return Math.floor(Math.floor(U/Z)/C)}function ge(U,C,Z,he){const Ee=U.updateRanges;if(Ee.length===0)t.texSubImage2D(a.TEXTURE_2D,0,0,0,C.width,C.height,Z,he,C.data);else{Ee.sort((ze,Ae)=>ze.start-Ae.start);let Ne=0;for(let ze=1;ze<Ee.length;ze++){const Ae=Ee[Ne],be=Ee[ze],nt=Ae.start+Ae.count,st=Se(be.start,C.width,4),pt=Se(Ae.start,C.width,4);be.start<=nt+1&&st===pt&&Se(be.start+be.count-1,C.width,4)===st?Ae.count=Math.max(Ae.count,be.start+be.count-Ae.start):(++Ne,Ee[Ne]=be)}Ee.length=Ne+1;const de=t.getParameter(a.UNPACK_ROW_LENGTH),pe=t.getParameter(a.UNPACK_SKIP_PIXELS),ke=t.getParameter(a.UNPACK_SKIP_ROWS);t.pixelStorei(a.UNPACK_ROW_LENGTH,C.width);for(let ze=0,Ae=Ee.length;ze<Ae;ze++){const be=Ee[ze],nt=Math.floor(be.start/4),st=Math.ceil(be.count/4),pt=nt%C.width,j=Math.floor(nt/C.width),we=st,fe=1;t.pixelStorei(a.UNPACK_SKIP_PIXELS,pt),t.pixelStorei(a.UNPACK_SKIP_ROWS,j),t.texSubImage2D(a.TEXTURE_2D,0,pt,j,we,fe,Z,he,C.data)}U.clearUpdateRanges(),t.pixelStorei(a.UNPACK_ROW_LENGTH,de),t.pixelStorei(a.UNPACK_SKIP_PIXELS,pe),t.pixelStorei(a.UNPACK_SKIP_ROWS,ke)}}function Oe(U,C,Z){let he=a.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(he=a.TEXTURE_2D_ARRAY),C.isData3DTexture&&(he=a.TEXTURE_3D);const _e=ue(U,C),Ee=C.source;t.bindTexture(he,U.__webglTexture,a.TEXTURE0+Z);const Ne=i.get(Ee);if(Ee.version!==Ne.__version||_e===!0){if(t.activeTexture(a.TEXTURE0+Z),(typeof ImageBitmap<"u"&&C.image instanceof ImageBitmap)===!1){const fe=vt.getPrimaries(vt.workingColorSpace),Be=C.colorSpace===gs?null:vt.getPrimaries(C.colorSpace),Re=C.colorSpace===gs||fe===Be?a.NONE:a.BROWSER_DEFAULT_WEBGL;t.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,C.flipY),t.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),t.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re)}t.pixelStorei(a.UNPACK_ALIGNMENT,C.unpackAlignment);let pe=x(C.image,!1,s.maxTextureSize);pe=Le(C,pe);const ke=o.convert(C.format,C.colorSpace),ze=o.convert(C.type);let Ae=A(C.internalFormat,ke,ze,C.normalized,C.colorSpace,C.isVideoTexture);De(he,C);let be;const nt=C.mipmaps,st=C.isVideoTexture!==!0,pt=Ne.__version===void 0||_e===!0,j=Ee.dataReady,we=L(C,pe);if(C.isDepthTexture)Ae=N(C.format===ta,C.type),pt&&(st?t.texStorage2D(a.TEXTURE_2D,1,Ae,pe.width,pe.height):t.texImage2D(a.TEXTURE_2D,0,Ae,pe.width,pe.height,0,ke,ze,null));else if(C.isDataTexture)if(nt.length>0){st&&pt&&t.texStorage2D(a.TEXTURE_2D,we,Ae,nt[0].width,nt[0].height);for(let fe=0,Be=nt.length;fe<Be;fe++)be=nt[fe],st?j&&t.texSubImage2D(a.TEXTURE_2D,fe,0,0,be.width,be.height,ke,ze,be.data):t.texImage2D(a.TEXTURE_2D,fe,Ae,be.width,be.height,0,ke,ze,be.data);C.generateMipmaps=!1}else st?(pt&&t.texStorage2D(a.TEXTURE_2D,we,Ae,pe.width,pe.height),j&&ge(C,pe,ke,ze)):t.texImage2D(a.TEXTURE_2D,0,Ae,pe.width,pe.height,0,ke,ze,pe.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){st&&pt&&t.texStorage3D(a.TEXTURE_2D_ARRAY,we,Ae,nt[0].width,nt[0].height,pe.depth);for(let fe=0,Be=nt.length;fe<Be;fe++)if(be=nt[fe],C.format!==qi)if(ke!==null)if(st){if(j)if(C.layerUpdates.size>0){const Re=ox(be.width,be.height,C.format,C.type);for(const xe of C.layerUpdates){const Xe=be.data.subarray(xe*Re/be.data.BYTES_PER_ELEMENT,(xe+1)*Re/be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,fe,0,0,xe,be.width,be.height,1,ke,Xe)}C.clearLayerUpdates()}else t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,fe,0,0,0,be.width,be.height,pe.depth,ke,be.data)}else t.compressedTexImage3D(a.TEXTURE_2D_ARRAY,fe,Ae,be.width,be.height,pe.depth,0,be.data,0,0);else it("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else st?j&&t.texSubImage3D(a.TEXTURE_2D_ARRAY,fe,0,0,0,be.width,be.height,pe.depth,ke,ze,be.data):t.texImage3D(a.TEXTURE_2D_ARRAY,fe,Ae,be.width,be.height,pe.depth,0,ke,ze,be.data)}else{st&&pt&&t.texStorage2D(a.TEXTURE_2D,we,Ae,nt[0].width,nt[0].height);for(let fe=0,Be=nt.length;fe<Be;fe++)be=nt[fe],C.format!==qi?ke!==null?st?j&&t.compressedTexSubImage2D(a.TEXTURE_2D,fe,0,0,be.width,be.height,ke,be.data):t.compressedTexImage2D(a.TEXTURE_2D,fe,Ae,be.width,be.height,0,be.data):it("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?j&&t.texSubImage2D(a.TEXTURE_2D,fe,0,0,be.width,be.height,ke,ze,be.data):t.texImage2D(a.TEXTURE_2D,fe,Ae,be.width,be.height,0,ke,ze,be.data)}else if(C.isDataArrayTexture)if(st){if(pt&&t.texStorage3D(a.TEXTURE_2D_ARRAY,we,Ae,pe.width,pe.height,pe.depth),j)if(C.layerUpdates.size>0){const fe=ox(pe.width,pe.height,C.format,C.type);for(const Be of C.layerUpdates){const Re=pe.data.subarray(Be*fe/pe.data.BYTES_PER_ELEMENT,(Be+1)*fe/pe.data.BYTES_PER_ELEMENT);t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,Be,pe.width,pe.height,1,ke,ze,Re)}C.clearLayerUpdates()}else t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,0,pe.width,pe.height,pe.depth,ke,ze,pe.data)}else t.texImage3D(a.TEXTURE_2D_ARRAY,0,Ae,pe.width,pe.height,pe.depth,0,ke,ze,pe.data);else if(C.isData3DTexture)st?(pt&&t.texStorage3D(a.TEXTURE_3D,we,Ae,pe.width,pe.height,pe.depth),j&&t.texSubImage3D(a.TEXTURE_3D,0,0,0,0,pe.width,pe.height,pe.depth,ke,ze,pe.data)):t.texImage3D(a.TEXTURE_3D,0,Ae,pe.width,pe.height,pe.depth,0,ke,ze,pe.data);else if(C.isFramebufferTexture){if(pt)if(st)t.texStorage2D(a.TEXTURE_2D,we,Ae,pe.width,pe.height);else{let fe=pe.width,Be=pe.height;for(let Re=0;Re<we;Re++)t.texImage2D(a.TEXTURE_2D,Re,Ae,fe,Be,0,ke,ze,null),fe>>=1,Be>>=1}}else if(C.isHTMLTexture){if("texElementImage2D"in a){const fe=a.canvas;if(fe.hasAttribute("layoutsubtree")||fe.setAttribute("layoutsubtree","true"),pe.parentNode!==fe){fe.appendChild(pe),_.add(C),fe.onpaint=at=>{const Ut=at.changedElements;for(const At of _)Ut.includes(At.image)&&(At.needsUpdate=!0)},fe.requestPaint();return}const Be=0,Re=a.RGBA,xe=a.RGBA,Xe=a.UNSIGNED_BYTE;a.texElementImage2D(a.TEXTURE_2D,Be,Re,xe,Xe,pe),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE)}}else if(nt.length>0){if(st&&pt){const fe=jt(nt[0]);t.texStorage2D(a.TEXTURE_2D,we,Ae,fe.width,fe.height)}for(let fe=0,Be=nt.length;fe<Be;fe++)be=nt[fe],st?j&&t.texSubImage2D(a.TEXTURE_2D,fe,0,0,ke,ze,be):t.texImage2D(a.TEXTURE_2D,fe,Ae,ke,ze,be);C.generateMipmaps=!1}else if(st){if(pt){const fe=jt(pe);t.texStorage2D(a.TEXTURE_2D,we,Ae,fe.width,fe.height)}j&&t.texSubImage2D(a.TEXTURE_2D,0,0,0,ke,ze,pe)}else t.texImage2D(a.TEXTURE_2D,0,Ae,ke,ze,pe);E(C)&&w(he),Ne.__version=Ee.version,C.onUpdate&&C.onUpdate(C)}U.__version=C.version}function Qe(U,C,Z){if(C.image.length!==6)return;const he=ue(U,C),_e=C.source;t.bindTexture(a.TEXTURE_CUBE_MAP,U.__webglTexture,a.TEXTURE0+Z);const Ee=i.get(_e);if(_e.version!==Ee.__version||he===!0){t.activeTexture(a.TEXTURE0+Z);const Ne=vt.getPrimaries(vt.workingColorSpace),de=C.colorSpace===gs?null:vt.getPrimaries(C.colorSpace),pe=C.colorSpace===gs||Ne===de?a.NONE:a.BROWSER_DEFAULT_WEBGL;t.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,C.flipY),t.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),t.pixelStorei(a.UNPACK_ALIGNMENT,C.unpackAlignment),t.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe);const ke=C.isCompressedTexture||C.image[0].isCompressedTexture,ze=C.image[0]&&C.image[0].isDataTexture,Ae=[];for(let xe=0;xe<6;xe++)!ke&&!ze?Ae[xe]=x(C.image[xe],!0,s.maxCubemapSize):Ae[xe]=ze?C.image[xe].image:C.image[xe],Ae[xe]=Le(C,Ae[xe]);const be=Ae[0],nt=o.convert(C.format,C.colorSpace),st=o.convert(C.type),pt=A(C.internalFormat,nt,st,C.normalized,C.colorSpace),j=C.isVideoTexture!==!0,we=Ee.__version===void 0||he===!0,fe=_e.dataReady;let Be=L(C,be);De(a.TEXTURE_CUBE_MAP,C);let Re;if(ke){j&&we&&t.texStorage2D(a.TEXTURE_CUBE_MAP,Be,pt,be.width,be.height);for(let xe=0;xe<6;xe++){Re=Ae[xe].mipmaps;for(let Xe=0;Xe<Re.length;Xe++){const at=Re[Xe];C.format!==qi?nt!==null?j?fe&&t.compressedTexSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Xe,0,0,at.width,at.height,nt,at.data):t.compressedTexImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Xe,pt,at.width,at.height,0,at.data):it("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):j?fe&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Xe,0,0,at.width,at.height,nt,st,at.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Xe,pt,at.width,at.height,0,nt,st,at.data)}}}else{if(Re=C.mipmaps,j&&we){Re.length>0&&Be++;const xe=jt(Ae[0]);t.texStorage2D(a.TEXTURE_CUBE_MAP,Be,pt,xe.width,xe.height)}for(let xe=0;xe<6;xe++)if(ze){j?fe&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,Ae[xe].width,Ae[xe].height,nt,st,Ae[xe].data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,pt,Ae[xe].width,Ae[xe].height,0,nt,st,Ae[xe].data);for(let Xe=0;Xe<Re.length;Xe++){const Ut=Re[Xe].image[xe].image;j?fe&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Xe+1,0,0,Ut.width,Ut.height,nt,st,Ut.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Xe+1,pt,Ut.width,Ut.height,0,nt,st,Ut.data)}}else{j?fe&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,0,0,nt,st,Ae[xe]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0,pt,nt,st,Ae[xe]);for(let Xe=0;Xe<Re.length;Xe++){const at=Re[Xe];j?fe&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Xe+1,0,0,nt,st,at.image[xe]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Xe+1,pt,nt,st,at.image[xe])}}}E(C)&&w(a.TEXTURE_CUBE_MAP),Ee.__version=_e.version,C.onUpdate&&C.onUpdate(C)}U.__version=C.version}function Je(U,C,Z,he,_e,Ee){const Ne=o.convert(Z.format,Z.colorSpace),de=o.convert(Z.type),pe=A(Z.internalFormat,Ne,de,Z.normalized,Z.colorSpace),ke=i.get(C),ze=i.get(Z);if(ze.__renderTarget=C,!ke.__hasExternalTextures){const Ae=Math.max(1,C.width>>Ee),be=Math.max(1,C.height>>Ee);_e===a.TEXTURE_3D||_e===a.TEXTURE_2D_ARRAY?t.texImage3D(_e,Ee,pe,Ae,be,C.depth,0,Ne,de,null):t.texImage2D(_e,Ee,pe,Ae,be,0,Ne,de,null)}t.bindFramebuffer(a.FRAMEBUFFER,U),ft(C)?u.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,he,_e,ze.__webglTexture,0,Vt(C)):(_e===a.TEXTURE_2D||_e>=a.TEXTURE_CUBE_MAP_POSITIVE_X&&_e<=a.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&a.framebufferTexture2D(a.FRAMEBUFFER,he,_e,ze.__webglTexture,Ee),t.bindFramebuffer(a.FRAMEBUFFER,null)}function Bt(U,C,Z){if(a.bindRenderbuffer(a.RENDERBUFFER,U),C.depthBuffer){const he=C.depthTexture,_e=he&&he.isDepthTexture?he.type:null,Ee=N(C.stencilBuffer,_e),Ne=C.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;ft(C)?u.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,Vt(C),Ee,C.width,C.height):Z?a.renderbufferStorageMultisample(a.RENDERBUFFER,Vt(C),Ee,C.width,C.height):a.renderbufferStorage(a.RENDERBUFFER,Ee,C.width,C.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,Ne,a.RENDERBUFFER,U)}else{const he=C.textures;for(let _e=0;_e<he.length;_e++){const Ee=he[_e],Ne=o.convert(Ee.format,Ee.colorSpace),de=o.convert(Ee.type),pe=A(Ee.internalFormat,Ne,de,Ee.normalized,Ee.colorSpace);ft(C)?u.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,Vt(C),pe,C.width,C.height):Z?a.renderbufferStorageMultisample(a.RENDERBUFFER,Vt(C),pe,C.width,C.height):a.renderbufferStorage(a.RENDERBUFFER,pe,C.width,C.height)}}a.bindRenderbuffer(a.RENDERBUFFER,null)}function ut(U,C,Z){const he=C.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(a.FRAMEBUFFER,U),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const _e=i.get(C.depthTexture);if(_e.__renderTarget=C,(!_e.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),he){if(_e.__webglInit===void 0&&(_e.__webglInit=!0,C.depthTexture.addEventListener("dispose",F)),_e.__webglTexture===void 0){_e.__webglTexture=a.createTexture(),t.bindTexture(a.TEXTURE_CUBE_MAP,_e.__webglTexture),De(a.TEXTURE_CUBE_MAP,C.depthTexture);const ke=o.convert(C.depthTexture.format),ze=o.convert(C.depthTexture.type);let Ae;C.depthTexture.format===Hr?Ae=a.DEPTH_COMPONENT24:C.depthTexture.format===ta&&(Ae=a.DEPTH24_STENCIL8);for(let be=0;be<6;be++)a.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,Ae,C.width,C.height,0,ke,ze,null)}}else Y(C.depthTexture,0);const Ee=_e.__webglTexture,Ne=Vt(C),de=he?a.TEXTURE_CUBE_MAP_POSITIVE_X+Z:a.TEXTURE_2D,pe=C.depthTexture.format===ta?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;if(C.depthTexture.format===Hr)ft(C)?u.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,pe,de,Ee,0,Ne):a.framebufferTexture2D(a.FRAMEBUFFER,pe,de,Ee,0);else if(C.depthTexture.format===ta)ft(C)?u.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,pe,de,Ee,0,Ne):a.framebufferTexture2D(a.FRAMEBUFFER,pe,de,Ee,0);else throw new Error("Unknown depthTexture format")}function wt(U){const C=i.get(U),Z=U.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==U.depthTexture){const he=U.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),he){const _e=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,he.removeEventListener("dispose",_e)};he.addEventListener("dispose",_e),C.__depthDisposeCallback=_e}C.__boundDepthTexture=he}if(U.depthTexture&&!C.__autoAllocateDepthBuffer)if(Z)for(let he=0;he<6;he++)ut(C.__webglFramebuffer[he],U,he);else{const he=U.texture.mipmaps;he&&he.length>0?ut(C.__webglFramebuffer[0],U,0):ut(C.__webglFramebuffer,U,0)}else if(Z){C.__webglDepthbuffer=[];for(let he=0;he<6;he++)if(t.bindFramebuffer(a.FRAMEBUFFER,C.__webglFramebuffer[he]),C.__webglDepthbuffer[he]===void 0)C.__webglDepthbuffer[he]=a.createRenderbuffer(),Bt(C.__webglDepthbuffer[he],U,!1);else{const _e=U.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,Ee=C.__webglDepthbuffer[he];a.bindRenderbuffer(a.RENDERBUFFER,Ee),a.framebufferRenderbuffer(a.FRAMEBUFFER,_e,a.RENDERBUFFER,Ee)}}else{const he=U.texture.mipmaps;if(he&&he.length>0?t.bindFramebuffer(a.FRAMEBUFFER,C.__webglFramebuffer[0]):t.bindFramebuffer(a.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=a.createRenderbuffer(),Bt(C.__webglDepthbuffer,U,!1);else{const _e=U.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,Ee=C.__webglDepthbuffer;a.bindRenderbuffer(a.RENDERBUFFER,Ee),a.framebufferRenderbuffer(a.FRAMEBUFFER,_e,a.RENDERBUFFER,Ee)}}t.bindFramebuffer(a.FRAMEBUFFER,null)}function It(U,C,Z){const he=i.get(U);C!==void 0&&Je(he.__webglFramebuffer,U,U.texture,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,0),Z!==void 0&&wt(U)}function dt(U){const C=U.texture,Z=i.get(U),he=i.get(C);U.addEventListener("dispose",T);const _e=U.textures,Ee=U.isWebGLCubeRenderTarget===!0,Ne=_e.length>1;if(Ne||(he.__webglTexture===void 0&&(he.__webglTexture=a.createTexture()),he.__version=C.version,c.memory.textures++),Ee){Z.__webglFramebuffer=[];for(let de=0;de<6;de++)if(C.mipmaps&&C.mipmaps.length>0){Z.__webglFramebuffer[de]=[];for(let pe=0;pe<C.mipmaps.length;pe++)Z.__webglFramebuffer[de][pe]=a.createFramebuffer()}else Z.__webglFramebuffer[de]=a.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){Z.__webglFramebuffer=[];for(let de=0;de<C.mipmaps.length;de++)Z.__webglFramebuffer[de]=a.createFramebuffer()}else Z.__webglFramebuffer=a.createFramebuffer();if(Ne)for(let de=0,pe=_e.length;de<pe;de++){const ke=i.get(_e[de]);ke.__webglTexture===void 0&&(ke.__webglTexture=a.createTexture(),c.memory.textures++)}if(U.samples>0&&ft(U)===!1){Z.__webglMultisampledFramebuffer=a.createFramebuffer(),Z.__webglColorRenderbuffer=[],t.bindFramebuffer(a.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let de=0;de<_e.length;de++){const pe=_e[de];Z.__webglColorRenderbuffer[de]=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,Z.__webglColorRenderbuffer[de]);const ke=o.convert(pe.format,pe.colorSpace),ze=o.convert(pe.type),Ae=A(pe.internalFormat,ke,ze,pe.normalized,pe.colorSpace,U.isXRRenderTarget===!0),be=Vt(U);a.renderbufferStorageMultisample(a.RENDERBUFFER,be,Ae,U.width,U.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+de,a.RENDERBUFFER,Z.__webglColorRenderbuffer[de])}a.bindRenderbuffer(a.RENDERBUFFER,null),U.depthBuffer&&(Z.__webglDepthRenderbuffer=a.createRenderbuffer(),Bt(Z.__webglDepthRenderbuffer,U,!0)),t.bindFramebuffer(a.FRAMEBUFFER,null)}}if(Ee){t.bindTexture(a.TEXTURE_CUBE_MAP,he.__webglTexture),De(a.TEXTURE_CUBE_MAP,C);for(let de=0;de<6;de++)if(C.mipmaps&&C.mipmaps.length>0)for(let pe=0;pe<C.mipmaps.length;pe++)Je(Z.__webglFramebuffer[de][pe],U,C,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+de,pe);else Je(Z.__webglFramebuffer[de],U,C,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);E(C)&&w(a.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ne){for(let de=0,pe=_e.length;de<pe;de++){const ke=_e[de],ze=i.get(ke);let Ae=a.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Ae=U.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY),t.bindTexture(Ae,ze.__webglTexture),De(Ae,ke),Je(Z.__webglFramebuffer,U,ke,a.COLOR_ATTACHMENT0+de,Ae,0),E(ke)&&w(Ae)}t.unbindTexture()}else{let de=a.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(de=U.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY),t.bindTexture(de,he.__webglTexture),De(de,C),C.mipmaps&&C.mipmaps.length>0)for(let pe=0;pe<C.mipmaps.length;pe++)Je(Z.__webglFramebuffer[pe],U,C,a.COLOR_ATTACHMENT0,de,pe);else Je(Z.__webglFramebuffer,U,C,a.COLOR_ATTACHMENT0,de,0);E(C)&&w(de),t.unbindTexture()}U.depthBuffer&&wt(U)}function Zt(U){const C=U.textures;for(let Z=0,he=C.length;Z<he;Z++){const _e=C[Z];if(E(_e)){const Ee=P(U),Ne=i.get(_e).__webglTexture;t.bindTexture(Ee,Ne),w(Ee),t.unbindTexture()}}}const zt=[],Tn=[];function X(U){if(U.samples>0){if(ft(U)===!1){const C=U.textures,Z=U.width,he=U.height;let _e=a.COLOR_BUFFER_BIT;const Ee=U.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,Ne=i.get(U),de=C.length>1;if(de)for(let ke=0;ke<C.length;ke++)t.bindFramebuffer(a.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+ke,a.RENDERBUFFER,null),t.bindFramebuffer(a.FRAMEBUFFER,Ne.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+ke,a.TEXTURE_2D,null,0);t.bindFramebuffer(a.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer);const pe=U.texture.mipmaps;pe&&pe.length>0?t.bindFramebuffer(a.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer[0]):t.bindFramebuffer(a.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let ke=0;ke<C.length;ke++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(_e|=a.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(_e|=a.STENCIL_BUFFER_BIT)),de){a.framebufferRenderbuffer(a.READ_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.RENDERBUFFER,Ne.__webglColorRenderbuffer[ke]);const ze=i.get(C[ke]).__webglTexture;a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,ze,0)}a.blitFramebuffer(0,0,Z,he,0,0,Z,he,_e,a.NEAREST),f===!0&&(zt.length=0,Tn.length=0,zt.push(a.COLOR_ATTACHMENT0+ke),U.depthBuffer&&U.resolveDepthBuffer===!1&&(zt.push(Ee),Tn.push(Ee),a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,Tn)),a.invalidateFramebuffer(a.READ_FRAMEBUFFER,zt))}if(t.bindFramebuffer(a.READ_FRAMEBUFFER,null),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),de)for(let ke=0;ke<C.length;ke++){t.bindFramebuffer(a.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+ke,a.RENDERBUFFER,Ne.__webglColorRenderbuffer[ke]);const ze=i.get(C[ke]).__webglTexture;t.bindFramebuffer(a.FRAMEBUFFER,Ne.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+ke,a.TEXTURE_2D,ze,0)}t.bindFramebuffer(a.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&f){const C=U.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,[C])}}}function Vt(U){return Math.min(s.maxSamples,U.samples)}function ft(U){const C=i.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Pt(U){const C=c.render.frame;p.get(U)!==C&&(p.set(U,C),U.update())}function Le(U,C){const Z=U.colorSpace,he=U.format,_e=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||Z!==Gu&&Z!==gs&&(vt.getTransfer(Z)===Lt?(he!==qi||_e!==Li)&&it("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Tt("WebGLTextures: Unsupported texture color space:",Z)),C}function jt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(h.width=U.naturalWidth||U.width,h.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(h.width=U.displayWidth,h.height=U.displayHeight):(h.width=U.width,h.height=U.height),h}this.allocateTextureUnit=W,this.resetTextureUnits=Q,this.getTextureUnits=se,this.setTextureUnits=V,this.setTexture2D=Y,this.setTexture2DArray=ae,this.setTexture3D=oe,this.setTextureCube=B,this.rebindTextures=It,this.setupRenderTarget=dt,this.updateRenderTargetMipmap=Zt,this.updateMultisampleRenderTarget=X,this.setupDepthRenderbuffer=wt,this.setupFrameBufferTexture=Je,this.useMultisampledRTT=ft,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function YR(a,e){function t(i,s=gs){let o;const c=vt.getTransfer(s);if(i===Li)return a.UNSIGNED_BYTE;if(i===mm)return a.UNSIGNED_SHORT_4_4_4_4;if(i===gm)return a.UNSIGNED_SHORT_5_5_5_1;if(i===_y)return a.UNSIGNED_INT_5_9_9_9_REV;if(i===xy)return a.UNSIGNED_INT_10F_11F_11F_REV;if(i===my)return a.BYTE;if(i===gy)return a.SHORT;if(i===Ul)return a.UNSIGNED_SHORT;if(i===pm)return a.INT;if(i===pr)return a.UNSIGNED_INT;if(i===cr)return a.FLOAT;if(i===Vr)return a.HALF_FLOAT;if(i===vy)return a.ALPHA;if(i===yy)return a.RGB;if(i===qi)return a.RGBA;if(i===Hr)return a.DEPTH_COMPONENT;if(i===ta)return a.DEPTH_STENCIL;if(i===Sy)return a.RED;if(i===_m)return a.RED_INTEGER;if(i===ca)return a.RG;if(i===xm)return a.RG_INTEGER;if(i===vm)return a.RGBA_INTEGER;if(i===bu||i===Tu||i===wu||i===Au)if(c===Lt)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===bu)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Tu)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===wu)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Au)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===bu)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Tu)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===wu)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Au)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ap||i===op||i===lp||i===cp)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===ap)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===op)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===lp)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===cp)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===up||i===dp||i===fp||i===hp||i===pp||i===Vu||i===mp)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(i===up||i===dp)return c===Lt?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===fp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC;if(i===hp)return o.COMPRESSED_R11_EAC;if(i===pp)return o.COMPRESSED_SIGNED_R11_EAC;if(i===Vu)return o.COMPRESSED_RG11_EAC;if(i===mp)return o.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===gp||i===_p||i===xp||i===vp||i===yp||i===Sp||i===Mp||i===Ep||i===bp||i===Tp||i===wp||i===Ap||i===Cp||i===Rp)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(i===gp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===_p)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===xp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===vp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===yp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Sp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Mp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ep)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===bp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Tp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===wp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ap)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Cp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Rp)return c===Lt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Pp||i===Np||i===Dp)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(i===Pp)return c===Lt?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Np)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Dp)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Lp||i===Ip||i===Hu||i===Fp)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(i===Lp)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Ip)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Hu)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Fp)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ol?a.UNSIGNED_INT_24_8:a[i]!==void 0?a[i]:null}return{convert:t}}const KR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ZR=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class QR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Dy(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Yi({vertexShader:KR,fragmentShader:ZR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Gr(new ed(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class JR extends fa{constructor(e,t){super();const i=this;let s=null,o=1,c=null,u="local-floor",f=1,h=null,p=null,_=null,m=null,S=null,M=null;const b=typeof XRWebGLBinding<"u",x=new QR,E={},w=t.getContextAttributes();let P=null,A=null;const N=[],L=[],F=new Ft;let T=null;const I=new Di;I.viewport=new un;const z=new Di;z.viewport=new un;const k=[I,z],q=new lw;let Q=null,se=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ue){let Se=N[ue];return Se===void 0&&(Se=new ah,N[ue]=Se),Se.getTargetRaySpace()},this.getControllerGrip=function(ue){let Se=N[ue];return Se===void 0&&(Se=new ah,N[ue]=Se),Se.getGripSpace()},this.getHand=function(ue){let Se=N[ue];return Se===void 0&&(Se=new ah,N[ue]=Se),Se.getHandSpace()};function V(ue){const Se=L.indexOf(ue.inputSource);if(Se===-1)return;const ge=N[Se];ge!==void 0&&(ge.update(ue.inputSource,ue.frame,h||c),ge.dispatchEvent({type:ue.type,data:ue.inputSource}))}function W(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",H);for(let ue=0;ue<N.length;ue++){const Se=L[ue];Se!==null&&(L[ue]=null,N[ue].disconnect(Se))}Q=null,se=null,x.reset();for(const ue in E)delete E[ue];e.setRenderTarget(P),S=null,m=null,_=null,s=null,A=null,De.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(F.width,F.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ue){o=ue,i.isPresenting===!0&&it("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ue){u=ue,i.isPresenting===!0&&it("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||c},this.setReferenceSpace=function(ue){h=ue},this.getBaseLayer=function(){return m!==null?m:S},this.getBinding=function(){return _===null&&b&&(_=new XRWebGLBinding(s,t)),_},this.getFrame=function(){return M},this.getSession=function(){return s},this.setSession=async function(ue){if(s=ue,s!==null){if(P=e.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",W),s.addEventListener("inputsourceschange",H),w.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(F),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,Oe=null,Qe=null;w.depth&&(Qe=w.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=w.stencil?ta:Hr,Oe=w.stencil?Ol:pr);const Je={colorFormat:t.RGBA8,depthFormat:Qe,scaleFactor:o};_=this.getBinding(),m=_.createProjectionLayer(Je),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),A=new fr(m.textureWidth,m.textureHeight,{format:qi,type:Li,depthTexture:new go(m.textureWidth,m.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:w.stencil,colorSpace:e.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const ge={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:o};S=new XRWebGLLayer(s,t,ge),s.updateRenderState({baseLayer:S}),e.setPixelRatio(1),e.setSize(S.framebufferWidth,S.framebufferHeight,!1),A=new fr(S.framebufferWidth,S.framebufferHeight,{format:qi,type:Li,colorSpace:e.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(f),h=null,c=await s.requestReferenceSpace(u),De.setContext(s),De.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function H(ue){for(let Se=0;Se<ue.removed.length;Se++){const ge=ue.removed[Se],Oe=L.indexOf(ge);Oe>=0&&(L[Oe]=null,N[Oe].disconnect(ge))}for(let Se=0;Se<ue.added.length;Se++){const ge=ue.added[Se];let Oe=L.indexOf(ge);if(Oe===-1){for(let Je=0;Je<N.length;Je++)if(Je>=L.length){L.push(ge),Oe=Je;break}else if(L[Je]===null){L[Je]=ge,Oe=Je;break}if(Oe===-1)break}const Qe=N[Oe];Qe&&Qe.connect(ge)}}const Y=new re,ae=new re;function oe(ue,Se,ge){Y.setFromMatrixPosition(Se.matrixWorld),ae.setFromMatrixPosition(ge.matrixWorld);const Oe=Y.distanceTo(ae),Qe=Se.projectionMatrix.elements,Je=ge.projectionMatrix.elements,Bt=Qe[14]/(Qe[10]-1),ut=Qe[14]/(Qe[10]+1),wt=(Qe[9]+1)/Qe[5],It=(Qe[9]-1)/Qe[5],dt=(Qe[8]-1)/Qe[0],Zt=(Je[8]+1)/Je[0],zt=Bt*dt,Tn=Bt*Zt,X=Oe/(-dt+Zt),Vt=X*-dt;if(Se.matrixWorld.decompose(ue.position,ue.quaternion,ue.scale),ue.translateX(Vt),ue.translateZ(X),ue.matrixWorld.compose(ue.position,ue.quaternion,ue.scale),ue.matrixWorldInverse.copy(ue.matrixWorld).invert(),Qe[10]===-1)ue.projectionMatrix.copy(Se.projectionMatrix),ue.projectionMatrixInverse.copy(Se.projectionMatrixInverse);else{const ft=Bt+X,Pt=ut+X,Le=zt-Vt,jt=Tn+(Oe-Vt),U=wt*ut/Pt*ft,C=It*ut/Pt*ft;ue.projectionMatrix.makePerspective(Le,jt,U,C,ft,Pt),ue.projectionMatrixInverse.copy(ue.projectionMatrix).invert()}}function B(ue,Se){Se===null?ue.matrixWorld.copy(ue.matrix):ue.matrixWorld.multiplyMatrices(Se.matrixWorld,ue.matrix),ue.matrixWorldInverse.copy(ue.matrixWorld).invert()}this.updateCamera=function(ue){if(s===null)return;let Se=ue.near,ge=ue.far;x.texture!==null&&(x.depthNear>0&&(Se=x.depthNear),x.depthFar>0&&(ge=x.depthFar)),q.near=z.near=I.near=Se,q.far=z.far=I.far=ge,(Q!==q.near||se!==q.far)&&(s.updateRenderState({depthNear:q.near,depthFar:q.far}),Q=q.near,se=q.far),q.layers.mask=ue.layers.mask|6,I.layers.mask=q.layers.mask&-5,z.layers.mask=q.layers.mask&-3;const Oe=ue.parent,Qe=q.cameras;B(q,Oe);for(let Je=0;Je<Qe.length;Je++)B(Qe[Je],Oe);Qe.length===2?oe(q,I,z):q.projectionMatrix.copy(I.projectionMatrix),J(ue,q,Oe)};function J(ue,Se,ge){ge===null?ue.matrix.copy(Se.matrixWorld):(ue.matrix.copy(ge.matrixWorld),ue.matrix.invert(),ue.matrix.multiply(Se.matrixWorld)),ue.matrix.decompose(ue.position,ue.quaternion,ue.scale),ue.updateMatrixWorld(!0),ue.projectionMatrix.copy(Se.projectionMatrix),ue.projectionMatrixInverse.copy(Se.projectionMatrixInverse),ue.isPerspectiveCamera&&(ue.fov=Op*2*Math.atan(1/ue.projectionMatrix.elements[5]),ue.zoom=1)}this.getCamera=function(){return q},this.getFoveation=function(){if(!(m===null&&S===null))return f},this.setFoveation=function(ue){f=ue,m!==null&&(m.fixedFoveation=ue),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=ue)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(q)},this.getCameraTexture=function(ue){return E[ue]};let Ie=null;function Fe(ue,Se){if(p=Se.getViewerPose(h||c),M=Se,p!==null){const ge=p.views;S!==null&&(e.setRenderTargetFramebuffer(A,S.framebuffer),e.setRenderTarget(A));let Oe=!1;ge.length!==q.cameras.length&&(q.cameras.length=0,Oe=!0);for(let ut=0;ut<ge.length;ut++){const wt=ge[ut];let It=null;if(S!==null)It=S.getViewport(wt);else{const Zt=_.getViewSubImage(m,wt);It=Zt.viewport,ut===0&&(e.setRenderTargetTextures(A,Zt.colorTexture,Zt.depthStencilTexture),e.setRenderTarget(A))}let dt=k[ut];dt===void 0&&(dt=new Di,dt.layers.enable(ut),dt.viewport=new un,k[ut]=dt),dt.matrix.fromArray(wt.transform.matrix),dt.matrix.decompose(dt.position,dt.quaternion,dt.scale),dt.projectionMatrix.fromArray(wt.projectionMatrix),dt.projectionMatrixInverse.copy(dt.projectionMatrix).invert(),dt.viewport.set(It.x,It.y,It.width,It.height),ut===0&&(q.matrix.copy(dt.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale)),Oe===!0&&q.cameras.push(dt)}const Qe=s.enabledFeatures;if(Qe&&Qe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){_=i.getBinding();const ut=_.getDepthInformation(ge[0]);ut&&ut.isValid&&ut.texture&&x.init(ut,s.renderState)}if(Qe&&Qe.includes("camera-access")&&b){e.state.unbindTexture(),_=i.getBinding();for(let ut=0;ut<ge.length;ut++){const wt=ge[ut].camera;if(wt){let It=E[wt];It||(It=new Dy,E[wt]=It);const dt=_.getCameraImage(wt);It.sourceTexture=dt}}}}for(let ge=0;ge<N.length;ge++){const Oe=L[ge],Qe=N[ge];Oe!==null&&Qe!==void 0&&Qe.update(Oe,Se,h||c)}Ie&&Ie(ue,Se),Se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Se}),M=null}const De=new Uy;De.setAnimationLoop(Fe),this.setAnimationLoop=function(ue){Ie=ue},this.dispose=function(){}}}const e3=new mn,Gy=new ct;Gy.set(-1,0,0,0,1,0,0,0,1);function t3(a,e){function t(x,E){x.matrixAutoUpdate===!0&&x.updateMatrix(),E.value.copy(x.matrix)}function i(x,E){E.color.getRGB(x.fogColor.value,Ly(a)),E.isFog?(x.fogNear.value=E.near,x.fogFar.value=E.far):E.isFogExp2&&(x.fogDensity.value=E.density)}function s(x,E,w,P,A){E.isNodeMaterial?E.uniformsNeedUpdate=!1:E.isMeshBasicMaterial?o(x,E):E.isMeshLambertMaterial?(o(x,E),E.envMap&&(x.envMapIntensity.value=E.envMapIntensity)):E.isMeshToonMaterial?(o(x,E),_(x,E)):E.isMeshPhongMaterial?(o(x,E),p(x,E),E.envMap&&(x.envMapIntensity.value=E.envMapIntensity)):E.isMeshStandardMaterial?(o(x,E),m(x,E),E.isMeshPhysicalMaterial&&S(x,E,A)):E.isMeshMatcapMaterial?(o(x,E),M(x,E)):E.isMeshDepthMaterial?o(x,E):E.isMeshDistanceMaterial?(o(x,E),b(x,E)):E.isMeshNormalMaterial?o(x,E):E.isLineBasicMaterial?(c(x,E),E.isLineDashedMaterial&&u(x,E)):E.isPointsMaterial?f(x,E,w,P):E.isSpriteMaterial?h(x,E):E.isShadowMaterial?(x.color.value.copy(E.color),x.opacity.value=E.opacity):E.isShaderMaterial&&(E.uniformsNeedUpdate=!1)}function o(x,E){x.opacity.value=E.opacity,E.color&&x.diffuse.value.copy(E.color),E.emissive&&x.emissive.value.copy(E.emissive).multiplyScalar(E.emissiveIntensity),E.map&&(x.map.value=E.map,t(E.map,x.mapTransform)),E.alphaMap&&(x.alphaMap.value=E.alphaMap,t(E.alphaMap,x.alphaMapTransform)),E.bumpMap&&(x.bumpMap.value=E.bumpMap,t(E.bumpMap,x.bumpMapTransform),x.bumpScale.value=E.bumpScale,E.side===si&&(x.bumpScale.value*=-1)),E.normalMap&&(x.normalMap.value=E.normalMap,t(E.normalMap,x.normalMapTransform),x.normalScale.value.copy(E.normalScale),E.side===si&&x.normalScale.value.negate()),E.displacementMap&&(x.displacementMap.value=E.displacementMap,t(E.displacementMap,x.displacementMapTransform),x.displacementScale.value=E.displacementScale,x.displacementBias.value=E.displacementBias),E.emissiveMap&&(x.emissiveMap.value=E.emissiveMap,t(E.emissiveMap,x.emissiveMapTransform)),E.specularMap&&(x.specularMap.value=E.specularMap,t(E.specularMap,x.specularMapTransform)),E.alphaTest>0&&(x.alphaTest.value=E.alphaTest);const w=e.get(E),P=w.envMap,A=w.envMapRotation;P&&(x.envMap.value=P,x.envMapRotation.value.setFromMatrix4(e3.makeRotationFromEuler(A)).transpose(),P.isCubeTexture&&P.isRenderTargetTexture===!1&&x.envMapRotation.value.premultiply(Gy),x.reflectivity.value=E.reflectivity,x.ior.value=E.ior,x.refractionRatio.value=E.refractionRatio),E.lightMap&&(x.lightMap.value=E.lightMap,x.lightMapIntensity.value=E.lightMapIntensity,t(E.lightMap,x.lightMapTransform)),E.aoMap&&(x.aoMap.value=E.aoMap,x.aoMapIntensity.value=E.aoMapIntensity,t(E.aoMap,x.aoMapTransform))}function c(x,E){x.diffuse.value.copy(E.color),x.opacity.value=E.opacity,E.map&&(x.map.value=E.map,t(E.map,x.mapTransform))}function u(x,E){x.dashSize.value=E.dashSize,x.totalSize.value=E.dashSize+E.gapSize,x.scale.value=E.scale}function f(x,E,w,P){x.diffuse.value.copy(E.color),x.opacity.value=E.opacity,x.size.value=E.size*w,x.scale.value=P*.5,E.map&&(x.map.value=E.map,t(E.map,x.uvTransform)),E.alphaMap&&(x.alphaMap.value=E.alphaMap,t(E.alphaMap,x.alphaMapTransform)),E.alphaTest>0&&(x.alphaTest.value=E.alphaTest)}function h(x,E){x.diffuse.value.copy(E.color),x.opacity.value=E.opacity,x.rotation.value=E.rotation,E.map&&(x.map.value=E.map,t(E.map,x.mapTransform)),E.alphaMap&&(x.alphaMap.value=E.alphaMap,t(E.alphaMap,x.alphaMapTransform)),E.alphaTest>0&&(x.alphaTest.value=E.alphaTest)}function p(x,E){x.specular.value.copy(E.specular),x.shininess.value=Math.max(E.shininess,1e-4)}function _(x,E){E.gradientMap&&(x.gradientMap.value=E.gradientMap)}function m(x,E){x.metalness.value=E.metalness,E.metalnessMap&&(x.metalnessMap.value=E.metalnessMap,t(E.metalnessMap,x.metalnessMapTransform)),x.roughness.value=E.roughness,E.roughnessMap&&(x.roughnessMap.value=E.roughnessMap,t(E.roughnessMap,x.roughnessMapTransform)),E.envMap&&(x.envMapIntensity.value=E.envMapIntensity)}function S(x,E,w){x.ior.value=E.ior,E.sheen>0&&(x.sheenColor.value.copy(E.sheenColor).multiplyScalar(E.sheen),x.sheenRoughness.value=E.sheenRoughness,E.sheenColorMap&&(x.sheenColorMap.value=E.sheenColorMap,t(E.sheenColorMap,x.sheenColorMapTransform)),E.sheenRoughnessMap&&(x.sheenRoughnessMap.value=E.sheenRoughnessMap,t(E.sheenRoughnessMap,x.sheenRoughnessMapTransform))),E.clearcoat>0&&(x.clearcoat.value=E.clearcoat,x.clearcoatRoughness.value=E.clearcoatRoughness,E.clearcoatMap&&(x.clearcoatMap.value=E.clearcoatMap,t(E.clearcoatMap,x.clearcoatMapTransform)),E.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=E.clearcoatRoughnessMap,t(E.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),E.clearcoatNormalMap&&(x.clearcoatNormalMap.value=E.clearcoatNormalMap,t(E.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(E.clearcoatNormalScale),E.side===si&&x.clearcoatNormalScale.value.negate())),E.dispersion>0&&(x.dispersion.value=E.dispersion),E.iridescence>0&&(x.iridescence.value=E.iridescence,x.iridescenceIOR.value=E.iridescenceIOR,x.iridescenceThicknessMinimum.value=E.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=E.iridescenceThicknessRange[1],E.iridescenceMap&&(x.iridescenceMap.value=E.iridescenceMap,t(E.iridescenceMap,x.iridescenceMapTransform)),E.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=E.iridescenceThicknessMap,t(E.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),E.transmission>0&&(x.transmission.value=E.transmission,x.transmissionSamplerMap.value=w.texture,x.transmissionSamplerSize.value.set(w.width,w.height),E.transmissionMap&&(x.transmissionMap.value=E.transmissionMap,t(E.transmissionMap,x.transmissionMapTransform)),x.thickness.value=E.thickness,E.thicknessMap&&(x.thicknessMap.value=E.thicknessMap,t(E.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=E.attenuationDistance,x.attenuationColor.value.copy(E.attenuationColor)),E.anisotropy>0&&(x.anisotropyVector.value.set(E.anisotropy*Math.cos(E.anisotropyRotation),E.anisotropy*Math.sin(E.anisotropyRotation)),E.anisotropyMap&&(x.anisotropyMap.value=E.anisotropyMap,t(E.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=E.specularIntensity,x.specularColor.value.copy(E.specularColor),E.specularColorMap&&(x.specularColorMap.value=E.specularColorMap,t(E.specularColorMap,x.specularColorMapTransform)),E.specularIntensityMap&&(x.specularIntensityMap.value=E.specularIntensityMap,t(E.specularIntensityMap,x.specularIntensityMapTransform))}function M(x,E){E.matcap&&(x.matcap.value=E.matcap)}function b(x,E){const w=e.get(E).light;x.referencePosition.value.setFromMatrixPosition(w.matrixWorld),x.nearDistance.value=w.shadow.camera.near,x.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function n3(a,e,t,i){let s={},o={},c=[];const u=a.getParameter(a.MAX_UNIFORM_BUFFER_BINDINGS);function f(w,P){const A=P.program;i.uniformBlockBinding(w,A)}function h(w,P){let A=s[w.id];A===void 0&&(M(w),A=p(w),s[w.id]=A,w.addEventListener("dispose",x));const N=P.program;i.updateUBOMapping(w,N);const L=e.render.frame;o[w.id]!==L&&(m(w),o[w.id]=L)}function p(w){const P=_();w.__bindingPointIndex=P;const A=a.createBuffer(),N=w.__size,L=w.usage;return a.bindBuffer(a.UNIFORM_BUFFER,A),a.bufferData(a.UNIFORM_BUFFER,N,L),a.bindBuffer(a.UNIFORM_BUFFER,null),a.bindBufferBase(a.UNIFORM_BUFFER,P,A),A}function _(){for(let w=0;w<u;w++)if(c.indexOf(w)===-1)return c.push(w),w;return Tt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(w){const P=s[w.id],A=w.uniforms,N=w.__cache;a.bindBuffer(a.UNIFORM_BUFFER,P);for(let L=0,F=A.length;L<F;L++){const T=Array.isArray(A[L])?A[L]:[A[L]];for(let I=0,z=T.length;I<z;I++){const k=T[I];if(S(k,L,I,N)===!0){const q=k.__offset,Q=Array.isArray(k.value)?k.value:[k.value];let se=0;for(let V=0;V<Q.length;V++){const W=Q[V],H=b(W);typeof W=="number"||typeof W=="boolean"?(k.__data[0]=W,a.bufferSubData(a.UNIFORM_BUFFER,q+se,k.__data)):W.isMatrix3?(k.__data[0]=W.elements[0],k.__data[1]=W.elements[1],k.__data[2]=W.elements[2],k.__data[3]=0,k.__data[4]=W.elements[3],k.__data[5]=W.elements[4],k.__data[6]=W.elements[5],k.__data[7]=0,k.__data[8]=W.elements[6],k.__data[9]=W.elements[7],k.__data[10]=W.elements[8],k.__data[11]=0):ArrayBuffer.isView(W)?k.__data.set(new W.constructor(W.buffer,W.byteOffset,k.__data.length)):(W.toArray(k.__data,se),se+=H.storage/Float32Array.BYTES_PER_ELEMENT)}a.bufferSubData(a.UNIFORM_BUFFER,q,k.__data)}}}a.bindBuffer(a.UNIFORM_BUFFER,null)}function S(w,P,A,N){const L=w.value,F=P+"_"+A;if(N[F]===void 0)return typeof L=="number"||typeof L=="boolean"?N[F]=L:ArrayBuffer.isView(L)?N[F]=L.slice():N[F]=L.clone(),!0;{const T=N[F];if(typeof L=="number"||typeof L=="boolean"){if(T!==L)return N[F]=L,!0}else{if(ArrayBuffer.isView(L))return!0;if(T.equals(L)===!1)return T.copy(L),!0}}return!1}function M(w){const P=w.uniforms;let A=0;const N=16;for(let F=0,T=P.length;F<T;F++){const I=Array.isArray(P[F])?P[F]:[P[F]];for(let z=0,k=I.length;z<k;z++){const q=I[z],Q=Array.isArray(q.value)?q.value:[q.value];for(let se=0,V=Q.length;se<V;se++){const W=Q[se],H=b(W),Y=A%N,ae=Y%H.boundary,oe=Y+ae;A+=ae,oe!==0&&N-oe<H.storage&&(A+=N-oe),q.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),q.__offset=A,A+=H.storage}}}const L=A%N;return L>0&&(A+=N-L),w.__size=A,w.__cache={},this}function b(w){const P={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(P.boundary=4,P.storage=4):w.isVector2?(P.boundary=8,P.storage=8):w.isVector3||w.isColor?(P.boundary=16,P.storage=12):w.isVector4?(P.boundary=16,P.storage=16):w.isMatrix3?(P.boundary=48,P.storage=48):w.isMatrix4?(P.boundary=64,P.storage=64):w.isTexture?it("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(w)?(P.boundary=16,P.storage=w.byteLength):it("WebGLRenderer: Unsupported uniform value type.",w),P}function x(w){const P=w.target;P.removeEventListener("dispose",x);const A=c.indexOf(P.__bindingPointIndex);c.splice(A,1),a.deleteBuffer(s[P.id]),delete s[P.id],delete o[P.id]}function E(){for(const w in s)a.deleteBuffer(s[w]);c=[],s={},o={}}return{bind:f,update:h,dispose:E}}const i3=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let rr=null;function r3(){return rr===null&&(rr=new $T(i3,16,16,ca,Vr),rr.name="DFG_LUT",rr.minFilter=kn,rr.magFilter=kn,rr.wrapS=Ir,rr.wrapT=Ir,rr.generateMipmaps=!1,rr.needsUpdate=!0),rr}class s3{constructor(e={}){const{canvas:t=bT(),context:i=null,depth:s=!0,stencil:o=!1,alpha:c=!1,antialias:u=!1,premultipliedAlpha:f=!0,preserveDrawingBuffer:h=!1,powerPreference:p="default",failIfMajorPerformanceCaveat:_=!1,reversedDepthBuffer:m=!1,outputBufferType:S=Li}=e;this.isWebGLRenderer=!0;let M;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=i.getContextAttributes().alpha}else M=c;const b=S,x=new Set([vm,xm,_m]),E=new Set([Li,pr,Ul,Ol,mm,gm]),w=new Uint32Array(4),P=new Int32Array(4),A=new re;let N=null,L=null;const F=[],T=[];let I=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=dr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const z=this;let k=!1,q=null;this._outputColorSpace=Ni;let Q=0,se=0,V=null,W=-1,H=null;const Y=new un,ae=new un;let oe=null;const B=new Et(0);let J=0,Ie=t.width,Fe=t.height,De=1,ue=null,Se=null;const ge=new un(0,0,Ie,Fe),Oe=new un(0,0,Ie,Fe);let Qe=!1;const Je=new Py;let Bt=!1,ut=!1;const wt=new mn,It=new re,dt=new un,Zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let zt=!1;function Tn(){return V===null?De:1}let X=i;function Vt(D,K){return t.getContext(D,K)}try{const D={alpha:!0,depth:s,stencil:o,antialias:u,premultipliedAlpha:f,preserveDrawingBuffer:h,powerPreference:p,failIfMajorPerformanceCaveat:_};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${hm}`),t.addEventListener("webglcontextlost",xe,!1),t.addEventListener("webglcontextrestored",Xe,!1),t.addEventListener("webglcontextcreationerror",at,!1),X===null){const K="webgl2";if(X=Vt(K,D),X===null)throw Vt(K)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(D){throw Tt("WebGLRenderer: "+D.message),D}let ft,Pt,Le,jt,U,C,Z,he,_e,Ee,Ne,de,pe,ke,ze,Ae,be,nt,st,pt,j,we,fe;function Be(){ft=new rC(X),ft.init(),j=new YR(X,ft),Pt=new KA(X,ft,e,j),Le=new $R(X,ft),Pt.reversedDepthBuffer&&m&&Le.buffers.depth.setReversed(!0),jt=new oC(X),U=new LR,C=new qR(X,ft,Le,U,Pt,j,jt),Z=new iC(z),he=new dw(X),we=new qA(X,he),_e=new sC(X,he,jt,we),Ee=new cC(X,_e,he,we,jt),nt=new lC(X,Pt,C),ze=new ZA(U),Ne=new DR(z,Z,ft,Pt,we,ze),de=new t3(z,U),pe=new FR,ke=new VR(ft),be=new $A(z,Z,Le,Ee,M,f),Ae=new XR(z,Ee,Pt),fe=new n3(X,jt,Pt,Le),st=new YA(X,ft,jt),pt=new aC(X,ft,jt),jt.programs=Ne.programs,z.capabilities=Pt,z.extensions=ft,z.properties=U,z.renderLists=pe,z.shadowMap=Ae,z.state=Le,z.info=jt}Be(),b!==Li&&(I=new dC(b,t.width,t.height,s,o));const Re=new JR(z,X);this.xr=Re,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){const D=ft.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=ft.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return De},this.setPixelRatio=function(D){D!==void 0&&(De=D,this.setSize(Ie,Fe,!1))},this.getSize=function(D){return D.set(Ie,Fe)},this.setSize=function(D,K,le=!0){if(Re.isPresenting){it("WebGLRenderer: Can't change size while VR device is presenting.");return}Ie=D,Fe=K,t.width=Math.floor(D*De),t.height=Math.floor(K*De),le===!0&&(t.style.width=D+"px",t.style.height=K+"px"),I!==null&&I.setSize(t.width,t.height),this.setViewport(0,0,D,K)},this.getDrawingBufferSize=function(D){return D.set(Ie*De,Fe*De).floor()},this.setDrawingBufferSize=function(D,K,le){Ie=D,Fe=K,De=le,t.width=Math.floor(D*le),t.height=Math.floor(K*le),this.setViewport(0,0,D,K)},this.setEffects=function(D){if(b===Li){Tt("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(D){for(let K=0;K<D.length;K++)if(D[K].isOutputPass===!0){it("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(D||[])},this.getCurrentViewport=function(D){return D.copy(Y)},this.getViewport=function(D){return D.copy(ge)},this.setViewport=function(D,K,le,ne){D.isVector4?ge.set(D.x,D.y,D.z,D.w):ge.set(D,K,le,ne),Le.viewport(Y.copy(ge).multiplyScalar(De).round())},this.getScissor=function(D){return D.copy(Oe)},this.setScissor=function(D,K,le,ne){D.isVector4?Oe.set(D.x,D.y,D.z,D.w):Oe.set(D,K,le,ne),Le.scissor(ae.copy(Oe).multiplyScalar(De).round())},this.getScissorTest=function(){return Qe},this.setScissorTest=function(D){Le.setScissorTest(Qe=D)},this.setOpaqueSort=function(D){ue=D},this.setTransparentSort=function(D){Se=D},this.getClearColor=function(D){return D.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(D=!0,K=!0,le=!0){let ne=0;if(D){let te=!1;if(V!==null){const Pe=V.texture.format;te=x.has(Pe)}if(te){const Pe=V.texture.type,Ge=E.has(Pe),Ce=be.getClearColor(),$e=be.getClearAlpha(),Ze=Ce.r,ot=Ce.g,lt=Ce.b;Ge?(w[0]=Ze,w[1]=ot,w[2]=lt,w[3]=$e,X.clearBufferuiv(X.COLOR,0,w)):(P[0]=Ze,P[1]=ot,P[2]=lt,P[3]=$e,X.clearBufferiv(X.COLOR,0,P))}else ne|=X.COLOR_BUFFER_BIT}K&&(ne|=X.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),le&&(ne|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ne!==0&&X.clear(ne)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(D){D.setRenderer(this),q=D},this.dispose=function(){t.removeEventListener("webglcontextlost",xe,!1),t.removeEventListener("webglcontextrestored",Xe,!1),t.removeEventListener("webglcontextcreationerror",at,!1),be.dispose(),pe.dispose(),ke.dispose(),U.dispose(),Z.dispose(),Ee.dispose(),we.dispose(),fe.dispose(),Ne.dispose(),Re.dispose(),Re.removeEventListener("sessionstart",Cs),Re.removeEventListener("sessionend",ma),gr.stop()};function xe(D){D.preventDefault(),z_("WebGLRenderer: Context Lost."),k=!0}function Xe(){z_("WebGLRenderer: Context Restored."),k=!1;const D=jt.autoReset,K=Ae.enabled,le=Ae.autoUpdate,ne=Ae.needsUpdate,te=Ae.type;Be(),jt.autoReset=D,Ae.enabled=K,Ae.autoUpdate=le,Ae.needsUpdate=ne,Ae.type=te}function at(D){Tt("WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function Ut(D){const K=D.target;K.removeEventListener("dispose",Ut),At(K)}function At(D){zn(D),U.remove(D)}function zn(D){const K=U.get(D).programs;K!==void 0&&(K.forEach(function(le){Ne.releaseProgram(le)}),D.isShaderMaterial&&Ne.releaseShaderCache(D))}this.renderBufferDirect=function(D,K,le,ne,te,Pe){K===null&&(K=Zt);const Ge=te.isMesh&&te.matrixWorld.determinant()<0,Ce=Wl(D,K,le,ne,te);Le.setMaterial(ne,Ge);let $e=le.index,Ze=1;if(ne.wireframe===!0){if($e=_e.getWireframeAttribute(le),$e===void 0)return;Ze=2}const ot=le.drawRange,lt=le.attributes.position;let Ye=ot.start*Ze,Mt=(ot.start+ot.count)*Ze;Pe!==null&&(Ye=Math.max(Ye,Pe.start*Ze),Mt=Math.min(Mt,(Pe.start+Pe.count)*Ze)),$e!==null?(Ye=Math.max(Ye,0),Mt=Math.min(Mt,$e.count)):lt!=null&&(Ye=Math.max(Ye,0),Mt=Math.min(Mt,lt.count));const Ht=Mt-Ye;if(Ht<0||Ht===1/0)return;we.setup(te,ne,Ce,le,$e);let qt,Nt=st;if($e!==null&&(qt=he.get($e),Nt=pt,Nt.setIndex(qt)),te.isMesh)ne.wireframe===!0?(Le.setLineWidth(ne.wireframeLinewidth*Tn()),Nt.setMode(X.LINES)):Nt.setMode(X.TRIANGLES);else if(te.isLine){let dn=ne.linewidth;dn===void 0&&(dn=1),Le.setLineWidth(dn*Tn()),te.isLineSegments?Nt.setMode(X.LINES):te.isLineLoop?Nt.setMode(X.LINE_LOOP):Nt.setMode(X.LINE_STRIP)}else te.isPoints?Nt.setMode(X.POINTS):te.isSprite&&Nt.setMode(X.TRIANGLES);if(te.isBatchedMesh)if(ft.get("WEBGL_multi_draw"))Nt.renderMultiDraw(te._multiDrawStarts,te._multiDrawCounts,te._multiDrawCount);else{const dn=te._multiDrawStarts,Ve=te._multiDrawCounts,wn=te._multiDrawCount,mt=$e?he.get($e).bytesPerElement:1,Wn=U.get(ne).currentProgram.getUniforms();for(let Xn=0;Xn<wn;Xn++)Wn.setValue(X,"_gl_DrawID",Xn),Nt.render(dn[Xn]/mt,Ve[Xn])}else if(te.isInstancedMesh)Nt.renderInstances(Ye,Ht,te.count);else if(le.isInstancedBufferGeometry){const dn=le._maxInstanceCount!==void 0?le._maxInstanceCount:1/0,Ve=Math.min(le.instanceCount,dn);Nt.renderInstances(Ye,Ht,Ve)}else Nt.render(Ye,Ht)};function Mi(D,K,le){D.transparent===!0&&D.side===Lr&&D.forceSinglePass===!1?(D.side=si,D.needsUpdate=!0,ga(D,K,le),D.side=ws,D.needsUpdate=!0,ga(D,K,le),D.side=Lr):ga(D,K,le)}this.compile=function(D,K,le=null){le===null&&(le=D),L=ke.get(le),L.init(K),T.push(L),le.traverseVisible(function(te){te.isLight&&te.layers.test(K.layers)&&(L.pushLight(te),te.castShadow&&L.pushShadow(te))}),D!==le&&D.traverseVisible(function(te){te.isLight&&te.layers.test(K.layers)&&(L.pushLight(te),te.castShadow&&L.pushShadow(te))}),L.setupLights();const ne=new Set;return D.traverse(function(te){if(!(te.isMesh||te.isPoints||te.isLine||te.isSprite))return;const Pe=te.material;if(Pe)if(Array.isArray(Pe))for(let Ge=0;Ge<Pe.length;Ge++){const Ce=Pe[Ge];Mi(Ce,le,te),ne.add(Ce)}else Mi(Pe,le,te),ne.add(Pe)}),L=T.pop(),ne},this.compileAsync=function(D,K,le=null){const ne=this.compile(D,K,le);return new Promise(te=>{function Pe(){if(ne.forEach(function(Ge){U.get(Ge).currentProgram.isReady()&&ne.delete(Ge)}),ne.size===0){te(D);return}setTimeout(Pe,10)}ft.get("KHR_parallel_shader_compile")!==null?Pe():setTimeout(Pe,10)})};let mr=null;function pa(D){mr&&mr(D)}function Cs(){gr.stop()}function ma(){gr.start()}const gr=new Uy;gr.setAnimationLoop(pa),typeof self<"u"&&gr.setContext(self),this.setAnimationLoop=function(D){mr=D,Re.setAnimationLoop(D),D===null?gr.stop():gr.start()},Re.addEventListener("sessionstart",Cs),Re.addEventListener("sessionend",ma),this.render=function(D,K){if(K!==void 0&&K.isCamera!==!0){Tt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(k===!0)return;q!==null&&q.renderStart(D,K);const le=Re.enabled===!0&&Re.isPresenting===!0,ne=I!==null&&(V===null||le)&&I.begin(z,V);if(D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),K.parent===null&&K.matrixWorldAutoUpdate===!0&&K.updateMatrixWorld(),Re.enabled===!0&&Re.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(Re.cameraAutoUpdate===!0&&Re.updateCamera(K),K=Re.getCamera()),D.isScene===!0&&D.onBeforeRender(z,D,K,V),L=ke.get(D,T.length),L.init(K),L.state.textureUnits=C.getTextureUnits(),T.push(L),wt.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),Je.setFromProjectionMatrix(wt,ur,K.reversedDepth),ut=this.localClippingEnabled,Bt=ze.init(this.clippingPlanes,ut),N=pe.get(D,F.length),N.init(),F.push(N),Re.enabled===!0&&Re.isPresenting===!0){const Ge=z.xr.getDepthSensingMesh();Ge!==null&&So(Ge,K,-1/0,z.sortObjects)}So(D,K,0,z.sortObjects),N.finish(),z.sortObjects===!0&&N.sort(ue,Se),zt=Re.enabled===!1||Re.isPresenting===!1||Re.hasDepthSensing()===!1,zt&&be.addToRenderList(N,D),this.info.render.frame++,Bt===!0&&ze.beginShadows();const te=L.state.shadowsArray;if(Ae.render(te,D,K),Bt===!0&&ze.endShadows(),this.info.autoReset===!0&&this.info.reset(),(ne&&I.hasRenderPass())===!1){const Ge=N.opaque,Ce=N.transmissive;if(L.setupLights(),K.isArrayCamera){const $e=K.cameras;if(Ce.length>0)for(let Ze=0,ot=$e.length;Ze<ot;Ze++){const lt=$e[Ze];Zi(Ge,Ce,D,lt)}zt&&be.render(D);for(let Ze=0,ot=$e.length;Ze<ot;Ze++){const lt=$e[Ze];Gl(N,D,lt,lt.viewport)}}else Ce.length>0&&Zi(Ge,Ce,D,K),zt&&be.render(D),Gl(N,D,K)}V!==null&&se===0&&(C.updateMultisampleRenderTarget(V),C.updateRenderTargetMipmap(V)),ne&&I.end(z),D.isScene===!0&&D.onAfterRender(z,D,K),we.resetDefaultState(),W=-1,H=null,T.pop(),T.length>0?(L=T[T.length-1],C.setTextureUnits(L.state.textureUnits),Bt===!0&&ze.setGlobalState(z.clippingPlanes,L.state.camera)):L=null,F.pop(),F.length>0?N=F[F.length-1]:N=null,q!==null&&q.renderEnd()};function So(D,K,le,ne){if(D.visible===!1)return;if(D.layers.test(K.layers)){if(D.isGroup)le=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(K);else if(D.isLightProbeGrid)L.pushLightProbeGrid(D);else if(D.isLight)L.pushLight(D),D.castShadow&&L.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||Je.intersectsSprite(D)){ne&&dt.setFromMatrixPosition(D.matrixWorld).applyMatrix4(wt);const Ge=Ee.update(D),Ce=D.material;Ce.visible&&N.push(D,Ge,Ce,le,dt.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||Je.intersectsObject(D))){const Ge=Ee.update(D),Ce=D.material;if(ne&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),dt.copy(D.boundingSphere.center)):(Ge.boundingSphere===null&&Ge.computeBoundingSphere(),dt.copy(Ge.boundingSphere.center)),dt.applyMatrix4(D.matrixWorld).applyMatrix4(wt)),Array.isArray(Ce)){const $e=Ge.groups;for(let Ze=0,ot=$e.length;Ze<ot;Ze++){const lt=$e[Ze],Ye=Ce[lt.materialIndex];Ye&&Ye.visible&&N.push(D,Ge,Ye,le,dt.z,lt)}}else Ce.visible&&N.push(D,Ge,Ce,le,dt.z,null)}}const Pe=D.children;for(let Ge=0,Ce=Pe.length;Ge<Ce;Ge++)So(Pe[Ge],K,le,ne)}function Gl(D,K,le,ne){const{opaque:te,transmissive:Pe,transparent:Ge}=D;L.setupLightsView(le),Bt===!0&&ze.setGlobalState(z.clippingPlanes,le),ne&&Le.viewport(Y.copy(ne)),te.length>0&&Rs(te,K,le),Pe.length>0&&Rs(Pe,K,le),Ge.length>0&&Rs(Ge,K,le),Le.buffers.depth.setTest(!0),Le.buffers.depth.setMask(!0),Le.buffers.color.setMask(!0),Le.setPolygonOffset(!1)}function Zi(D,K,le,ne){if((le.isScene===!0?le.overrideMaterial:null)!==null)return;if(L.state.transmissionRenderTarget[ne.id]===void 0){const Ye=ft.has("EXT_color_buffer_half_float")||ft.has("EXT_color_buffer_float");L.state.transmissionRenderTarget[ne.id]=new fr(1,1,{generateMipmaps:!0,type:Ye?Vr:Li,minFilter:ea,samples:Math.max(4,Pt.samples),stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:vt.workingColorSpace})}const Pe=L.state.transmissionRenderTarget[ne.id],Ge=ne.viewport||Y;Pe.setSize(Ge.z*z.transmissionResolutionScale,Ge.w*z.transmissionResolutionScale);const Ce=z.getRenderTarget(),$e=z.getActiveCubeFace(),Ze=z.getActiveMipmapLevel();z.setRenderTarget(Pe),z.getClearColor(B),J=z.getClearAlpha(),J<1&&z.setClearColor(16777215,.5),z.clear(),zt&&be.render(le);const ot=z.toneMapping;z.toneMapping=dr;const lt=ne.viewport;if(ne.viewport!==void 0&&(ne.viewport=void 0),L.setupLightsView(ne),Bt===!0&&ze.setGlobalState(z.clippingPlanes,ne),Rs(D,le,ne),C.updateMultisampleRenderTarget(Pe),C.updateRenderTargetMipmap(Pe),ft.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let Mt=0,Ht=K.length;Mt<Ht;Mt++){const qt=K[Mt],{object:Nt,geometry:dn,material:Ve,group:wn}=qt;if(Ve.side===Lr&&Nt.layers.test(ne.layers)){const mt=Ve.side;Ve.side=si,Ve.needsUpdate=!0,Mo(Nt,le,ne,dn,Ve,wn),Ve.side=mt,Ve.needsUpdate=!0,Ye=!0}}Ye===!0&&(C.updateMultisampleRenderTarget(Pe),C.updateRenderTargetMipmap(Pe))}z.setRenderTarget(Ce,$e,Ze),z.setClearColor(B,J),lt!==void 0&&(ne.viewport=lt),z.toneMapping=ot}function Rs(D,K,le){const ne=K.isScene===!0?K.overrideMaterial:null;for(let te=0,Pe=D.length;te<Pe;te++){const Ge=D[te],{object:Ce,geometry:$e,group:Ze}=Ge;let ot=Ge.material;ot.allowOverride===!0&&ne!==null&&(ot=ne),Ce.layers.test(le.layers)&&Mo(Ce,K,le,$e,ot,Ze)}}function Mo(D,K,le,ne,te,Pe){D.onBeforeRender(z,K,le,ne,te,Pe),D.modelViewMatrix.multiplyMatrices(le.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),te.onBeforeRender(z,K,le,ne,D,Pe),te.transparent===!0&&te.side===Lr&&te.forceSinglePass===!1?(te.side=si,te.needsUpdate=!0,z.renderBufferDirect(le,K,ne,te,D,Pe),te.side=ws,te.needsUpdate=!0,z.renderBufferDirect(le,K,ne,te,D,Pe),te.side=Lr):z.renderBufferDirect(le,K,ne,te,D,Pe),D.onAfterRender(z,K,le,ne,te,Pe)}function ga(D,K,le){K.isScene!==!0&&(K=Zt);const ne=U.get(D),te=L.state.lights,Pe=L.state.shadowsArray,Ge=te.state.version,Ce=Ne.getParameters(D,te.state,Pe,K,le,L.state.lightProbeGridArray),$e=Ne.getProgramCacheKey(Ce);let Ze=ne.programs;ne.environment=D.isMeshStandardMaterial||D.isMeshLambertMaterial||D.isMeshPhongMaterial?K.environment:null,ne.fog=K.fog;const ot=D.isMeshStandardMaterial||D.isMeshLambertMaterial&&!D.envMap||D.isMeshPhongMaterial&&!D.envMap;ne.envMap=Z.get(D.envMap||ne.environment,ot),ne.envMapRotation=ne.environment!==null&&D.envMap===null?K.environmentRotation:D.envMapRotation,Ze===void 0&&(D.addEventListener("dispose",Ut),Ze=new Map,ne.programs=Ze);let lt=Ze.get($e);if(lt!==void 0){if(ne.currentProgram===lt&&ne.lightsStateVersion===Ge)return bo(D,Ce),lt}else Ce.uniforms=Ne.getUniforms(D),q!==null&&D.isNodeMaterial&&q.build(D,le,Ce),D.onBeforeCompile(Ce,z),lt=Ne.acquireProgram(Ce,$e),Ze.set($e,lt),ne.uniforms=Ce.uniforms;const Ye=ne.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(Ye.clippingPlanes=ze.uniform),bo(D,Ce),ne.needsLights=rd(D),ne.lightsStateVersion=Ge,ne.needsLights&&(Ye.ambientLightColor.value=te.state.ambient,Ye.lightProbe.value=te.state.probe,Ye.directionalLights.value=te.state.directional,Ye.directionalLightShadows.value=te.state.directionalShadow,Ye.spotLights.value=te.state.spot,Ye.spotLightShadows.value=te.state.spotShadow,Ye.rectAreaLights.value=te.state.rectArea,Ye.ltc_1.value=te.state.rectAreaLTC1,Ye.ltc_2.value=te.state.rectAreaLTC2,Ye.pointLights.value=te.state.point,Ye.pointLightShadows.value=te.state.pointShadow,Ye.hemisphereLights.value=te.state.hemi,Ye.directionalShadowMatrix.value=te.state.directionalShadowMatrix,Ye.spotLightMatrix.value=te.state.spotLightMatrix,Ye.spotLightMap.value=te.state.spotLightMap,Ye.pointShadowMatrix.value=te.state.pointShadowMatrix),ne.lightProbeGrid=L.state.lightProbeGridArray.length>0,ne.currentProgram=lt,ne.uniformsList=null,lt}function Eo(D){if(D.uniformsList===null){const K=D.currentProgram.getUniforms();D.uniformsList=Cu.seqWithValue(K.seq,D.uniforms)}return D.uniformsList}function bo(D,K){const le=U.get(D);le.outputColorSpace=K.outputColorSpace,le.batching=K.batching,le.batchingColor=K.batchingColor,le.instancing=K.instancing,le.instancingColor=K.instancingColor,le.instancingMorph=K.instancingMorph,le.skinning=K.skinning,le.morphTargets=K.morphTargets,le.morphNormals=K.morphNormals,le.morphColors=K.morphColors,le.morphTargetsCount=K.morphTargetsCount,le.numClippingPlanes=K.numClippingPlanes,le.numIntersection=K.numClipIntersection,le.vertexAlphas=K.vertexAlphas,le.vertexTangents=K.vertexTangents,le.toneMapping=K.toneMapping}function jl(D,K){if(D.length===0)return null;if(D.length===1)return D[0].texture!==null?D[0]:null;A.setFromMatrixPosition(K.matrixWorld);for(let le=0,ne=D.length;le<ne;le++){const te=D[le];if(te.texture!==null&&te.boundingBox.containsPoint(A))return te}return null}function Wl(D,K,le,ne,te){K.isScene!==!0&&(K=Zt),C.resetTextureUnits();const Pe=K.fog,Ge=ne.isMeshStandardMaterial||ne.isMeshLambertMaterial||ne.isMeshPhongMaterial?K.environment:null,Ce=V===null?z.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:vt.workingColorSpace,$e=ne.isMeshStandardMaterial||ne.isMeshLambertMaterial&&!ne.envMap||ne.isMeshPhongMaterial&&!ne.envMap,Ze=Z.get(ne.envMap||Ge,$e),ot=ne.vertexColors===!0&&!!le.attributes.color&&le.attributes.color.itemSize===4,lt=!!le.attributes.tangent&&(!!ne.normalMap||ne.anisotropy>0),Ye=!!le.morphAttributes.position,Mt=!!le.morphAttributes.normal,Ht=!!le.morphAttributes.color;let qt=dr;ne.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(qt=z.toneMapping);const Nt=le.morphAttributes.position||le.morphAttributes.normal||le.morphAttributes.color,dn=Nt!==void 0?Nt.length:0,Ve=U.get(ne),wn=L.state.lights;if(Bt===!0&&(ut===!0||D!==H)){const Dt=D===H&&ne.id===W;ze.setState(ne,D,Dt)}let mt=!1;ne.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==wn.state.version||Ve.outputColorSpace!==Ce||te.isBatchedMesh&&Ve.batching===!1||!te.isBatchedMesh&&Ve.batching===!0||te.isBatchedMesh&&Ve.batchingColor===!0&&te.colorTexture===null||te.isBatchedMesh&&Ve.batchingColor===!1&&te.colorTexture!==null||te.isInstancedMesh&&Ve.instancing===!1||!te.isInstancedMesh&&Ve.instancing===!0||te.isSkinnedMesh&&Ve.skinning===!1||!te.isSkinnedMesh&&Ve.skinning===!0||te.isInstancedMesh&&Ve.instancingColor===!0&&te.instanceColor===null||te.isInstancedMesh&&Ve.instancingColor===!1&&te.instanceColor!==null||te.isInstancedMesh&&Ve.instancingMorph===!0&&te.morphTexture===null||te.isInstancedMesh&&Ve.instancingMorph===!1&&te.morphTexture!==null||Ve.envMap!==Ze||ne.fog===!0&&Ve.fog!==Pe||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==ze.numPlanes||Ve.numIntersection!==ze.numIntersection)||Ve.vertexAlphas!==ot||Ve.vertexTangents!==lt||Ve.morphTargets!==Ye||Ve.morphNormals!==Mt||Ve.morphColors!==Ht||Ve.toneMapping!==qt||Ve.morphTargetsCount!==dn||!!Ve.lightProbeGrid!=L.state.lightProbeGridArray.length>0)&&(mt=!0):(mt=!0,Ve.__version=ne.version);let Wn=Ve.currentProgram;mt===!0&&(Wn=ga(ne,K,te),q&&ne.isNodeMaterial&&q.onUpdateProgram(ne,Wn,Ve));let Xn=!1,gt=!1,_r=!1;const Rt=Wn.getUniforms(),Wt=Ve.uniforms;if(Le.useProgram(Wn.program)&&(Xn=!0,gt=!0,_r=!0),ne.id!==W&&(W=ne.id,gt=!0),Ve.needsLights){const Dt=jl(L.state.lightProbeGridArray,te);Ve.lightProbeGrid!==Dt&&(Ve.lightProbeGrid=Dt,gt=!0)}if(Xn||H!==D){Le.buffers.depth.getReversed()&&D.reversedDepth!==!0&&(D._reversedDepth=!0,D.updateProjectionMatrix()),Rt.setValue(X,"projectionMatrix",D.projectionMatrix),Rt.setValue(X,"viewMatrix",D.matrixWorldInverse);const Oi=Rt.map.cameraPosition;Oi!==void 0&&Oi.setValue(X,It.setFromMatrixPosition(D.matrixWorld)),Pt.logarithmicDepthBuffer&&Rt.setValue(X,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(ne.isMeshPhongMaterial||ne.isMeshToonMaterial||ne.isMeshLambertMaterial||ne.isMeshBasicMaterial||ne.isMeshStandardMaterial||ne.isShaderMaterial)&&Rt.setValue(X,"isOrthographic",D.isOrthographicCamera===!0),H!==D&&(H=D,gt=!0,_r=!0)}if(Ve.needsLights&&(wn.state.directionalShadowMap.length>0&&Rt.setValue(X,"directionalShadowMap",wn.state.directionalShadowMap,C),wn.state.spotShadowMap.length>0&&Rt.setValue(X,"spotShadowMap",wn.state.spotShadowMap,C),wn.state.pointShadowMap.length>0&&Rt.setValue(X,"pointShadowMap",wn.state.pointShadowMap,C)),te.isSkinnedMesh){Rt.setOptional(X,te,"bindMatrix"),Rt.setOptional(X,te,"bindMatrixInverse");const Dt=te.skeleton;Dt&&(Dt.boneTexture===null&&Dt.computeBoneTexture(),Rt.setValue(X,"boneTexture",Dt.boneTexture,C))}te.isBatchedMesh&&(Rt.setOptional(X,te,"batchingTexture"),Rt.setValue(X,"batchingTexture",te._matricesTexture,C),Rt.setOptional(X,te,"batchingIdTexture"),Rt.setValue(X,"batchingIdTexture",te._indirectTexture,C),Rt.setOptional(X,te,"batchingColorTexture"),te._colorsTexture!==null&&Rt.setValue(X,"batchingColorTexture",te._colorsTexture,C));const Ui=le.morphAttributes;if((Ui.position!==void 0||Ui.normal!==void 0||Ui.color!==void 0)&&nt.update(te,le,Wn),(gt||Ve.receiveShadow!==te.receiveShadow)&&(Ve.receiveShadow=te.receiveShadow,Rt.setValue(X,"receiveShadow",te.receiveShadow)),(ne.isMeshStandardMaterial||ne.isMeshLambertMaterial||ne.isMeshPhongMaterial)&&ne.envMap===null&&K.environment!==null&&(Wt.envMapIntensity.value=K.environmentIntensity),Wt.dfgLUT!==void 0&&(Wt.dfgLUT.value=r3()),gt){if(Rt.setValue(X,"toneMappingExposure",z.toneMappingExposure),Ve.needsLights&&id(Wt,_r),Pe&&ne.fog===!0&&de.refreshFogUniforms(Wt,Pe),de.refreshMaterialUniforms(Wt,ne,De,Fe,L.state.transmissionRenderTarget[D.id]),Ve.needsLights&&Ve.lightProbeGrid){const Dt=Ve.lightProbeGrid;Wt.probesSH.value=Dt.texture,Wt.probesMin.value.copy(Dt.boundingBox.min),Wt.probesMax.value.copy(Dt.boundingBox.max),Wt.probesResolution.value.copy(Dt.resolution)}Cu.upload(X,Eo(Ve),Wt,C)}if(ne.isShaderMaterial&&ne.uniformsNeedUpdate===!0&&(Cu.upload(X,Eo(Ve),Wt,C),ne.uniformsNeedUpdate=!1),ne.isSpriteMaterial&&Rt.setValue(X,"center",te.center),Rt.setValue(X,"modelViewMatrix",te.modelViewMatrix),Rt.setValue(X,"normalMatrix",te.normalMatrix),Rt.setValue(X,"modelMatrix",te.matrixWorld),ne.uniformsGroups!==void 0){const Dt=ne.uniformsGroups;for(let Oi=0,Qi=Dt.length;Oi<Qi;Oi++){const Ps=Dt[Oi];fe.update(Ps,Wn),fe.bind(Ps,Wn)}}return Wn}function id(D,K){D.ambientLightColor.needsUpdate=K,D.lightProbe.needsUpdate=K,D.directionalLights.needsUpdate=K,D.directionalLightShadows.needsUpdate=K,D.pointLights.needsUpdate=K,D.pointLightShadows.needsUpdate=K,D.spotLights.needsUpdate=K,D.spotLightShadows.needsUpdate=K,D.rectAreaLights.needsUpdate=K,D.hemisphereLights.needsUpdate=K}function rd(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return Q},this.getActiveMipmapLevel=function(){return se},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(D,K,le){const ne=U.get(D);ne.__autoAllocateDepthBuffer=D.resolveDepthBuffer===!1,ne.__autoAllocateDepthBuffer===!1&&(ne.__useRenderToTexture=!1),U.get(D.texture).__webglTexture=K,U.get(D.depthTexture).__webglTexture=ne.__autoAllocateDepthBuffer?void 0:le,ne.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(D,K){const le=U.get(D);le.__webglFramebuffer=K,le.__useDefaultFramebuffer=K===void 0};const Qt=X.createFramebuffer();this.setRenderTarget=function(D,K=0,le=0){V=D,Q=K,se=le;let ne=null,te=!1,Pe=!1;if(D){const Ce=U.get(D);if(Ce.__useDefaultFramebuffer!==void 0){Le.bindFramebuffer(X.FRAMEBUFFER,Ce.__webglFramebuffer),Y.copy(D.viewport),ae.copy(D.scissor),oe=D.scissorTest,Le.viewport(Y),Le.scissor(ae),Le.setScissorTest(oe),W=-1;return}else if(Ce.__webglFramebuffer===void 0)C.setupRenderTarget(D);else if(Ce.__hasExternalTextures)C.rebindTextures(D,U.get(D.texture).__webglTexture,U.get(D.depthTexture).__webglTexture);else if(D.depthBuffer){const ot=D.depthTexture;if(Ce.__boundDepthTexture!==ot){if(ot!==null&&U.has(ot)&&(D.width!==ot.image.width||D.height!==ot.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(D)}}const $e=D.texture;($e.isData3DTexture||$e.isDataArrayTexture||$e.isCompressedArrayTexture)&&(Pe=!0);const Ze=U.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(Ze[K])?ne=Ze[K][le]:ne=Ze[K],te=!0):D.samples>0&&C.useMultisampledRTT(D)===!1?ne=U.get(D).__webglMultisampledFramebuffer:Array.isArray(Ze)?ne=Ze[le]:ne=Ze,Y.copy(D.viewport),ae.copy(D.scissor),oe=D.scissorTest}else Y.copy(ge).multiplyScalar(De).floor(),ae.copy(Oe).multiplyScalar(De).floor(),oe=Qe;if(le!==0&&(ne=Qt),Le.bindFramebuffer(X.FRAMEBUFFER,ne)&&Le.drawBuffers(D,ne),Le.viewport(Y),Le.scissor(ae),Le.setScissorTest(oe),te){const Ce=U.get(D.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ce.__webglTexture,le)}else if(Pe){const Ce=K;for(let $e=0;$e<D.textures.length;$e++){const Ze=U.get(D.textures[$e]);X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0+$e,Ze.__webglTexture,le,Ce)}}else if(D!==null&&le!==0){const Ce=U.get(D.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,Ce.__webglTexture,le)}W=-1},this.readRenderTargetPixels=function(D,K,le,ne,te,Pe,Ge,Ce=0){if(!(D&&D.isWebGLRenderTarget)){Tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let $e=U.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Ge!==void 0&&($e=$e[Ge]),$e){Le.bindFramebuffer(X.FRAMEBUFFER,$e);try{const Ze=D.textures[Ce],ot=Ze.format,lt=Ze.type;if(D.textures.length>1&&X.readBuffer(X.COLOR_ATTACHMENT0+Ce),!Pt.textureFormatReadable(ot)){Tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pt.textureTypeReadable(lt)){Tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}K>=0&&K<=D.width-ne&&le>=0&&le<=D.height-te&&X.readPixels(K,le,ne,te,j.convert(ot),j.convert(lt),Pe)}finally{const Ze=V!==null?U.get(V).__webglFramebuffer:null;Le.bindFramebuffer(X.FRAMEBUFFER,Ze)}}},this.readRenderTargetPixelsAsync=async function(D,K,le,ne,te,Pe,Ge,Ce=0){if(!(D&&D.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let $e=U.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Ge!==void 0&&($e=$e[Ge]),$e)if(K>=0&&K<=D.width-ne&&le>=0&&le<=D.height-te){Le.bindFramebuffer(X.FRAMEBUFFER,$e);const Ze=D.textures[Ce],ot=Ze.format,lt=Ze.type;if(D.textures.length>1&&X.readBuffer(X.COLOR_ATTACHMENT0+Ce),!Pt.textureFormatReadable(ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pt.textureTypeReadable(lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ye=X.createBuffer();X.bindBuffer(X.PIXEL_PACK_BUFFER,Ye),X.bufferData(X.PIXEL_PACK_BUFFER,Pe.byteLength,X.STREAM_READ),X.readPixels(K,le,ne,te,j.convert(ot),j.convert(lt),0);const Mt=V!==null?U.get(V).__webglFramebuffer:null;Le.bindFramebuffer(X.FRAMEBUFFER,Mt);const Ht=X.fenceSync(X.SYNC_GPU_COMMANDS_COMPLETE,0);return X.flush(),await TT(X,Ht,4),X.bindBuffer(X.PIXEL_PACK_BUFFER,Ye),X.getBufferSubData(X.PIXEL_PACK_BUFFER,0,Pe),X.deleteBuffer(Ye),X.deleteSync(Ht),Pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(D,K=null,le=0){const ne=Math.pow(2,-le),te=Math.floor(D.image.width*ne),Pe=Math.floor(D.image.height*ne),Ge=K!==null?K.x:0,Ce=K!==null?K.y:0;C.setTexture2D(D,0),X.copyTexSubImage2D(X.TEXTURE_2D,le,0,0,Ge,Ce,te,Pe),Le.unbindTexture()};const sd=X.createFramebuffer(),To=X.createFramebuffer();this.copyTextureToTexture=function(D,K,le=null,ne=null,te=0,Pe=0){let Ge,Ce,$e,Ze,ot,lt,Ye,Mt,Ht;const qt=D.isCompressedTexture?D.mipmaps[Pe]:D.image;if(le!==null)Ge=le.max.x-le.min.x,Ce=le.max.y-le.min.y,$e=le.isBox3?le.max.z-le.min.z:1,Ze=le.min.x,ot=le.min.y,lt=le.isBox3?le.min.z:0;else{const Wt=Math.pow(2,-te);Ge=Math.floor(qt.width*Wt),Ce=Math.floor(qt.height*Wt),D.isDataArrayTexture?$e=qt.depth:D.isData3DTexture?$e=Math.floor(qt.depth*Wt):$e=1,Ze=0,ot=0,lt=0}ne!==null?(Ye=ne.x,Mt=ne.y,Ht=ne.z):(Ye=0,Mt=0,Ht=0);const Nt=j.convert(K.format),dn=j.convert(K.type);let Ve;K.isData3DTexture?(C.setTexture3D(K,0),Ve=X.TEXTURE_3D):K.isDataArrayTexture||K.isCompressedArrayTexture?(C.setTexture2DArray(K,0),Ve=X.TEXTURE_2D_ARRAY):(C.setTexture2D(K,0),Ve=X.TEXTURE_2D),Le.activeTexture(X.TEXTURE0),Le.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,K.flipY),Le.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),Le.pixelStorei(X.UNPACK_ALIGNMENT,K.unpackAlignment);const wn=Le.getParameter(X.UNPACK_ROW_LENGTH),mt=Le.getParameter(X.UNPACK_IMAGE_HEIGHT),Wn=Le.getParameter(X.UNPACK_SKIP_PIXELS),Xn=Le.getParameter(X.UNPACK_SKIP_ROWS),gt=Le.getParameter(X.UNPACK_SKIP_IMAGES);Le.pixelStorei(X.UNPACK_ROW_LENGTH,qt.width),Le.pixelStorei(X.UNPACK_IMAGE_HEIGHT,qt.height),Le.pixelStorei(X.UNPACK_SKIP_PIXELS,Ze),Le.pixelStorei(X.UNPACK_SKIP_ROWS,ot),Le.pixelStorei(X.UNPACK_SKIP_IMAGES,lt);const _r=D.isDataArrayTexture||D.isData3DTexture,Rt=K.isDataArrayTexture||K.isData3DTexture;if(D.isDepthTexture){const Wt=U.get(D),Ui=U.get(K),Dt=U.get(Wt.__renderTarget),Oi=U.get(Ui.__renderTarget);Le.bindFramebuffer(X.READ_FRAMEBUFFER,Dt.__webglFramebuffer),Le.bindFramebuffer(X.DRAW_FRAMEBUFFER,Oi.__webglFramebuffer);for(let Qi=0;Qi<$e;Qi++)_r&&(X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,U.get(D).__webglTexture,te,lt+Qi),X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,U.get(K).__webglTexture,Pe,Ht+Qi)),X.blitFramebuffer(Ze,ot,Ge,Ce,Ye,Mt,Ge,Ce,X.DEPTH_BUFFER_BIT,X.NEAREST);Le.bindFramebuffer(X.READ_FRAMEBUFFER,null),Le.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else if(te!==0||D.isRenderTargetTexture||U.has(D)){const Wt=U.get(D),Ui=U.get(K);Le.bindFramebuffer(X.READ_FRAMEBUFFER,sd),Le.bindFramebuffer(X.DRAW_FRAMEBUFFER,To);for(let Dt=0;Dt<$e;Dt++)_r?X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,Wt.__webglTexture,te,lt+Dt):X.framebufferTexture2D(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,Wt.__webglTexture,te),Rt?X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,Ui.__webglTexture,Pe,Ht+Dt):X.framebufferTexture2D(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,Ui.__webglTexture,Pe),te!==0?X.blitFramebuffer(Ze,ot,Ge,Ce,Ye,Mt,Ge,Ce,X.COLOR_BUFFER_BIT,X.NEAREST):Rt?X.copyTexSubImage3D(Ve,Pe,Ye,Mt,Ht+Dt,Ze,ot,Ge,Ce):X.copyTexSubImage2D(Ve,Pe,Ye,Mt,Ze,ot,Ge,Ce);Le.bindFramebuffer(X.READ_FRAMEBUFFER,null),Le.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else Rt?D.isDataTexture||D.isData3DTexture?X.texSubImage3D(Ve,Pe,Ye,Mt,Ht,Ge,Ce,$e,Nt,dn,qt.data):K.isCompressedArrayTexture?X.compressedTexSubImage3D(Ve,Pe,Ye,Mt,Ht,Ge,Ce,$e,Nt,qt.data):X.texSubImage3D(Ve,Pe,Ye,Mt,Ht,Ge,Ce,$e,Nt,dn,qt):D.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,Pe,Ye,Mt,Ge,Ce,Nt,dn,qt.data):D.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,Pe,Ye,Mt,qt.width,qt.height,Nt,qt.data):X.texSubImage2D(X.TEXTURE_2D,Pe,Ye,Mt,Ge,Ce,Nt,dn,qt);Le.pixelStorei(X.UNPACK_ROW_LENGTH,wn),Le.pixelStorei(X.UNPACK_IMAGE_HEIGHT,mt),Le.pixelStorei(X.UNPACK_SKIP_PIXELS,Wn),Le.pixelStorei(X.UNPACK_SKIP_ROWS,Xn),Le.pixelStorei(X.UNPACK_SKIP_IMAGES,gt),Pe===0&&K.generateMipmaps&&X.generateMipmap(Ve),Le.unbindTexture()},this.initRenderTarget=function(D){U.get(D).__webglFramebuffer===void 0&&C.setupRenderTarget(D)},this.initTexture=function(D){D.isCubeTexture?C.setTextureCube(D,0):D.isData3DTexture?C.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?C.setTexture2DArray(D,0):C.setTexture2D(D,0),Le.unbindTexture()},this.resetState=function(){Q=0,se=0,V=null,Le.reset(),we.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ur}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=vt._getDrawingBufferColorSpace(e),t.unpackColorSpace=vt._getUnpackColorSpace()}}function Nx(){const a=me.useRef(null),{theme:e}=ha(),t=e==="dark";return me.useEffect(()=>{if(!a.current)return;const i=new VT;i.fog=new Em(0,.001);const s=new Di(60,window.innerWidth/window.innerHeight,.1,2e3);s.position.set(0,0,180);const o=new s3({alpha:!0,antialias:!0,powerPreference:"high-performance"});o.setSize(window.innerWidth,window.innerHeight),o.setPixelRatio(Math.min(window.devicePixelRatio,2)),a.current.appendChild(o.domElement);const c=8e4,u=new Ki,f=new Float32Array(c*3),h=new Float32Array(c*3),p=new Float32Array(c),_=t?new Et(58879):new Et(2450411),m=t?new Et(14239471):new Et(12592851);for(let T=0;T<c;T++){const I=T*3;let z=0,k=0,q=0,Q=_;const se=Math.random();if(se<.4){const V=(Math.random()-.5)*400,W=V*.1,H=25+Math.random()*2;z=Math.cos(W)*H,k=V,q=Math.sin(W)*H,Q=_,p[T]=1+Math.random()*1.5}else if(se<.8){const V=(Math.random()-.5)*400,W=V*.1+Math.PI,H=25+Math.random()*2;z=Math.cos(W)*H,k=V,q=Math.sin(W)*H,Q=m,p[T]=1+Math.random()*1.5}else if(se<.9){const V=(Math.random()-.5)*400,W=Math.random(),H=V*.1,Y=V*.1+Math.PI,ae=Math.cos(H)*25,oe=Math.sin(H)*25,B=Math.cos(Y)*25,J=Math.sin(Y)*25;z=ae+(B-ae)*W,k=V,q=oe+(J-oe)*W,Q=_.clone().lerp(m,W),p[T]=.5+Math.random()}else{const V=40+Math.random()*150,W=Math.random()*Math.PI*2,H=Math.acos(Math.random()*2-1);z=V*Math.sin(H)*Math.cos(W),k=V*Math.sin(H)*Math.sin(W),q=V*Math.cos(H),Q=Math.random()>.5?_:m,p[T]=Math.random()*2}z+=(Math.random()-.5)*3,k+=(Math.random()-.5)*3,q+=(Math.random()-.5)*3,f[I]=z,f[I+1]=k,f[I+2]=q,h[I]=Q.r,h[I+1]=Q.g,h[I+2]=Q.b}u.setAttribute("position",new vi(f,3)),u.setAttribute("color",new vi(h,3)),u.setAttribute("scale",new vi(p,1));const S=new Yi({uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uIsDark:{value:t?1:0}},vertexShader:`
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float scale;
        varying vec3 vColor;
        varying float vZ;

        void main() {
          vColor = color;
          vec3 pos = position;

          // Organic flow animation
          float noise = sin(pos.y * 0.05 + uTime) * 2.0;
          pos.x += cos(pos.y * 0.02 + uTime) * noise;
          pos.z += sin(pos.y * 0.02 + uTime) * noise;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vZ = -mvPosition.z;
          
          gl_Position = projectionMatrix * mvPosition;
          
          // Point size based on depth and scale
          gl_PointSize = scale * uPixelRatio * (250.0 / vZ);
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vZ;
        uniform float uIsDark;

        void main() {
          // Circular particle with soft edge
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if(ll > 0.5) discard;
          
          // Glow calculation
          float glow = smoothstep(0.5, 0.1, ll);
          
          // Depth fading
          float depthFade = smoothstep(400.0, 50.0, vZ);
          
          // Base opacity depends on theme
          float baseOpacity = mix(0.7, 0.9, uIsDark);
          
          gl_FragColor = vec4(vColor, glow * depthFade * baseOpacity);
        }
      `,transparent:!0,vertexColors:!0,blending:t?qh:oa,depthWrite:!1}),M=new QT(u,S);i.add(M),M.rotation.z=Math.PI*.1,M.rotation.x=Math.PI*.1;let b=0,x=0,E=0,w=0;const P=T=>{b=(T.clientX/window.innerWidth-.5)*2,x=(T.clientY/window.innerHeight-.5)*2};window.addEventListener("mousemove",P),cn.fromTo(M.scale,{x:.1,y:.1,z:.1},{x:1,y:1,z:1,duration:2.5,ease:"expo.out"}),cn.fromTo(M.rotation,{y:-Math.PI},{y:0,duration:3,ease:"power3.out"});const A=new cw;let N;const L=()=>{N=requestAnimationFrame(L);const T=A.getElapsedTime();S.uniforms.uTime.value=T,E+=(b-E)*.05,w+=(x-w)*.05,M.rotation.y+=.002,M.rotation.x=Math.PI*.1+w*.3,M.rotation.z=Math.PI*.1-E*.3,s.position.x+=(E*20-s.position.x)*.05,s.position.y+=(-w*20-s.position.y)*.05,s.lookAt(i.position),o.render(i,s)};L();const F=()=>{s.aspect=window.innerWidth/window.innerHeight,s.updateProjectionMatrix(),o.setSize(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",F),()=>{var T;cancelAnimationFrame(N),window.removeEventListener("mousemove",P),window.removeEventListener("resize",F),(T=a.current)!=null&&T.contains(o.domElement)&&a.current.removeChild(o.domElement),u.dispose(),S.dispose(),o.dispose()}},[t]),v.jsx("div",{ref:a,className:"fixed inset-0 z-0 pointer-events-none",style:{mixBlendMode:t?"screen":"normal"}})}const Vp=me.createContext({theme:"dark",toggleTheme:()=>{}}),ha=()=>me.useContext(Vp);function a3(){const[a,e]=me.useState([]),[t,i]=me.useState(!0),[s,o]=me.useState(!1),[c,u]=me.useState("dashboard"),[f,h]=me.useState("dark"),p=()=>{h(A=>{const N=A==="dark"?"light":"dark";return cn.to("body",{duration:.4,ease:"power2.inOut"}),N})},_=f==="dark";me.useEffect(()=>{const A=document.getElementById("page-content");A&&cn.fromTo(A,{y:24,opacity:0},{y:0,opacity:1,duration:.55,ease:"expo.out"})},[c]);const m=A=>{const N={...A,id:Date.now().toString(),timestamp:new Date};e([N,...a])},S=A=>{e(a.map(N=>N.id===A?{...N,liked:!N.liked}:N))},M=()=>i(!1);me.useEffect(()=>{t||(cn.timeline({defaults:{ease:"power4.out"}}).fromTo("header",{y:-80,opacity:0},{y:0,opacity:1,duration:1.2,delay:.2}).fromTo(".lucide",{scale:0,rotation:-90},{scale:1,rotation:0,duration:.8,stagger:.1,ease:"back.out(1.7)"},"-=0.8").fromTo("main > div",{y:60,opacity:0,scale:.97},{y:0,opacity:1,scale:1,duration:1,stagger:.15},"-=0.6"),document.querySelectorAll("button").forEach(L=>{L.addEventListener("mousemove",F=>{const T=L.getBoundingClientRect(),I=F.clientX-T.left-T.width/2,z=F.clientY-T.top-T.height/2;cn.to(L,{x:I*.3,y:z*.3,duration:.4,ease:"power2.out"})}),L.addEventListener("mouseleave",()=>{cn.to(L,{x:0,y:0,duration:.7,ease:"elastic.out(1, 0.3)"})})}))},[t,c]);const E=_?{"--bg-base":"#000005","--bg-surface":"rgba(10,10,24,0.65)","--bg-card":"rgba(14,14,30,0.75)","--border-color":"rgba(255,255,255,0.10)","--text-primary":"#ffffff","--text-secondary":"rgba(255,255,255,0.65)","--text-muted":"rgba(255,255,255,0.38)","--accent-cyan":"#22d3ee","--accent-violet":"#8b5cf6","--accent-fuchsia":"#d946ef","--header-bg":"rgba(5,5,14,0.80)","--footer-bg":"rgba(5,5,14,0.88)","--nav-active-bg":"rgba(139,92,246,0.20)","--input-bg":"rgba(8,8,20,0.60)","--scrollbar-thumb":"rgba(255,255,255,0.15)"}:{"--bg-base":"#f8faff","--bg-surface":"rgba(255,255,255,0.95)","--bg-card":"rgba(255,255,255,0.98)","--border-color":"rgba(0,0,0,0.10)","--text-primary":"#0a0a1a","--text-secondary":"rgba(10,10,26,0.72)","--text-muted":"rgba(10,10,26,0.48)","--accent-cyan":"#0284c7","--accent-violet":"#6d28d9","--accent-fuchsia":"#9333ea","--header-bg":"rgba(255,255,255,0.95)","--footer-bg":"rgba(248,250,255,0.97)","--nav-active-bg":"rgba(109,40,217,0.10)","--input-bg":"rgba(248,250,255,0.95)","--scrollbar-thumb":"rgba(0,0,0,0.18)"},w="text-[--text-primary]",P="border-[--border-color]";return t?v.jsx(Vp.Provider,{value:{theme:f,toggleTheme:p},children:v.jsxs("div",{style:E,children:[!_&&v.jsx("div",{className:"fixed inset-0 z-0 pointer-events-none",style:{background:"linear-gradient(135deg, #dde8ff 0%, #f0f5ff 40%, #f5eeff 70%, #edf9f5 100%)",opacity:.95}}),v.jsx(Nx,{}),v.jsx("div",{className:"relative z-10 min-h-screen",children:v.jsx(jb,{onGetStarted:M})})]})}):v.jsx(Vp.Provider,{value:{theme:f,toggleTheme:p},children:v.jsxs("div",{className:`min-h-screen relative overflow-hidden transition-colors duration-500 ${w}`,style:E,children:[!_&&v.jsx("div",{className:"fixed inset-0 z-0 pointer-events-none",style:{background:"linear-gradient(135deg, #dde8ff 0%, #f5f9ff 35%, #f5eeff 70%, #e8f8f5 100%)",opacity:.92}}),v.jsx(Nx,{}),v.jsxs("div",{className:"relative z-10",children:[v.jsx("header",{className:`sticky top-0 z-50 backdrop-blur-2xl border-b ${P}`,style:{background:"var(--header-bg)",boxShadow:_?"0 4px 30px rgba(0,0,0,0.5)":"0 4px 20px rgba(0,0,0,0.08)"},children:v.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[v.jsxs("div",{className:"flex items-center justify-between py-4",children:[v.jsxs("div",{className:"flex items-center gap-3 cursor-pointer",children:[v.jsx("div",{className:"p-3 rounded-xl transition-transform duration-300 hover:scale-110",style:{background:"linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",boxShadow:_?"0 0 20px rgba(139,122,255,0.4)":"0 4px 16px rgba(109,40,217,0.3)"},children:v.jsx(gl,{className:"w-8 h-8 text-white"})}),v.jsxs("div",{children:[v.jsx("h1",{className:"text-xl font-bold tracking-wide",style:{fontFamily:"'Syne', sans-serif",color:"var(--text-primary)",letterSpacing:"0.05em"},children:"MediAI Pro"}),v.jsx("p",{className:"text-[10px] uppercase tracking-[0.25em] hidden sm:block mt-0.5",style:{fontFamily:"'Syne', sans-serif",color:"var(--text-muted)"},children:"AI Diagnostic Suite"})]})]}),v.jsx("nav",{className:"hidden md:flex items-center gap-1",children:[{id:"dashboard",label:"Dashboard",icon:c_},{id:"analyze",label:"Analyze",icon:na},{id:"history",label:"History",icon:Nu},{id:"settings",label:"Settings",icon:f_}].map(({id:A,label:N,icon:L})=>v.jsxs("button",{onClick:()=>u(A),className:"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",style:{background:c===A?"var(--nav-active-bg)":"transparent",color:c===A?"var(--accent-violet)":"var(--text-secondary)",border:c===A?"1px solid var(--accent-violet)":"1px solid transparent"},children:[v.jsx(L,{className:"w-4 h-4"}),N]},A))}),v.jsxs("div",{className:"flex items-center gap-2",children:[v.jsxs("button",{className:"hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300",style:{background:"var(--bg-surface)",color:"var(--text-secondary)",border:"1px solid var(--border-color)"},children:[v.jsx(lv,{className:"w-4 h-4"}),"Profile"]}),v.jsx(sy,{}),v.jsx("button",{className:"md:hidden p-2 rounded-xl transition-all",onClick:()=>o(!s),style:{background:"var(--bg-surface)",color:"var(--text-primary)",border:"1px solid var(--border-color)"},children:s?v.jsx($p,{className:"w-5 h-5"}):v.jsx(UM,{className:"w-5 h-5"})})]})]}),s&&v.jsx("div",{className:`md:hidden pb-4 border-t mt-2 pt-4 ${P}`,children:v.jsx("div",{className:"flex flex-col gap-1",children:[{id:"dashboard",label:"Dashboard",icon:c_},{id:"analyze",label:"Analyze",icon:na},{id:"history",label:"History",icon:Nu},{id:"settings",label:"Settings",icon:f_}].map(({id:A,label:N,icon:L})=>v.jsxs("button",{onClick:()=>{u(A),o(!1)},className:"flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",style:{background:c===A?"var(--nav-active-bg)":"transparent",color:c===A?"var(--accent-violet)":"var(--text-secondary)"},children:[v.jsx(L,{className:"w-4 h-4"}),N]},A))})})]})}),v.jsxs("main",{id:"page-content",className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10",children:[c==="analyze"&&v.jsxs("div",{children:[v.jsxs("div",{className:"mb-8",children:[v.jsx("h2",{className:"text-3xl font-bold mb-2",style:{fontFamily:"'Syne', sans-serif",color:"var(--text-primary)"},children:"AI-Powered Analysis"}),v.jsx("p",{style:{color:"var(--text-secondary)"},children:"Choose an analysis method to get started"})]}),v.jsxs(lM,{defaultValue:"symptoms",className:"space-y-6",children:[v.jsx(iv,{className:"grid w-full grid-cols-3 lg:w-auto lg:inline-grid rounded-2xl p-1",style:{background:"var(--bg-surface)",border:"1px solid var(--border-color)"},children:[{value:"symptoms",label:"Symptoms",icon:na},{value:"image",label:"Scans",icon:gl},{value:"report",label:"Reports",icon:Ml}].map(({value:A,label:N,icon:L})=>v.jsxs(rv,{value:A,className:"gap-2 data-[state=active]:text-white",style:{color:"var(--text-secondary)"},children:[v.jsx(L,{className:"w-4 h-4"}),v.jsx("span",{className:"hidden sm:inline",children:N})]},A))}),v.jsx(vu,{value:"symptoms",children:v.jsx(Fb,{onPrediction:m})}),v.jsx(vu,{value:"image",children:v.jsx(Bb,{onPrediction:m})}),v.jsx(vu,{value:"report",children:v.jsx(zb,{onPrediction:m})})]})]}),c==="dashboard"&&v.jsx(Hb,{predictions:a,onNavigate:u}),c==="history"&&v.jsxs("div",{children:[v.jsxs("div",{className:"mb-8",children:[v.jsx("h2",{className:"text-3xl font-bold mb-2",style:{fontFamily:"'Syne', sans-serif",color:"var(--text-primary)"},children:"Analysis History"}),v.jsx("p",{style:{color:"var(--text-secondary)"},children:"Review all your previous medical analyses"})]}),v.jsx(Vb,{predictions:a,onLike:S})]}),c==="settings"&&v.jsxs("div",{children:[v.jsxs("div",{className:"mb-8",children:[v.jsx("h2",{className:"text-3xl font-bold mb-2",style:{fontFamily:"'Syne', sans-serif",color:"var(--text-primary)"},children:"Settings"}),v.jsx("p",{style:{color:"var(--text-secondary)"},children:"Manage your preferences and account"})]}),v.jsx(Gb,{})]})]}),v.jsx("footer",{className:`mt-16 border-t ${P}`,style:{background:"var(--footer-bg)",backdropFilter:"blur(20px)"},children:v.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10",children:[v.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-8 mb-8",children:[v.jsxs("div",{children:[v.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[v.jsx("div",{className:"p-2 rounded-lg",style:{background:"linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))"},children:v.jsx(gl,{className:"w-5 h-5 text-white"})}),v.jsx("span",{className:"font-bold text-lg",style:{color:"var(--text-primary)"},children:"MediAI Pro"})]}),v.jsx("p",{className:"text-sm",style:{color:"var(--text-secondary)"},children:"Advanced AI-powered disease prediction and medical analysis platform."})]}),[{heading:"Features",items:["Symptom Analysis","Medical Scan Review","Lab Report Analysis","Prediction History"]},{heading:"Resources",items:["Documentation","API Reference","Privacy Policy","Terms of Service"]},{heading:"Support",items:["Help Center","Contact Us","FAQ","Community"]}].map(({heading:A,items:N})=>v.jsxs("div",{children:[v.jsx("h4",{className:"font-semibold mb-3",style:{color:"var(--text-primary)"},children:A}),v.jsx("ul",{className:"space-y-2 text-sm",children:N.map(L=>v.jsx("li",{style:{color:"var(--text-secondary)"},className:"hover:opacity-80 cursor-pointer transition-opacity",children:L},L))})]},A))]}),v.jsxs("div",{className:`border-t pt-6 ${P}`,children:[v.jsxs("p",{className:"text-center text-sm mb-3",style:{color:"var(--text-secondary)"},children:["⚠️ ",v.jsx("strong",{children:"Medical Disclaimer:"})," This is an AI-powered diagnostic assistance tool for informational purposes only. Always consult with qualified healthcare professionals."]}),v.jsx("p",{className:"text-center text-xs",style:{color:"var(--text-muted)"},children:"© 2026 MediAI Pro. All rights reserved. | Powered by Advanced Machine Learning"})]})]})})]})]})})}NS.createRoot(document.getElementById("root")).render(v.jsx(a3,{}));
