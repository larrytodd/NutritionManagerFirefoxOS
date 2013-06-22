
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Zepto provides nice js and DOM methods (very similar to jQuery,
    // and a lot smaller):
    // http://zeptojs.com/
    var $ = require('zepto');

    // Need to verify receipts? This library is included by default.
    // https://github.com/mozilla/receiptverifier
    require('receiptverifier');

    require('underscore');
    require('backbone');
    require('text');
    require('api');
    window.Recipe= Backbone.Model.extend({
        defaults:{
            title:'',
            ingredients:[{description:'',portion:''}]
        }
    });
    window.Ingredient = Backbone.Model.extend({
        defaults :{
            description:'',
            portion:''
        }
    });
    window.Header = Backbone.Model.extend({
        defaults:{
            header:''
        }
    });
    window.IngredientCollection= Backbone.Collection.extend({
        model:Ingredient
    });
    window.RecipeCollection = Backbone.Collection.extend({
        model:Recipe
    });
    window.InitialView = Backbone.View.extend({
        template:_.template($('#tpl-recipe-search-header').html()),
        render:function(eventName){
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            "keyup #txtSearch" : "searchRecipes"
        },
        searchRecipes:function(){
            var recipeCollection = new RecipeCollection();
            if($('#txtSearch').val().trim().length>0){
               api.getNutrtionixSearch($('#txtSearch').val());
                document.addEventListener("datareturned", function(e){
                    var data = e.detail.dataReturned.hits;
                    this.searchedView = new SearchedView({model: data});
                    $('#content').html(this.searchedView.render().el);
                    return false;
                });
            }
            $('#content').html('');
        }
    });
    window.SearchedView = Backbone.View.extend({
        template:_.template($('#tpl-recipe-searched').html()),
        render:function(eventName){
            $(this.el).html(this.template(this.model));
            return this;
        },
        events:{
            "click [name ='pRecipeItem']" : "recipeDetails"
        },
        recipeDetails: function(event){
            var target = event.target;
            app.detail(target.id);
            app.navigate('recipe/'+target.id,false);
            return false;
        }

    });
    window.DetailView = Backbone.View.extend({
        template:_.template($('#tpl-recipe-detail').html()),
        render: function(eventName){
            $(this.el).html(this.template(this.model));
            return this;
        },
        events:{
            "click .pack-icon-send" : "mailContact",
            "click [role='tab'] > a" : "filterDetail"
        },
        mailContact: function(event){
          api.getContacts();
          document.addEventListener("datareturned", function(e){
            alert(e.givenName[0]);
            return false;
          });
        },
        filterDetail: function(event){
            $("[name='filterTabs']").css('display','none');
            $("[role='tab']").attr('aria-selected','false');
            switch(event.target.id)
            {
                case 'hrefFilter2-1':
                    document.getElementById('divFiler2-1').style.display='inline';
                    break;
                case 'hrefFilter2-2':
                    document.getElementById('divFiler2-2').style.display='inline';
                    break;
                case 'hrefFilter2-3':
                    document.getElementById('divFiler2-3').style.display='inline';
                    break;
                default:
                    break;
            }
        }
    });
    window.HeaderView = Backbone.View.extend({
        template:_.template($('#tpl-header').html()),
        render: function(eventName){
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var AppRouter = Backbone.Router.extend({
        routes:{
            "":"search",
            "recipe/:id":"detail"
        },
        search:function(){
            this.initialView = new InitialView({model:new RecipeCollection()});
            $('#header').html(this.initialView.render().el);
        },
        detail:function(id){
            var recipeIdToPass = id.replace('rcp_','').replace('rcp2_','');
            api.getNutritionixDetails(recipeIdToPass);
            document.addEventListener('datareturned',function(e){
                var data = e.detail.dataReturned;
                this.header= new Header({header: data.item_name});
                this.headerView = new HeaderView({model:this.header});
                $('#header').html(this.headerView.render().el);
                this.detailView = new DetailView({model:data});
                $('#content').html(this.detailView.render().el);
            });
        }
    });
    var app=new AppRouter();
    Backbone.history.start();
});

