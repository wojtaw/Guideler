class Guider < ActiveRecord::Base
  has_many :steps
  belongs_to :user

  attr_accessible :description, :name
end
