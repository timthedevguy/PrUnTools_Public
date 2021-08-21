// ==UserScript==
// @name         PrUnTools_FIO_Client
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://apex.prosperousuniverse.com/
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://cdn.jsdelivr.net/gh/timthedevguy/apexutils@latest/dist/apexutils.min.js
// @require https://cdn.datatables.net/1.10.21/js/jquery.dataTables.js
// ==/UserScript==

(function () {
    'use strict';

    let table = '';
    let styles = `
        TABLE.PrUnTools_Table.dataTable THEAD TH, TABLE.dataTable THEAD TD
        {
        \tpadding: 6px 0px 4px 5px;
        \tborder-bottom: 1px solid #111;
        \tborder-bottom: 1px solid #2b485a;
        }
        BODY.PrUnTools .dataTables_info {color:white;}
        BODY.PrUnTools table.dataTable tbody tr {background-color: transparent}
    `

    // Load ApexUtils (Inserts Menu on APEX UI)
    apex.load(styles);

    // Fired when PrUnTools Menu is ready (Occurs after 5s of page load)
    document.addEventListener('PrUnTools_Loaded', () => {

        // Add new Menu Item
        apex.addMenuItem('fio_client', 'FIO', 'FIO Client', fio_click);
    });

    function fio_click() {

        let html=`
            <table id="gdp-form" class="PrUnTools_Table">
                <tbody>
                    <tr>
                        <td width="25%" class="PrUnTools_Label yellow">Resource One</td>
                        <td width="25%" class="PrUnTools_Label_Input yellow">
                            <select class='PrUnTools_Control ticker-select' id='ticker1-select'>
                                <option value="">Select a resource...</option>
                            </select>
                        </td>
                        <td width="50%" rowspan="5">
                            <p><strong>Please Note:</strong> This data is retrieved live from a third party server, it
                             does not come from the official game client.</p>
                        </td>
                    </tr>
                    <tr>
                        <td width="25%" class="PrUnTools_Label yellow">Resource Two</td>
                        <td width="25%" class="PrUnTools_Label_Input yellow">
                            <select class='PrUnTools_Control ticker-select' id='ticker2-select'>
                                <option value="">Select a resource...</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="25%" class="PrUnTools_Label yellow">Resource Three</td>
                        <td width="25%" class="PrUnTools_Label_Input yellow">
                            <select class='PrUnTools_Control ticker-select' id='ticker3-select'>
                                <option value="">Select a resource...</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="25%" class="PrUnTools_Label yellow">Resource Four</td>
                        <td width="25%" class="PrUnTools_Label_Input yellow">
                            <select class='PrUnTools_Control ticker-select' id='ticker4-select'>
                                <option value="">Select a resource...</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="50%" colspan="2" style="text-align: right;" class="header-cell"><button class="PrUnTools_Button_Primary" id="illuminati-search"><span>search</span></button></td>
                    </tr>
                </tbody>
            </table>
            <table id="gdp-table" class="PrUnTools_Table">
                <thead>
                    <tr>
                        <th>Planet</th>
                        <th>Ticker</th>
                        <th>Form</th>
                        <th>Concent.</th>
                        <th>Extract.</th>
                        <th>Hortus</th>
                        <th>Moria</th>
                        <th>Benten</th>
                        <th>Type</th>
                        <th>Grav.</th>
                        <th>Pres.</th>
                        <th>Temp.</th>
                        <th>Tier</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;

        apex.showBuffer("Illuminati GDP", 'APEXUTILS', 950,500, html);

        $('HEAD').append($('<LINK>').attr('href', 'https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css').attr('rel', 'stylesheet'));

        $.get('http://localhost:8000/lists/resources', (response) => {
            response.forEach((item) => {
                $('.ticker-select').append($('<OPTION>').attr('value', item).html(item));
            });
        },'json');

        table = $('#gdp-table').DataTable({
            paging: false,
            searching: false,
            scrollY: "351px",
            columns: [
                {"data": "planet_id"},
                {"data": "ticker"},
                {"data": "form"},
                {"data": "concentration"},
                {"data": "extraction"},
                {"data": "dist_hortus"},
                {"data": "dist_moria"},
                {"data": "dist_benten"},
                {"data": "type"},
                {"data": "grav"},
                {"data": "pres"},
                {"data": "temp"},
                {"data": "tier"},
            ]
        });

        $('BODY').on('click', '#illuminati-search', search_click);
    }

    function search_click() {
        console.log('click');

        table.clear();

        let ticker = $('#ticker1-select option:selected').val()
        console.log(ticker);

        let data = {
            ticker1: ticker,
            ticker2: ""
        };

        $.post('http://localhost:8000/search/resource', JSON.stringify(data), (response) => {
            // $('#gdp-table').DataTable({
            //     data: response
            // });
            console.log(response);
            console.log(response[0]);
            table.rows.add(response).draw(false);
        });
    }

})();
