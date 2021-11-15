
/*
    |   Utils JS
    |---------------------------------------------------------------------------
    |   Responsabilidade:   Manter os scripts reutilizáveis em todo e qualquer
    |                       projeto
    |
 */

/** @namespace Global; */

/**
 * Variável global
 * @type JSON
 */
Global = {
    "getParam":function(){
        return this.param;
    },
    "setParam":function(param){
        this.param = param;
    }
};

/** @namespace Pop; */

/**
 * Classe Pop manipula o PopUp
 * @returns {undefined}
 */
Pop = function (){};

/**
 * Para armazenar o status do PopUp <br/>
 * 0 - UNSENT (metodo open não foi chamado)<br/>
 * 1 - OPENED (O PopUp está aberto)<br/>
 * 2 - HEADERS_RECEIVED (O metodo send foi chamado)<br/>
 * 3 - LOADING (Recebendo ou enviando dados)<br/>
 * 4 - DONE (Operação concluída)
 * @type Number
 */
Pop.readyState = 0;

/**
 * Resposta parcial
 * @type String
 */
Pop.responseText = "";

Pop.response = {};

/**
 * Ação efetuada
 * @type String
 */
Pop.action = "";

/**
 * Guarda os Erros
 * @type Array
 */
Pop.errors = [];

/**
 * Chama uma funçao de retorno quando houver sucesso.
 * @param {Function} callback função de retorno
 * @returns {undefined}
 */
Pop.success = function(callback)
{   //console.log("Pop.success("+callback+")");/**/
    const interval = setInterval(function(){
        if(Pop.readyState === 4 && Pop.action === "OK")
        {   clearInterval(interval);
            return callback(Pop.response);
        }else if(Pop.readyState === 4 && Pop.action === "Cancel")
        {   clearInterval(interval);
            return false;
        }
    },200);
};

/**
 * Verifica se o status esta pronto e se o tempo limite não foi excedido
 * @param {Function} callback função de retorno
 * @param {type} time_limit tempo maximo de espera em milessegungos
 * @returns {Boolean}
 */
Pop.onready = function(callback, time_limit = 10000)
{   //console.log("Pop.onready("+time_limit+")");/**/

    if(Pop.readyState === 4)
    {   callback(Pop.responseText);
        return false;
    }

    if(time_limit <= 0)
    {   Pop.errors.push("Time limit exceeded");
        Pop.close();
        for(var i in Pop.errors)
        {  console.warn(Pop.errors[i]);
        }

        return false;
    }

    setTimeout(function(){
        Pop.onready(callback,time_limit - 200);
    },200);
};

/**
 * Cria o background do PopUp
 * @returns {Element}
 */
Pop.back = function()
{   //console.log("Pop.back()");/**/

    return DOM.div({
        "id"                :"pop-back",
        "style"             :"position: fixed;"
                            +"left: 0px;"
                            +"right: 0px;"
                            +"top: 0px;"
                            +"bottom: 0px;"
                            +"background-color: rgba(0,0,0,0.5);"
                            +"padding: 100px;"
                            +"display: none;"
    });
};

/**
 * Cria a div principal do PopUp
 * @returns {Element}
 */
Pop.front = function()
{   //console.log("Pop.front()");/**/

    return DOM.div({
        "id"                    :"pop-front",
        "className"             :"col-sm-10 col-md-8 col-lg-6",
        "style"                 :"height: 300px;"
                                +"background-color: #FFF;"
                                +"border: 1px solid #EFEFEF;"
                                +"border-radius: 10px;"
                                +"padding: 20px;"
    });
};

/**
 * Cria a div responsiva do PopUp
 * @returns {Element}
 */
Pop.image = function(url)
{   //console.log("Pop.img()");/**/

	var content = DOM.div({
        "id"        :"pop-content",
        "style"     :"overflow-y: auto;"
                    +"float: top;"
                    +"border: 1px solid #FFF;"
                    +"border-bottom: 1px solid #EFEFEF;"
                    +"padding-bottom: 8px;"
    });

    var img = DOM.img({
        "src" : url,
		"height": "70%",
		"width": "70%"
    });

	return content.appendChild(img);
};


/**
 * Cria o conteúdo dentro do PopUp
 * @param {type} obj
 * @returns {Pop.setContent.content|Element}
 */
