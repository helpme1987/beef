#
# Copyright (c) 2006-2025 Wade Alcorn - wade@bindshell.net
# Browser Exploitation Framework (BeEF) - https://beefproject.com
# See the file 'doc/COPYING' for copying permission
#
module BeEF
  module Core
    module Console
      #
      # This module parses the command line argument when running beef.
      #
      module CommandLine
        @options = {}
        @options[:verbose] = false
        @options[:resetdb] = false
        @options[:ascii_art] = false
        @options[:ext_config] = ''
        @options[:port] = ''
        @options[:ws_port] = ''
        @options[:interactive] = false
        @options[:update_disabled] = false
        @options[:update_auto] = false

        @already_parsed = false

        #
        # Parses the command line arguments of the console.
        # It also populates the 'options' hash.
        #
        def self.parse
          return @options if @already_parsed

          optparse = OptionParser.new do |opts|
            opts.on('-x', '--reset', 'Reset the database') do
              @options[:resetdb] = true
            end

            opts.on('-v', '--verbose', 'Display debug information') do
              @options[:verbose] = true
            end

            opts.on('-a', '--ascii_art', 'Prints BeEF ascii art') do
              @options[:ascii_art] = true
            end

            opts.on('-c', '--config FILE', "Load a different configuration file: if it's called custom-config.yaml, git automatically ignores it.") do |f|
              @options[:ext_config] = f
            end

            opts.on('-p', '--port PORT', 'Change the default BeEF listening port') do |p|
              @options[:port] = p
            end

            opts.on('-w', '--wsport WS_PORT', 'Change the default BeEF WebSocket listening port') do |ws_port|
              @options[:ws_port] = ws_port
            end

            opts.on('-ud', '--update_disabled', 'Skips update') do
              @options[:update_disabled] = true
            end

            opts.on('-ua', '--update_auto', 'Automatic update with no prompt') do
              @options[:update_auto] = true
            end

            # opts.on('-i', '--interactive', 'Starts with the Console Shell activated') do
            #  @options[:interactive] = true
            # end
          end

          optparse.parse!
          @already_parsed = true
          @options
        rescue OptionParser::InvalidOption
          puts 'Invalid command line option provided. Please run beef --help'
          exit 1
        end
      end
    end
  end
end
