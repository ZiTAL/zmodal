/**
 * @author zital
 * 
 * zmodal: modal box
 * license: GPL 3.0
 * version: 0.0.3
 * based on subModal: can be downloaded from http://gabrito.com/files/subModal/
 */

var zmodal = function()
{
	// public properties
	this.title;
	this.width;
	this.height;
	this.type;
	this.content;
	
	// private properties
	this.browser;
	this.background;
	this.modal;
	this.events;
	this.tags = new Array('embed');	

	// public events

	// main event
	this.main = function()
	{
		var t = this;
		// hidde this.tags elements
		new recursive(document.body, t.tags, function(node)
			{
				var div = document.createElement('div');								
				div.style.width = getSize(node, 'width')+"px";	
				div.style.height = getSize(node, 'height')+"px";							
				div.style.top = getPosition(node, 'top')+"px";
				div.style.left = getPosition(node, 'left')+"px";
				div.style.display = 'block';
				addClass(node, 'zhidden');
				node.parentNode.insertBefore(div, node);
			}
		);
		// get browser
		this.browser = getBrowser();
		// set new events for web
		setEvents.call(this);
		// set modal window
		setModal.call(this);
	};
	
	this.close = function(t)
	{
		privateClose(t);
	};
	
	// event to redefine, whe close modal do this
	this.onClose = function(){};

	// private events	
	
	// set Modal window
	var setModal = function()
	{
		// create main div and add to page
		var div = document.createElement('div');
		div.id = 'zmodal';
		document.body.appendChild(div);
		
		// create background div
		this.background = document.createElement('div');
		this.background.className = 'background';

		// create modal div
		this.modal = document.createElement('div');
		this.modal.className = 'modal';

		// set modal position
		setPosition.call(this);

		// add divs to modal div
		div.appendChild(this.background);
		div.appendChild(this.modal);

		// set Modal Content
		setModalContent.call(this, this.type, this.content);
	};

	// set Modal position
	var setPosition = function()
	{
		// get Scroll positions
		var scroll = getScroll();
		// get page width
		var width = getPageSize('width');
		// get page height
		var height = getPageSize('height');
		// set background position
		setBackgroundPosition.call(this, this.background, scroll, width, height);
		// set modal position
		setModalPosition.call(this, this.modal, scroll, width, height);
	};

	// set background position
	var setBackgroundPosition = function(elem, scroll, width, height)
	{
		// depend of scroll position
		elem.style.left = scroll[0]+"px";
		elem.style.top = scroll[1]+"px";
		// if browser internet explorer
		if(this.browser==='msie')
		{
			elem.style.width = width+"px";
			elem.style.height = height+"px";
		}
		// no ie browser
		else
		{
			elem.style.width = '100%';
			elem.style.height = '100%';
		}
	};

	// set Modal position
	var setModalPosition = function(elem, scroll, width, height)
	{
		elem.style.width = this.width+"px";
		elem.style.height = this.height+"px";
		elem.style.left = scroll[0]+(width-this.width)/2+"px";
		elem.style.top = scroll[1]+(height-this.height)/2+"px";
	};

	// set modal content
	var setModalContent = function(type, content)
	{
		// add close img
		setCloseImg.call(this);

		// modal out div (overflow: hidden)
		var _out = document.createElement('div');
		_out.className = 'out';
		this.modal.appendChild(_out);

		// modal in div (overflow: auto)
		var _in = document.createElement('div');
		_in.className = 'in';
		if(this.title!==undefined)
		{
			// set title to out div
			setTitle(_out, this.title);
			var titlediv = getByClass(document.getElementById('zmodal'), 'title');
			// get title Height: is necessary to be added to web before get Height
			var titleHeight = getSize(titlediv, 'height');
			// substract title height to 'in' div
			_in.style.height = (this.height-titleHeight)+"px";	
		}
		// if no title full height
		else
			_in.style.height = this.height+"px";
		
		// full width
		_in.style.width = this.width+"px";
		// add in div to out div
		_out.appendChild(_in);

		// modal content types
		if(type==='html')
			_in.innerHTML = content;
		else if(type==='dom')
			_in.appendChild(content);
		// get DOM ID content and put in the modal, onclose restore div
		else if(type==='id')
			setElementChilds(_in, document.getElementById(content).childNodes);
	};
	
	// set Modal title to out div
	var setTitle = function(elem, title)
	{
		var div = document.createElement('div');
		div.className = 'title';
		var span = document.createElement('span');
		span.appendChild(document.createTextNode(title));
		div.appendChild(span);
		elem.appendChild(div);
	};

	// get Scroll info
	var getScroll = function()
	{
		var scroll = [];
		if (self.pageYOffset)
		{
			scroll[0] = self.pageXOffset;
			scroll[1] = self.pageYOffset;
		}
		else if (document.documentElement && document.documentElement.scrollTop)
		{
			scroll[0] = document.documentElement.scrollLeft;
			scroll[1] = document.documentElement.scrollTop;
		}
		else if (document.body)
		{
			scroll[0] = document.body.scrollLeft;
			scroll[1] = document.body.scrollTop;
		}
		return scroll;
	};

	// set Events to page
	var setEvents = function()
	{
		var t = this;
		t.events = [];
		// get old Events and save
		t.events[0] = window.onresize;
		t.events[1] = window.onscroll;
		
		var _event = function()
		{
			// konqueror fix 
			window.setTimeout(function()
			{
				setPosition.call(t);				
			}, 1);
		};

		window.onresize = function(){new _event();};
		window.onscroll = function(){new _event();};
	};
	
	// restore page old events
	var restoreEvents = function(t)
	{
		window.onresize = t.events[0];
		window.onscroll = t.events[1];
	}

	// get page size by type
	var getPageSize = function(type)
	{
		var a;
		if(type==='width')
		{
			if (window.innerWidth!=window.undefined) a = window.innerWidth;
			else if (document.compatMode=='CSS1Compat') a = document.documentElement.clientWidth;
			else if (document.body) a = document.body.clientWidth;
			else a = window.undefined;
		}
		else if(type==='height')
		{
			if (window.innerHeight!=window.undefined) a = window.innerHeight;
			else if (document.compatMode=='CSS1Compat') a = document.documentElement.clientHeight;
			else if (document.body) a = document.body.clientHeight; 
			else a = window.undefined;
		}
		return a;
	};

	// get Element size in page
	var getSize = function(elem, type)
	{
		if(type==='width')
			return (elem.offsetWidth || elem.style.pixelWidth);
		else if(type==='height')
			return (elem.offsetHeight || elem.style.pixelHeigth);
	};
	
	var getPosition = function(elem, type)
	{
		var pos = 0;
		while(elem.offsetParent)
		{
			if(type === 'top')
				pos += elem.offsetTop;
			else if(type === 'left')
				pos += elem.offsetLeft;
			elem = elem.offsetParent;			
		}		
		return pos;
	};
	
	// get browser type
	var getBrowser = function()
	{
		var a;
		if(navigator.appName==='Microsoft Internet Explorer')
			a = 'msie';
		else
			a = 'default';
		return a;
	};

	// set close button
	var setCloseImg= function()
	{
		var t = this;
		var div = document.createElement('div');
		div.className = 'close';
		var img = document.createElement('img');
		img.src = 'img/x-trans.png';
		img.title = 'close';
		img.alt = 'close';
		
		// add event
		img.onclick = function()
		{
			privateClose(t);
		};
		// if ie browser fix PNG
		if(t.browser==='msie')
			img = fixPng(img);
		div.appendChild(img);
		t.modal.appendChild(div);
	};

	// remove element from page
	var removeElement = function(elem)
	{
		elem.parentNode.removeChild(elem);
	};

	// fix png for ie6
	var fixPng = function(img)
	{
		var png = /\.png$/i;
		if(png.test(img.src))
		{
			img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\""+img.src+"\",sizingMethod=\"image\")";
			img.src = 'img/trans.gif';
		}
		return img;
	};

	// add childs to element
	var setElementChilds = function(elem, obj)
	{
		var len = obj.length;
		for(var i=0;i<len;i++)
			elem.appendChild(obj[i]);
	};

	// onclose private method
	var privateClose = function(t)
	{
		var zmodal = document.getElementById('zmodal');
		// if type ID restore ID content to div
		if(t.type==='id')
		{
			var _in = getByClass(zmodal, 'in');
			setElementChilds(document.getElementById(t.content), _in.childNodes);
		}
		// remove modal
		removeElement(zmodal);
		// restore hidden elements
		new recursive(document.body, t.tags, function(node)
			{
				node.parentNode.removeChild(node.previousSibling);
				removeClass(node, 'zhidden');
			}
		);		
		// restore events
		restoreEvents(t);
		// execute public onClose method
		t.onClose();
	};

	// get element by class (only returns 1)
	var getByClass = function(elem, _class)
	{
		var childs = elem.childNodes;
		var len = childs.length;
		for(var i=0;i<len;i++)
			if(childs[i].className===_class)
				return childs[i];
			else if(childs[i].hasChildNodes())
				var a = getByClass(childs[i], _class);
		return a;
	};
	
	var addClass = function(elem, _class)
	{
		elem.className+= " "+_class;
	};
	
	var removeClass = function(elem, _class)
	{
		var aClass = elem.className.split(' ');
		var len = aClass.length;
		var tmp = '';
		for(var i=0;i<len;i++)
			if(aClass[i]!==_class)
				tmp+=" "+aClass[i];
		elem.className = tmp;
	};
	
	var recursive = function(e, tags, f)
	{
		for(var node = e.firstChild; node; node = node.nextSibling)
			if(node.nodeType===1)
				if(in_array(node.nodeName.toLowerCase(), tags))
					new f(node);
				else 
					new recursive(node, tags, f);
	};
	
	var in_array = function(text, a)
	{
		for (var i = a.length; i > -1; i--)
			if (a[i-1] === text)
				return true;

		return false;
	};
};
