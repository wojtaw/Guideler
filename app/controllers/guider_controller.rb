class GuiderController < ApplicationController
  def player
    guider = Guider.find(params[:guiderID])

    render :locals => { :guider => guider}

  rescue ActiveRecord::StatementInvalid
    redirect_to show_general_error_path(:error_code => 103)

  rescue ActiveRecord::RecordNotFound
    redirect_to show_general_error_path(:error_code => 104)
  end

  def editor
    guider = Guider.find(params[:guiderID])

    if user_signed_in?

      if current_user.id == guider.user_id
        render :locals => { :guider => guider}
      else
        redirect_to show_general_error_path(:error_code => 100)
      end

    else
      redirect_to show_general_error_path(:error_code => 101)
    end

  rescue ActiveRecord::StatementInvalid
    redirect_to show_general_error_path(:error_code => 103)

  rescue ActiveRecord::RecordNotFound
    redirect_to show_general_error_path(:error_code => 104)
  end

  def manage_all

    if user_signed_in?
      guiders = current_user.guiders
      render :locals => { :guiders => guiders }, :layout => "profile"
    else
      redirect_to show_general_error_path(:error_code => 101)
    end


  end

  def display_profile

    if user_signed_in?
      guiders = current_user.guiders
      render :locals => { :guiders => guiders }, :layout => "profile"
    else
      redirect_to show_general_error_path(:error_code => 101)
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
      redirect_to show_general_error_path(:error_code => 102)
    end


  end

  def api_edit_guider
    result = ActiveSupport::JSON.decode(request.body)
    #delete all steps belonging to the guider
    guider = Guider.find(result['guiderID'])

    guider.name = result['guiderName']
    guider.description = result['guiderDescription']
    guider.save

    Step.delete_all(guider_id: result['guiderID'])
    #add new updated steps

    result["steps"].each do |step_data|

      Step.create(
        :guider_id => result['guiderID'],
        :step_order => step_data["step_order"],
        :description => step_data["description"],
        :link => step_data["externalLink"],
        :question => step_data["question"],
        :question_enabled => step_data["questionEnabled"],
        :correct_answer => step_data["correctAnswer"],
        :answer1 => step_data["answer1"],
        :answer2 => step_data["answer2"],
        :answer3 => step_data["answer3"],
      )
    end


    render :inline => 'SUCCESS'
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
    redirect_to show_general_error_path(:error_code => 103)


  rescue ActiveRecord::RecordNotFound
    redirect_to show_general_error_path(:error_code => 104)
  end

  private

  def parse_service(parsing_link)
      url = URI.parse(parsing_link)
      host = url.host
      if host == nil
        return "GENERAL"
      end

      #check if it is not generic content like image
      if parsing_link[/.png|.jpg|.jpeg|.gif|.jpeg2000|.bmp\z/i]
        return "IMAGE"
      end

      if host.start_with?('www.')
        host = host[4..host.length]
      end

      if host == "youtube.com"
        return "YOUTUBE"
      elsif host == "slideslive.com"
        return "SLIDESLIVE"
      elsif host == "vimeo.com"
        return "VIMEO"
      elsif host == "soundcloud.com"
        return "SOUNDCLOUD"
      elsif host == "slideshare.net"
        return "SLIDESHARE"
      elsif host == "flickr.com"
        return "FLICKR"
      elsif host == "instagram.com"
        return "INSTAGRAM"
      elsif host == "scribd.com"
        return "SCRIBD"
      else
        return "GENERAL"
      end
  end

  #finding either video ID or article ID or whatever data that identifies content that should be loaded
  def parse_external_data(service, parsing_link)
    if service == "YOUTUBE"
      if parsing_link[/youtu\.be\/([^\?]*)/]
        return $1
      else
        # Regex from # http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url/4811367#4811367
        parsing_link[/^.*((v\/)|(embed\/)|(watch\?))\??v?=?([^\&\?]*).*/]
        return $5
      end
    elsif service == "SLIDESLIVE"
      parsing_link[/([0-9]{5,10}\z)/]
      return $1
    elsif service == "VIMEO"
      parsing_link[/https?:\/\/(?:[\w]+\.)*vimeo\.com(?:[\/\w]*\/videos?)?\/([0-9]+)[^\s]*/]
      return $1
    elsif service == "SOUNDCLOUD"
      return parsing_link;
    elsif service == "SLIDESHARE"
      return parsing_link;
    elsif service == "INSTAGRAM"
      return parsing_link;
    elsif service == "FLICKR"
      return parsing_link;
    elsif service == "SCRIBD"
      return parsing_link;
    else
      return parsing_link
    end
  end

end
