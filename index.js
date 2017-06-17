let tbody = document.querySelector('tbody');
let numRows = 0;
let numCol = 0;

adicionaLinha();

let gramatica = {
    "S" : ["aAb"],
    "A" : ["bA", "bb", "Vazio"]
}

function adicionaLinha(){
	let tr = document.createElement('tr');
    tr.setAttribute('id', numRows);
	tr.innerHTML = `
		<td id="col-${numCol}">
            <input typ  e="text" id="row${numRows}" />
        </td>
		<td id="col-${++numCol}">
			<input type="text" id="row${numRows}" />
		</td>
	`;
	tbody.appendChild(tr);
	numRows++;
    numCol++;
}


function addColuna(idBtn){
    let td = document.createElement('td');
    td.innerHTML = `
		<td id="col-${numCol}">
            <input typ  e="text" id="row${numRows}" />
	`;
}

function substituirVazio(){

}