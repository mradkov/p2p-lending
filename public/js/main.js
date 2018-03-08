jQuery(document).ready(function () {

    var ua = navigator.userAgent.toLowerCase();
    if ((ua.indexOf("safari/") !== -1 && ua.indexOf("windows") !== -1 && ua.indexOf("chrom") === -1) || is_touch_device())
    {

        jQuery("html").css('overflow', 'auto');

        jQuery(".scroll-top").click(function () {
            jQuery('html, body').animate({scrollTop: 0}, 2000);
            return false;
        });

        jQuery('.post-num-comments a').click(function (e) {
            e.preventDefault();
            jQuery('html, body').animate({scrollTop: jQuery(this.hash).offset().top}, 2000);
            return false;
        });
    } else
    {
        jQuery("html").niceScroll({cursorcolor: "#CDC8C1", scrollspeed: 100, mousescrollstep: 80, cursorwidth: "12px", cursorborder: "none", cursorborderradius: "0px"});

        //Scroll Top animation
        jQuery(".scroll-top").click(function () {
            jQuery("html").getNiceScroll(0).doScrollTop(0);
        });

        //Smooth scroll on single post (comments)
        jQuery('.post-num-comments a').click(function (e) {
            e.preventDefault();
            jQuery("html").getNiceScroll(0).doScrollTop(jQuery(this.hash).offset().top);
        });
    }

    jQuery(".site-content").fitVids();

    //Placeholder show/hide
    jQuery('input, textarea').focus(function () {
        jQuery(this).data('placeholder', jQuery(this).attr('placeholder'));
        jQuery(this).attr('placeholder', '');
    });
    jQuery('input, textarea').blur(function () {
        jQuery(this).attr('placeholder', jQuery(this).data('placeholder'));
    });

    //Fix for default menu
    jQuery('.default-menu ul').addClass('main-menu sm sm-clean');

});


$(document).ready(function () {

    //Fix for logo holder
    jQuery('.logo-holder').css({'left': (jQuery('body').width() - jQuery('.logo-holder img').outerWidth()) / 2, 'bottom': 0 - (jQuery('.logo-holder img').outerHeight() / 2)});

//Set menu
    jQuery('.main-menu').smartmenus({
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8,
        markCurrentItem: true
    });

    var $mainMenu = jQuery('.main-menu').on('click', 'span.sub-arrow', function (e) {
        var obj = $mainMenu.data('smartmenus');
        if (obj.isCollapsible()) {
            var $item = jQuery(this).parent(),
                    $sub = $item.parent().dataSM('sub');
            $sub.dataSM('arrowClicked', true);
        }
    }).bind({
        'beforeshow.smapi': function (e, menu) {
            var obj = $mainMenu.data('smartmenus');
            if (obj.isCollapsible()) {
                var $menu = jQuery(menu);
                if (!$menu.dataSM('arrowClicked')) {
                    return false;
                }
                $menu.removeDataSM('arrowClicked');
            }
        }
    });



//Show-Hide header sidebar
    jQuery('#toggle').on("click", multiClickFunctionStop);

    jQuery('.carousel_pagination').each(function () {
        var pagination_width = jQuery(this).width();
        var windw_width = jQuery('.testimonial_slider_holder').width();
        jQuery(this).css("margin-left", (windw_width - pagination_width) / 2);
    });


    //PrettyPhoto initial
    jQuery('a[data-rel]').each(function () {
        jQuery(this).attr('rel', jQuery(this).data('rel'));
    });

    jQuery("a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed: 'fast', /* fast/slow/normal */
        slideshow: false, /* false OR interval time in ms */
        autoplay_slideshow: false, /* true/false */
        opacity: 0.80, /* Value between 0 and 1 */
        show_title: true, /* true/false */
        allow_resize: true, /* Resize the photos bigger than viewport. true/false */
        default_width: 1280,
        default_height: 720,
        counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
        theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
        hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
        wmode: 'opaque', /* Set the flash wmode attribute */
        autoplay: true, /* Automatically start videos: True/False */
        modal: false, /* If set to true, only the close button will close the window */
        overlay_gallery: false, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
        keyboard_shortcuts: true, /* Set to false if you open forms inside prettyPhoto */
        deeplinking: false,
        social_tools: false,
        iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
        changepicturecallback: function () {
            if (!is_touch_device()) {
                var ua = navigator.userAgent.toLowerCase();
                if (!(ua.indexOf("safari/") !== -1 && ua.indexOf("windows") !== -1 && ua.indexOf("chrom") === -1))
                {
                    jQuery("html").getNiceScroll().remove();
                    jQuery("html").css("cssText", "overflow: hidden !important");
                }
            }
        },
        callback: function () {
            if (!is_touch_device()) {
                var ua = navigator.userAgent.toLowerCase();
                if (!(ua.indexOf("safari/") !== -1 && ua.indexOf("windows") !== -1 && ua.indexOf("chrom") === -1))
                {
                    jQuery("html").niceScroll({cursorcolor: "#CDC8C1", scrollspeed: 100, mousescrollstep: 80, cursorwidth: "12px", cursorborder: "none", cursorborderradius: "0px"});
                }
            }
        }
    });

    jQuery('.doc-loader').fadeOut('fast');

});


