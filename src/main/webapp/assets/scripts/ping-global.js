
/*  START: function fnSelect(objId)  */
// Text selection function - replacing flash copy/paste
// http://stackoverflow.com/questions/1173194/select-all-div-text-with-single-mouse-click
// To use it, attach this to the html element -- onClick="fnSelect('element-id')" id="element-id" --
function fnSelect(objId)
{
   fnDeSelect();
   if (document.selection) 
   {
      var range = document.body.createTextRange();
      range.moveToElementText(document.getElementById(objId));
      range.select();
   }
   else if (window.getSelection) 
   {
      var range = document.createRange();
      range.selectNode(document.getElementById(objId));
      window.getSelection().addRange(range);
   }
}
function fnDeSelect() 
{
   if (document.selection)
             document.selection.empty();
   else if (window.getSelection)
              window.getSelection().removeAllRanges();
}
/*  END: function fnSelect(objId)  */


// feedback title strings for ease of configuration
var feedbackTitle = '<h1>Feedback</h1>';
var feedbackResponseTitle = '<h1>Thanks for your feedback!</h1><h4>Someone will be in touch if a response is required.</h4>';
var loginTitle = '<h1>Sign In</h1>';
var registrationTitle = '<h1>Create an IdP account</h1>';

// div text selection function from: (note L: previous, still used)
// http://www.ryantetek.com/2010/02/selecting-text-inside-html-elements-with-jquery/
var selectText = function( text ) {
	if( $.browser.msie ) {
		var range = document.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	}
	else if( $.browser.mozilla || $.browser.opera ) {
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	}
	else if( $.browser.safari ) {
		var selection = window.getSelection();
		selection.setBaseAndExtent(text, 0, text, 1);
	}
};

var initHelpTooltips = function() {
	var qtip = {
			position: {
				my: 'left center', 
				at: 'right center',
				adjust: {
					y: 2
				}
			},
			style: {
				classes: 'ui-tooltip-rounded ui-tooltip-shadow',
				tip: {
					color: '#353533',
					width: 9,
					height: 16
				}
			}
	   	};
	$('a.ping-help').qtip( qtip );
	$("a.ping-help").attr("tabindex", "-1");
	$('a.ping-help-text').qtip( qtip );
	$('a.ping-help[wicket\\:id!="helplink"]').attr('href', 'javascript:void(0);');
};

var initSamplePanels = function() {
	// init with no default selected tab (panel hidden)
	$('.ping-sample-panel').tabs( {
		selected: -1,
		collapsible: true,
		fx: {
			height: 'show',
			opacity: 'show'
		}
	} );

	// auto-select sample code on focus
	$('.ping-sample-panel .ping-sample-code code').click(
		function( e ) {
			selectText( this );
		}
	);
};

/* id: the ID of the element to attach messages to */
var attachFeedbackMessages = function(id, level, message) {
	var $input = $('#' + id);
	$parent = $input.parents('div.control-group');
	
	// Mark the parent as having errors.
	if (!$parent.hasClass('error')) {
		$parent.addClass('error');
	}
	
	$feedbackContainer = $input.siblings('span.feedbackContainer');
	
	// Add the feedback panel if it hasn't been added already.
	if ($feedbackContainer.children('div.feedbackPanel').length == 0) {
		$feedbackContainer.append('<div class="feedbackPanel alert alert-error"><ul class="feedbackPanel"></ul></div>');
	}
	
	$feedbackPanel = $feedbackContainer.children('div.feedbackPanel').children('ul.feedbackPanel');
	
	$feedbackPanel.append('<li class="feedbackPanel' + level + '">' +
			'<span class="feedbackPanel' + level + '">' +
			message +
			'</span>' +
			'</li>');
};
/* id: the ID of the element to remove messages from */
var removeFeedbackMessages = function(id) {
	var $input = $('#' + id);
    $input.parents('div.control-group').removeClass('error');
    $input.siblings('span.feedbackContainer').children('div.feedbackPanel').remove();
};

