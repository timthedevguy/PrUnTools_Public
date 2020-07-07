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

        let prices = apex.state.comex.broker.brokers;

        if(Object.keys(prices).length > 0) {

            stl = Object.values(prices).filter(obj => { return obj.data.material.ticker === 'SF' });
            ftl = Object.values(prices).filter(obj => { return obj.data.material.ticker === 'FF'});

            if(stl.length > 0 & ftl.length > 0) {
                content = `
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

                $('body').on('keyup', '#sf-fuel-input', function(){
                    $('#sf-fuel-total').html(($('#sf-fuel-input').val() * $('#sf-fuel-price').html()).toFixed(2));
                    $('#fuel-total-cost').html((Number($('#sf-fuel-total').html()) + Number($('#ff-fuel-total').html())).toFixed(2));
                });
                $('body').on('keyup', '#ff-fuel-input', function(){
                    $('#ff-fuel-total').html(($('#ff-fuel-input').val() * $('#ff-fuel-price').html()).toFixed(2));
                    $('#fuel-total-cost').html((Number($('#sf-fuel-total').html()) + Number($('#ff-fuel-total').html())).toFixed(2));
                });

                if(stl[0].data.ask != null) {
                    content = content.replace('{{:stl_price}}', stl[0].data.ask.price.amount);
                } else {
                    content = content.replace('{{:stl_price}}', 0);
                }

                if(ftl[0].data.ask != null) {
                    content = content.replace('{{:ftl_price}}', ftl[0].data.ask.price.amount);
                } else {
                    content = content.replace('{{:ftl_price}}', 0);
                }

                apex.showBuffer('Fuel Calculator', 'PrUnTools', 300,118, content);

                return null;
            }
        }

        apex.showAlertBuffer('Fuel Calculator', 'PrUnTools', 'Price Data Missing', 'No Market data has been loaded to memory.  Navigate to area with market prices and use the MRKT utility.', 400,200, 'red');
    }
})();
