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
    service = "SLIDESLIVE"
    extenal_data = "J1IJpHDalvkaaaaaaa"
    render :content_type => 'application/json', :locals => { :guider => guider, :serviceType => service, :externalData => extenal_data}, :layout => false

  rescue ActiveRecord::StatementInvalid
    render :inline => 'Guider invalid'

  rescue ActiveRecord::RecordNotFound
    render :inline => 'Guider not found'
  end
end
