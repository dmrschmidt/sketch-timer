desc 'Deploys middleman artifacts to CF'
namespace :cf do
  task :deploy do
    sh("middleman build")
    sh("cf push sketch-timer -p build/ -b https://github.com/cloudfoundry-incubator/staticfile-buildpack.git")
  end
end
