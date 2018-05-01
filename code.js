//                      //
// Component definition //
//                      //

// Elements

const spinnercomp = Vue.component('spinnercomp', {
    template: '#spinnercomp'
});

const footercomp = Vue.component('footercomp', {
  template: '#footercomp'
});

const pokecard = Vue.component('pokecard', {
  template: '#pokecard',
  props: [
    'name',
    'image',
    'cp',
    'cpwu',
    'rank',
  ]
});

const eventcard = Vue.component('eventcard', {
  template: '#eventcard',
  props: [
    'event'
  ]
});

// Pages

const statspage = Vue.component('statspage', {

  template: '#statspage',

  data () {
    return {
      pokemon: [],
      search: '',
      loading: true,
      alert: window.location.hash == '#sent'
    }
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

const msspage = Vue.component('msspage', {
  template: '#msspage',

  data () {
    return {
      events: [],
      loading: true
    }
  },

  mounted () {
    var data = this;

    const cpSheet = new Miso.Dataset({
      importer : Miso.Dataset.Importers.GoogleSpreadsheet,
      parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
      key : "1WUNrJWrsAK_7EEIn2L0QyMC2SArXqGIOpJ4G1XrlU20",
      worksheet : "2"
    });

    var misodata = []; 

    cpSheet.fetch({
      success : function() {
        cpSheet.where({
          rows : function (row) { return row.Placing != null; }
        }).sort(
          function (a, b) {
            return new Date(b.Date) - new Date(a.Date) || a.Standing - b.Standing;
          }
        ).each( function (row, index) {
          misodata.push(row);
        });
        data.events = misodata.reduce( 
          function (r, v, i, a) {
            var k1 = v.Date;
            var k2 = v.Region; 
            var k3 = v.Country;
            ( r[k1 + k2 + k3] || (r[k1 + k2 + k3] = []) ).push(v);
            return r; 
          }, {}
        );
        data.loading = false;
      },

      error : function() {
        console.log("Are you sure you are connected to the internet?");
      }
    });
  }
});

const regpage = Vue.component('regpage', {
  template: '#regpage',

  data () {
    return {
      events: [],
      loading: true
    }
  },

  mounted () {
    var data = this;

    const cpSheet = new Miso.Dataset({
      importer : Miso.Dataset.Importers.GoogleSpreadsheet,
      parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
      key : "1WUNrJWrsAK_7EEIn2L0QyMC2SArXqGIOpJ4G1XrlU20",
      worksheet : "3"
    });

    var misodata = []; 

    cpSheet.fetch({
      success : function() {
        cpSheet.where({
          rows : function (row) { return row.Placing != null; }
        }).sort(
          function (a, b) {
            return new Date(b.Date) - new Date(a.Date) || a.Standing - b.Standing;
          }
        ).each( function (row, index) {
          misodata.push(row);
        });
        data.events = misodata.reduce( 
          function (r, v, i, a) {
            var k1 = v.Date;
            var k2 = v.Region; 
            var k3 = v.Country;
            ( r[k1 + k2 + k3] || (r[k1 + k2 + k3] = []) ).push(v);
            return r; 
          }, {}
        );
        data.loading = false;
      },

      error : function() {
        console.log("Are you sure you are connected to the internet?");
      }
    });
  }
});

const natpage = Vue.component('natpage', {
  template: '#natpage',

  data () {
    return {
      events: [],
      loading: true
    }
  },

  mounted () {
    var data = this;

    const cpSheet = new Miso.Dataset({
      importer : Miso.Dataset.Importers.GoogleSpreadsheet,
      parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
      key : "1WUNrJWrsAK_7EEIn2L0QyMC2SArXqGIOpJ4G1XrlU20",
      worksheet : "4"
    });

    var misodata = []; 

    cpSheet.fetch({
      success : function() {
        cpSheet.where({
          rows : function (row) { return row.Placing != null; }
        }).sort(
          function (a, b) {
            return new Date(b.Date) - new Date(a.Date) || a.Standing - b.Standing;
          }
        ).each( function (row, index) {
          misodata.push(row);
        });
        data.events = misodata.reduce( 
          function (r, v, i, a) {
            var k1 = v.Date;
            var k2 = v.Region; 
            var k3 = v.Country;
            ( r[k1 + k2 + k3] || (r[k1 + k2 + k3] = []) ).push(v);
            return r; 
          }, {}
        );
        data.loading = false;
      },

      error : function() {
        console.log("Are you sure you are connected to the internet?");
      }
    });
  }
});

//                   //
// Router definition //
//                   //

const router = new VueRouter ({
  routes: [
    {
      path: '/',
      name: 'Stats',
      component: statspage,
    },
    {
      path: '/mss',
      name: 'MSS',
      component: msspage
    },
    {
      path: '/regs',
      name: 'Regs',
      component: regpage
    },
    {
      path: '/nats',
      name: 'Nats',
      component: natpage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

//                //
// Vue definition //
//                //

var vm = new Vue({
  el: '#app',
  router: router,
  data() {
    return {
      loading: true,
    }
  }
});
