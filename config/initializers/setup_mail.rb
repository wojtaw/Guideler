ActionMailer::Base.smtp_settings = {
    :address              => "smtp.gmail.com",
    :port                 => 587,
    :domain               => "googlemail.com",
    :user_name            => "guidelerapp@gmail.com",
    :password             => "password",
    :authentication       => "plain",
    :enable_starttls_auto => true
}