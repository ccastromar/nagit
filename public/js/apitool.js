/**
 * Object app. Use it in any html page and invoke de apitool Library
 */
let app = (function () {

    "use strict";

    /**
     * HTML Select tag
     */
    let comboSel = document.getElementById("comboapi");

    /**
     * Information div for an api function
     */
    let info = document.getElementById("info");

    /**
     * Help div
     */
    let help = document.getElementById("help");

    /**
     * Language
     */
    let language = 'en';

    /**
     * Div for the scrollTop
     */
    let divTop = document.querySelector('#scrollTop');

    /**
     * Show div scroll to top when at certain scroll height
     */
    function showDivTop() {
        if (window.scrollY >= 300) {
            divTop.classList.add('visible');
        } else {
            divTop.classList.remove('visible');
        }
    }

    /**
     * Scrolls to top
     */
    function scrollTop() {
        if (window.scrollY != 0) {
            setTimeout(function () {
                window.scrollTo(0, window.scrollY - 30);
                scrollTop();
            }, 5);
        }
    }
    window.addEventListener('scroll', showDivTop);
    divTop.addEventListener('click', scrollTop);


    /**
     * Activates (enables) the corresponding input html fields for an api function
     * @method _activateInput
     * @private
     * @param {string[]} input - An array of strings corresponding to input elements id
     */
    function _activateInput(input) {
        let allInputs = document.getElementsByTagName("INPUT");

        for (let i = 0; i < allInputs.length; i++) {
            let inp = allInputs[i];
            if (inp.type === 'text') {
                if (inp.id === 'nishost' || inp.id === 'nisport')
                    continue;

                inp.style.backgroundColor = "#dddddd";
                inp.disabled = true;
            }
        }

        for (let i = 0; i < input.length; i++) {
            let e = document.getElementById(input[i]);
            e.disabled = false;
            e.style.backgroundColor = "#d0f0d0";
        }
    }

    /**
     * Sets html information div with a text
     * @method _showInfo
     * @private
     * @param {string} txt - The description text
     */
    function _showInfo(txt) {
        info.innerHTML = '<i class="fa fa-info-circle"></i> ' + txt;
    }

    /**
     * When user selects an option, gets all data from comboList. Then activates the corresponding input data and shows a description
     * @method selchange
     */
    function selchange(lang) {
        let i = comboSel.value;
        if (i == -1) return;

        let obj = apitool.comboList[i];
        let inputText = obj.input;
        _activateInput(inputText);
        _showInfo(obj.info[lang]);
    }

    /**
     * When user clicks button Send, gets all data from comboList. Then calls the corresponding api function 
     * @method selcall
     */
    function selcall() {
        let i = comboSel.value;
        if (i == -1) return;

        let obj = apitool.comboList[i];
        let fn = obj.fn;
        apitool[fn]();
        console.log("fn " + fn);
    }

    /**
     * Dismiss help message
     */
    function closeHelp() {
        help.innerHTML = "";
    }

    return {
        selchange: selchange,
        selcall: selcall,
        closeHelp: closeHelp
    }

})();

/*!
 * API Tool Library for NEM API. It validates the input data, sends GET or POST requests and pretty prints the response.
 * Copyright (c) 2018 Carlos Castro Martos
 * Released under the MIT license
 * Date: 2018-11-16
 */
