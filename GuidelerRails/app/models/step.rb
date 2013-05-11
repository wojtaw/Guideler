class Step < ActiveRecord::Base
  belongs_to :guider
  has_and_belongs_to_many :users

  attr_accessible :answer1, :answer2, :answer3, :correct_answer, :link, :question, :step_order, :guider_id, :question_enabled, :description
end
