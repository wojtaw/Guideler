class Step < ActiveRecord::Base
  belongs_to :guider

  attr_accessible :answer1, :answer2, :answer3, :correct_answer, :link, :question, :step_order
end