Pop.setContent = function(obj)
{   //console.log("Pop.setContent("+ obj +")");/**/

    var content = DOM.div({
        "id"        :"pop-content",
        "style"     :"overflow-y: auto;"
                    +"float: top;"
                    +"border: 1px solid #FFF;"
                    +"border-bottom: 1px solid #EFEFEF;"
                    +"height: 74%;"
                    +"padding-bottom: 8px;"
    });

    var elements = {};

    if(typeof(obj.label) === "string")
    {   var element = Pop.createElement(obj);
        content.appendChild(element);
    }

    for (var i in obj)
    {   if(typeof(obj[i]) === "object")
        {   if(!obj[i].name)
            {   obj[i].name = i;
            }
            elements[i] = Pop.createElement(obj[i]);
            if(elements[i] !== false)
            {   content.appendChild(elements[i][0]);
                content.appendChild(elements[i][1]);
            }
        }
    }

    return content;
};

/**
 * Cria um elemento para o PopUp
 * @param {type} obj
 * @returns {Array|Boolean}
 */
Pop.createElement = function(obj)
{   //console.log("Pop.createElement("+ obj +")");/**/

    if(typeof(obj) !== "object")
    {   return false;
    }

    if(!obj.value)
    {   obj.value = "";
    }

    if(!obj.label)
    {   obj.label = "";
    }

    if(!obj.placeholder)
    {   obj.placeholder = "";
    }

    if(!obj.type)
    {   obj.type = "text";
    }

    if(!obj.className)
    {   obj.className = "col-sm-8";
    }

    if(!obj.name)
    {   obj.name = "";
    }

    if(!obj.id)
    {   obj.id = "";
    }

    var label = DOM.div({
        className     :"col-sm-4 lab",
        innerHTML     :obj.label,
        style         :"font-weight: bold;"
                      +"background-color: #EFEFEF;"
                      +"height: 32px;"
                      +"margin-top: 10px;"

    });

    var input = DOM.input({
        type          :obj.type,
        className     :obj.className + " value",
        name          :obj.name,
        id            :obj.id,
        placeholder   :obj.placeholder,
        value         :obj.value,
        style         :"height: 32px;"
                      +"margin-top: 10px;"
    });

    return [label,input];
};

/**
 * Quando for um alert seta a mensagem
 * @param {type} msg
 * @returns {Element}
 */
Pop.setMessage = function(msg)
{   //console.log("Pop.setMessage("+msg+")");/**/

    return DOM.div({
        id          :"message",
        innerHTML   :msg,
        style       :"height: 200px;"
                    +"width: 100%;"
                    +"overflow: auto;"
    });
};

/**
 * Seta o título do PopUp
 * @param {String} strTitle
 * @returns {Element}
 */
Pop.setTitle = function(strTitle)
{   //console.log("Pop.setTitle(" + strTitle + ")");/**/

    return DOM.div({
        "id"            :"pop-title",
        "className"     :"col-sm-11",
        "innerHTML"     :strTitle,
        "style"         :"float: left;"
                        +"font-weight: bold;"
    });
};

/**
 * Seta o título do PopUp
 * @returns {Element}
 */
Pop.header = function()
{   //console.log("Pop.header()");/**/

    return DOM.div({
        "id"            :"pop-header",
        "className"     :"col-sm-12",
        "style"         :"float: top;"
                        +"border-bottom: 1px solid #EFEFEF;"
                        +"height: 40px;"
                        +"padding-bottom: 8px;"
    });
};

Pop.footer = function()
{   //console.log("Pop.footer()");/**/

    return DOM.div({
        "id"            :"pop-footer",
        "className"     :"",
        "style"         :"float: bottom;"
                        +"height: 40px;"
                        +"padding-top: 8px;"
                        +"width: 250px;"
                        +"text-align: center;"
                        +"margin: auto;"
    });
};

/**
 * Seta o botão close (fechar)
 * @param {type} nameFunction
 * @returns {Element|Pop.setCloseButton.button}
 */
Pop.setCloseButton = function(nameFunction, element=false)
{   //console.log("Pop.setButton("+ nameFunction +")");/**/

    var button = DOM.button({
        "id"                :"pop-button-close",
        "className"         :"col-sm-4 btn btn-danger",
        "innerHTML"         :"Cancelar",
        "style"             :"height: 32px;"
                            +"width: 100px;"
                            +"float: left;"
    });

    button.addEventListener("click", function(){
        eval(nameFunction);
        Pop.close(element);
        Pop.action = "Cancel";
    });

    return button;
};

