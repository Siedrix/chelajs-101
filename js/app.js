/* jshint asi:true */
/* global Backbone, _ */

var app = window.app = {}
var ENTER_KEY = 13

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
app.links = new Links()

app.LinkView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#link-template').html()),
  initialize: function () {
    this.listenTo(this.model, 'destroy', this.remove)
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()))
    return this
  }
})

app.AppView = Backbone.View.extend({
  el: '#linksapp',
  events: {
    'click #submit-control': 'createLink',
    'keypress #url-control': 'createLinkOnEnter',
  },
  initialize: function () {
    this.$title = this.$('#title-control')
    this.$url = this.$('#url-control')
    this.$main = this.$('#links-content')
    this.$list = this.$('#links-list')
    this.listenTo(app.links, 'all', this.render)
    this.listenTo(app.links, 'add', this.addOne)
  },
  render: function () {
  },
  addOne: function (link) {
    var view = new app.LinkView({model: link})
    this.$list.append(view.render().el)
  },
  newAttributes: function () {
    return {
      title: this.$title.val().trim(),
      url: this.$url.val().trim()
    }
  },
  hasData: function () {
    return this.$title.val().trim() && this.$url.val().trim()
  },
  cleanup: function () {
    this.$title.val('')
    this.$url.val('')
  },
  createLink: function () {
    if (this.hasData()) {
      app.links.create(this.newAttributes())
      this.cleanup()
    }
  },
  createLinkOnEnter: function(e) {
    console.log(e.which === ENTER_KEY)
    if (e.which === ENTER_KEY && this.hasData()) {
      app.links.create(this.newAttributes())
      this.cleanup()
    }
  }
})