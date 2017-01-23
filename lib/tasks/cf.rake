desc 'Deploys middleman artifacts to CF'
namespace :cf do
  task :deploy do
    manifest_location = File.expand_path("../../../manifest.yml", __FILE__)
    sh("middleman build")
    sh("cf push sketch-timer -p build/ -f #{manifest_location} -b https://github.com/cloudfoundry-incubator/staticfile-buildpack.git")
  end
end
