//                         //
// Basic app configuration //
//                         //

//https://sheets.googleapis.com/v4/spreadsheets/1z28nMvWohrDjOQ4WiGkmLBUVgC1XeQA4caS6L8jLsn4/values/CP-TOTAL!A1:E20000?key=AIzaSyC3FsbFxets0WTIJXOYC88vqQb-Bc6mZKg
const SHEET_ID = "1mpF1j7iDkzQzf9a1scwfwt9q3abapYg-Jspos_UtXRk";
const API_KEY = "AIzaSyC3FsbFxets0WTIJXOYC88vqQb-Bc6mZKg";

function getApiUrl (range) {
  return "https://sheets.googleapis.com/v4/spreadsheets/" 
    + SHEET_ID 
    + "/values/" 
    + range 
    + "?dateTimeRenderOption=FORMATTED_STRING&valueRenderOption=UNFORMATTED_VALUE&key=" 
    + API_KEY;
}


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
      begindate: "2018-09-04",
      enddate: "2019-08-31",
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
        return this.begindate === "2018-09-04" && this.enddate === "2019-08-31";
    },

    datesun () {
      return this.begindate === "2018-09-04" && this.enddate === "2019-01-07";
    },

    datemoon () {
      return this.begindate === "2019-01-08" && this.enddate === "2019-04-11";
    },

    dateultra () {
      return this.begindate === "2019-04-02" && this.enddate === "2019-08-31";
    },

    datecustom () {
      return !this.dateyear && !this.datesun && !this.datemoon && !this.dateultra;
    }
  },

  methods: {
    setdateyear: function () {
      this.begindate = "2018-09-04";
      this.enddate = "2019-08-31";
    },

    setdatesun: function () {
      this.begindate = "2018-09-04";
      this.enddate = "2019-01-07";
    },

    setdatemoon: function () {
      this.begindate = "2019-01-08";
      this.enddate = "2019-04-11";
    },

    setdateultra: function () {
      this.begindate = "2019-04-02";
      this.enddate = "2019-08-31";
    },

    setdatecustom: function () {
      this.begindate = "2018-09-04";
      this.enddate = new Date().toISOString().split('T')[0];
    }
  },

  mounted() {
    axios
      .get(getApiUrl("CP-TOTAL!B:E"))
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

// Event mixin

const eventMixin = {
  template: '#eventpage',

  data () {
    return {
      events: [],
      loading: true
    }
  },

  mounted () {

    axios
      .get(getApiUrl(this.range))
      .then(response => {

        var data = this;

        data.events = response.data.values
          .filter( row => { return row.length && row[0] !== '' && row[0] !== "Date" })
          .sort(
            function (a, b) {
              return new Date(b[0]) - new Date(a[0]) || a[17] - b[17];
            }
          )
          .reduce( 
            function (r, current, i, array) {
              let key = current[0] + current[1] + current[2]
              if ( !r[key] ) {
                r[key] = {
                  Date:     current[0],
                  Region:   current[1],
                  Country:  current[2],
                  Playlist: current[18],
                  teams:    [],
                }
              }

              let team = {}
              team["Player"]    = current[4]
              team["Placing"]   = current[3]
              team["Standing"]  = current[17]
              team["Pokemon 1"] = current[5]
              team["Pokemon 2"] = current[6]
              team["Pokemon 3"] = current[7]
              team["Pokemon 4"] = current[8]
              team["Pokemon 5"] = current[9]
              team["Pokemon 6"] = current[10]
              team["Img1"]      = current[11]
              team["Img2"]      = current[12]
              team["Img3"]      = current[13]
              team["Img4"]      = current[14]
              team["Img5"]      = current[15]
              team["Img6"]      = current[16]
              
              r[key].teams.push(team);

              return r; 
            }, {}
          )

        data.loading = false;
      })
  }
}

// Event pages 
const msspage = Vue.component('msspage', {
  mixins: [
    eventMixin
  ],

  data: function () {
    return {
      range: "Input-MSS"
    }
  }
})

const regpage = Vue.component('regpage', {
  mixins: [
    eventMixin
  ],

  data: function () {
    return {
      range: "Input-REG"
    }
  }
})

const natpage = Vue.component('natpage', {
  mixins: [
    eventMixin
  ],

  data: function () {
    return {
      range: "Input-INT"
    }
  }
})


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
