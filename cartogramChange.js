// console.log("aqui");

var obj_csv = {
    size:0,
    dataFile:[]
};

var csvAddress = "./estados.csv"
var csvFile = null;
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", csvAddress, false);
xmlhttp.send();
if (xmlhttp.status==200) {
    csvFile = xmlhttp.responseText;
}
var dadosEstados = parseData(csvFile);
console.log(dadosEstados);

function parseData(data){
    let csvData = [];
    let lbreak = data.split("\n");
    lbreak.forEach(res => {
        csvData.push(res.split(","));
    });
    
    let csvObjs = {};
    for(var i=1;i<csvData.length;i++){
        let csvObj = {};
        for (var j=1;j<csvData[0].length;j++){
            csvObj[csvData[0][j]]=csvData[i][j]
        }
        csvObjs[csvData[i][0]] = csvObj;
        // console.log(i,csvObj);
    }
    
    return csvObjs;
}


window.addEventListener("load",function(){
    var a = document.getElementById("svgMap");
    var svgDoc = a.getSVGDocument();
    var s = Snap(svgDoc);
    // console.log(svgDoc);
    var tamanho = svgDoc.getElementById("estados");
    tamanho.setAttribute("visibility", "visible");
    var pop = svgDoc.getElementById("pop");
    pop.setAttribute("visibility", "hidden");
    var pib = svgDoc.getElementById("PIB");
    pib.setAttribute("visibility", "hidden");

    var leg2 = svgDoc.getElementById("tooltip");
    var leg1 = svgDoc.getElementById("leg1");
    // console.log(legenda);
    leg1.setAttribute("visibility", "hidden");
    leg2.setAttribute("visibility", "hidden");
    // console.log(dadosEstados);
    for(var nome in dadosEstados){
        // console.log(nome);
        dadosEstados[nome]["sestado"] = s.select("#"+nome);
        dadosEstados[nome]["destado"] = dadosEstados[nome].sestado.node.getAttribute('d');
        dadosEstados[nome]["dpib"] = s.select("#pib_"+nome).node.getAttribute('d');
        dadosEstados[nome]["dpop"] = s.select("#pop_"+nome).node.getAttribute('d');
        // sestado.animate({d: dpib},2000,mina.backout);
        let estado = svgDoc.getElementById(nome);
        estado.addEventListener("mousemove",function(evt){
            var atual = evt.srcElement.id;
            // console.log(dadosEstados[atual]["Unidade federativa"] +'\n' + dadosEstados[atual]["Área (km²)"] +' km²');
            ShowTooltip(evt, dadosEstados[atual]["Unidade federativa"],dadosEstados[atual]["Área (km²)"] +' km²');
        }, false);
        estado.addEventListener("mouseout",function(evt){
            leg2.setAttribute("visibility", "hidden");
            leg1.setAttribute("visibility", "hidden");
            // console.log(tooltip)
            evt.target.style.fill = '#00AF00';
        },false);
        // console.log('pop_'+nome);
        let popestado = svgDoc.getElementById('pop_'+nome);
        popestado.addEventListener("mousemove",function(evt){
            var atual = evt.srcElement.id.split('_')[1];
            // console.log(dadosEstados[atual]["Unidade federativa"] +'\n' + dadosEstados[atual]["Área (km²)"] +' km²');
            ShowTooltip(evt, dadosEstados[atual]["Unidade federativa"],dadosEstados[atual]["População (2014)"]);
        }, false);
        popestado.addEventListener("mouseout",function(evt){
            leg2.setAttribute("visibility", "hidden");
            leg1.setAttribute("visibility", "hidden");
            // console.log(tooltip)
            evt.target.style.fill = '#00AF00';
        },false);
        let pibestado = svgDoc.getElementById('pib_'+nome);
        pibestado.addEventListener("mousemove",function(evt){
            var atual = evt.srcElement.id.split('_')[1];
            // console.log(dadosEstados[atual]["Unidade federativa"] +'\n' + dadosEstados[atual]["Área (km²)"] +' km²');
            ShowTooltip(evt, dadosEstados[atual]["Unidade federativa"],dadosEstados[atual]["PIB (2015)"]);
        }, false);
        pibestado.addEventListener("mouseout",function(evt){
            leg2.setAttribute("visibility", "hidden");
            leg1.setAttribute("visibility", "hidden");
            // console.log(tooltip)
            evt.target.style.fill = '#00AF00';
        },false);
    }

    function ShowTooltip(evt, nome,valor) {
       evt.target.style.fill = '#0080A0';
        var point = svgDoc.firstChild.createSVGPoint();
        point.x = evt.clientX;
        point.y = evt.clientY;
        var xy = point.matrixTransform(svgDoc.firstElementChild.getScreenCTM().inverse())
        if(xy.x>800.0){
            leg2.firstChild.setAttribute("x", xy.x-180);
            leg1.firstChild.setAttribute("x", xy.x-180);
        } else {
            leg2.firstChild.setAttribute("x", xy.x+5);
            leg1.firstChild.setAttribute("x", xy.x+5);
        }
        leg2.firstChild.setAttribute("y", xy.y-10);
        leg1.firstChild.setAttribute("y", xy.y-40);
        // console.log(tooltip.firstChild);
        // console.log(mouseovertext);
        leg2.firstChild.innerHTML = valor;
        leg2.setAttribute("visibility", "visible");
        leg1.firstChild.innerHTML = nome;
        leg1.setAttribute("visibility", "visible");
    }

    document.getElementById("tamanho").addEventListener("change",function(){
        for(estado in dadosEstados){
            dadosEstados[estado].sestado.animate({d: dadosEstados[estado].destado},2000);
        }
        // tamanho.setAttribute("visibility", "visible");
        // pop.setAttribute("visibility", "hidden");
        // pib.setAttribute("visibility", "hidden");        
    })
    
    document.getElementById("PIB").addEventListener("change",function(){
        for(estado in dadosEstados){
            dadosEstados[estado].sestado.animate({d: dadosEstados[estado].dpib},2000);
            let est = svgDoc.getElementById(estado);
            est.addEventListener("mousemove",function(evt){
                var atual = evt.srcElement.id;
                // console.log(dadosEstados[atual]["Unidade federativa"] +'\n' + dadosEstados[atual]["Área (km²)"] +' km²');
                ShowTooltip(evt, dadosEstados[atual]["Unidade federativa"],"R$"+dadosEstados[atual]["PIB (2015)"]+" bilhões");
            }, false);
        }
        // tamanho.setAttribute("visibility", "hidden");
        // pop.setAttribute("visibility", "hidden");
        // pib.setAttribute("visibility", "visible");        
    })
    document.getElementById("pop").addEventListener("change",function(){
        for(estado in dadosEstados){
            dadosEstados[estado].sestado.animate({d: dadosEstados[estado].dpop},2000);
            let est = svgDoc.getElementById(estado);
            est.addEventListener("mousemove",function(evt){
                var atual = evt.srcElement.id;
                // console.log(dadosEstados[atual]["Unidade federativa"] +'\n' + dadosEstados[atual]["Área (km²)"] +' km²');
                ShowTooltip(evt, dadosEstados[atual]["Unidade federativa"],dadosEstados[atual]["População (2014)"]+" hab.");
            }, false);
        }
    //     tamanho.setAttribute("visibility", "hidden");
    //     pop.setAttribute("visibility", "visible");
    //     pib.setAttribute("visibility", "hidden");        
    })
});