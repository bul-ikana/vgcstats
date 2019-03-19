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
    'name2',
    'image2',
    'cp',
    'rank',
    'cpu',
    'search',
    'usage'
  ],

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
      events: [],
      search: '',
      loading: true,
    }
  },

  computed: {
    searchPokemon() {
      search = this.search
      return this.events
        .filter(function (p) {
          return p.Pokemon1.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                 p.Pokemon2.toLowerCase().indexOf(search.toLowerCase()) !== -1
        })
        ;
    },
  },

  mounted() {
    var data = this;

    var cpSheet = new Miso.Dataset({
      importer : Miso.Dataset.Importers.GoogleSpreadsheet,
      parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
      key : "1IKPdv-h-DqB_lsECL4wsbgmQQTpGxn1E9vvJ9ftAKhc",
      worksheet : "2"
      // worksheet : "12"
    });

    var misodata = [];

    cpSheet.fetch({
      success : function() {
        cpSheet.where({
          rows : function (row) { return row.Placing != null; }
        }).each( function (row, index) {
          misodata.push(row);
        });

        data.events = misodata.reduce(function (r, v, i, a) {

          if (r.some(e => e.Pokemon1 === v.Pokemon1 && e.Pokemon2 === v.Pokemon2)) {
            r.find(e => e.Pokemon1 === v.Pokemon1 &&  e.Pokemon2 === v.Pokemon2).count++
          } else {
            r.push({
              Pokemon1:  v.Pokemon1,
              Pokemon2:  v.Pokemon2,
              Img1:  v.Img1,
              Img2:  v.Img2,
              count: 1,
              rank: 0
            })
          }
          return r;
        }, [])
        .sort((a,b) => (b.count - a.count))
        .map(function (v, i) {v.rank = i + 1; return v});

        data.loading = false;
      },

      error : function() {
        console.log("Are you sure you are connected to the internet?");
      }
    });
  }
});

// Teams page
const teamspage = Vue.component('teamspage', {
  template: '#teamspage',

  data () {
    return {
      events: [],
      loading: true,
      search: ''
    }
  },

  computed: {
    searchPokemon() {
      search = this.search
      return this.events
        .filter(function (p) {
          return p.Pokemon1.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                 p.Pokemon2.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                 p.Pokemon3.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                 p.Pokemon4.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                 p.Pokemon5.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                 p.Pokemon6.toLowerCase().indexOf(search.toLowerCase()) !== -1 
        })
        ;
    },
  },

  mounted () {
    var data = this;

    const cpSheet = new Miso.Dataset({
      importer : Miso.Dataset.Importers.GoogleSpreadsheet,
      parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
      key : "1IKPdv-h-DqB_lsECL4wsbgmQQTpGxn1E9vvJ9ftAKhc",
      worksheet : "2"
    });

    var misodata = []; 

    cpSheet.fetch({
      success : function() {
        cpSheet.where({
          rows : function (row) { return row.Placing != null; }
        }).each( function (row, index) {
          misodata.push(row);
        });
        data.events = misodata;
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

const percentfilter = Vue.filter("percentage", function(value, decimals) {
  if(!value) value = 0;
  if(!decimals) decimals = 0;

  value = value * 100;
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals) + "%";
});