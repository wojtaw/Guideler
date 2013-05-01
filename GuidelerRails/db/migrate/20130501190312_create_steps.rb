class CreateSteps < ActiveRecord::Migration
  def change
    create_table :steps do |t|
      t.references :guider
      t.integer :step_order
      t.text :link
      t.text :question
      t.string :answer1
      t.string :answer2
      t.string :answer3
      t.integer :correct_answer

      t.timestamps
    end
  end
end