jQuery(window).resize(function () {

    //Fix for logo holder
    jQuery('.logo-holder').css({'left': (jQuery('body').width() - jQuery('.logo-holder img').outerWidth()) / 2, 'bottom': 0 - (jQuery('.logo-holder img').outerHeight() / 2)});

//Fix for logo holder on single post
    jQuery('.single-post .logo-holder').css({'left': (jQuery('body').width() - jQuery('.logo-holder img').outerWidth()) / 2, 'top': 0 - (jQuery('.logo-holder img').outerHeight() / 2)});


    jQuery('.carousel_pagination').each(function () {
        var pagination_width = jQuery(this).width();
        var windw_width = jQuery('.testimonial_slider_holder').width();
        jQuery(this).css("margin-left", (windw_width - pagination_width) / 2);
    });

    // Fix for Gallery Item size
    var doc_width = jQuery('#content').width();

    var elemnt_width = Math.floor(doc_width / 3);

    if (doc_width < 960)
    {
        elemnt_width = Math.floor(doc_width / 2);
    }

    jQuery('.grid-sizer, .grid-item.p_one_third').width(elemnt_width);
    jQuery('.grid-item.p_two_third').width(2 * elemnt_width);

    //Fix for gallery item text
    jQuery('.gallery-text-holder').each(function () {
        jQuery(this).find('p').css('margin-top', jQuery(this).height() / 2);
    });

});

//------------------------------------------------------------------------
//Helper Methods -->
//------------------------------------------------------------------------


var multiClickFunctionStop = function (e) {
    jQuery('#toggle').off("click");
    jQuery('#toggle').toggleClass("on");
    if (jQuery('#toggle').hasClass("on"))
    {
        jQuery('#header-main-menu').fadeIn(function () {
            if (!is_touch_device()) {
                var ua = navigator.userAgent.toLowerCase();
                if (!(ua.indexOf("safari/") !== -1 && ua.indexOf("windows") !== -1 && ua.indexOf("chrom") === -1))
                {
                    jQuery("html").getNiceScroll().remove();
                }
            }
            jQuery("html").css("cssText", "overflow: hidden !important");
            jQuery('#toggle').on("click", multiClickFunctionStop);
        });
    } else
    {
        jQuery('#header-main-menu').fadeOut(function () {
            jQuery('#toggle').on("click", multiClickFunctionStop);
            if (!is_touch_device()) {
                var ua = navigator.userAgent.toLowerCase();
                if (!(ua.indexOf("safari/") !== -1 && ua.indexOf("windows") !== -1 && ua.indexOf("chrom") === -1))
                {
                    jQuery("html").niceScroll({cursorcolor: "#CDC8C1", scrollspeed: 100, mousescrollstep: 80, cursorwidth: "12px", cursorborder: "none", cursorborderradius: "0px"});
                }
            } else
            {
                jQuery("html").css("cssText", "overflow: auto");
            }
        });
    }
};

function is_touch_device() {
    return !!('ontouchstart' in window);
}

jQuery(window).bind("scroll", function () {
    if (jQuery(this).scrollTop() > 700) {
        jQuery('.scroll-top').fadeIn(500);
    } else
    {
        jQuery('.scroll-top').fadeOut(500);
    }
});