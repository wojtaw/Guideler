class AddQuestionEnabledToSteps < ActiveRecord::Migration
  def up
    change_table :steps do |t|
      t.boolean :question_enabled, :default => false
    end
    Step.update_all ["question_enabled = ?", false]
  end

  def down
    remove_column :steps, :question_enabled
  end
end
