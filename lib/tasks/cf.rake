desc 'Deploys middleman artifacts to CF'
namespace :cf do
  task :deploy do
    manifest_location = File.expand_path("../../../manifest.yml", __FILE__)
    sh("bundle exec middleman build")
    sh("cf push -f #{manifest_location}")
  end
end