/**
 * Seta o botão de Envio
 * @param {type} nameFunction
 * @returns {Pop.setOKButton.button|Element}
 */
Pop.setOKButton = function(nameFunction, element = false)
{   //console.log("Pop.setButton("+ nameFunction +")");/**/

    var button = DOM.button({
        "id"                :"pop-button-send",
        "className"         :"col-sm-4 btn btn-success",
        "innerHTML"         :"OK",
        "style"             :"height: 32px;"
                            +"width: 100px;"
                            +"float: right;"
    });

    button.addEventListener("click", function(){
        Pop.send(element);
        Pop.action = "OK";
        eval(nameFunction + ";");
    });
    return button;
};

/**
 * Cria o PopUp com o conteudo recebido
 * @param {type} obj
 * @returns {undefined}
 */
Pop.create = function(obj)
{   //console.log("Pop.create("+obj+")");/**/
    if(!obj.title)
    {   obj.title = "Adicionar Parametro";
    }
    if(!obj.callback)
    {   obj.callback = "console.warn('callback não definido!')";
    }

    var back = Pop.back();
    var front = Pop.front();
    var header = Pop.header();
    var title = Pop.setTitle(obj.title);
    var footer = Pop.footer();
    var closeButton = Pop.setCloseButton("",back);
    var sendButton = Pop.setOKButton(obj.callback,back);
    var content = Pop.setContent(obj);

    document.body.appendChild(back);
    back.appendChild(front);

    front.appendChild(header);
    front.appendChild(content);
    front.appendChild(footer);

    header.appendChild(title);
    footer.appendChild(closeButton);
    footer.appendChild(sendButton);

    return back;
};

/**
 * Cria o PopUp com o conteudo recebido
 * @param {type} obj
 * @returns {undefined}
 */
Pop.img = function(obj)
{
    if(!obj.title)
    {
		obj.title = "Adicionar Parametro";
    }

	if(!obj.src)
	{
		obj.callback = "console.warn('src não definido!')";
	}

    var back = Pop.back();
    var front = Pop.image(obj.src);
    var header = Pop.header();
    var title = Pop.setTitle(obj.title);
    var footer = Pop.footer();
    var closeButton = Pop.setCloseButton("", back);
    var content = Pop.setContent(obj);

    document.body.appendChild(back);
    back.appendChild(front);

    front.appendChild(header);
    front.appendChild(content);
    front.appendChild(footer);

    header.appendChild(title);
    footer.appendChild(closeButton);

    return back;
};

/**
 * Destroi o PopUp
 * @returns {undefined}
 */
Pop.destroy = function(element = false)
{   //console.log("Pop.destroy()");/**/
    var divBack;
    if(element)
    {   divBack = element;
    }else
    {    divBack = document.getElementById("pop-back");
    }
    document.body.removeChild(divBack);
};

/**
 * Mostra o PopUp que está oculto
 * @returns {undefined}
 */
Pop.open = function (element = false)
{   //console.log("Pop.open()");/**/
    var divBack;

    if(element)
    {   divBack = element;
    }else
    {   divBack = document.getElementById("pop-back");
    }

    divBack.style.display = "block";
    Pop.readyState = 1;/* 1 equivale OPENED similar em XMLHttpRequest */
};

/**
 * Esconde o PopUp que está visivel
 * @returns {undefined}
 */
Pop.close = function (element = false)
{   //console.log("Pop.close()");/**/
    var divBack;
    if(element)
    {   divBack = element;
    }else
    {   divBack = document.getElementById("pop-back");
    }

    divBack.style.display = "none";
    Pop.readyState = 4;/* 4 equivale DONE similar em XMLHttpRequest */
};

/**
 * Envia dados dos parametros recebidos do usuário
 * @returns {undefined}
 */
