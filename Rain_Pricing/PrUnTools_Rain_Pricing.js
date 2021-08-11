// ==UserScript==
// @name         PrUnTools_Rain_Pricing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://apex.prosperousuniverse.com/
// @grant        none
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://cdn.jsdelivr.net/gh/timthedevguy/apexutils@0.0.15/dist/apexutils.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Apex
    apex.load();

    // Wait for Load to be complete
    document.addEventListener('PrUnTools_Loaded', () => {
        // Add our menu button
        apex.addMenuItem('rain_price', 'RAIN', 'Rain Pricing', rain_click);
    });

    function copyToClipboard(text) {
        var dummy = document.createElement("textarea");
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    function rain_click() {
        !function(){return function e(r,t,a){function o(c,i){if(!t[c]){if(!r[c]){var s="function"==typeof require&&require;if(!i&&s)return s(c,!0);if(n)return n(c,!0);var u=new Error("Cannot find module '"+c+"'");throw u.code="MODULE_NOT_FOUND",u}var d=t[c]={exports:{}};r[c][0].call(d.exports,function(e){return o(r[c][1][e]||e)},d,d.exports,e,r,t,a)}return t[c].exports}for(var n="function"==typeof require&&require,c=0;c<a.length;c++)o(a[c]);return o}}()({1:[function(e,r,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=e("../snippet-core"),o=e("../extractors/material-value-extractor");(new a.SnippetCore).Run(o.MaterialValueExtractor)},{"../extractors/material-value-extractor":3,"../snippet-core":7}],2:[function(e,r,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.MaterialDataProvider=class{constructor(e){this.data=e,this.Materials=e.materials.materials.reduce((e,r)=>Object.assign(e,{[r.id]:r}),{})}}},{}],3:[function(e,r,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=e("./data-providers/material-dp");e("../helpers");t.MaterialValueExtractor=class{Parse(e){this.materials=new a.MaterialDataProvider(e).Materials;var r=Object.keys(this.materials).map(e=>this.materials[e]).map(e=>({ticker:e.ticker})).reduce((e,r)=>Object.assign(e,{[r.ticker]:r}),{}),t=Object.keys(e.comex.exchange.exchanges.data).map(r=>e.comex.exchange.exchanges.data[r]).map(e=>({id:e.id,name:e.name,code:e.code,currency:e.currency.code})),o=[];Object.keys(e.comex.broker.brokers).map(r=>e.comex.broker.brokers[r]).filter(e=>!!e.data).forEach(e=>{r[e.data.material.ticker];var t,a,n=null!==(t=e.data.buyingOrders.filter(e=>null===e.amount).map(e=>e.limit.amount)[0])&&void 0!==t?t:"",c=null!==(a=e.data.sellingOrders.filter(e=>null===e.amount).map(e=>e.limit.amount)[0])&&void 0!==a?a:"";o.push({ticker:e.data.material.ticker,cx:e.data.exchange.code,type:"mm-buy",value:n}),o.push({ticker:e.data.material.ticker,cx:e.data.exchange.code,type:"mm-sell",value:c});var i=e.data.ask?e.data.ask.price.amount:"",s=e.data.bid?e.data.bid.price.amount:"",u=e.data.priceAverage?e.data.priceAverage.amount:"";o.push({ticker:e.data.material.ticker,cx:e.data.exchange.code,type:"ask",value:i}),o.push({ticker:e.data.material.ticker,cx:e.data.exchange.code,type:"bid",value:s}),o.push({ticker:e.data.material.ticker,cx:e.data.exchange.code,type:"avg",value:u})});var n=o.groupBy((e,r)=>Math.floor(r/500).toString());return[{dataVersion:"MATERIAL-VALUE-001",userInfo:{username:e.user.user.data.username,companyId:e.user.user.data.companyId,userId:e.user.user.data.id},exchanges:t},...Object.values(n)]}}},{"../helpers":4,"./data-providers/material-dp":2}],4:[function(e,r,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Array.prototype.flatten=function(){return this.reduce((e,r)=>e.concat(r),[])},Array.prototype.groupBy=function(e){return this.reduce((r,t,a)=>{var o,n=e(t,a);return r[n]=(o=r[n],null!==o&&void 0!==o?o:[]).concat([t]),r},{})},Array.prototype.toDictionary=function(e){return this.reduce((r,t)=>{var a=e(t);return r[a]||(r[a]=t),r},{})}},{}],5:[function(e,r,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.ExportEncoder=class{ExportToLog(e){if(e&&e.length)return e.map(e=>{var r=JSON.stringify(e);return btoa(r)}).join("\n");var r=JSON.stringify(e);return btoa(r)}}},{}],6:[function(e,r,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.ReduxStoreHarness=class{GetStore(){var e=document.getElementById("container");if(!e)throw new Error("Unable to find container element, this may not be running on APEX.");try{return e._reactRootContainer._internalRoot.current.child.child.child.pendingProps.store.getState().toJS()}catch(e){throw new Error("Unable to find state on container element.")}}}},{}],7:[function(e,r,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=e("./services/export-encoder"),o=e("./services/redux-store-harness");t.SnippetCore=class{Run(e){try{var r=new e,t=new o.ReduxStoreHarness,n=new a.ExportEncoder,c=t.GetStore(),i=r.Parse(c),s=n.ExportToLog(i);console.log("Exported Data (copied to clipboard) ",s),copyToClipboard(s)}catch(e){console.error("Exception occurred",e)}}}},{"./services/export-encoder":5,"./services/redux-store-harness":6}]},{},[1]);
        apex.flashMenuItem('rain_price', 'green', 1000);
    }



})();
