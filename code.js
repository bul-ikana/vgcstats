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
    search: '',
    alert: window.location.hash == '#sent'
  },
  computed: {
    searchPokemon() {
      return this.pokemon.filter(poke => {
          return poke.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      });
    }
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
      },

      error : function() {
        console.log("Are you sure you are connected to the internet?");
      }
    });
  }
});
