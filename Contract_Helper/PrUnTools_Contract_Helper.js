// ==UserScript==
// @name         PrUnTools_Contract_Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://apex.prosperousuniverse.com/
// @grant        none
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://cdn.jsdelivr.net/gh/binarygod/apexutils@0.0.11/dist/apexutils.min.js
// ==/UserScript==

(function() {
    'use strict';

    let data;

    // Load ApexUtils (Inserts Menu on APEX UI)
    apex.load();

    // Fired when PrUnTools Menu is ready (Occurs after 5s of page load)
    document.addEventListener('PrUnTools_Loaded', () => {

        // Add new Menu Item
        apex.addMenuItem('contract-helper', 'CONT-H', 'Contract Helper', contract_helper_click);
    });

    function contract_helper_click() {

        data = apex.state.contracts;

        let contracts = Object.values(data).filter(obj => { return obj.status !== 'FULFILLED'; });
        let awaitingProvisioning = Object.values(contracts).filter(obj => { return obj.conditions[0].status !== 'FULFILLED'; });
        let awaitingPayment = Object.values(contracts).filter(obj => { return obj.conditions[0].status === 'FULFILLED' & obj.conditions[1].status !== 'FULFILLED'; });
        let awaitingPickup = Object.values(contracts).filter(obj => { return obj.conditions[0].status === 'FULFILLED' & obj.conditions[2].status !== 'FULFILLED'; });
        let awaitingDelivery = Object.values(contracts).filter(obj => { return obj.conditions[0].status === 'FULFILLED' & obj.conditions[2].status === 'FULFILLED' & obj.conditions[3].status !== 'FULFILLED'; });

        let html = `
            <table class='PrUnTools_Table' id='table_contract_helper'>
                <thead>
                    <tr>
                        <th>Contract</th>
                        <th>Partner</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Due</th>
                        <th>Payment</th>
                        <th>Cmds</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if(Object.keys(awaitingProvisioning).length > 0) {

            html += `
                <tr>
                    <td colspan="7" class="header-cell">Awaiting Payment</td>
                </tr>
        `

            for (var key in awaitingProvisioning) {
                html += `<tr>
                        <td>${awaitingProvisioning[key].localId}</td>
                        <td>${awaitingProvisioning[key].partner.name}</td>
                        <td>${awaitingProvisioning[key].conditions[2].address.lines[0].entity.name} - ${awaitingProvisioning[key].conditions[2].address.lines[1].entity.name} (${awaitingProvisioning[key].conditions[2].address.lines[1].entity.naturalId})</td>
                        <td>${awaitingProvisioning[key].conditions[3].destination.lines[0].entity.name} - ${awaitingProvisioning[key].conditions[3].destination.lines[1].entity.name} (${awaitingProvisioning[key].conditions[3].destination.lines[1].entity.naturalId})</td>
                        <td>${getTimestampDifference(awaitingProvisioning[key].dueDate.timestamp)}</td>
                        <td class="accounting-cell">${awaitingProvisioning[key].conditions[1].amount.amount} ${awaitingProvisioning[key].conditions[1].amount.currency}</td>
                        <td><button class="PrUnTools_Button_Primary contract-view" id="${awaitingProvisioning[key].localId}"><span>view</span></button></td>
                    </tr>
            `
            }
        }

        if(Object.keys(awaitingPayment).length > 0) {
            html += `
                <tr>
                    <td colspan="7" class="header-cell">Awaiting Payment</td>
                </tr>
        `

            for (var key in awaitingPayment) {
                html += `<tr>
                        <td>${awaitingPayment[key].localId}</td>
                        <td>${awaitingPayment[key].partner.name}</td>
                        <td>${awaitingPayment[key].conditions[2].address.lines[0].entity.name} - ${awaitingPayment[key].conditions[2].address.lines[1].entity.name} (${awaitingPayment[key].conditions[2].address.lines[1].entity.naturalId})</td>
                        <td>${awaitingPayment[key].conditions[3].destination.lines[0].entity.name} - ${awaitingPayment[key].conditions[3].destination.lines[1].entity.name} (${awaitingPayment[key].conditions[3].destination.lines[1].entity.naturalId})</td>
                        <td>${getTimestampDifference(awaitingPayment[key].dueDate.timestamp)}</td>
                        <td class="accounting-cell">${awaitingPayment[key].conditions[1].amount.amount} ${awaitingPayment[key].conditions[1].amount.currency}</td>
                        <td><button class="PrUnTools_Button_Primary contract-view" id="${awaitingPayment[key].localId}"><span>view</span></button></td>
                    </tr>
            `
            }
        }

        if(Object.keys(awaitingPickup).length > 0) {

            html += `
                <tr>
                    <td colspan="7" class="header-cell">Awaiting Pickup</td>
                </tr>
        `

            for (var key in awaitingPickup) {
                html += `<tr>
                        <td>${awaitingPickup[key].localId}</td>
                        <td>${awaitingPickup[key].partner.name}</td>
                        <td>${awaitingPickup[key].conditions[2].address.lines[0].entity.name} - ${awaitingPickup[key].conditions[2].address.lines[1].entity.name} (${awaitingPickup[key].conditions[2].address.lines[1].entity.naturalId})</td>
                        <td>${awaitingPickup[key].conditions[3].destination.lines[0].entity.name} - ${awaitingPickup[key].conditions[3].destination.lines[1].entity.name} (${awaitingPickup[key].conditions[3].destination.lines[1].entity.naturalId})</td>
                        <td>${getTimestampDifference(awaitingPickup[key].dueDate.timestamp)}</td>
                        <td class="accounting-cell">${awaitingPickup[key].conditions[1].amount.amount} ${awaitingPickup[key].conditions[1].amount.currency}</td>
                        <td><button class="PrUnTools_Button_Primary contract-view" id="${awaitingPickup[key].localId}"><span>view</span></button></td>
                    </tr>
            `
            }
        }

        if(Object.keys(awaitingDelivery).length > 0) {

            html += `
                <tr>
                    <td colspan="7" class="header-cell">Awaiting Delivery</td>
                </tr>
        `

            for (var key in awaitingDelivery) {
                html += `<tr>
                        <td>${awaitingDelivery[key].localId}</td>
                        <td>${awaitingDelivery[key].partner.name}</td>
                        <td>${awaitingDelivery[key].conditions[2].address.lines[0].entity.name} - ${awaitingDelivery[key].conditions[2].address.lines[1].entity.name} (${awaitingDelivery[key].conditions[2].address.lines[1].entity.naturalId})</td>
                        <td>${awaitingDelivery[key].conditions[3].destination.lines[0].entity.name} - ${awaitingDelivery[key].conditions[3].destination.lines[1].entity.name} (${awaitingDelivery[key].conditions[3].destination.lines[1].entity.naturalId})</td>
                        <td>${getTimestampDifference(awaitingDelivery[key].dueDate.timestamp)}</td>
                        <td class="accounting-cell">${awaitingDelivery[key].conditions[1].amount.amount} ${awaitingDelivery[key].conditions[1].amount.currency}</td>
                        <td><button class="PrUnTools_Button_Primary contract-view" id="${awaitingDelivery[key].localId}"><span>view</span></button></td>
                    </tr>
            `
            }
        }

        html += `
                </tbody>
            </table>
        `

        $('BODY').on('click', '.contract-view', openContract);

        console.log(awaitingProvisioning);
        console.log(awaitingPayment);
        console.log(awaitingPickup);
        console.log(awaitingDelivery);

        apex.showBuffer("Contract Helper", 'PrUnTools', 800,300, html);
    }

    function openContract() {
        let contractId = $(this).attr('id');

        $('[class^="ContractsPanel__table"] TBODY TR').each((index) => {
            if($('[class^="ContractsPanel__table"] TBODY TR:nth-child(' + index + ') TD:first-child').html() == contractId) {
                $('[class^="ContractsPanel__table"] TBODY TR:nth-child(' + index + ') TD:nth-child(6) BUTTON').click();
            }
        });
    }

    function getTimestampDifference(dueInTimestamp) {
        let nowTimestamp = (new Date()).getTime();
        let diffTimestamp = (dueInTimestamp - nowTimestamp)/1000;

        let days = Math.floor(diffTimestamp / 86400);
        diffTimestamp -= days * 86400;

        let hours = Math.floor(diffTimestamp / 3600) % 24;
        diffTimestamp -= hours * 3600;

        let minutes = Math.floor(diffTimestamp / 60) % 60;
        diffTimestamp -= minutes * 60;

        let seconds = diffTimestamp % 60;

        let result = '';

        if(days > 0) {
            if(days > 1) {
                result += `${days} days `
            } else {
                result += `${days} day `
            }
        }

        if(hours > 0) {
            result += `${hours}h`
        }

        if((days == 0 | hours == 0) & minutes > 0) {
            result += `${minutes}m`;
        }

        if((days == 0 & hours == 0) & seconds > 0) {
            result += `${seconds}s`;
        }

        return result;
    }
})();
