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
    'cpu',
    'search'
  ],

  computed: {
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
    }
  },

  computed: {

    searchPokemon() {
      return this.pokemon
        .filter(function (p) {
          return p.cp > 0
        })
        .sort(function (a, b) {
          return b.cp - a.cp;
        })
        ;
    },
  },

  mounted() {
    var data = this;

    var cpSheet = new Miso.Dataset({
      importer : Miso.Dataset.Importers.GoogleSpreadsheet,
      parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
      key : "1IuI2G-Jon4fZQ61p4e0eOLFv-GZ-q7w7RHphmfxpLoU",
      worksheet : "6"
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
      key : "10N_ttYQ66UfsKrIDckxk93g9FXjBDQe9kd4GfhLiUCo",
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
