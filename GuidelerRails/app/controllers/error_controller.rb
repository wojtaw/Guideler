class ErrorController < ApplicationController
  def show_general_error
    error_message = ""
    if params[:error_code] == "100"
      error_message = "Only owner can edit this guider"
    elsif params[:error_code] == "100"
      error_message = "Only owner can edit this guider"
    else
      error_message = "Unknown error"
    end

    render :locals => { :error_message => error_message}, :layout => "empty"
  end
end
