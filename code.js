// jQuery stuff

$(function () {
  $('[data-toggle="popover"]').popover({ trigger: "click hover" })
  $('#submit').click(function () {
    alert("Register coming soon!");
  });
})

// Vue stuff

var pokecard = Vue.component('pokecard', {
  template: '#pokecard',
  props: [
    'name',
    'image',
    'cp',
    'cpwu',
  ]
});

var vm = new Vue({
  el: '#app',
  data:{
    pokemon: [],
  },
  mounted() {
    var pokedata = this;
    
    var cpSheet = new Miso.Dataset({
      importer : Miso.Dataset.Importers.GoogleSpreadsheet,
      parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
      key : "1WUNrJWrsAK_7EEIn2L0QyMC2SArXqGIOpJ4G1XrlU20",
      worksheet : "12"
    });

    cpSheet.fetch({ 
      success : function() {
        cpSheet.each(function (row, rowIndex) {
          pokedata.pokemon.push({
            name: row.Pokemon, 
            image: row.Image, 
            cp: row.TotalCP, 
            cpwu: row.CPusage, 
          });
        });
      },

      error : function() {
        console.log("Are you sure you are connected to the internet?");
      }
    });
  }
});
