// ==UserScript==
// @name         PrUnTools_FIO_Tooltips
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds FIO powered market tooltips to Apex console
// @author       Tim Davis (binarygod, @timthedevguy)
// @match        https://apex.prosperousuniverse.com/
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.10.0/jquery.min.js
// @require https://cdn.jsdelivr.net/gh/calebjacob/tooltipster@latest/dist/js/tooltipster.bundle.min.js
// @require https://cdn.jsdelivr.net/gh/timthedevguy/apexutils@0.0.35/src/apexutils.js
// @downloadURL https://raw.githubusercontent.com/timthedevguy/PrUnTools_Public/master/FIO_Tooltips/PrUnTools_FIO_Tooltips.js
// ==/UserScript==

(function () {
    'use strict';

    let fio = [];
    let last_update = null;
    let updates_on = null;
    let loaded = false;
    let styles = '.tooltipster-base{display:flex;pointer-events:none;position:absolute!important;font-family:"Droid Sans",sans-serif;font-size:10px;color:#bbb}.tooltipster-box{flex:1 1 auto}.tooltipster-content{box-sizing:border-box;max-height:100%;max-width:100%;overflow:auto}.tooltipster-fade{opacity:0;-webkit-transition-property:opacity;-moz-transition-property:opacity;-o-transition-property:opacity;-ms-transition-property:opacity;transition-property:opacity}.tooltipster-fade.tooltipster-show{opacity:1}.tooltipster-sidetip .tooltipster-box{background:#222;border:1px solid #2b485a;box-shadow:0 0 5px rgba(63,162,222,.5);border-radius:0}.tooltipster-sidetip.tooltipster-right .tooltipster-box{margin-left:0}.tooltipster-sidetip .tooltipster-content{line-height:10px;padding:0}.tooltipster-sidetip .tooltipster-arrow{overflow:hidden;display:none;position:absolute}.tooltipster-content H1{border-bottom:1px solid #2b485a;background-color:rgba(63,162,222,.15);padding-bottom:8px;padding-top:9px;padding-left:10px;margin:0;font-weight:400;padding-right:10px;font-size:12px}'
    let tooltip_html = `<table class="PrUnTools_Table">
						<thead>
							<tr>
								<th></th>
								<th>AI1</th>
								<th>CI1</th>
								<th>IC1</th>
								<th>NC1</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Ask</td>
								<td class="accounting-cell">{Ask.AI1}</td>
								<td class="accounting-cell">{Ask.CI1}</td>
								<td class="accounting-cell">{Ask.IC1}</td>
								<td class="accounting-cell">{Ask.NC1}</td>
							</tr>
							<tr>
								<td>Bid</td>
								<td class="accounting-cell">{Buy.AI1}</td>
								<td class="accounting-cell">{Buy.CI1}</td>
								<td class="accounting-cell">{Buy.IC1}</td>
								<td class="accounting-cell">{Buy.NC1}</td>
							</tr>
							<tr>
								<td>Average</td>
								<td class="accounting-cell">{Avg.AI1}</td>
								<td class="accounting-cell">{Avg.CI1}</td>
								<td class="accounting-cell">{Avg.IC1}</td>
								<td class="accounting-cell">{Avg.NC1}</td>
							</tr>
							<tr class="top-border-cell">
								<td>Supply</td>
								<td class="accounting-cell">{Supply.AI1}</td>
								<td class="accounting-cell">{Supply.CI1}</td>
								<td class="accounting-cell">{Supply.IC1}</td>
								<td class="accounting-cell">{Supply.NC1}</td>
							</tr>
							<tr>
								<td>Demand</td>
								<td class="accounting-cell">{Demand.AI1}</td>
								<td class="accounting-cell">{Demand.CI1}</td>
								<td class="accounting-cell">{Demand.IC1}</td>
								<td class="accounting-cell">{Demand.NC1}</td>
							</tr>
						</tbody>
						<tfoot>
							<tr class="bottom-border-cell">
								<td colspan="5">Updates on {UPDATE}</td>
							</tr>
						</tfoot>
					</table>`;

    // Initialize Apex and add Styles
    apex.load(styles);

    document.addEventListener('PrUnTools_Loaded', () => {

        console.log("APEX LOADED");
        // Add new Menu Item
        apex.addMenuItem('fio-tooltips', 'FIO-TP', 'FIO Tooltips (Click to open Help)', open_help);
        apex.setMenuItemColor('fio-tooltips', 'green');

        update_tooltips();

    });

    document.addEventListener('PrUnTools_ScreenChange_Started', () => {
        apex.setMenuItemColor('fio-tooltips', 'red');
    });

    document.addEventListener('PrUnTools_ScreenChange_Complete', () => {
        update_tooltips();
        apex.setMenuItemColor('fio-tooltips', 'green');
    });

    document.addEventListener('PrUnTools_TileUpdate', () => {
        update_tooltips();
    });

    document.addEventListener('PrUnTools_BufferCreated', () => {
        update_tooltips();
    });


    function open_help() {
        let help_html = `<div style="padding-left:10px;padding-right:10px;">
        <h1>FIO Tooltips Help</h1>
        <p><strong>How to Use</strong><br/>FIO Tooltips are on by default if the TamperMonkey script is enabled.  The system will check FIO for updated prices every 5 minutes and will update all tooltips accordingly.</p>
        <p>The next update time is located at the bottom of each tooltip</p>
        <p><strong>Supported Areas</strong><br/>Currently only Inventory areas are supported.  This may change at a later date to include building recipies, but for now only Inventories.  This includes: base inventory, ship inventory, fuel inventory and warehouse inventory.</p>
        <p><strong>How to disable?</strong><br/>Disabling FIO Tooltips is done via TamperMonkey.  Click the TamperMonkey icon in browser toolbar and click the toggle switch beside 'PrUnTools_FIO_Tooltips'  Reload Apex console and tooltips are disabled.</p>
        <h2>Special Thanks</h2>
        <p>Special thanks to the authors and contributors of the FIO project.  This addon wouldn't be possible without their amazing work!!!</p>
        </div>`;
        apex.showBuffer('FIO Tooltips Help', 'PrUnTools', 400, 373, help_html);
    }

    function find_tickers() {
        // Find all elements that meet our criteria
        //ARCHIVE CODE: let elements = $.merge($('.V8WqkG0dijeM9m2xgyXcj[style*="height: 48px"] span._1BIGnSPbvzDVBNLlwLm3GK'), $('.V8WqkG0dijeM9m2xgyXcj[style*="height: 35px"] span._1BIGnSPbvzDVBNLlwLm3GK'));
        //ARCHIVE CODE: elements = $.merge(elements, $('.V8WqkG0dijeM9m2xgyXcj[style*="height: 33px"] span._1BIGnSPbvzDVBNLlwLm3GK'));
        let elements = $('.V8WqkG0dijeM9m2xgyXcj[style*="height: 48px"] span._1BIGnSPbvzDVBNLlwLm3GK');

        // Convert to array and grab JUST the innerHTML
        let all_tickers = Array.from(elements).map(function(a) {return a.innerHTML;});

        // Remove duplicates
        let tickers=[];
        $.each(all_tickers, function(i, el){
            if($.inArray(el, tickers) === -1) tickers.push(el);
        });

        return {
            tickers: tickers,
            elements: elements
        };
    }

    function create_tooltips(data) {
        // Create any missing tooltip content placeholder
        data.tickers.forEach(function(item) {
            if($(`#tooltip_${item}`).length == 0) {
                // Create our element
                $('BODY').append($('<DIV />').attr('id',`tooltip_${item}`).addClass('PrUn_tooltip_content'));
            }
        });
        //Loop through elements and configure to use tooltips
        data.elements.each(function(i,item) {
            if(!$(item).parent().parent().hasClass('PrUn_tooltip')) {
                let ticker = item.innerHTML;
                let title = $(item).parent().parent().attr('title');
                $(`#tooltip_${ticker}`).attr('data-title', title);
                $(item).parent().parent().attr('data-tooltip-content',`#tooltip_${ticker}`);
                $(item).parent().parent().addClass('PrUn_tooltip');
            }
        });
    }

    function populate_tooltips(data) {

        // Check if last_update is null or if now is past the updates on
        if(!last_update || (new Date()) > updates_on) {
            // Get market data from FIO
            $.ajax({
                type: "GET",
                url: "https://rest.fnar.net/exchange/all",
                success: function(output, status, xhr) {
                    // Grab data
                    fio = output;
                    // Set last update to now
                    last_update = new Date();
                    // Set updates_on to 5 minutes from now
                    updates_on = new Date(last_update.getTime() + 5*60000);
                    // Set our 5 min timer
                    setTimeout(update_tooltips, 301000);

                    // Parse the data
                    parse_data(data, true);
                },
                error: function(output) {
                    console.log("Error in API call");
                }
            });
        } else {
            // No update needed go ahead and parse the data
            parse_data(data);
        }

    }

    function parse_data(data, force_update=false) {

        let html = ''
        let isDirty = false;

        // Go through all our tickers
        data.tickers.forEach(function(item) {
            // If tooltip content isn't populate or force_update is set to true
            if(!$(`#tooltip_${item}`).html() || force_update) {
                // Begin building the HTML
                html = tooltip_html.replace('{UPDATE}', updates_on.toLocaleString());
                // Find Material in FIO data
                let market_data = fio.filter(obj => {return obj.MaterialTicker === item});
                // Filter should return all 4 markets worth of data, populate our tooltip
                market_data.forEach(function(ticker_data) {
                    html = html.replace(`{Ask.${ticker_data.ExchangeCode}}`, ticker_data.Ask);
                    html = html.replace(`{Buy.${ticker_data.ExchangeCode}}`, ticker_data.Bid);
                    html = html.replace(`{Avg.${ticker_data.ExchangeCode}}`, ticker_data.PriceAverage);
                    html = html.replace(`{Supply.${ticker_data.ExchangeCode}}`, ticker_data.Supply);
                    html = html.replace(`{Demand.${ticker_data.ExchangeCode}}`, ticker_data.Demand);
                });
                // Replace any nulls with '--'
                html = html.replace('null','--');
                // Add tooltip to box
                $(`#tooltip_${item}`).html(`<h1>${$(`#tooltip_${item}`).attr('data-title')}</h1>${html}`);
                isDirty = true;
            }
        });

        if(isDirty) {
            // Destroy tooltips
            try{
                $('.PrUn_tooltip').tooltipster('destroy');
            } catch {
                console.log("Tooltips not initialized yet....");
            }
        }

        // Activate the tooltips
        $('.PrUn_tooltip').tooltipster({
            position: 'right',
            contentAsHTML: true,
            contentCloning: true,
            arrow: false,
        });
    }

    function update_tooltips() {
        let data = find_tickers();
        create_tooltips(data);
        populate_tooltips(data);
    }

})();