$(document).ready(function () {
    //ocultar alerta
    $("#alerta").hide();
    // botão para adicionar gramática de exemplo
    var ultimon = 0;
    $('#btn_add').click(function () {
        var num = Math.floor((Math.random() * 6) + 1);
        while (ultimon == num) {
            num = Math.floor((Math.random() * 6) + 1);
        }
        if (num == 1) {
            $('#input-gramatica').text("S->aB\nB->bB|Σ");
        }
        if (num == 2) {
            $('#input-gramatica').text("J->aABcD|aBcA|bDc\nA->bAbD|bb|Σ\nB->bDaA|bBBa|bDba|ba|b\nD->bB|Σ");
        }
        if (num == 3) {
            $('#input-gramatica').text("S->aAb\nA->bA|bb|Σ");
        }
        if (num == 4) {
            $('#input-gramatica').text("S->bDCe\nD->dD|Σ\nC->cC|Σ");
        }
        if (num == 5) {
            $('#input-gramatica').text("S->AB|SCB\nA->aA|C\nB->bB|b\nC->cC|Σ");
        }
        if (num == 6) {
            $('#input-gramatica').text("S->AB|SCB|SB|B\nA->aA|C|a\nB->bB|b\nC->cC|c");
        }
        ultimon = num;
    });
    // botão para executar função para elimitar produções vazias
    $('#btn_vazio').click(function () {
        if (verifica_textarea()) {
            $('#input-resultado').val(prod_vazia($('#input-gramatica').val().trim(' ')));
        }
    });
    // botão para executar função para elimitar produções unitárias
    $('#btn_unitaria').click(function () {
        if (verifica_textarea()) {
            $('#input-resultado').val(prod_unitaria($('#input-gramatica').val()));
        }
    });
    // botão para executar função para elimitar símbolos inúteis
    $('#btn_inuteis').click(function () {
        if (verifica_textarea()) {
            simb_inuteis($('#input-gramatica').val());
        }
    });
    // botão para executar função para simplificar a gramática
    $('#btn_simplificar').click(function () {
        if (verifica_textarea()) {
            prod_vazia($('#input-gramatica').val());
            prod_unitaria($('#input-gramatica').val());
            simb_inuteis($('#input-gramatica').val());
        }
    });
    // verifica se o textarea está em branco
    function verifica_textarea() {
        if ($('#input-gramatica').val() == "") {
            $("#alerta").fadeIn(300).delay(1500).fadeOut(500);
            $("#input-gramatica").focus();
            return false;
        }
        else {
            return true;
        }
    }
    // função para remover produções duplicadas da gramatica
    function remove_duplicados(gram) {
        var novaglc = "";
        var linhas = gram.split('\n');
        for (var i = 0; i < linhas.length; i++) {
            var separa = linhas[i].split('->');
            var glc = separa[1].split('|');
            var novoGLC = glc.filter(function (a, b) {
                return glc.indexOf(a) == b;
            });
            novaglc = novaglc + separa[0] + '->';
            for (var j = 0; j < novoGLC.length; j++) {
                if (j == 0) {
                    novaglc = novaglc + novoGLC[j];
                }
                else {
                    novaglc = novaglc + '|' + novoGLC[j];
                }
            }
            novaglc = novaglc + '\n';
        }
        return novaglc.trim();
    }
    // função para eliminar produções vazias
    function prod_vazia(gramatica) {
        var nova_gramatica = "";
        var vazios = new Array();
        var linha = gramatica.split('\n');
        // descobre onde estão os vazios
        for (var i = 0; i < linha.length; i++) {
            var gr = linha[i].split('->');
            var prod = gr[1].split('|');
            for (var j = 0; j < prod.length; j++) {
                if (prod[j] == 'Σ') {
                    console.log(gr[0]);
                    vazios.push(gr[0]);
                }
            }
        }

        console.log('gramática a ser analisada:\n' + gramatica.trim() + '\n---------------\nquantidade de não terminais vazios: ' + vazios.length + '\n---------------');
        // processa a gramática
        if (vazios.length > 0) {
            for (var i = 0; i < linha.length; i++) {
                var gr = linha[i].split('->');
                var prod = gr[1].split('|');
                console.log('não terminal atual: ' + gr[0]);
                console.log('quantidade de produções: ' + prod.length);
                nova_gramatica = nova_gramatica + gr[0] + "->";
                for (var j = 0; j < prod.length; j++) {
                    console.log('produção atual: ' + prod[j]);
                    if (prod[j] != 'Σ') {
                        if (j == 0) {
                            nova_gramatica = nova_gramatica + prod[j];
                        }
                        else {
                            nova_gramatica = nova_gramatica + '|' + prod[j];
                        }
                    }
                    if (vazios.length > 1) {
                        var contador_prod = 0;
                        for (k = 0; k < vazios.length; k++) {
                            // verifica se a produção possui um não terminal do indice de não terminais vazios
                            if (prod[j].indexOf(vazios[k]) > -1) {
                                contador_prod++;
                                //possui não terminal vazio
                               if(prod[j].replace(vazios[k], "") != ""){     
                                    nova_gramatica = nova_gramatica + '|' + prod[j].replace(vazios[k], "");
                                    console.log('produção processada: ' + prod[j].replace(vazios[k], ""));
                                }
                            }
                        }
                        if (contador_prod > 1) {
                            var nova_prod = prod[j];
                            for (n = 0; n < vazios.length; n++) {
                                var regex = new RegExp(vazios[n], "g");
                                nova_prod = nova_prod.replace(regex, "");
                            }
                            nova_gramatica = nova_gramatica + '|' + nova_prod;
                            console.log('produção processada: ' + nova_prod);
                        }
                    }
                    else {
                        for (l = 0; l < vazios.length; l++) {
                            // verifica se a produção possui um não terminal do indice de não terminais vazios
                            if (prod[j].indexOf(vazios[l]) > -1) {
                                //possui não terminal vazio
                                if (prod[j] != 'Σ') {
                                    // insere produção processada
                                    if(prod[j].replace(vazios[l], "") != ""){
                                    nova_gramatica = nova_gramatica + '|' + prod[j].replace(vazios[l], "");
                                    console.log('produção processada: ' + prod[j].replace(vazios[l], ""));
                                    }
                                }
                            }
                        }
                    }
                }
                nova_gramatica = nova_gramatica + "\n";
                console.log('---------------\ngramática gerada:\n' + nova_gramatica.trim() + '\n---------------');
            }
            // remover produções duplicadas
            nova_gramatica = remove_duplicados(nova_gramatica.trim());
            console.log('---------------\ngramática final:\n' + nova_gramatica + '\n---------------');
            return nova_gramatica;
        }
        else {
            //não possui produções vazias
            nova_gramatica = gramatica.trim();
            console.log('---------------\na produção não possui produções vazias.\n---------------\ngramática final:\n' + nova_gramatica + '\n---------------');
            return nova_gramatica;
        }
    }
    // função para eliminar produções unitárias
    function prod_unitaria(gramatica) {
        var nova_gramatica = "";
        var nova_gramatica2 = "";
        var unitario = new Array();
        var linha = gramatica.split('\n');
        // função para verificar se tem produções unitárias
        function tem_unit(gramat) {
            gramat = gramat.trim();
            var qtd = 0;
            var lin = gramat.split('\n');
            for (var i = 0; i < lin.length; i++) {
                var gr = lin[i].split('->');
                var prod = gr[1].split('|');
                for (var j = 0; j < prod.length; j++) {
                    if (eh_unit(prod[j])) {
                        qtd++;
                    }
                }
            }
            return qtd;
        }
        // função para verificar se produção qualquer é unitária
        function eh_unit(producao) {
            if (producao.length == 1) {
                if (producao.match(/[A-Z]/i)) {
                    if (producao == producao.toUpperCase()) {
                        return true;
                    }
                }
            }
            return false;
        }
        // processa a gramática
        if (tem_unit(gramatica) > 0) {
            // descobre quais são as produções unitárias
            for (var i = 0; i < linha.length; i++) {
                var gr = linha[i].split('->');
                var prod = gr[1].split('|');
                for (var j = 0; j < prod.length; j++) {
                    if (eh_unit(prod[j])) {
                        unitario.push(prod[j]);
                    }
                }
            }
            console.log('gramática a ser analisada:\n' + gramatica.trim() + '\n---------------\nquantidade de produções unitárias: ' + tem_unit(gramatica) + '\n---------------');
            // função para pegar produções da unitária desejada
            function pega_producoes(nterm) {
                for (var i = 0; i < linha.length; i++) {
                    var gr = linha[i].split('->');
                    for (var j = 0; j < unitario.length; j++) {
                        if (gr[0] == nterm) {
                            return gr[1];
                        }
                    }
                }
            }
            for (var i = 0; i < linha.length; i++) {
                var gr = linha[i].split('->');
                var prod = gr[1].split('|');
                console.log('não terminal atual: ' + gr[0]);
                console.log('quantidade de produções: ' + prod.length);
                nova_gramatica = nova_gramatica + gr[0] + '->';
                for (var j = 0; j < prod.length; j++) {
                    console.log('produção atual: ' + prod[j]);
                    if (eh_unit(prod[j])) {
                        if (j == 0) {
                            nova_gramatica = nova_gramatica + pega_producoes(prod[j]);
                            console.log('produção processada: ' + pega_producoes(prod[j]));
                        }
                        else {
                            nova_gramatica = nova_gramatica + '|' + pega_producoes(prod[j]);
                            console.log('produção processada: ' + pega_producoes(prod[j]));
                        }
                    }
                    else {
                        if (j == 0) {
                            nova_gramatica = nova_gramatica + prod[j];
                        }
                        else {
                            nova_gramatica = nova_gramatica + '|' + prod[j];
                        }
                    }
                }
                nova_gramatica = nova_gramatica + "\n";
                console.log('---------------\ngramática gerada:\n' + nova_gramatica.trim() + '\n---------------');
            }
            // verificar se ainda possui alguma produção unitária
            var nova_qtde_unit = tem_unit(nova_gramatica.trim());
            if (nova_qtde_unit > 0) {
                linha2 = nova_gramatica.trim().split('\n');
                console.log('---------------\nproduções unitárias restantes:\n' + nova_qtde_unit + '\n---------------');
                for (h = 0; h < nova_qtde_unit; h++) {
                    for (var i = 0; i < linha2.length; i++) {
                        var gr = linha2[i].split('->');
                        var prod = gr[1].split('|');
                        console.log('não terminal atual: ' + gr[0]);
                        console.log('quantidade de produções: ' + prod.length);
                        nova_gramatica2 = nova_gramatica2 + gr[0] + '->';
                        for (var j = 0; j < prod.length; j++) {
                            console.log('produção atual: ' + prod[j]);
                            if (eh_unit(prod[j])) {
                                if (j == 0) {
                                    nova_gramatica2 = nova_gramatica2 + pega_producoes(prod[j]);
                                    console.log('produção processada: ' + pega_producoes(prod[j]));
                                }
                                else {
                                    nova_gramatica2 = nova_gramatica2 + '|' + pega_producoes(prod[j]);
                                    console.log('produção processada: ' + pega_producoes(prod[j]));
                                }
                            }
                            else {
                                if (j == 0) {
                                    nova_gramatica2 = nova_gramatica2 + prod[j];
                                }
                                else {
                                    nova_gramatica2 = nova_gramatica2 + '|' + prod[j];
                                }
                            }
                        }
                        nova_gramatica2 = nova_gramatica2 + "\n";
                        console.log('---------------\ngramática gerada:\n' + nova_gramatica2.trim() + '\n---------------');
                    }
                }
            }
            else {
                nova_gramatica2 = nova_gramatica;
            }
            // remover produções duplicadas
            nova_gramatica2 = remove_duplicados(nova_gramatica2.trim());
            console.log('---------------\ngramática final:\n' + nova_gramatica2.trim() + '\n---------------');
            return nova_gramatica2;
        }
        else {
            //não possui produções unitárias
            nova_gramatica = gramatica.trim();
            console.log('---------------\na produção não possui produções unitárias.\n---------------\ngramática final:\n' + nova_gramatica + '\n---------------');
            return nova_gramatica;
        }
    }
    // função para eliminação de símbolos inúteis
    function simb_inuteis(gramatica) {
        //
    }
});