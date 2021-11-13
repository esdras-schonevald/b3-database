document.addEventListener("DOMContentLoaded", function (){

    var title   =   new Title();
    var info    =   document.getElementById('info');

    info.value  =   JSON.stringify(
            title.getInfo()
    );

    document.getElementById('formInfo').submit();


    /*
    stock_list = [
        "VALE3",
        "BIDI4",
        "MGLU3",
        "ITSA4",
        "ITUB4",
        "BBDC4",
        "MXRF11",
        "MRVE3",
        "TRPL4",
        "TAEE4",
        "CMIN3",
        "CMIG4"
    ];

    for (let i = 0; i < stock_list.length; i++) {
        let ticker = stock_list[i];

        ajax({
            url: "ajax.php",
            method: "POST",
            data: {
                ticker: ticker
            },

            success: function (HTTPResponseText){

            }
        });

    }
    */

}, false);