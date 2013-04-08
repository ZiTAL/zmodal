zmodal
======

js/css modal all browser support from ie6

example:

		var a = new zmodal();
		a.width = '250';
		a.height = '75';
		a.type = 'html';
		a.title = 'Please insert nickname';
		a.content = '<p><input type="text" id="login_name" /><input id="login_send" type="button" value="send" /></p>';
		a.main();	
		a.onClose = function()
		{
			a = null;
			new setIntervals('open');			
		};