Pop.send = function (element = false)
{   //console.log("Pop.send()");/**/

    var labels = document.querySelectorAll(".lab");
    var values = document.querySelectorAll(".value");

    var obj = {};
    for(var i = 0; i < Object.keys(labels).length; i++)
    {   obj[values[i].name] = values[i].value;
        /* cria globais */
        eval('window.' + values[i].name + '="' + values[i].value + '";');
    }

    Pop.readyState = 2; /* 2 equivale HEADERS_RECEIVED similar em XMLHttpRequest */

    Pop.response = obj;
    Pop.responseText = JSON.stringify(obj);
    /* Envia para a variável global 'param' */
    Global.setParam(obj);

    /* fecha o PopUp */
    Pop.close(element);
};

/**
 * Cria um PopUp de alerta
 * @param {type} msg
 * @returns {undefined}
 */
Pop.alert = function(msg)
{   //console.log("Pop.alert(" + msg + ")");/**/

    var back = Pop.back();
    var front = Pop.front();
    var header = Pop.header();
    var title = Pop.setTitle("Valor Inserido!");
    var closeButton = Pop.setCloseButton("",back);
    var message = Pop.setMessage(msg);

    document.body.appendChild(back);
    back.appendChild(front);
    front.appendChild(header);
    header.appendChild(title);
    header.appendChild(closeButton);
    front.appendChild(message);
    return back;
};

/**
 * Instancia e abre um novo PopUp
 * @param {type} obj
 * @returns {undefined}
 */
Pop.add = function(obj)
{   //console.log("Pop.add(" + params + ")");/**/
    if(document.getElementById("pop-back"))
    {   Pop.destroy();
    }

    var element = Pop.create(obj);
    Pop.open(element);
    return element;
};

/**
 *
 * @param {string} text mensagem que será exibida
 * @param {type} value [optional] valor default
 * @returns {undefined}
 */
Pop.prompt = function(text, value)
{   Pop.add({
        title:text,
        param:{
            value:value
        }
    });
    /* continue.... falta implementar a logica de retorno do resultado */
};

/** @namespace DOM; */

/**
 * Classe de manipulação de Documentos (HTML/XML)
 * @returns {undefined}
 */
DOM = function(){};

/**
 * Cria uma nova Div
 * @param {type} obj
 * @returns {Element}
 */
DOM.div = function(obj)
{   //console.log("DOM.div("+obj+")");/**/

    var div = document.createElement("div");
    for(var i in obj)
    {   div[i] = obj[i];
    }
    return div;
};

/**
 * Cria uma nova Span
 * @param {type} obj
 * @returns {Element}
 */
DOM.span = function(obj)
{   //console.log("DOM.span("+obj+")");/**/

    var element = document.createElement("span");
    for(var i in obj)
    {   element[i] = obj[i];
    }
    return element;
};

/**
 * Cria um novo botão
 * @param {type} obj
 * @returns {Element}
 */
DOM.button = function(obj)
{   //console.log("DOM.button("+obj+")");/**/

    var button = document.createElement("button");
    for(var i in obj)
    {   button[i] = obj[i];
    }
    return button;
};

/**
 * Cria um novo Input
 * @param {type} obj
 * @returns {Element}
 */
DOM.input = function(obj)
{   //console.log("DOM.input("+obj+")");/**/

    var input = document.createElement("input");
    for(var i in obj)
    {   input[i] = obj[i];
    }
    return input;
};

/**
 * Cria uma nova label
 * @param {Object} obj
 * @returns {Element}
 */
DOM.label = function(obj)
{   //console.log("DOM.label("+obj+")");/**/

    var label = document.createElement("label");
    for(var i in obj)
    {   label[i] = obj[i];
    }
    return label;
};

/**
 * Cria um novo Formulário
 * @param {Object} obj
 * @returns {Element}
 */
DOM.form  = function (obj)
{   //console.log("DOM.label("+obj+")");/**/

    var form = document.createElement("form");
    for(var i in obj)
    {   form[i] = obj[i];
    }
    return form;
};

/**
 * Cria uma nova imagem
 * @param {Object} obj
 * @returns {Element}
 */
 DOM.img = function(obj)
 {
	var img = document.createElement("img");

	for(var i in obj)
    {
		img.setAttribute(i, obj[i]);
    }

	return img;
 }

/**
 * Para fazer requisições do tipo XMLHttpRequest
 * @param {Object} obj
 * @returns {undefined}
 */
