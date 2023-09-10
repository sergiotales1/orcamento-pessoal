class Despesa {
   constructor(ano, mes, dia, tipo, descricao, valor){
      this.ano = ano
      this.mes = mes
      this.dia = dia
      this.tipo = tipo
      this.descricao = descricao
      this.valor = valor
   }

   validarDados(){
      for(let i in this){
         if(this[i] == undefined || this[i] == "" || this[i] == null){
            return false
         } 
      }
      return true
   }
}

class Bd {

   constructor(){
      let id = localStorage.getItem('id')

      if(id === null){
         localStorage.setItem('id', 0)
      }
   }

   getProximoId(){
      let proximoId = localStorage.getItem('id')
      return parseInt(proximoId) + 1
   }

   gravar(d){
      let id = this.getProximoId()
      
      localStorage.setItem(id, JSON.stringify(d))

      localStorage.setItem('id', id)
   }

   recuperarTodosRegistros(){
      // array de despesas
      let despesas = Array()

      let id = localStorage.getItem('id')

      // recuperar todas as despesas cadastradas em localStorage
      for(let i = 1; i <= id; i++){
         // recuperar despesa
         let despesa = JSON.parse(localStorage.getItem(i))
         
         // existe a possibilidade de haver indices removidos
         // nestes casos vamos pular esses indices
         if(despesa === null){
            continue
         }

         despesa.id = i
         despesas.push(despesa) // add despesa into despesas array
      }
      return despesas
   }

   pesquisar(despesa){
      let despesasFiltradas = Array()

      despesasFiltradas = this.recuperarTodosRegistros()
      // make a chain filtering method when first we limit the despesasFiltradas to only have the objects which correspond of the despesa.ano (filter applied), then we limit to despesasFiltradas only the objects of the d.mes, and we keep doing this for all atributes

      // ano
      if(despesa.ano != ''){
        despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
      }

      // mes
      if(despesa.mes != ''){
         despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
       }
       
      // dia
      if(despesa.dia != ''){
         despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
       }
       
      // tipo
      if(despesa.tipo != ''){
         despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
       }
       
      // descricao
      if(despesa.descricao != ''){
         despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
       }
       
      // valor
      if(despesa.valor != ''){
         despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
       } 
       
      return despesasFiltradas
   }

   remover(id) {
      localStorage.removeItem(id)
   }
}

let bd = new Bd()

function cadastrarDespesa(){
   let ano = document.getElementById('ano')
   let mes = document.getElementById('mes')
   let dia = document.getElementById('dia')
   let tipo = document.getElementById('tipo')
   let descricao = document.getElementById('descricao')
   let valor = document.getElementById('valor')

  
   let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

   const modalTitle = document.getElementById('exampleModalLongTitle')
   const modalHeader = document.querySelector('.modal-header')
   const modalBody = document.querySelector('.modal-body')
   const modalButton = document.getElementById('myBtn')
   if(despesa.validarDados()){
      // dialog de sucesso
      bd.gravar(despesa)
      modalTitle.innerHTML = 'Registro inserido com sucesso'
      modalBody.innerHTML = 'Despesa cadastrada com sucesso!'
      modalButton.innerHTML = 'Voltar'
      modalHeader.classList.remove('text-danger')
      modalHeader.classList.add('text-success')
      modalButton.classList.remove('btn-danger')
      modalButton.classList.add('btn-success')
      $('#modalRegistraDespesa').modal('show')

      // limpando os inputs
      ano.value = ""
      mes.value = ""
      dia.value = ""
      tipo.value = ""
      descricao.value = ""
      valor.value = ""
      
   } else {
      // dialog de erro
      modalTitle.innerHTML = 'Erro na gravação!'
      modalBody.innerHTML = 'Existem campos obrigatórios que não foram preenchidos.'
      modalButton.innerHTML = 'Voltar e corrigir'
      modalHeader.classList.remove('text-success')
      modalHeader.classList.add('text-danger')
      modalButton.classList.remove('btn-success')
      modalButton.classList.add('btn-danger')
      $('#modalRegistraDespesa').modal('show')
   }
   
}

function carregaListaDespesas(despesas = Array(), filtro = false){

   if(despesas.length == 0 && filtro === false){
      despesas = bd.recuperarTodosRegistros()
   }

   // selecionando o elemento tbody da table
   let listaDespesas = document.getElementById('listaDespesas')
   listaDespesas.innerHTML = ""
   /*
   <tr>
      <td>15/03/2018</td>
      <td>Alimentação</td>
      <td>Compras do mês</td>
      <td>444.75</td>
   </tr>
   */
   // percorrer o array despesas, listando cada despesa de forma dinâmica 

   despesas.forEach(function(d) {
      // criando a linha (tr)

      let linha = listaDespesas.insertRow()

      // criar as colunas (td)
      linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

      // ajustar o tipo 
      switch(d.tipo){
         case '1' : d.tipo = 'Alimentação'
            break
         case '2' : d.tipo = 'Educação'
            break
         case '3' : d.tipo = 'Lazer'
            break
         case '4' : d.tipo = 'Saúde'
            break
         case '5' : d.tipo = 'Transporte'
            break
      }
      linha.insertCell(1).innerHTML = d.tipo

      linha.insertCell(2).innerHTML = d.descricao
      linha.insertCell(3).innerHTML = d.valor

      // criar o botão de exclusão
      let btn = document.createElement("button")
      btn.className = "btn btn-danger"
      btn.innerHTML = '<i class="fas fa-times"></i>'
      btn.id = `id_despesa_${d.id}`
      btn.onclick = function(){
         //remover despesa
         let id = this.id.replace('id_despesa_', '')
         
         bd.remover(id)

         window.location.reload()
      }
      linha.insertCell(4).append(btn)
      console.log(d)
   })
}

function pesquisarDespesa(){
   let ano = document.getElementById('ano').value
   let mes = document.getElementById('mes').value
   let dia = document.getElementById('dia').value
   let tipo = document.getElementById('tipo').value
   let descricao = document.getElementById('descricao').value
   let valor = document.getElementById('valor').value

   let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
   
   let despesas = bd.pesquisar(despesa)

   carregaListaDespesas(despesas, true)
}