/* jshint asi:true */
/* global Backbone, _ */

'use strict';

var app = window.app = {}
var ENTER_KEY = 13

$(function () {
  new app.AppView()
  Backbone.history.start()
})

var socket = window.io.connect();

socket.on('link:add', function(data){
  window.app.links.add(data)
})

socket.on('link:remove', function(id){
  var links = window.app.links.where({_id:id})
  links.forEach(function(link){
    link.destroy()
  })
})

app.Link = Backbone.Model.extend({
  idAttribute: '_id',
  defaults: {
    url: '',
    title: ''
  }
})

var LinkRouter = Backbone.Router.extend({})
app.router = new LinkRouter()

var Links = Backbone.Collection.extend({
  model: app.Link,
  url: '/links'
  // localStorage: new Backbone.LocalStorage('Link')
})
app.links = new Links()

app.LinkView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#link-template').html()),
  events: {
    'click .delete': 'removeItem',
  },
  initialize: function () {
    this.listenTo(this.model, 'destroy', this.remove)
    this.listenTo(this.model, 'change', this.render)
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()))
    return this
  },
  removeItem: function() {
    this.model.destroy()
  }
})

app.AppView = Backbone.View.extend({
  el: '#linksapp',
  events: {
    'click #submit-control': 'createLink',
    'keypress #url-control': 'createLinkOnEnter'
  },
  initialize: function () {
    this.$title = this.$('#title-control')
    this.$url = this.$('#url-control')
    this.$main = this.$('#links-content')
    this.$list = this.$('#links-list')
    this.listenTo(app.links, 'sync', this.render)
    this.listenTo(app.links, 'add', this.addOne)

    app.links.fetch({reset: true})
  },
  render: function () {
    this.$list.empty()
    var self = this
    app.links.each(function (link) {
      var view = new app.LinkView({model: link})
      self.$list.append(view.render().el)
    })
  },
  addOne: function (link) {
    console.log('Adding link');
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
    if (e.which === ENTER_KEY && this.hasData()) {
      app.links.create(this.newAttributes())
      this.cleanup()
    }
  }
})
