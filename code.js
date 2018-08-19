//                      //
// Component definition //
//                      //

// Elements //

// Spinner
const spinnercomp = Vue.component('spinnercomp', {
    template: '#spinnercomp'
});

// Footer
const footercomp = Vue.component('footercomp', {
  template: '#footercomp'
});

// Pokemon card
const pokecard = Vue.component('pokecard', {
  template: '#pokecard',
  
  props: [
    'name',
    'image',
    'cp',
    'rank',
    'tcp',
    'search'
  ],

  computed: {
    cpwu () {
      return this.tcp
        ? (this.cp * 6 / this.tcp * 100).toFixed(2) + "%"
        : 0;
    },

    hidden () {
      return this.name 
        ? this.name.toLowerCase().indexOf(this.search.toLowerCase()) === -1
        : false;
    }

  }
});

// Event card
const eventcard = Vue.component('eventcard', {
  template: '#eventcard',
  props: [
    'event'
  ]
});

// Pages //

// Stats page
const statspage = Vue.component('statspage', {

  template: '#statspage',

  data () {
    return {
      pokemon: [],
      search: '',
      loading: true,
      alert: window.location.hash == '#sent',
      begindate: "2018-01-01",
      enddate: "2018-12-31",
    }
  },

  computed: {

    searchPokemon() {
      return this.pokemon
        .filter(poke => {
            let pokedate = new Date(poke.Date);
            return pokedate >= new Date(this.begindate) && pokedate <= new Date(this.enddate);
        })
        .reduce( function (r, v, i, a) {

          let el = r.find((r) => r && r.name === v['Name']);
          if (el) {
            el.cp += v['CP'];
          } else {
            r.push({
              name: v['Name'],
              image: v['Image'],
              cp: v['CP'],
            })
          }
          return r;

        }, [])
        .sort(function (a, b) {
          return b.cp - a.cp;
        })
        .map( function (v, i, a) {
          rank = i +  1;
          while (i !== 0 && v.cp === a[i - 1].cp) {
            rank--;
            i--;
          }
          v['rank'] = rank;
          return v;
        })
        ;
    },

    totalCP () {
      return this.searchPokemon ? 
        this.searchPokemon.reduce( function (r, v) {
          return r + v.cp;
        }, 0)
        : 0;
    },
  },

  mounted() {
    var data = this;

    var cpSheet = new Miso.Dataset({
      importer : Miso.Dataset.Importers.GoogleSpreadsheet,
      parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
      key : "10N_ttYQ66UfsKrIDckxk93g9FXjBDQe9kd4GfhLiUCo",
      worksheet : "19"
      // worksheet : "12"
    });

    var misodata = [];

    cpSheet.fetch({
      success : function() {
        data.pokemon = cpSheet.toJSON();
        data.loading = false;
      },

      error : function() {
        console.log("Are you sure you are connected to the internet?");
      }
    });
  }
});

// MSS page
const teamspage = Vue.component('teamspage', {
  template: '#teamspage',

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
      key : "10N_ttYQ66UfsKrIDckxk93g9FXjBDQe9kd4GfhLiUCo",
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

// Regs page


//                   //
// Router definition //
//                   //

const router = new VueRouter ({
  routes: [
    {
      path: '/',
      name: 'Pokémon',
      component: statspage,
    },
    {
      path: '/teams',
      name: 'Teams',
      component: teamspage
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