ajax = function(obj)
{
    var xhr = new XMLHttpRequest();
    if(!obj.method)
    {   obj.method = "POST";
    }

    if(!obj.url)
    {   obj.url = "#";
    }

    if(!obj.async)
    {   obj.async = true;
    }

    if(!obj.username)
    {   obj.username = "";
    }

    if(!obj.password)
    {   obj.password = "";
    }

    if(obj.timeout)
    {   xhr.timeout = obj.timeout;
    }

    if(!obj.data)
    {   obj.data = {};
    }

    if(!obj.success)
    {   obj.success = function(resp){
            console.log(resp);
        };
    }

    if(!obj.error)
    {   obj.error = function(resp){
            console.error(resp);
        };
    }

    xhr.onreadystatechange = function (){
        if(this.readyState === 4 && this.status === 200)
        {   obj.success(this.responseText);
        }

        if(this.readyState === 4 && this.status !== 200)
        {   obj.error(this.responseText);
        }
    };

    var data_encoded = uriEncode(obj.data);

    xhr.open(obj.method, obj.url, obj.async, obj.username, obj.password);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-Length", data_encoded.length);
    xhr.send(data_encoded);
};

/**
 * Codifica obeto para formato string uri
 * @param {Object} obj
 * @returns {String}
 */
function uriEncode(obj)
{   var arrayUri = [];
    var count = 0;
    for(var i in obj)
    {   arrayUri[count++] = i + "=" + encodeURI(obj[i]);
    }
    return arrayUri.join("&");
}

function clearIsoChars(str)
{   str = str .replace(/ÃƒÂ¡/g,		'á');
    str = str .replace(/Ãƒ /g,		'Ã ');
	str = str .replace(/Ãƒ&nbsp;/g, 	'Ã ');
    str = str .replace(/ÃƒÂ¢/g,		'â');
    str = str .replace(/ÃƒÂ£/g,		'ã');
    str = str .replace(/ÃƒÂ©/g,		'é');
    str = str .replace(/ÃƒÂ¨/g,		'Ã¨');
    str = str .replace(/ÃƒÂª/g,		'Ãª');
    str = str .replace(/ÃƒÂ­/g,		'Ã­');
    str = str .replace(/ÃƒÂ³/g,		'Ã³');
    str = str .replace(/ÃƒÂ´/g,		'Ã´');
    str = str .replace(/ÃƒÂµ/g,		'õ');
    str = str .replace(/ÃƒÂ¶/g,		'Ã¶');
    str = str .replace(/ÃƒÂº/g,		'ú');
    str = str .replace(/ÃƒÂ¼/g,		'Ã¼');
    str = str .replace(/ÃƒÂ±/g,		'Ã±');
    str = str .replace(/ÃƒÂ½/g,		'Ã½');
    str = str .replace(/ÃƒÂ§/g,		'ç');
    str = str .replace(/ÃƒÂ/g, 		'Ã');
    str = str .replace(/Ãƒâ‚¬/g,		'Ã€');
    str = str .replace(/Ãƒâ€š/g,		'Ã‚');
    str = str .replace(/ÃƒÆ’/g,		'Ãƒ');
    str = str .replace(/Ãƒâ€°/g,		'Ã‰');
    str = str .replace(/ÃƒË†/g,		'Ãˆ');
    str = str .replace(/ÃƒÅ /g,		'ÃŠ');
    str = str .replace(/ÃƒÂ/g, 		'Ã');
    str = str .replace(/Ãƒâ€œ/g,		'Ã“');
    str = str .replace(/Ãƒâ€/g,		'Ã”');
    str = str .replace(/Ãƒâ€¢/g,		'Ã•');
    str = str .replace(/Ãƒâ€“/g,		'Ã–');
    str = str .replace(/ÃƒÅ¡/g,		'Ãš');
    str = str .replace(/ÃƒÅ“/g,		'Ãœ');
    str = str .replace(/Ãƒâ€˜/g,		'Ã‘');
    str = str .replace(/ÃƒÂ/g, 		'Ã');
    str = str .replace(/Ãƒâ€¡/g,		'Ã‡');
	str	= str .replace(/ââ‚¬â€œ/g, 		'-');
	str = str .replace(/ââ‚¬Â¢/g,		'â€¢');
	str = str .replace(/Ã‚Â·/g,		'Â·');
	str = str .replace(/Ã‚&nbsp;/g,	'&nbsp;');
	str = str .replace(/Ã‚ /g,		' ');
    return str;
}

