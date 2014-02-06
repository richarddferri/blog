json.array!(@microposts) do |micropost|
  json.extract! micropost, :id, :title, :text
  json.url micropost_url(micropost, format: :json)
end
