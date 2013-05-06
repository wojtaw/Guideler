class AddDependencyToGuider < ActiveRecord::Migration
  def change
    change_table :guiders do |t|
      t.references :user, :null => false
    end
  end
end
