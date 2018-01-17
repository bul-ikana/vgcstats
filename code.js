var pokecard = Vue.component('pokecard', {
  template: '#pokecard',
  props: [
    'name',
    'image',
    'cp',
    'cpwu',
    'rank',
  ]
});

var vm = new Vue({
  el: '#app',
  data:{
    pokemon: [],
    loading: true,
  },
  mounted() {
    var data = this;

    var cpSheet = new Miso.Dataset({
      importer : Miso.Dataset.Importers.GoogleSpreadsheet,
      parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
      key : "1WUNrJWrsAK_7EEIn2L0QyMC2SArXqGIOpJ4G1XrlU20",
      worksheet : "12"
    });

    cpSheet.fetch({
      success : function() {
        cpSheet
          .where({
            rows: function(row) {
              return row.TotalCP > 0;
            }
          })
          .each(function (row, rowIndex) {
            data.pokemon.push({
              name: row.Pokemon, 
              image: row.Image, 
              cp: row.TotalCP, 
              rank: row.Rank,
              cpwu: row.CPusage, 
            });
          });
        data.loading = false;

        $(function () {
          $('[data-toggle="popover"]').popover({ trigger: "hover" });
        });
      },

      error : function() {
        console.log("Are you sure you are connected to the internet?");
      }
    });
  }
});
