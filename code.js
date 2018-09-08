//                         //
// Basic app configuration //
//                         //

//https://sheets.googleapis.com/v4/spreadsheets/1z28nMvWohrDjOQ4WiGkmLBUVgC1XeQA4caS6L8jLsn4/values/CP-TOTAL!A1:E20000?key=AIzaSyC3FsbFxets0WTIJXOYC88vqQb-Bc6mZKg
const SHEET_ID = "1z28nMvWohrDjOQ4WiGkmLBUVgC1XeQA4caS6L8jLsn4";
const API_KEY = "AIzaSyC3FsbFxets0WTIJXOYC88vqQb-Bc6mZKg";
const API_URL = "https://sheets.googleapis.com/v4/spreadsheets/" + SHEET_ID + "/values/CP-TOTAL!B1:E20000?dateTimeRenderOption=FORMATTED_STRING&valueRenderOption=UNFORMATTED_VALUE&key=" + API_KEY;

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

    dateyear () {
        return this.begindate === "2018-01-01" && this.enddate === "2018-12-31";
    },

    datepreintimiroar () {
      return this.begindate === "2018-01-01" && this.enddate === "2018-03-07";
    },

    dateintimiroar () {
      return this.begindate === "2018-03-08" && this.enddate === "2018-12-31";
    },

    datecustom () {
      return !this.dateyear && !this.dateintimiroar && !this.datepreintimiroar;
    }
  },

  methods: {
    setdateyear: function () {
      this.begindate = "2018-01-01";
      this.enddate = "2018-12-31";
    },

    setdatepreintimiroar: function () {
      this.begindate = "2018-01-01";
      this.enddate = "2018-03-07";
    },

    setdateintimiroar: function () {
      this.begindate = "2018-03-08";
      this.enddate = "2018-12-31";
    },

    setdatecustom: function () {
      this.begindate = "2018-01-01";
      this.enddate = new Date().toISOString().split('T')[0];
    }
  },


  mounted() {
    axios
      .get(API_URL)
      .then(response => {
        var data = this;
        data.pokemon = response.data.values.map( function (current, index, array) {
          poke = {}
          if (index !== 0) {
            poke[array[0][0]] = current[0]
            poke[array[0][1]] = current[1]
            poke[array[0][2]] = current[2]
            poke[array[0][3]] = current[3]
          }
          return poke
        });
        data.loading = false;
      })
  }

});

// MSS page
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
      key : "1z28nMvWohrDjOQ4WiGkmLBUVgC1XeQA4caS6L8jLsn4",
      worksheet : "1"
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
      key : "1z28nMvWohrDjOQ4WiGkmLBUVgC1XeQA4caS6L8jLsn4",
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

// Nats page
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
      key : "1z28nMvWohrDjOQ4WiGkmLBUVgC1XeQA4caS6L8jLsn4",
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
