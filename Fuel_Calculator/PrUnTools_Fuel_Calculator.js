// ==UserScript==
// @name         PrUnTools_Fuel_Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://apex.prosperousuniverse.com/
// @grant        none
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://cdn.jsdelivr.net/gh/binarygod/apexutils@0.0.9/dist/apexutils.min.js
// ==/UserScript==

(function() {
    'use strict';

    let data;
    let prices;
    // REMOVE
    // $.getJSON('market_data_multiple.json', (json) => {
    //     data = json;
    // });
    // REMOVE

    // Load ApexUtils (Inserts Menu on APEX UI)
    apex.load();

    // Fired when PrUnTools Menu is ready (Occurs after 5s of page load)
    document.addEventListener('PrUnTools_Loaded', () => {

        // Add new Menu Item
        apex.addMenuItem('fuel-calc', 'FUEL', 'Fuel Calculator', fuel_click);
    });

    function fuel_click() {

        let stl = '';
        let ftl = '';
        let content = '';
        let hasCurrency = false;

        // Load prices from STATE
        prices = apex.state.comex.broker.brokers;

        // Make sure we have data
        if(Object.keys(prices).length > 0) {

            // Get all entries with matching Ticker
            stl = Object.values(prices).filter(obj => { return obj.data.material.ticker === 'SF' });
            ftl = Object.values(prices).filter(obj => { return obj.data.material.ticker === 'FF' });

            // Ensure we have at least 1 of each Fuel type in the STATE data
            if(stl.length > 0 & ftl.length > 0) {

                // Check if we have more than one entry per Fuel Type, if so then multiple currencies
                // are involved.
                if(stl.length > 1 | ftl.length > 1) {

                    let currencies = {};
                    // Add Name and Currency Code to Dictionary
                    stl.forEach((item) => {
                        currencies[item.data.currency.code] = item.data.currency.numericCode;
                    });
                    // Add Name and Currency Code to Dictionary
                    ftl.forEach((item) => {
                        currencies[item.data.currency.code] = item.data.currency.numericCode;
                    });

                    // We have multiple Currencies in STATE so we need to setup a way to pick the one the user
                    // wants to use for calculations.
                    content = `
                        <table class='PrUnTools_Table'>
                            <tbody>
                                <tr>
                                    <td class="PrUnTools_Label yellow" style="width:150px;">Currency</td>
                                    <td class="PrUnTools_Label_Input yellow"><select class='PrUnTools_Control' id='currency-select'>
                    `
                    // Create our Options for Currencies that we have data for
                    for(var key in currencies) {
                        content += '<option value="' + currencies[key] + '">' + key + '</option>';
                    };
                    // Finish content
                    content += `</select>
                                </td>
                            </tr>
                            <tr>
                                <td class="top-border-cell" colspan="2">
                                    <p>Multiple currencies found in STATE, select currency to use.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>`;

                    // Default selected currency is 0, lets start with that one
                    let selectedCode = currencies[Object.keys(currencies)[0]];
                    stl = Object.values(prices).filter(obj => { return (obj.data.currency.numericCode === selectedCode & obj.data.material.ticker === 'SF') });
                    ftl = Object.values(prices).filter(obj => { return (obj.data.currency.numericCode === selectedCode & obj.data.material.ticker === 'FF') });

                    // Setup Currency Select Change event.
                    $('BODY').on('change', '#currency-select', select_changed);

                    // Mark that we have the currency stuff loaded (used to determine window size)
                    hasCurrency = true;
                }

                // Add normal Calculator content
                content += `
                <table class="PrUnTools_Table">
                    <thead>
                        <tr>
                            <th style="width:45px;">Fuel</th>
                            <th style="width:55px;">Price</th>
                            <th>Quantity</th>
                            <th style="width:75px">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="center-cell">SF</td>
                            <td class="accounting-cell" id="sf-fuel-price">{{:stl_price}}</td>
                            <td><input type="text" class="PrUnTools_Control" id="sf-fuel-input"/></td>
                            <td class="accounting-cell" id="sf-fuel-total">0</td>
                        </tr>
                        <tr>
                            <td class="center-cell">FF</td>
                            <td class="accounting-cell" id="ff-fuel-price">{{:ftl_price}}</td>
                            <td><input type="text" class="PrUnTools_Control" id="ff-fuel-input"/></td>
                            <td class="accounting-cell" id="ff-fuel-total">0</td>
                        </tr>
                        <tr class="totals">
                            <td colspan="3" class="accounting-cell"><strong>Total Cost: </strong></td>
                            <td id="fuel-total-cost" class="accounting-cell">0</td>
                        </tr>
                    </tbody>
                </table>
            `;

                // Setup events
                $('body').on('keyup', '#sf-fuel-input', calculate);
                $('body').on('keyup', '#ff-fuel-input', calculate);

                // Configure initial price
                if(stl[0].data.ask != null) {
                    content = content.replace('{{:stl_price}}', stl[0].data.ask.price.amount);
                } else {
                    content = content.replace('{{:stl_price}}', 0);
                }
                // Configure initial price
                if(ftl[0].data.ask != null) {
                    content = content.replace('{{:ftl_price}}', ftl[0].data.ask.price.amount);
                } else {
                    content = content.replace('{{:ftl_price}}', 0);
                }

                // Setup buffer default height
                let bufferH = 118;
                // If we are showing currency change it
                if(hasCurrency) { bufferH = 180; }
                // Finally show the calculator
                apex.showBuffer('Fuel Calculator', 'PrUnTools', 300,300, content);

                return null;
            }
        }
        // Something is wrong!
        apex.showAlertBuffer('Fuel Calculator', 'PrUnTools', 'Price Data Missing', 'No Market data has been loaded to memory.  Navigate to area with market prices and use the MRKT utility.', 400,200, 'red');
    }

    function select_changed() {

        // Get Selected Currency Code
        let selectedCode = Number($('#currency-select option:selected').val());
        // Get Fuel prices for that Code
        let stl = Object.values(prices).filter(obj => { return (obj.data.currency.numericCode === selectedCode & obj.data.material.ticker === 'SF') });
        let ftl = Object.values(prices).filter(obj => { return (obj.data.currency.numericCode === selectedCode & obj.data.material.ticker === 'FF') });
        // Set HTML to new price
        if(stl[0].data.ask != null) {
            $('#sf-fuel-price').html(stl[0].data.ask.price.amount);
        } else {
            $('#sf-fuel-price').html(0);
        }
        // Set HTML to new price
        if(ftl[0].data.ask != null)
        {
            $('#ff-fuel-price').html(ftl[0].data.ask.price.amount);
        } else {
            $('#ff-fuel-price').html(0);
        }
        // Calculate prices
        calculate();
    }

    function calculate() {
        // Calculate
        $('#sf-fuel-total').html(($('#sf-fuel-input').val() * $('#sf-fuel-price').html()).toFixed(2));
        $('#ff-fuel-total').html(($('#ff-fuel-input').val() * $('#ff-fuel-price').html()).toFixed(2));
        $('#fuel-total-cost').html((Number($('#sf-fuel-total').html()) + Number($('#ff-fuel-total').html())).toFixed(2));
    }
})();
