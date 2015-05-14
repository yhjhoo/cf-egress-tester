# hello.rb
require 'sinatra'
require 'net/ping'

get '/' do
  redirect to('/index.html')
end

get '/egress-status/:host/:port' do
  check_egress("tcp", params[:host], params[:port])
end

get '/egress-status/:protocol/:host/:port' do
  validate(params[:protocol])
  check_egress(params[:protocol], params[:host], params[:port])
end

def validate(protocol)

  if !['tcp', 'udp', 'icmp'].include? protocol.downcase
    halt 400, "Unknown protocol '#{protocol}'.  Only 'tcp', 'udp', 'icmp' are supported."
  end

end

def check_egress(protocol, host, port)

    pingAttempt = doPing(protocol, host, port)
    status = nil

    if pingAttempt.ping
      status = "SUCCESS"
    else
      status = "FAILURE\n" +  pingAttempt.exception.to_s
    end

    status
end

def doPing(protocol, host, port)
  puts "Connecting to #{host}:#{port}..."

  timeout = 3
  ping = nil

  case protocol
  when "tcp"
    ping = Net::Ping::TCP.new(host, port, timeout)
  when "udp"
    ping = Net::Ping::UDP.new(host, port, timeout)
  when "icmp"
    ping = Net::Ping::External.new(host, port, timeout)
  end

  puts "Result:  #{ping.ping}, #{ping.exception.to_s}"
  ping
end
