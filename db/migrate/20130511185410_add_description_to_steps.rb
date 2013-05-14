class AddDescriptionToSteps < ActiveRecord::Migration
  def up
    change_table :steps do |t|
      t.text :description
    end
    Step.update_all ["description = ?", ""]
  end

  def down
    remove_column :steps, :description
  end
end
