// JavaScript Document
(function($,w){
	
	var AbstractModal = function(par){
		var emptyF = function(){},
			n = null;
		var privates = {modalType:'modal',index:0};	
		var defaults = {
					title:n,
					content:n,
					type:n,
					buttons:n,
					position:n,
					contentCss:{width:350,height:250,padding:20},
					containerCss:{'z-index':9999999,position:'fixed'},
					onShow:emptyF,
					onClose:emptyF,
					afterShow:emptyF,
					afterClose:emptyF,
					overlay:false,
					draggable:false,
					overlayOnClickClose:true,
					transitionIn:{style:'fadeIn'},
					transitionOut:{style:'fadeOut'}
		};
		var template = {
				$container:$("<div class='cjl-db-container' id='cjl_db_container_"+$.cjlDialog_count+"'></div>"),
				$header: $("<div class='cjl-db-header'></div>"),
				$closeBtn: $('<button class="cjl-db-close">&#10006;</button>'),
				$contentWrapper:$('<div class="cjl-db-content-wrapper"></div>'),
				$content:$('<div class="cjl-db-content"></div>'),
				$contentType:$('<div class="type"></div>'),
				$footer:$('<div class="cjl-db-footer"></div>'),
				$footerWrapper:$('<div class="cjl-db-footer-wrapper"></div>'),
				$overlay:$('<div class="cjl-db-overlay"></div>')
		};
		var addGist = function(){
						
							template.$header.append('<h3>' + defaults.title +'</h3>');
							template.$header.append(template.$closeBtn);
							
						
						if(defaults.type){
							template.$contentWrapper.append(template.$contentType.addClass(par.type).css('width',60));
						}
						
						template.$content.append(defaults.content).css(defaults.contentCss);
						template.$contentWrapper.append(template.$content);	
						
						if(defaults.buttons){
							for(var k in defaults.buttons){
								
								var btn= defaults.buttons[k];
								$button = $('<button></button>');
								
								for(var att in btn)
									$button[att](btn[att]);
								template.$footerWrapper.append($button);
							}
							
							template.$footer.append(template.$footerWrapper);
							template.$container.append(template.$footer);
						}
						var width = (defaults.type?template.$contentType.outerWidth():0)+template.$content.outerWidth();
						
						//sets the width of header,contentWrapper,footer
						//this is to avoid broken animation in the jquery ui effects
						template.$container.append([template.$header,template.$contentWrapper,template.$footer])
							.css('width',width);
						template.$header.css('width',width);
						template.$contentWrapper.css('width',width);
						template.$footer.css('width',width);
		}
		var positionContainer = function(){
						if(defaults.position){
							if(typeof defaults.position == 'object')
								template.$container.css(defaults.position);
							else if(typeof par.position == 'function')
								defaults.position(template.$container);
						}
						else
							template.$container.css($.centerLocation(template.$container));
		}
		var showContainer = function(){

						if(defaults.overlay){
							$('html').css('overflow','hidden');
						}

						$.cjlDialog_current.push(this); //saves a global copy
						privates.index = $.cjlDialog_current.length-1;

						template.$container.css(defaults.containerCss).attr({'data-cjldb-status':'open','data-cjldb-gindex':privates.index});

						(defaults.draggable)?template.$container.draggable():'';

						defaults.onShow(template.$container); //calling callback
						
						if(typeof defaults.transitionIn == 'function')
							defaults.transitionIn(template.$container,defaults.afterShow);
						else if(typeof defaults.transitionIn  == 'object'){
							var transIn = defaults.transitionIn;
								transIn.mode = 'show';
								transIn.complete = defaults.afterShow;
							if(!template.$container[defaults.transitionIn.style])
								defaults.transitionIn.style = 'fadeIn';

							template.$container[defaults.transitionIn.style](transIn);
						}
						
		}//end showContainer
		var closeAnimation = function(callback){
							callback = typeof callback !== 'function'?emptyF:callback;
							defaults.onClose(template.$container); //calling onClose callback
							
							if(typeof defaults.transitionOut == 'function')
								defaults.transitionOut(template.$container.attr('data-cjlDB-status','close'),remove);
							else if(typeof defaults.transitionOut == 'object'){
								var transOut = defaults.transitionOut;
									transOut.mode = 'hide';
									transOut.complete = callback;
								if(!template.$container[defaults.transitionOut.style]) //check if function exist
									defaults.transitionOut.style = 'fadeOut';		//sets to default

								template.$container[defaults.transitionOut.style](transOut).attr('data-cjlDB-status','close');
								
							}

							$.cjlDialog_current.splice(privates.index,1);
							updateGlobalCopy(privates.index);
			};
		
		var addCloseEvent = function(callback){
						
						template.$closeBtn.on('click',close);
						if(defaults.overlayOnClickClose){
							template.$overlay.on('click',close);
						}
		}//end addCloseEvent
		var addToBody = function(){
			var parent = $('body');
			
			if(defaults.overlay){
				if(privates.modalType == 'modal')
					parent.prepend(template.$overlay.attr('z-index',999));
				else
					parent.append(template.$overlay);
			}
			
			if(privates.modalType !== 'modal'){
				parent.append(template.$container);
			}
			
		}
		var updateGlobalCopy = function(i){
			for(;i<$.cjlDialog_current.length;i++){
				var c = $.cjlDialog_current[i];
				c.privates.index--;
				c.template.$container.attr('data-cjldb-gindex',c.privates.index);
				// console.log(i);

			}
			/*
			for(var i in $.cjlDialog_current){
				var c = $.cjlDialog_current[i];
				if(c.privates.index){ // make sure current index != 0, else it would result to - value if subtracted
					c.privates.index--;
					c.template.$container.attr('data-cjldb-gindex',c.privates.index);
				}
			}
			*/
		}
		var close = function(){
			closeAnimation(function(){
				if(defaults.overlay){
								$('html').css('overflow','auto');
								template.$overlay.remove();
							}
							if(privates.modalType != 'modal')
								template.$container.remove();
							
							defaults.afterClose();
			});
		}
		var options = function(opt){
			for(var k in par)
				defaults[k] = par[k];
		}
		//constructor exec
		options(par);
		this.defaults = defaults;
		this.privates = privates;
		this.template = template;
		this.options = options;
		this.addGist = addGist;
		this.addToBody = addToBody;
		this.addCloseEvent = addCloseEvent;
		this.closeAnimation = closeAnimation;
		this.positionContainer = positionContainer;
		this.close = close;
		this.showContainer = showContainer;
		
		return this;
	}
	
	var centerLocation = function($el){
			var left = (window.innerWidth/2) - ($el.outerWidth()/2),
				top = (window.innerHeight/2) - ($el.outerHeight()/2);
			
			return {top:top,left:left};
		}
	var cjlDialog = function(par){
		var modal = new AbstractModal(par);
			modal.privates.modalType = 'dialog';
			modal.addGist(); 
			modal.addCloseEvent();
			modal.addToBody(); 
			modal.positionContainer();
			modal.showContainer();
			$.cjlDialog_count++;
				
	}
	$.extend({cjlDialog:cjlDialog,cjlDialog_count:0,centerLocation:centerLocation,cjlDialog_current:[]});
	$.fn.cjlModal = function(par){ 
		if(!par)
			par = {};

			par.overlay = (typeof par.overlay === 'undefined')?true:par.overlay;
		var modal = new AbstractModal(par);	
			modal.template.$container = this;
			
		//public method
		this.open = function(){
			modal.addToBody();
			modal.addCloseEvent();
			modal.positionContainer();
			modal.showContainer();
			return this;
		};
		this.close = function(){
			modal.closeAnimation();
			return this
		}
		this.options = function(opt){modal.options(opt); return this;}
		return this;
	};

	//painless style modal
	$(document).click(function(e){
		var $el = $(e.target);
		
		switch( $el.attr('data-cjlmodal') ){
			case 'open':
				e.preventDefault();
				$( $el.attr('href') ).cjlModal( eval('('+$el.attr('data-cjlmodal-opt')+')' ) ).open();
				break;
			case 'close':
				e.preventDefault();
				$.cjlDialog_current[$el.parents('*[data-cjldb-status="open"]').attr('data-cjldb-gindex')].close();
		}
		
	}).keyup(function(e){
		switch(e.keyCode){
			case 27:
				if($.cjlDialog_current.length)
					$.cjlDialog_current[$.cjlDialog_current.length-1].close();
				break;
		}
	});


})(jQuery,this);