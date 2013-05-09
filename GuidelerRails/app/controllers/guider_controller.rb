class GuiderController < ApplicationController
  def player
    guider = Guider.find(params[:guiderID])

    render :locals => { :guider => guider}

  rescue ActiveRecord::StatementInvalid
    render :inline => 'Guider invalid'

  rescue ActiveRecord::RecordNotFound
    render :inline => 'Guider not found'
  end

  def editor
    guider = Guider.find(params[:guiderID])

    if current_user.id == guider.user_id
      render :locals => { :guider => guider}
    else
      render :inline => 'Only owner can edit this guider'
    end


  end

  def manage_all

    if user_signed_in?
      guiders = current_user.guiders
      render :locals => { :guiders => guiders }
    else
      render :inline => 'Login please'
    end


  end

  def new_guider

    guider = Guider.new
    guider.name = "New Guider (Untitled)"
    guider.user_id = current_user.id
    guider.save


    redirect_to editor_path(:guiderID => guider.id)

  end

  def delete_guider
    guider = Guider.find(params[:guiderID])

    if current_user.id == guider.user_id
      guider.delete
      redirect_to :manage_all
    else
      render :inline => 'Only owner can delete'
    end


  end

  def api_edit_guider
    result = ActiveSupport::JSON.decode(request.body)
    #delete all steps belonging to the guider

    Step.delete_all(guider_id: result['guider_id'])
    #add new updated steps
    result["steps"].each do |step_data|
      single_step = Step.new
      single_step.link = step_data.externalLink
      single_step.save
    end


    render :inline => 'It works'+result['name']
  end

  def guiderJSON
    guider = Guider.find(params[:guiderID])



    service_type = Array.new
    external_data = Array.new

    output_string = "First nothing"
    guider.steps.each do |single_step|
      tmp_service = parse_service(single_step.link)
      tmp_external_data = parse_external_data(tmp_service, single_step.link)

      service_type.push tmp_service
      external_data.push tmp_external_data

    end

    service_type.each do |single_field|
      output_string.concat(single_field+"\n")
    end

    external_data.each do |single_field|
      output_string.concat(single_field+"\n")
    end


    #render :text => output_string

    render :content_type => 'application/json', :locals => { :guider => guider, :serviceType => service_type, :externalData => external_data}, :layout => false

  rescue ActiveRecord::StatementInvalid
    render :inline => 'Guider invalid'

  rescue ActiveRecord::RecordNotFound
    render :inline => 'Guider not found'
  end

  private

  def parse_service(parsing_link)
      url = URI.parse(parsing_link)
      host = url.host
      if host.start_with?('www.')
        host = host[4..host.length]
      end

      if host == "youtube.com"
        return "YOUTUBE"
      elsif host == "slideslive.com"
        return "SLIDESLIVE"
      elsif host == "vimeo.com"
        return "VIMEO"
      else
        return "GENERAL"
      end
  end

  #finding either video ID or article ID or whatever data that identifies content that should be loaded
  def parse_external_data(service, parsing_link)
    if service == "YOUTUBE"
      return "J1IJpHDalvk"
    elsif service == "SLIDESLIVE"
      return "38889951"
    elsif service == "VIMEO"
      return "63691010"
    else
      return parsing_link
    end
  end

end
