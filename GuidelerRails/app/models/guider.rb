class Guider < ActiveRecord::Base
  has_many :steps

  attr_accessible :description, :name
end
