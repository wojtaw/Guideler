class ErrorController < ApplicationController
  def show_general_error
    error_message = ""
    if params[:error_code] == "100"
      error_message = "Only owner can edit this guider"
    elsif params[:error_code] == "101"
      error_message = "This part of site requires login"
    elsif params[:error_code] == "102"
      error_message = "Only owner can delete guider :-P"
    elsif params[:error_code] == "103"
      error_message = "Oh no, this Guider is broken :("
    elsif params[:error_code] == "104"
      error_message = "Whoops, guider not found! :-/"
    elsif params[:error_code] == "105"
      error_message = "This guider was not published and can be viewed only by owner"
    elsif params[:error_code] == "106"
      error_message = ""
    else
      error_message = "Unknown error"
    end

    render :locals => { :error_message => error_message}, :layout => "empty"
  end
end
