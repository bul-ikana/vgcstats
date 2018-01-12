// jQuery stuff

$(function () {
  $('[data-toggle="popover"]').popover({ trigger: "click hover" })
  $('#submit').click(function () {
    alert("Register coming soon!");
  });
})

// Vue stuff

var sheetUrl = "";

var pokecard = Vue.component('pokecard', {
  template: '#pokecard',
  props: [
    'name',
    'image',
    'cp',
    'cpwu',
  ]
});

var app = new Vue({
  el: '#app',
  data: function () {
    return {
        pokemon: [
            {
                name: 'Landorus-T',
                image: 'https://www.serebii.net/art/th/645-s.png',
                cp: 282,
                cpwu: 55.51,
            },
            {
                name: 'Tapu Fini',
                image: 'https://www.serebii.net/art/th/788.png',
                cp: 215,
                cpwu: 42.32,
            },
            {
                name: 'Amoongus',
                image: 'https://www.serebii.net/art/th/591.png',
                cp: 182,
                cpwu: 35.83,
            },
            {
                name: 'Zapdos',
                image: 'https://www.serebii.net/art/th/145.png',
                cp: 150,
                cpwu: 29.53,
            },
            {
                name: 'Tapu Bulu',
                image: 'https://www.serebii.net/art/th/787.png',
                cp: 137,
                cpwu: 26.97,
            },
            {
                name: 'Snorlax',
                image: 'https://www.serebii.net/art/th/143.png',
                cp: 115,
                cpwu: 22.64,
            },
            {
                name: 'M-Charizard Y',
                image: 'https://www.serebii.net/art/th/6-my.png',
                cp: 114,
                cpwu: 22.44,
            },
            {
                name: 'Tapu Lele',
                image: 'https://www.serebii.net/art/th/786.png',
                cp: 107,
                cpwu: 21.06,
            },
        ]
    }
  },
  mounted() {
      $.get({
        url: sheetUrl,
        jsonp: "callback",
        dataType: "jsonp",
        success: function( data ) {
            console.log( data.feed );
        }
      });
  }
});
