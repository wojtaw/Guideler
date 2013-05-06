class CreateProgressConnectingTable < ActiveRecord::Migration
  def change
    change_table :steps do |t|
      t.references :user, :null => false
    end
    change_table :users do |r|
      r.references :step, :null => false
    end
  end
end
