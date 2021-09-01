// ==UserScript==
// @name         PrUnTools_Freight_Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://apex.prosperousuniverse.com/
// @grant        none
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://cdn.jsdelivr.net/gh/binarygod/apexutils@0.0.15/dist/apexutils.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Apex
    apex.load();

    // Wait for Load to be complete
    document.addEventListener('PrUnTools_Loaded', () => {
        // Add our menu button
        apex.addMenuItem('freight-calc', 'FCALC', 'Freight Calculator', fcalc_click);
    });

    function fcalc_click() {
        let content = `
            <table class='PrUnTools_Table'>
                <thead>
                    <tr>
                        <th colspan="2">Standard Value Settings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="PrUnTools_Label yellow" style="width:150px;">Full load value / 24 hrs</td>
                        <td class="PrUnTools_Label_Input yellow"><input style="max-width:75px;" type="text" id="base_value" class="PrUnTools_Control fcalc" value="5000"/></td>
                    <tr>
                    <tr>
                        <td class="bottom-border-cell" colspan="2">
                            <p>This is the current suggested value by the market for a fully loaded ship per 24 hours or travel.</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="PrUnTools_Label yellow" style="width:150px;">Cargo Tonnage</td>
                        <td class="PrUnTools_Label_Input yellow"><input style="max-width:75px;" type="text" id="ton" class="PrUnTools_Control fcalc" value="0"/></td>
                    <tr>
                    <tr>
                        <td class="PrUnTools_Label yellow" style="width:150px;">Cargo Volume</td>
                        <td class="PrUnTools_Label_Input yellow"><input style="max-width:75px;" type="text" id="volume" class="PrUnTools_Control fcalc" value="0"/></td>
                    <tr>
                    <tr>
                        <td class="bottom-border-cell" colspan="2">
                            <p>The greater of Cargo Tonnage or Cargo Volume will be used for the calculations.</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="PrUnTools_Label yellow" style="width:150px;">Travel Time in Hours</td>
                        <td class="PrUnTools_Label_Input yellow"><input style="max-width:75px;" type="text" id="time" class="PrUnTools_Control fcalc" value="0"/></td>
                    <tr>
                    <tr>
                        <td class="bottom-border-cell" colspan="2">
                            <p>Convert the travel time to hours, round up as needed.</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="PrUnTools_Label blue" style="width:150px;">Contract Value</td>
                        <td class="PrUnTools_Label_Output blue"><span id="value">0.0</span></td>
                    <tr>
                </tbody>
            </table>
        `;

        $('BODY').on('keyup', '.fcalc', calculate);

        apex.showBuffer("Freight Calculator", 'PrUnTools', 400, 298, content);
    }

    function calculate() {
        let base_value = Number($('#base_value').val());
        let tonnage = Number($('#ton').val());
        let volume = Number($('#volume').val());
        let time = (Number($('#time').val())/24);

        let modifier = 0;

        if(tonnage > volume) {
            modifier = (tonnage/400);
        } else {
            modifier = (volume/400);
        }

        $('#value').html(((base_value*time)*modifier).toFixed(2));
    }
})();
