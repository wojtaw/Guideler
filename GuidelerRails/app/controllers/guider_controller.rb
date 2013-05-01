class GuiderController < ApplicationController
  def player
    guider = params[:guider] == nil ? nil : Guider.find(params[:guider])

  rescue ActiveRecord::RecordNotFound
    guider_not_found
  end

  private

  def guider_not_found
    render :inline => 'Guider not found'
  end

end