var setViewMode = function(id) {
	var $span = $('#' + id);
	$span.siblings('.field-val').html($('#' + id).html());
	$span.siblings('.field-val').show();
	
	// look up the inline help link and hide it in view mode
	$span.siblings('.bt-inln-hlp').css('visibility', 'hidden');
	
	// remove the 'required-f' class from the label field in the .row.form-line group
	$span.closest('.row.form-line').find('label.required-f').removeClass('required-f');
	
	// remove the 'required-line' class from the parent (for the old-style forms)
	$span.parent('div.required-line').removeClass('required-line');
};

// workaround for IE 7 & 8 to trigger the onchange event
var triggerOnChangeOnClick = function(radioName) {
	if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
		$("input[name=" + radioName + "]:radio, input[name=" + radioName + "]:checkbox").bind("click", function(event) {
			event.preventDefault();
			$(this).trigger("change");
		});
	}
};

jQuery.fn.limitMaxlength = function(options) {
	var settings = jQuery.extend(
			{ attribute: "maxlength", onLimit: function(){}, onEdit: function(){} },
			options);
  
	// Event handler to limit the textarea
	var onEdit = function() {
		var textarea = jQuery(this);
		var maxlength = parseInt(textarea.attr(settings.attribute));
		
		if (textarea.val().length > maxlength) {
			textarea.val(textarea.val().substr(0, maxlength));
			
			// Call the onlimit handler within the scope of the textarea
			jQuery.proxy(settings.onLimit, this)();
		}

		// Call the onEdit handler within the scope of the textarea
		jQuery.proxy(settings.onEdit, this)(maxlength - textarea.val().length);
	};

	this.each(onEdit);

	return this.keyup(onEdit).keydown(onEdit).focus(onEdit);
};

var setupHelpLinksAndScrollbar = function() {
	if (jQuery.isFunction(jQuery.fn.mCustomScrollbar) && $(".page-help-block").length > 0) {
		if (! $(".page-help-block").hasClass("mCustomScrollbar")) {
			$(".page-help-block").mCustomScrollbar();
		}
		
	    // when the "?" button is clicked navigate to the corresponding help section
	    $(".bt-inln-hlp").unbind("click").bind("click", function(event) {
	        event.preventDefault();
	
	        var selector = "#" + $(this).parent().parent().attr("helpid");
	        $(".page-help-block").mCustomScrollbar("scrollTo", selector);
	        $(".hp-item-selected").removeClass("hp-item-selected");
	        $(selector).addClass("hp-item-selected");
	        
	        $(".but-ih-active").removeClass("but-ih-active");
	        $(this).addClass("but-ih-active");
	        
	        $(this).blur();
	    });
	}
};
var setupHelpHeight = function() {
	var help = $(".page-help");
	if (help.length > 0) {
		var helpBlock = $(".page-help-block");
		
		// first of all, reset the help height and let the browser redraw the rest of the page
		helpBlock.height("");
		help.height("100px");
		
		var helpTop = help.position().top;
		var helpPaddingTop = parseInt(help.css("paddingTop"), 10);
		var helpMarginTop = parseInt(help.css("marginTop"), 10);
		
		var pageContent = $(".blk-page-content");
		var pageContentPaddingBottom = parseInt(pageContent.css("paddingBottom"), 10);
		var pageContentMarginBottom = parseInt(pageContent.css("marginBottom"), 10);
		
		var footer = $(".pingfooter");
		var footerTop = footer.position().top;
		var footerPaddingTop = parseInt(footer.css("paddingTop"), 10);
		var footerMarginTop = parseInt(footer.css("marginTop"), 10);
        
		var helpHeight = footerTop -  Math.abs(Math.min(footerMarginTop, 0)) - footerPaddingTop
				- pageContentPaddingBottom - pageContentMarginBottom
				- helpTop - helpPaddingTop - helpMarginTop
				- 10;
		help.height(helpHeight + "px");
		
		// now that we've set the height on the help container,
		// do the same thing with the help block
		var helpTitle = $(".page-help-title");
		var helpTitleHeight = helpTitle.height();
		var helpTitleMarginTop = parseInt(helpTitle.css("marginTop"), 10);
		var helpTitleMarginBottom = parseInt(helpTitle.css("marginBottom"), 10);
		
		var helpBlockHeight = helpHeight - helpTitleHeight - helpTitleMarginTop - helpTitleMarginBottom;
		helpBlock.height(helpBlockHeight + "px");
	}
};