let apitool = (function () {

    "use strict";

    /** API Tool version */
    let version = '1.1.0';

     /**
     * Language
     */
    let language = 'en';

    const nisCodes = ['Unknown status','NIS is stopped','NIS is starting','NIS is running',
      'NIS is booting the local node (implies NIS is running)','The local node is booted (implies NIS is running)',
      'The local node is synchronized (implies NIS is running and the local node is booted)',
        'NIS local node does not see any remote NIS node (implies running and booted)',
        'NIS is currently loading the block chain from the database. In this state NIS cannot serve any requests'];

    /**
     * Array of translations. Only labels for internal functions
     */
    let multiLabel = {"en":{"ERR_NO_RESP":"No response from server","ERR_JSON":"There was en error parsing the response","HIST_DATE":"Date", "HIST_FUNC":"Function", "HIST_STAT":"Status", "HIST_IN":"Input", "HIST_OUT":"Output"},
                    "es":{"ERR_NO_RESP":"No hubo respuesta del servidor","ERR_JSON":"Hubo un error parseando la respuesta","HIST_DATE":"Fecha", "HIST_FUNC":"Función", "HIST_STAT":"Estado", "HIST_IN":"Entrada", "HIST_OUT":"Salida"}};
     
    
    /**
     * Returns a translated label for any especific key
     * @param {string} key - Key to translate
     * @returns {string}  - The translation
     */
    function lbl(key) {
       return multiLabel[language][key];    
    }

    /**
     * Array of objects for every api function available with function name, input data needed and information in two languages
     */
    let comboList = [{ //0
            "fn": "currentBlock",
            "input": [],
            "info": {
                'en': 'Gets current block height',
                'es': 'Obtiene el número de bloque actual'
            }
        },
        { //1
            "fn": "getBlock",
            "input": ['blocknumber'],
            "info": {
                'en': 'Gets block data at height',
                'es': 'Obtiene los datos del bloque para un número de bloque dado'
            }
        },
        { //2
            "fn": "getLastNamespaces",
            "input": ['pagesize'],
            "info": {
                'en': 'Gets last namespaces created in nem. You must enter a pagesize from 25 to 100 elements',
                'es': 'Obtiene los últimos namespaces creados. Debe informar un total de 25 a 100 elementos por página'
            }
        },
        { //3
            "fn": "generateAddress",
            "input": [],
            "info": {
                'en': 'Generates wallet data (address, public & private keys). This will be saved for later testing.',
                'es': 'Genera los datos de una wallet (address, clave pública y privada). Esto se guardará para hacer pruebas'
            }
        },
        { //4
            "fn": "getAccount",
            "input": ['address'],
            "info": {
                'en': 'Gets account data for a NEM address',
                'es': 'Obtiene los datos de una cuenta para una NEM address concreta'
            }
        },
        { //5
            "fn": "getNamespacesFromAddress",
            "input": ['address'],
            "info": {
                'en': 'Gets namespaces belonging to a NEM address',
                'es': 'Obtiene los namespaces que pertenecen a una NEM address concreta'
            }
        },
        { //6
            "fn": "getMosaicsFromAddress",
            "input": ['address'],
            "info": {
                'en': 'Gets mosaics belonging to a NEM address',
                'es': 'Obtiene los mosaicos que pertenecen a una NEM address concreta'
            }
        },
        { //7
            "fn": "getMosaicsFromNamespace",
            "input": ['namespace'],
            "info": {
                'en': 'Gets mosaics belonging to a namespace',
                'es': 'Obtiene los mosaicos que pertenecen a un namespace dado'
            }
        },
        { //8
            "fn": "getStatusServer",
            "input": [],
            "info": {
                'en': 'Gets NIS Server status',
                'es': 'Obtiene el estado del servidor NIS'
            }
        },
        { //9
            "fn": "getIncomingTransactionsFromAddress",
            "input": ['address'],
            "info": {
                'en': 'Gets last 25 incoming transactions with NEM address as recipient',
                'es': 'Obtiene las últimas 25 transacciones que tienen una NEM address como destinatario'
            }
        },
        { //10
            "fn": "getOutgoingTransactionsFromAddress",
            "input": ['address'],
            "info": {
                'en': 'Gets last 25 outgoing transactions with NEM address as sender',
                'es': 'Obtiene las últimas 25 transacciones que ha enviado una NEM address'
            }
        },
        { //11
            "fn": "getHarvestingInfoFromAddress",
            "input": ['address'],
            "info": {
                'en': 'Gets harvesting information for the NEM address',
                'es': 'Obtiene información de recolección (harvesting) de una NEM address dada'
            }
        },
        { //12
            "fn": "getTenBlocksAfterHeight",
            "input": ['blocknumber'],
            "info": {
                'en': 'Gets 10 block data after a block height',
                'es': 'Obtiene los datos de 10 bloques siguientes a un número de bloque dado'
            }
        },
        { //13
            "fn": "getNamespace",
            "input": ['namespace'],
            "info": {
                'en': 'Gets namespace definition',
                'es': 'Obtiene la definición de un namespace'
            }
        },
        { //14
            "fn": "prepareTransaction",
            "input": ['amount', 'recipient', 'publickey', 'privatekey'],
            "info": {
                'en': 'Only for testing with your local node. Never expose or share your private key with untrusted websites or unknown NIS Nodes',
                'es': 'Sólo para pruebas con su nodo local. Nunca muestre o comparta su clave privada con sitios web que no confía o nodos NIS desconocidos'
            }
        },
        { //15
            "fn": "generateQR",
            "input": ['memo', 'amount', 'address'],
            "info": {
                'en': 'Generates a QR code for scanning given a NEM address, an amount and a memo',
                'es': 'Genera un código QR para escanear dada una NEM address, una cantidad y un mensaje'
            }
        },
        { //16
            "fn": "getNodeInformation",
            "input": [],
            "info": {
                'en': 'Gets basic information about the selected NIS Node',
                'es': 'Obtiene información básica sobre el servidor NIS seleccionado'
            }
        },
        { //17
            "fn": "getExtendedInfo",
            "input": [],
            "info": {
                'en': 'Gets extended information about the selected NIS Node',
                'es': 'Obtiene información ampliada sobre el servidor NIS seleccionado'
            }
        },
        { //18
            "fn": "getPeerList",
            "input": [],
            "info": {
                'en': 'Gets a list of all known nodes in the neighborhood',
                'es': 'Obtiene una lista de todos los nodos conocidos cercanos'
            }
        },
        { //19
            "fn": "getNodeExperiences",
            "input": [],
            "info": {
                'en': 'Gets a list of node experiences from another node',
                'es': 'Obtiene una lista de experiencias de nodos de otro nodo'
            }
        },
        { //20
            "fn": "getHeartbeat",
            "input": [],
            "info": {
                'en': 'Gets information if a node is up and responsive',
                'es': 'Obtiene información de si el nodo está arrancado y respondiendo'
            }
        },
        { //21
            "fn": "getAccountFromPK",
            "input": ['publickey'],
            "info": {
                'en': 'Gets account information from a public key',
                'es': 'Obtiene información de una cuenta a partir de la clave pública'
            }
        },
        { //22
            "fn": "lockAccount",
            "input": ['privatekey'],
            "info": {
                'en': 'Only for local testing. Never exposes your private key. Unlocks an account to enable harvesting',
                'es': 'Sólo para pruebas locales. Nunca proporcione su clave privada. Desbloquea una cuenta para activar la recolección (harvesting)'
            }
        },
        { //23
            "fn": "unlockAccount",
            "input": ['privatekey'],
            "info": {
                'en': 'Only for local testing. Never exposes your private key. Locks an account to disable harvesting',
                'es': 'Sólo para pruebas locales. Nunca proporcione su clave privada. Bloquea una cuenta para desactviar la recolección (harvesting)'
            }
        },
        { //24
            "fn": "getNetworkTimeFromNode",
            "input": [],
            "info": {
                'en': 'Get network time from a NIS Node in milliseconds',
                'es': 'Obtiene el tiempo de red a partir de un Nodo NIS en milisegundos'
            }
        },
        { //25
            "fn": "getMosaicSupply",
            "input": ['namespace','mosaicname'],
            "info": {
                'en': 'Get mosaic supply from mosaicId (namespace + mosaic name)',
                'es': 'Obtiene el número de mosaicos disponibles a partir de un mosaicId (namespace + nombre mosaico)'
            }
        }

    ];

    /** Nemesis block date */
    const NEM_TS_INI = Date.UTC(2015, 2, 29, 0, 6, 25, 0);
    
    /** Default NIS Node url */
    let url = "https://shibuya.supernode.me:7891";
    
    let network = document.getElementById("defaultnet");
    if (network.value === 'M')
        url = "https://shibuya.supernode.me:7891";
    else
        url = "https://nis-testnet.44uk.net:7891";

    let historyRequests = [];
    let output = {};
    let spinner = document.getElementById("spin0");
    let historyDiv = document.getElementById("historyDiv");
    let histDetail = document.getElementById("histDetail");
    let logs = document.getElementById("logs0");
    let comboSel = document.getElementById("comboapi");
    //input data
    let address = document.getElementById("address");
    let blocknumber = document.getElementById("blocknumber");
    let namespace = document.getElementById("namespace");
    let mosaicname = document.getElementById("mosaicname");
    let amount = document.getElementById("amount");
    let publickey = document.getElementById("publickey");
    let privatekey = document.getElementById("privatekey");
    let recipient = document.getElementById("recipient");
    let pagesize = document.getElementById("pagesize");
    //nis node
    let nishost = document.getElementById("nishost");
    let nisport = document.getElementById("nisport");
    let defaultNodeDiv = document.getElementById("defaultNodeDiv");
    let customNodeDiv = document.getElementById("customNodeDiv");
    let mainHist = document.getElementById('collapseHistory');
    let mainNode = document.getElementById('collapseNode');
    let historyToggle = document.getElementById('historyToggle');
    let nodeToggle = document.getElementById('nodeToggle');

    mainHist.classList.add('collapsed');
    mainNode.classList.add('collapsed');

    /**
     * Scrolls to top when user clicks History
     */
    function _mainHistToggle() {
        window.scrollTo(0, 0);
        mainHist.classList.toggle('collapsed');
    }
    /**
    * Scroll to top when user clicks Node 
    */
    function _mainNodeToggle() {
        window.scrollTo(0, 0);
        mainNode.classList.toggle('collapsed');
    }

    /**
     * Add event listener to history and node buttons
     */
    historyToggle.addEventListener('click', _mainHistToggle);
    nodeToggle.addEventListener('click', _mainNodeToggle);

    /**
     * Inits language variable
     * @param {string} lang - Language 'en' for english, 'es' for spanish 
     */
    function init(lang) {
        language=lang;
    }

    /**
     * Sets NIS Node Host and port
     * @method setNISNode
     */
    function setNISNode() {
        let portNum = 7890;
        try {
           portNum = parseInt(nisport.value);
        } catch (e) {
            //port is not a valid int            
        }
        if (nishost.value=="") {
            nishost.focus();
            return false;
        }
        if (nisport.value=="") {
            nisport.focus();
            return false;
        }
        if (portNum>65535 || portNum<=0) {
            nisport.value=7890;
            nisport.focus();
            return false;
        }
        url = 'http://' + nishost.value + ':' + nisport.value;
        customNodeDiv.classList.add("fa","fa-check-circle");
        defaultNodeDiv.classList.remove("fa","fa-check-circle");
       // console.log('setNISNode: ' + url);
    }

    /**
     * Returns the number of seconds elapsed since the creation of nemesis block 
     * @method _getTimestamp
     * @private
     * @return {number} the number of seconds
     */
    function _getTimestamp() {
        return Math.floor((Date.now() / 1000) - (NEM_TS_INI / 1000));
    }

    /**
     * Adds a class to the spinner to show that a request is waiting for a response 
     * @method _showLoader
     * @private
     */
    function _showLoader() {
        spinner.classList.add('fa', 'fa-refresh', 'fa-spin');
        spinner.style.marginRight = "8px";
    }

    /**
     * Removes a class from the spinner to show that a request has ended 
     * @method _hideLoader
     * @private
     */
    function _hideLoader() {
        spinner.classList.remove('fa', 'fa-refresh', 'fa-spin');
        spinner.style.marginRight = "0px";
    }

    /**
     * Sends a GET request to the NIS server. A callback function is optional
     * @method _doGet
     * @private
     * @param {string} p - The path of the URI
     * @param {callback} callback - The callback that user can use to handle the response
     */
    function _doGet(p, callback) {
        _showLoader();
        let xhttp = new XMLHttpRequest();
        let data = {};
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                _hideLoader();
                let res = JSON.parse(xhttp.responseText);
                output = res;
                if (callback)
                    callback();
              
                //save history
                _insertHistory(p, data, res, "GET", url, this.status, network.value);
                _render(res);
            } else if (this.readyState == 4 && this.status != 200) {
                _hideLoader();
                               
                let res = {};
                let errNoResp = {"Error":lbl("ERR_NO_RESP")};
                let errJson = {"Error":lbl("ERR_JSON")};               
                if (this.responseText=="") {
                   res=errNoResp;
                } else {                
                    try {                        
                        res = JSON.parse(this.responseText);
                    } catch (e) { 
                        res = errJson;                      
                    }
                }
                _insertHistory(p, data, res, "GET", url, this.status, network.value);
                _render(res);
            }
        }
        xhttp.open("GET", url + p, true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send();
    }

    /**
     * Sends a POST request to the NIS server. A callback function is optional
     * @method _doPost
     * @private
     * @param {string} p - The path of the URI
     * @param {Object} data - A JSON object with post data
     * @param {callback} callback - The callback that handles the response
     */
    function _doPost(p, data, callback) {
        _showLoader();
        const errNoResp = {"Error":lbl("ERR_NO_RESP")};
        const errJson = {"Error":lbl("ERR_JSON")};
        let xhttp = new XMLHttpRequest();
        let dataStr = JSON.stringify(data);
        xhttp.onreadystatechange = function () {
            let res = {};
            if (this.readyState == 4 && this.status == 200) {
                _hideLoader();
                console.log(this.responseText);
                if (this.responseText=="")
                    res = errJson;
                else {  
                 res = JSON.parse(this.responseText);
                }
                output = res;
                if (callback)
                    callback();
             
                //save history
                _insertHistory(p, data, res, "POST", url, this.status, network.value);
                _render(res);
            } else if (this.readyState == 4 && this.status != 200) {
                _hideLoader();
                
                if (this.responseText=="") {
                   res=errNoResp;
                } else {                
                    try { 
                        res = JSON.parse(this.responseText);
                    } catch (e) { 
                        res = errJson;                      
                    }
                }
                
                //save history
                _insertHistory(p, data, res, "POST", url, this.status, network.value);
                _render(res);
            }
        }
        xhttp.open("POST", url + p, true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send(dataStr);
    }
    /**
     * Insert request in Histoy Array and renders the table
     * @method _insertHistory
     * @private
     * @param {string} p - The path of the URI
     * @param {Object} input - A JSON object with input data
     * @param {Object} output - A JSON object with output data
     * @param {string} verb - GET or POST
     * @param {string} url - NIS Node url
     * @param {string} status - HTTP Status code
     * @param {string} network - NEM Network (testnet or mainnet)
     * @param {callback} callback - The callback that handles the response
     */
    function _insertHistory(uri, input, output, verb, url, status, network) {
        //save history in array
        let id = historyRequests.length;
        let fnId = comboSel.value;
        let fnName = comboList[fnId].fn;
        let descNet = (network === 'M') ? "Mainnet" : "Testnet";
        let r = {
            "id": id,
            "created": new Date(),
            "fnId": fnId,
            "fnName": fnName,
            "verb": verb,
            "url": url,
            "uri": uri,
            "input": input,
            "output": output,
            "status": status,
            "network": descNet
        };
        let fn = comboList[r.fnId].fn;
        historyRequests.push(r);
        //renderhistory
        _renderHistory();

        //debug
       // console.dir(historyRequests);
    }

     /**
     * Renders history table 
     * @method _renderHistory
     * @private
     */
    function _renderHistory() {
        let str = '<table class="table-striped table-hover table-fixed" style="height: 150px">';
        str += '<thead><th style="width:100px !important">'+lbl("HIST_DATE")+'</th><th style="width:250px !important">'+
        lbl("HIST_FUNC")+'</th><th>'+lbl("HIST_STAT")+'</th><th> </th></tr></thead><tbody>';
        for (let i = historyRequests.length; i-- > 0;) {
            let v = historyRequests[i];
            str += '<tr><td style="width:100px !important">' + v.created.toLocaleDateString() + '</td>';
            str += '<td style="width:250px !important"><a href="javascript:apitool.loadHistRequest(' + i + ')">' + v.fnName + '</a></td>';
            if (v.status === 200) {
                str += '<td><span class="text-success">' + v.status + '</span></td>';
            } else {
                str += '<td><span class="text-danger">' + v.status + '</span></td>';
            }
            str += '<td><i class="fa fa-trash" style="cursor:pointer" onclick="apitool.deleteHist(' + i + ',this)"></i></td>';
            str += '</tr>';
        }
        str += "</tbody></table>";
        historyDiv.innerHTML = str;
    }

    /**
     * Loads a request detail in the div
     * @method loadHistRequest
     * @param {number} i - The position in the array
     */
    function loadHistRequest(i) {
        let hist = historyRequests[i];
        let str = "<strong>" + hist.verb + ":</strong> " + hist.uri + "<br>";
        str += "<strong>"+lbl("HIST_DATE")+":</strong> " + hist.created.toLocaleString() + "<br>";
        str += "<strong>"+lbl("HIST_FUNC")+":</strong> " + hist.fnName + "<br>";
        str += "<strong>"+lbl("HIST_STAT")+":</strong> " + hist.status + "<br>";
        str += "<strong>"+lbl("HIST_IN")+":</strong> " + JSON.stringify(hist.input) + "<br>";
        str += "<strong>"+lbl("HIST_OUT")+":</strong> " + JSON.stringify(hist.output);

        histDetail.innerHTML = str;
    }

    /**
     * Deletes a request from Array and renders history table 
     * @method deleteHist
     * @param {number} i - The position in the array
     */
    function deleteHist(i) {
        historyRequests.splice(i, 1);
        _renderHistory();
        histDetail.innerHTML = "";
        //debug
     //   console.dir(historyRequests);
    }

    /**
     * Renders the response in output data div
     * @method _render
     * @private
     * @param {Object} res - A JSON object representing the response
     * @param {Object} r - A history request object 
     */
    function _render(res, r) {
        logs.style.visibility = "visible";
        logs.innerHTML = prettyJSON.htmlTable(res);
        document.querySelector('#outputId').scrollIntoView({
            behavior: 'smooth'
        });

    }

    /**
     * Sets the default NEM Blockchain network. T for Testnet and M for Mainnet
     * @method setNetwork
     */
    function setNetwork() {
        network = document.getElementById("defaultnet");

        if (network.value === 'M')
            url = "https://shibuya.supernode.me:7891";
        else
            url = "https://nis-testnet.44uk.net:7891";

        nishost.value="";
        nisport.value="";
        defaultNodeDiv.classList.add("fa","fa-check-circle");
        customNodeDiv.classList.remove("fa","fa-check-circle");
    }

    /**
     * Clears input data fields common data
     * @method delInputCommon
     */
    function delInputCommon() {
        blocknumber.value = "";
        namespace.value = "";
        memo.value = "";
        amount.value = "";
        recipient.value = "";
    }
    /**
     * Clears input data fields wallet data
     * @method delInputWallet
     */
    function delInputWallet() {
        address.value = "";
        publickey.value = "";
        privatekey.value = "";
    }
    /**
     * Clears the output div and input data fields
     * @method delOutpudata
     */
    function delOutputdata() {
        logs.innerHTML = "";
    }

    /**
     * Gets the current block height
     * @method currentBlock
     */
    function currentBlock() {
        _doGet('/chain/height');
    }

    /**
     * Gets the block data at height
     * @method getBlock
     */
    function getBlock() {
        let blq = blocknumber.value;
        if (blq == "" || isNaN(blq)) {
            blocknumber.focus();
            blocknumber.value = "";

            return false;
        }
        let blqnum = parseInt(blq);
        let data = {
            "height": blqnum
        };
        _doPost('/block/at/public', data);
    }

    /**
     * Gets the last 25 (first page) namespaces created in NEM
     * @method getLastNamespaces
     */
    function getLastNamespaces() {
        let ps = 25;
        if (pagesize.value=="") {
            pagesize.focus();
            return false;
        }    
        try {
            ps = parseInt(pagesize.value);
        } catch (e) {}

        if (pagesize.value!="")
        _doGet('/namespace/root/page?pageSize='+ps);
    }

    /**
     * Generates an account (a NEM address, a public key and a private key)
     * @method generateAddress
     */
    function generateAddress() {
        _doGet('/account/generate', _updateWallet);
    }

    /**
     * Updates input data fields (NEM address, public and private keys)
     * @method _updateWallet
     * @private
     */
    function _updateWallet() {
        if (!_isEmpty(output)) {
            address.value = output.address;
            publickey.value = output.publicKey;
            privatekey.value = output.privateKey;
        }
    }

    /**
     * Gets account data for a NEM address
     * @method getAccount
     */
    function getAccount() {
        let adr = address.value;
        let sanitizedAdr = adr.toUpperCase().replace(/-|\s/g, "");
        if (adr == "") {
            address.focus();
            return false;
        }
        _doGet('/account/get?address=' + sanitizedAdr);
    }

 /**
     * Gets account data for a NEM address using a public key
     * @method getAccountFromPK
     */
    function getAccountFromPK() {
        let pk = publickey.value;
        if (pk == "") {
            pk.focus();
            return false;
        }
        _doGet('/account/get/from-public-key?publicKey=' + pk);
    }

    /**
     * Gets namespaces belonging to a NEM address
     * @method getNamespacesFromAddress
     */
    function getNamespacesFromAddress() {
        let adr = address.value;
        let sanitizedAdr = adr.toUpperCase().replace(/-|\s/g, "");
        if (adr == "") {
            address.focus();
            return false;
        }
        _doGet('/account/namespace/page?address=' + sanitizedAdr);
    }

    /**
     * Gets mosaic data belonging to a NEM address
     * @method getMosaicsFromAddress
     */
    function getMosaicsFromAddress() {
        let adr = address.value;
        let sanitizedAdr = adr.toUpperCase().replace(/-|\s/g, "");
        if (adr == "") {
            address.focus();
            return false;
        }
        _doGet('/account/mosaic/definition/page?address=' + sanitizedAdr);
    }

    /**
     * Gets mosaics definitions belonging to a namespace
     * @method getMosaicsFromNamespace
     */
    function getMosaicsFromNamespace() {
        let spc = namespace.value;
        if (spc == "") {
            namespace.focus();
            return false;
        }
        _doGet('/namespace/mosaic/definition/page?namespace=' + spc);
    }

    /**
     * Gets status of NIS Server
     * @method getStatusServer
     */
    function getStatusServer() {
        _doGet('/status');
    }

    /**
     * Get last 25 incoming transactions with NEM address as recipient
     * @method getIncomingTransactionsFromAddress
     */
    function getIncomingTransactionsFromAddress() {
        let adr = address.value;
        let sanitizedAdr = adr.toUpperCase().replace(/-|\s/g, "");
        if (adr == "") {
            address.focus();
            return false;
        }
        _doGet('/account/transfers/incoming?address=' + sanitizedAdr);
    }

    /**
     * Get last 25 outgoing transactions with NEM address as sender
     * @method getOutgoingTransactionsFromAddress
     */
    function getOutgoingTransactionsFromAddress() {
        let adr = address.value;
        let sanitizedAdr = adr.toUpperCase().replace(/-|\s/g, "");
        if (adr == "") {
            address.focus();
            return false;
        }
        _doGet('/account/transfers/outgoing?address=' + sanitizedAdr);
    }

    /**
     * Get harvesting information for a NEM address
     * @method getHarvestingInfoFromAddress
     */
    function getHarvestingInfoFromAddress() {
        let adr = address.value;
        let sanitizedAdr = adr.toUpperCase().replace(/-|\s/g, "");
        if (adr == "") {
            address.focus();
            return false;
        }
        _doGet('/account/harvests?address=' + sanitizedAdr);
    }

    /**
     * Get 10 block data after a block height
     * @method getTenBlocksAfterHeight
     */
    function getTenBlocksAfterHeight() {
        let blq = blocknumber.value;
        if (blq == "" || isNaN(blq)) {
            blocknumber.focus();
            blocknumber.value = "";
            return false;
        }
        let blqnum = parseInt(blq);
        let data = {
            "height": blqnum
        };
        _doPost('/local/chain/blocks-after', data);
    }

    /**
     * Get namespace definition
     * @method getNamespace
     */
    function getNamespace() {
        let spc = namespace.value;
        if (spc == "") {
            namespace.focus();
            return false;
        }
        _doGet('/namespace?namespace=' + spc);
    }

    /**
     * Get Blockchain version
     * @method _getVersion
     * @private
     * @param {string} val     
     * @returns {number} a version
     * 
     */
    function _getVersion(val) {
        if (network.value === 'M') {
            return 0x68000000 | val;
        } else if (network.value === 'T') {
            return 0x98000000 | val;
        }
        return 0x60000000 | val;
    }

    /**
     * Validates if an object is empty
     * @method isEmpty
     * @param {Object} an object
     * @return {boolean} true if object is empty
     */
    function _isEmpty(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    /**
     * Prepares a transfer transaction and sends it to NIS Server
     * @method prepareTransaction
     */
    function prepareTransaction() {
        let amountInt=0;
        if (amount.value == "") {
            amount.focus();
            return false;
        }
        amountInt = parseInt(amount.value);
        
        if (recipient == "") {
            recipient.focus();
            return false;
        }
        let recipientAdr = recipient.value;

        let pubkey = publickey.value;
        if (pubkey == "") {
            publickey.focus();
            return false;
        }
        let prvkey = privatekey.value;
        if (prvkey == "") {
            privatekey.focus();
            return false;
        }

        let ts = _getTimestamp();
        let due = network.value === 'T' ? 60 : 24 * 60;
        let deadline = ts + due * 60;
        const payload = "4e454d20415049204578616d706c657320666f72206c6561726e696e67"; //NEM API Examples for learning 
        const fee = 500000;
        const typeTx = 257;
        let data = {
            "transaction": {
                "timeStamp": _getTimestamp(),
                "amount": amountInt,
                "fee": fee,
                "recipient": recipientAdr,
                "type": typeTx,
                "deadline": deadline,
                "message": {
                    "payload": payload,
                    "type": 1
                },
                "version": _getVersion(1),
                "signer": pubkey,
                "mosaics": []
            },
            "privateKey": prvkey
        };

        _doPost('/transaction/prepare-announce', data);
    }

    /**
     * Generates a QR Code given a NEM address, amount and message using klua lib
     * @method generateQR
     */
    function generateQR() {
        if (address.value=="") {
            address.focus();
            return false;
        }
        if (amount.value=="") {
            amount.focus();
            return false;
        }
        if (memo.value=="") {
            memo.focus();
            return false;
        }
        let data = {
            "v": 2,
            "type": 2,
            "data": {
                "addr": address.value,
                "amount": amount.value,
                "msg": memo.value,
                "name": "QR Code"
            }
        };
        let txt = JSON.stringify(data);
        let el = kjua({
            text: txt
        });

        let q = logs;
        if (q.hasChildNodes()) {
            q.removeChild(q.childNodes[0]);
            q.appendChild(el);
        } else {
            q.appendChild(el);
        }
        document.querySelector('#outputId').scrollIntoView({
            behavior: 'smooth'
        });
    }

    /**
     * Gets NIS Node information
     * @method getNodeInformation
     */
    function getNodeInformation() {
        _doGet('/node/info');
    }

    /**
     * Gets NIS Node extended information
     * @method getExtendedInfo
     */
    function getExtendedInfo() {
        _doGet('/node/extended-info');
    }    
    
    /**
     * Gets NIS peer list
     * @method getPeerList
     */
    function getPeerList() {
        _doGet('/node/peer-list/all');
    }    
    
    /**
     * Gets NIS Node experiences
     * @method getNodeExperiences
     */
    function getNodeExperiences() {
        _doGet('/node/experiences');
    }

    /**
     * Gets Heartbeat
     * @method getHeartbeat
     */
    function getHeartbeat() {
        _doGet('/heartbeat');
    }

    /**
     * Lock account
     * @method lock
     */
    function lockAccount() {
        if (privatekey.value=="") {
            privatekey.focus();
            return false;
        }
        let data = {"value":privatekey.value};
       _doPost('/account/lock', data);
    }
    
    /**
     * Unlock account
     * @method unlockAccount
     */
    function unlockAccount() {
        if (privatekey.value=="") {
            privatekey.focus();
            return false;
        }
        let data = {"value":privatekey.value};
        _doPost('/account/unlock', data);
    }

    /**
     * Gets network time from NIS node
     * @method getNetworkTimeFromNode
     */
    function getNetworkTimeFromNode() {
        _doGet('/time-sync/network-time');
    }

    /**
     * Gets mosaic supply
     * @method getMosaicSupply
     */
    function getMosaicSupply() {
        if (namespace.value=="") {
            namespace.focus();
            return false;
        }
        if (mosaicname.value=="") {
            mosaicname.focus();
            return false;
        }
        let mosaicId = namespace.value+":"+mosaicname.value;
        let data = {"mosaicId":mosaicId};
        _doGet('/mosaic/supply?mosaicId='+mosaicId);
    }


    return {
        comboList: comboList,
        init: init,
        delInputCommon: delInputCommon,
        delInputWallet: delInputWallet,
        delOutputdata: delOutputdata,
        setNetwork: setNetwork,
        loadHistRequest: loadHistRequest,
        deleteHist: deleteHist,
        generateAddress: generateAddress,
        getAccount: getAccount,
        getAccountFromPK: getAccountFromPK,
        lockAccount: lockAccount,
        unlockAccount: unlockAccount,
        getNamespacesFromAddress: getNamespacesFromAddress,
        getMosaicsFromAddress: getMosaicsFromAddress,
        getMosaicsFromNamespace: getMosaicsFromNamespace,
        currentBlock: currentBlock,
        getBlock: getBlock,
        getLastNamespaces: getLastNamespaces,
        getStatusServer: getStatusServer,
        getNodeInformation: getNodeInformation,
        getExtendedInfo: getExtendedInfo,
        getPeerList: getPeerList,
        getNodeExperiences: getNodeExperiences,
        getHeartbeat: getHeartbeat,
        getIncomingTransactionsFromAddress: getIncomingTransactionsFromAddress,
        getOutgoingTransactionsFromAddress: getOutgoingTransactionsFromAddress,
        getHarvestingInfoFromAddress: getHarvestingInfoFromAddress,
        getTenBlocksAfterHeight: getTenBlocksAfterHeight,
        getNamespace: getNamespace,
        prepareTransaction: prepareTransaction,
        generateQR: generateQR,
        setNISNode: setNISNode,
        getNetworkTimeFromNode: getNetworkTimeFromNode,
        getMosaicSupply: getMosaicSupply
    };

})();