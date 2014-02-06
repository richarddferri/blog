class IntegrationHelper < MiniTest::Spec
  include Capybara::DSL
  
  after do
    DatabaseCleaner.clean
    Capybara.reset_sessions!
    Capybara.use_default_driver
  end
end
MiniTest::Spec.register_spec_type( /Integration$/, IntegrationHelper )