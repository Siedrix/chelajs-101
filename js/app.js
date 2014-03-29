/* jshint asi:true */
/* global Backbone */

var app = window.app || {}
var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function () {
  'use strict';
  new app.AppView()
  Backbone.history.start()
})

app.Link = Backbone.Model.extend({
  defaults: {
    url: '',
    title: ''
  }
})

var LinkRouter = Backbone.Router.extend({
  
})
app.LinkRouter = new LinkRouter()

var Links = Backbone.Collection.extend({
  model: app.Link,
})
app.Links = new Links()

app.AppView = Backbone.View.extend({
  el: '#linksapp',
  events: {
    'keypress #newlink': 'createOnEnter',
  },
  newAttributes: function () {
    return {
      title: this.$input.val().trim(),
      url: this.$url.val().trim()
    }
  },
  createOnEnter: function (e) {
    if (e.which === ENTER_KEY && this.$input.val().trim()) {
      app.links.create(this.newAttributes())
    }
  }
})