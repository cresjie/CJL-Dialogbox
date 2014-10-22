// JavaScript Document
(function($,w){
	
	var AbstractModal = function(par){
		var emptyF = function(){};	
		var defaults = {
					contentCss:{width:350,height:250,padding:20},
					containerCss:{'z-index':9999999,position:'fixed'},
					onShow:emptyF,
					onClose:emptyF,
					afterShow:emptyF,
					afterClose:emptyF,
					overlay:false,
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
						
							template.$header.append('<h3>' + par.title +'</h3>');
							template.$header.append(template.$closeBtn);
							
						
						if(par.type){
							template.$contentWrapper.append(template.$contentType.addClass(par.type).css('width',60));
						}
						
						template.$content.append(par.content).css(defaults.contentCss);
						template.$contentWrapper.append(template.$content);	
						
						if(par.buttons){
							for(var k in par.buttons){
								
								var btn= par.buttons[k];
								$button = $('<button></button>');
								
								for(var att in btn)
									$button[att](btn[att]);
								template.$footerWrapper.append($button);
							}
							
							template.$footer.append(template.$footerWrapper);
							template.$container.append(template.$footer);
						}
						var width = (par.type?template.$contentType.outerWidth():0)+template.$content.outerWidth();
						
						//sets the width of header,contentWrapper,footer
						//this is to avoid broken animation in the jquery ui effects
						template.$container.append([template.$header,template.$contentWrapper,template.$footer])
							.css('width',width);
						template.$header.css('width',width);
						template.$contentWrapper.css('width',width);
						template.$footer.css('width',width);
		}
		var positionContainer = function(){
						if(typeof par.position == 'object')
							template.$container.css(par.position);
						else if(typeof par.position == 'function')
							par.position(template.$container);
						else
							template.$container.css($.centerLocation(template.$container));
		}
		var showContainer = function(){

						if(defaults.overlay){
							$('html').css('overflow','hidden');
						}


						template.$container.css(defaults.containerCss);
						defaults.onShow(template.$container); //calling callback
						
						if(typeof defaults.transitionIn == 'function')
							defaults.transitionIn(template.$container,defaults.afterShow);
						else if(typeof defaults.transitionIn  == 'object'){
							var transIn = defaults.transitionIn;
								transIn.mode = 'show';
								transIn.complete = defaults.afterShow;
							if(!template.$container[defaults.transitionIn.style])
								defaults.transitionIn.style = 'fadeIn';
							template.$container[defaults.transitionIn.style](transIn).attr('data-cjlDB-status','open');
						}
		}//end showContainer
		var closeAnimation = function(callback){

							if(defaults.overlay){
								$('html').css('overflow','auto');
							}
							
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
			};
		
		var addCloseEvent = function(callback){
						var c = function(){closeAnimation(callback)};
						template.$closeBtn.on('click',c);
						if(defaults.overlayOnClickClose){
							template.$overlay.on('click',c);
						}
		}//end addCloseEvent
		var remove = function(){
						template.$overlay.remove();
						template.$container.remove();
						defaults.afterClose();
		}
		for(var k in par)
				defaults[k] = par[k];
		this.defaults = defaults;
		this.template = template;
		this.addGist = addGist;
		this.addCloseEvent = addCloseEvent;
		this.closeAnimation = closeAnimation;
		this.positionContainer = positionContainer;
		this.remove = remove;
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
	
			modal.addGist(); 
			modal.addCloseEvent(modal.remove);
			
			if(par.overlay)
				$('body').append(modal.template.$overlay);
			
			$('body').append(modal.template.$container);
			modal.positionContainer();
			modal.showContainer();
			$.cjlDialog_count++;
				
	}
	$.extend({cjlDialog:cjlDialog,cjlDialog_count:0,centerLocation:centerLocation});
	$.fn.cjlModal = function(par){ 
		par.overlay = (typeof par.overlay === "undefined")?true:par.overlay;
		var modal = new AbstractModal(par);
			modal.template.$container = this;
			
		//public method
		this.open = function(){
			if(par.overlay){
				modal.addCloseEvent(function(){modal.template.$overlay.remove();modal.defaults.afterClose()});
				$('body').prepend(modal.template.$overlay.attr('z-index',999));
			}
			modal.positionContainer();
			modal.showContainer();
			return this;
		};
		this.close = function(){modal.closeAnimation(modal.defaults.afterClose); return this}
		
		return this;
	};
})(jQuery,this);