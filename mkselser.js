/*!
 * Ajax Autocomplete Selectbox, by Muammer Keleş.
V2
 */

; (function ($) {
    var defaults = {
        multipleSelect: false,
        singleSelect: true,
        minChar: 2,
        delay: 300,
        onchange: function () {
            
        },
        placeholder: "Select",
        searchHolder: "Search something",
        attributes: [],
        ajaxParams: {
            url: null,
            paramName: null,
            staticParams: null,
            dataType: null,
            cache: true,
            responsefields: null,
            responseKey: null,
            displayfields: [],
            valuekey:null,
            attributes: []
        },
        defaultdata: null //  {display:"venualdja ldkaj dlak dla",inputAttributes: { "venueid": "5" }},
    };

    /// $el = input element
    var SelectableSearchBox = function ($el, _opt) {
        var $options = $.extend({}, defaults, _opt);
        var $this = this;
        var _value = "";
        var panel = CreateSelSerObject($el);
        var focusIndex = -1;
        var cachedata = {
            data: {},
            timeout: 30000,
            data: {},
            remove: function (url) {
                delete cachedata.data[url];
            },
            exist: function (url) {
                return !!cachedata.data[url] && ((new Date().getTime() - cachedata.data[url]._) < cachedata.timeout);
            },
            get: function (url) {
                return cachedata.data[url].data;
            },
            set: function (url, newData, callback) {
                cachedata.remove(url);
                cachedata.data[url] = {
                    _: new Date().getTime(),
                    data: newData
                };
                if ($.isFunction(callback)) callback(newData);
            }
        };
        var selecteElement = null;
        panel.label.html($options.placeholder);
        panel.input.attr("placeholder", $options.searchHolder);

        //panel.input.on("keydown", function (keycode) {
        //    $(this).addClass("inp-loading");
        //});

        if ($options.ajaxParams != null) {

            if ($options.ajaxParams.url == null) {
                console.log("Ajax-Url wasn't defined!"); return false;
            }
            if ($options.ajaxParams.paramName == null) {
                console.log("paramName for Ajax-Url wasn't defined!"); return false;
            }
            if ($options.ajaxParams.responsefields == null) {
                console.log("responsefields for Ajax-Url wasn't defined!"); return false;
            }
            var keyCode = $.ui.keyCode;
            panel.input.on("keyup input", function (event) {
                switch (event.keyCode) {
                    case keyCode.PAGE_UP:
                        _keyEvent("previousPage", event);
                        break;
                    case keyCode.PAGE_DOWN:
                        _keyEvent("nextPage", event);
                        break;
                    case keyCode.UP:
                        _keyEvent("previous", event);
                        break;
                    case keyCode.DOWN:
                        _keyEvent("next", event);
                        break;
                    case keyCode.ENTER:

                        if (focusIndex > -1) {
                            event.preventDefault();
                            selectItem(event);
                        }
                        break;
                    case keyCode.TAB:

                        break;
                    case keyCode.ESCAPE:
                        if (panel.input.is(":visible")) {
                            close_it();
                            event.preventDefault();
                        }
                        break;
                    default:
                        $this._value = $(this).val();
                        _searchTimeout(event);
                        break;
                }
            });
        };

        if ($options.defaultdata != null) {
            var _dfdata = $options.defaultdata;
            var _df_display= $options.defaultdata.display;
            var _df_inp_attr = $options.defaultdata.inputAttributes;
            panel.label.html(_df_display);
            $.each(_df_inp_attr, function (x, y) {
                if (y != undefined && y != null && y != "") {
                    applySelect(x, y);
                }
            });
            //$options.onchange(_dfdata);
        }

        function _delay(handler, delay) {
            function handlerProxy() {
                return (typeof handler === "string" ? instance[handler] : handler)
                    .apply(instance, arguments);
            }
            var instance = this;
            return setTimeout(handlerProxy, delay || 0);
        };
        function _searchTimeout(event) {
            panel.input.addClass("inp-loading");
            if ($this._value.length < $options.minChar) {
                panel.input.removeClass("inp-loading");
                console.log("min char is less than val");
                return;
            }
            clearTimeout(this.searching);
            this.searching = _delay(function () {

                // Search if the value has changed, or if the user retypes the same value (see #7434)
                var equalValues = $this._value === panel.input.val(),
                    //menuVisible = $this.menu.element.is(":visible"),
                    modifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

                if (!equalValues || (equalValues && !modifierKey)) {
                    $this.selectedItem = null;
                    search(null, event);
                } else {
                    panel.input.removeClass("inp-loading");
                }

            }, $options.delay);
        };


        var search = function (value, event) {
            value = value != null ? value : $this._value; 
            if (value.length < $options.minChar) {
                panel.input.removeClass("inp-loading");
                console.log("min char is less than val", value);
                return;//this.close(event);
            }
            return _search(value); 
        }
        var _search = function (value) { 
            var _staticparams = "";
            if ($options.ajaxParams.staticParams != null) {
                $.each($options.ajaxParams.staticParams, function (si, sv) {
                    _staticparams += si + "=" + sv + "&";
                });
            };

            var $_uri = $options.ajaxParams.url + "?" + _staticparams + $options.ajaxParams.paramName + "=" + value;
            console.log("requested", $_uri);
            panel.input.addClass("inp-loading"); 
            $.ajax({
                url: $_uri, type: "GET",
                dataType: $options.ajaxParams.dataType,
                beforeSend: function () {
                    if ($options.ajaxParams.cache) {
                        if (cachedata.exist($_uri)) {
                            ShowResult(cachedata.get($_uri));
                            console.log("getting from cache");
                            return false;
                        }
                    }
                    return true;

                },
                success: function (_data) {
                     
                    var dt = _data;
                    if ($options.ajaxParams.responseKey != null && $options.ajaxParams.responseKey != "") {
                        dt = _data[$options.ajaxParams.responseKey];
                    }
                    if ($options.ajaxParams.cache && dt.length > 0) {
                        cachedata.set($_uri, dt);
                    }
                    console.log("CACHE DID NOT USE!");
                    
                    ShowResult(dt);

                }
            });

        }

        function ShowResult(dt) {
            focusIndex = -1;
            panel.container.find(".ul-res").html(""); 
            if (dt.length <= 0) {
                var obj = ["No result"];
                panel.container.find(".ul-res").append("<li class='litems' disabled> noresult</li>");
            } else { 

                $.each(dt, function (x, item) {
                    var displayfs="",attrs="";
                    $.each($options.ajaxParams.displayfields, function (x, y) {
                        displayfs += item[y] + " ";
                    });
                    $.each($options.ajaxParams.inputAttributes, function (x, y) {
                        attrs += " data-" + y + "='" + item[y] + "' ";
                    });
                    panel.container.find(".ul-res").append("<li class='litems' " + attrs + " > " + displayfs + "</li>");
                })
            }
            panel.input.removeClass("inp-loading");
        }

        panel.span.on("click", function () {
            $(this).toggleClass("active");
            panel.container.toggleClass("active");
            if (panel.container.hasClass("active")) {
                repointcontainer();
                panel.container.find(".res-input-box").focus();
            }
        });
        function repointcontainer() {
            var _stop = panel.span.offset().top;
            panel.container.css("width", panel.span.width());
            panel.container.css("left", panel.span.offset().left);
            panel.container.css("top", (_stop + panel.span.height()) - 10);
        };
        //function repointcontainer() {
        //    var _stop = panel.span.position().top;
        //    panel.container.css("width", panel.span.width());
        //    panel.container.css("left", 0);
        //    panel.container.css("top", (_stop + panel.span.height()) -10);
        //};
        //panel.container.on("focusout", function (focusEvent) {
        //    /console.log("secondTarget ", focusEvent.relatedTarget)
        //});
        panel.container.on("click", ".litems", function () { 
            if ($(this).attr("disabled")) return;
            var clickitem = $(this);
            panel.label.html($(this).html());
            selecteElement = $(this);
            $.each($options.ajaxParams.inputAttributes, function (x, y) { 
                applySelect(y, clickitem.attr("data-" + y));
            });
            focusIndex = $(this).index();
            focusItem(focusIndex);
            panel.span.trigger("click");
            $options.onchange(clickitem);

        });
        function applySelect(attrName, attrVal) {
            $el.attr("data-" + attrName, attrVal);
            if (attrName == $options.ajaxParams.valuekey) {
                // input value olarak atanan deger bu ise input value ayarlıyoruz
                $el.val(attrVal);
            }
        }
        function _isEventTargetInWidget(event) {
            //var par = $(event.target).parent();
            
            var menuElement = panel.container[0];
            var selectElement = panel.span[0];

            return event.target === selectElement ||
                event.target === menuElement ||
                $.contains(selectElement, event.target) || 
                $.contains(menuElement, event.target);
        };
      
        $(document).on("mousedown", function (e) {
            if (!_isEventTargetInWidget(e)) {
                close_it();
            }
        });
        function _keyEvent(keyEvent, event) {
            if (panel.container.is(":visible")) { 
                _move(keyEvent, event);
                // Prevents moving cursor to beginning/end of the text field in some browsers
                event.preventDefault();
            } 
        };
        function _move(direction, event) {
            switch (direction) {
                case "previous":
                    focusIndex--;
                    if (focusIndex < 0) {
                        focusIndex = panel.container.find("li").length-1;
                        panelMenuAnimate(panel.ulmenu.height());
                    }
                    focusItem(focusIndex);
                    break;
                case "next":
                    focusIndex++;
                    if (focusIndex > panel.container.find("li").length - 1) {
                        panelMenuAnimate(0);
                        focusIndex = 0;
                    }  
                    focusItem(focusIndex);
                    break;

                case "previousPage":
                    focusIndex -= 5;
                    if (focusIndex < 0) {
                        focusIndex = panel.container.find("li").length - 1;
                        panelMenuAnimate(panel.ulmenu.height());
                    }
                    focusItem(focusIndex);
                    break;
                case "nextPage":
                    focusIndex += 5;
                    if (focusIndex > panel.container.find("li").length - 1) {
                        panelMenuAnimate(0);
                        focusIndex = 0;
                    }
                    focusItem(focusIndex);
                    break;
            }
        };
        function panelMenuAnimate(st, speed) {
                panel.ulmenu.animate({
                    scrollTop: st
                }, speed == undefined ? 200 : speed);
        }
        function focusItem(focusIndex) {
            var item = panel.container.find("li").eq(focusIndex);
            panel.container.find("li.focus").removeClass("focus");
            item.addClass("focus");
            
            var itemtop = item.position().top;
            var itemheight = item.outerHeight();
            var ulpositiontop = panel.ulmenu.position().top;
            var ulheight = panel.ulmenu.outerHeight();
            if ((ulheight + ulpositiontop < itemtop + itemheight) ||(0 >itemtop - itemheight)) {
                panelMenuAnimate(itemtop);
            }
             

        }
        function selectItem() {
            panel.container.find(".litems.focus").trigger("click");
        };

        var close_it = function () {
            panel.span.removeClass("active");
            panel.container.removeClass("active");
        };
    };



    $.fn.selser = function (options) {
        return this.each(function () {
            var $el = $(this),
                selser;

            if ($el.hasClass("selser-inited")) return;
            $el.addClass("selser-inited");
            selser = new SelectableSearchBox($el, options);
        });
    };

})(jQuery);

