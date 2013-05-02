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
    render :content_type => 'application/json', :locals => { :guider => guider}, :layout => false

  rescue ActiveRecord::StatementInvalid
    render :inline => 'Guider invalid'

  rescue ActiveRecord::RecordNotFound
    render :inline => 'Guider not found'
  end
end
