class ErrorController < ApplicationController
  def show_general_error
      render :locals => { :errorMessage => params[:errorMessage] }, :layout => "empty"
  end
end