var CreateSelSerObject = function (selv) {
    
    var _p = selv;

    var _span = $('<span/>');
    var _selection = $("<span/>")
    var _sel_single = $("<span/>")
    var _sel_render = $("<span/>")
    var _sel_arrow = $("<span/>")
    var _b_role = $("<b/>")


    var _res_container = $("<span/>");

    var _res_below = $("<span/>");
    var _res_input_cover = $("<span/>");
    var _res_input_box = $("<input/>");

    var _res_wrap = $("<span/>");
    var _ulres = $("<ul/>");
    var _litems = $("<li/>");


    _span.append(_selection.append(_sel_single.append(_sel_render, _sel_arrow.append(_b_role))));
    //$("body").append(_span);
    _span.insertAfter(_p);
    _p.addClass("gizle");
    _span.addClass("most-span");
    _selection.addClass("selection");
    _sel_single.addClass("sel-single");
    _sel_render.addClass("sel-render");
    _sel_arrow.addClass("sel-arrow");
    _b_role.addClass("b-role");
    _res_container.addClass("res-container");
    _res_below.addClass("res-below");
    _res_input_cover.addClass("res-input-cover")

    _res_input_box.addClass("res-input-box")

    _res_wrap.addClass("res-wrap");
    _ulres.addClass("ul-res");
    //_litems.addClass("litems");


    var _t = $(_selection).closest(".most-span");
    _t.find(".res-container")
    _res_container.append(_res_below.append(_res_input_cover.append(_res_input_box), _res_wrap.append(_ulres)));

    var _stop = _span.position().top  ; /// _span.height();
    
    _res_container.css("width", _span.width());
    _res_container.css("left", 0);
    _res_container.css("top", (_stop + _span.height())-10);
       
    $("body").append(_res_container)

    _p.hide();
    this.container = _res_container;
    this.ulmenu = _ulres;
    this.span= _span;
    this.label = _sel_render;
    this.input = _res_input_box;
    return this;
}