desc 'Deploys middleman artifacts to CF'
task :shipit do
  puts "Checking for uncommitted changes..."
  if `git status -s`.chomp.length > 0
    system("git status")
    exit()
  end

  sh("git pull -r")
  sh("rake jasmine:ci")
  sh("git push")
end