$(document).ready(
	function() {
		// initialize tooltips (if present)
		if( $('a.ping-help').length > 0 || $('a.ping-help-text').length > 0 ) {
			initHelpTooltips();
		}

		// initialize tabbed panels (if present)
		if( $('.ping-sample-panel').length > 0 ) {
			initSamplePanels();
		}

		$('textarea[maxlength]').limitMaxlength({ });

		$('input[placeholder], textarea[placeholder]').placeholder();
		
		// fix the file input width issue in FF
		$('div.uploader > span.filename').click(
				function( e ) {
					$(this).siblings('input[type="file"]').click();
				}
			);
		$('div.uploader > span.action').click(
				function( e ) {
					$(this).siblings('input[type="file"]').click();
				}
			);
	
		// the HTML page containing such element has its own firstFocus policy
		if( $('#accordion').length == 0 ) {
			$('.firstFocus').focus();
		}
		
		//if ($('#supportAndKnowledgeBaseContainer')) {
		//	$('#supportAndKnowledgeBaseContainer').delay(500).animate({bottom: '0'}, 1000);
		//}
		
		jQuery.fn.center = function () {
			  var w = $(window);
			  this.css({
			    'position':'absolute',
			    'top':Math.abs(((w.height() - this.outerHeight()) / 2) + w.scrollTop()),
			    'left':Math.abs(((w.width() - this.outerWidth()) / 2) + w.scrollLeft())
			  });
			  return this;
		  };
	}
);
(function($) {
    $(window).load(function() {
        setupHelpLinksAndScrollbar();
		// setupHelpHeight();
    	// $(window).resize(setupHelpHeight);
    });
})(jQuery);


var scrollToFeedback = function(feedbackId) {
	$.scrollTo("#" + feedbackId, 500);
};

(function($) {
	
	$.fn.forceRedraw = function(brutal, ie8only) {
		if (ie8only && !($.browser.msie && $.browser.version.substr( 0, 1 ) == 8))
			return;

		//this fix works for most browsers. it has the same effect as el.className = el.className.
		$(this).addClass('forceRedraw').removeClass('forceRedraw');
		
		//sometimes for absolute positioned elements the above fix does not work.
		//there's still a "brutal" way to force a redraw by changing the padding.
		if(brutal) {
			var paddingLeft = $(this).css('padding-left');
			var parsedPaddingLeft = parseInt(paddingLeft, 10);
			$(this).css('padding-left', ++parsedPaddingLeft);
			
			//give it some time to redraw
			window.setTimeout($.proxy(function() {
				//change it back
				$(this).css('padding-left', paddingLeft);
			}, this), 1);		
		}

		return this;
		
	};
	
})(jQuery);

$.extend($.fn.disableTextSelect = function() {
    return this.each(function(){
        if($.browser.mozilla){//Firefox
            $(this).css('MozUserSelect','none');
        }else if($.browser.msie){//IE
            $(this).bind('selectstart',function(){return false;});
        }else{//Opera, etc.
            $(this).mousedown(function(){return false;});
        }
    });
});

jQuery.fn.scrollMinimal = function(smooth) {
  var cTop = this.offset().top;
  var cHeight = this.outerHeight(true);
  var windowTop = $(window).scrollTop();
  var visibleHeight = $(window).height();

  if (cTop < windowTop) {
    if (smooth) {
      $('body').animate({'scrollTop': cTop + 'px'}, 250);
    } else {
      $(window).scrollTop(cTop);
    }
  } else if (cTop + cHeight > windowTop + visibleHeight) {
    if (smooth) {
      $('body').animate({'scrollTop': (cTop - visibleHeight + cHeight) + 'px'}, 250);
    } else {
      $(window).scrollTop(cTop - visibleHeight + cHeight);
    }
  }
};