/**
 * Ordena uma coluna de uma tabela
 * @param  {String}     tableIdentifier  Identificador da tabela (Ex. #myTable)
 * @param  {Integer}    columnNumber     Numero da coluna a ser ordenada (Ex. 0)
 * @param  {String}     order            Ordem dos elementos 'ASC' para crescente, 'DESC' para decrescente
 * @param  {String}     bodyIdentifier   Identificador do corpo da tabela (Ex. tbody)
 * @param  {String}     rowIdentifier    Identificador de linha na tabela (Ex. tr)
 * @param  {String}     columnIdentifier Identificador de coluna na tabela (Ex. td)
 * @param  {string}     orderBy          Atributo de ordenação da coluna (Ex. innerText)
 * @return {boolean}
 */
function sortTable(tableIdentifier, columnNumber, order, bodyIdentifier, rowIdentifier, columnIdentifier, orderBy)
{   // Instancia variáveis a serem utilizadas
    var table, tbody, rows, switching, i, x, y, shouldSwitch, textNum;

    // Preenche os parâmetros que vieram nulos
    if (!tableIdentifier )
    {   tableIdentifier     = "table"   ;
    }
    if (!columnNumber    )
    {   columnNumber        = 0         ;
    }
    if (!order          )
    {   order               = "ASC"     ;
    }
    if (!bodyIdentifier  )
    {   bodyIdentifier      = "tbody"   ;
    }
    if (!rowIdentifier   )
    {   rowIdentifier       = "tr"      ;
    }
    if (!columnIdentifier)
    {   columnIdentifier    = "td"      ;
    }
    if (!orderBy)
    {   orderBy             = "innerText";
    }

    // Seta Valores Iniciais
    table       = document    .querySelector(tableIdentifier);
    tbody       = table       .querySelector(bodyIdentifier);
    switching   = true;

    // Faz as trocas de posições até que não existam mais trocas a serem feitas
    while (switching)
    {   // Inicia o loop assumindo que não existem mais trocas a serem feitas
        switching = false;
        rows = tbody.querySelectorAll(rowIdentifier);

        for (i = 0; i < (rows.length - 1); i++)
        {   // Inicia assumindo que não deve haver troca
            shouldSwitch = false;

            // Pega o elemento para comparar com o elemento da linha de baixo
            x       = rows[i]       .querySelectorAll(columnIdentifier)[columnNumber];
            y       = rows[i + 1]   .querySelectorAll(columnIdentifier)[columnNumber];

            textNum = parseFloat( x .innerText .replace(/\./g, '') .replace(',','.') );

            if (orderBy === "innerText" || orderBy === "innerHTML" || orderBy === "className")
            {   eval('x = x.' + orderBy + ';');
                eval('y = y.' + orderBy + ';');
            }
            else
            {   x = x .getAttribute(orderBy);
                y = y .getAttribute(orderBy);
            }

            // Verifica se é necessario trocar as linhas de lugar
            if (isNaN(textNum))
            {   if ( x.toLowerCase() > y.toLowerCase() && order.toUpperCase() === "ASC")
                {   // Assume que deve haver troca e pára o loop
                    shouldSwitch = true;
                    break;
                }
                if (x.toLowerCase() < y.toLowerCase() && order.toUpperCase() === "DESC")
                {   // Assume que deve haver troca e pára o loop
                    shouldSwitch = true;
                    break;
                }
            }

            else
            {   if (        parseInt( x .replace(/[^0-9]/g, ''))
                        >   parseInt( y .replace(/[^0-9]/g, ''))
                        &&  order.toUpperCase() === "ASC"
                    )
                {   // Assume que deve haver troca e pára o loop
                    shouldSwitch = true;
                    break;
                }
                if (        parseInt( x .replace(/[^0-9]/g, ''))
                        <   parseInt( y .replace(/[^0-9]/g, ''))
                        &&  order.toUpperCase() === "DESC"
                    )
                {   // Assume que deve haver troca e pára o loop
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch)
        {   // Faz a troca das linhas e assume que a troca continua
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    return true;
}

/**
 * Transforma de dd/mm/aaaa para aaaa-mm-dd
 * @param  {String} str_date Data no formato Brasileiro
 * @return {String}          Data no formato Americano
 */
function dateBRtoDB(str_date)
{   var date = str_date.split('/');
    return date[2] + "-" + date[1] + "-" + date[0];
}

/**
 * Transforma de aaaa-mm-dd para dd/mm/aaaa
 * @param  {String} str_date Data no formato Americano
 * @return {String}          Data no formato Brasileiro
 */
function dateDBtoBR (str_date)
{   var date = str_date.split('-');
    return date[2] + "/" + date[1] + "/" + date[0];
}

function csv_download (str_identifier)
{   var rows, i, str_csv, date;
    rows        =   document.querySelectorAll(str_identifier + ' .tr');

    str_csv     =   '';
    for (i = 0; i < Object.keys(rows).length; i++)
    {   str_csv += '"' + rows[i].innerText .replace(/\n/g, '";"') + '"\r\n';
    }

    date                    =   new Date();
    var hiddenElement       =   document.createElement('a');
    hiddenElement.href      =   'data:text/csv;charset=utf-8,' + encodeURI(str_csv);
    hiddenElement.id        =   'downloadable';
    hiddenElement.target    =   '_blank';
    hiddenElement.download  =   '_' + date .getTime() + '.csv';
    document.body.appendChild(hiddenElement);
    document.getElementById('downloadable').click();
}

function pdf_download (str_identifier)
{   var doc, rows, i, j, date, x, y,
    titles, cells, texto, numberCols,
    maxlength;

    doc = new jsPDF('p', 'mm', 'a4'); // tamanho do a4 = 210 x 297 mm
    x = 10;
    y = 10;

    doc.setFontSize(8);

    rows        =   document.querySelectorAll(str_identifier + ' .tr');
    titles      =   document.querySelectorAll(str_identifier + ' .tr .th');
    numberCols  =   Object.keys(titles).length;
    maxlength   =   200 / numberCols;

    for (i = 0; i < Object.keys(rows).length; i++)
    {   cells       =   rows[i] .querySelectorAll('.td');

        if (y == 10)
        {   for (j = 0; j < numberCols; j++)
            {   texto = titles[j] .innerText;
                if (texto.length > (maxlength / 2))
                {   texto   =   texto .substr(0, (maxlength / 2));
                }
                doc.text(x, y, texto);
                x   +=  maxlength;

                if (j < (numberCols-1))
                {   doc.line(x - 1, 11, x - 1, 290);
                }
            }
            doc.line(10, y + 1, 200, y + 1);
            x   =   10;
            y   +=  10;
        }
        else
        {   for (j = 0; j < numberCols; j++)
            {   texto = cells[j] .innerText;
                if (texto.length > (maxlength / 2))
                {   texto   =   texto .substr(0, (maxlength / 2));
                }

                doc.text(x, y, texto);
                x   +=  maxlength;
            }
            x   =   10;
            y   +=  10;
        }

        if (y >= 290)
        {   doc.addPage();
            y = 10;
        }

    }
    date    =   new Date();
    doc.save('_' + date .getTime() + '.pdf');
}

function wait (func_wait, callback, timeout, status) {
    if (timeout <= 0)
    {   return false;
    }

    if (!status)
    {   window.tmpWait = func_wait();
    }

    if (!window.tmpWait)
    {   alert('not yet');
        setTimeout(function () {
            return wait (func_wait, callback, timeout - 200, true);
        }, 200);
    } else {
        return setTimeout(function(){
            callback();
            alert('foi');
            return true;
        }, 200);
    }
};

/**
 * Verifica se variável está vazia
 * @returns {Boolean}
 */
empty = function ($var)
{   try
    {   if (!$var)  return true;
        var empty_obj       =   new Object;
        var empty_array     =   [];
        var empty_string    =   "";
        var empty_number    =   0;
        var empty_date      =   "0000-00-00";
        var empty_datetime  =   "0000-00-00 00:00:00";
        var empty_money     =   "0,00";
        var empty_decimal   =   "0.00";
        var empty_none      =   null;

        if ($var === empty_obj      )   return true;
        if ($var === empty_array    )   return true;
        if ($var === empty_string   )   return true;
        if ($var === empty_number   )   return true;
        if ($var === empty_date     )   return true;
        if ($var === empty_datetime )   return true;
        if ($var === empty_money    )   return true;
        if ($var === empty_decimal  )   return true;
        if ($var === empty_none     )   return true;

        return false;
    }
    catch(e)
    {   console.warn ("Falha na execução da função 'empty'");
        return false;
    }
};