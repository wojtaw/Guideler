class GuiderController < ApplicationController
  def player
    guider = Guider.find(params[:guiderID])

    render :locals => { :guider => guider}

  rescue ActiveRecord::StatementInvalid
    render :inline => 'Guider invalid'

  rescue ActiveRecord::RecordNotFound
    render :inline => 'Guider not found'
  end

  def guiderJSON
    guider = Guider.find(params[:guiderID])

    uri = URI.parse("http://www.google.com/url?sa=X&q=http://nashville.broadwayworld.com/article/Just_in_time_for_Halloween_Circle_Players_does_JEKYLL_HYDE_20101013&ct=ga&cad=:s7:f1:v1:d2:i0:lt:e0:p0:t1286988171:&cd=yQoOdKUFTLo&usg=AFQjCNEg2inHF8hXGEvG-TxMQyMx7YGHkA")
    uri_params = CGI.parse(uri.query)

    service_type = Array.new

    output_string = "First nothing"
    guider.steps.each do |single_step|
      service_type.push single_step.link

    end

    service_type.each do |single_field|

      output_string.concat(single_field+"\n")
    end


    render :text => output_string

    service = "SLIDESLIVE"
    extenal_data = uri_params['q']

    #render :content_type => 'application/json', :locals => { :guider => guider, :serviceType => uri.host, :externalData => extenal_data}, :layout => false

  rescue ActiveRecord::StatementInvalid
    render :inline => 'Guider invalid'

  rescue ActiveRecord::RecordNotFound
    render :inline => 'Guider not found'
  end

  private

  def parse_service

     render
  end
end
