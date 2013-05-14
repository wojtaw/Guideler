class CreateStepsUsers < ActiveRecord::Migration
  create_table :steps_users, :id => false do |t|
    t.references :step, :user
  end

  add_index :steps_users, [:step_id, :user_id]
end
