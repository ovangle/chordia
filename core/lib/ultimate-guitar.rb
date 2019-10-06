require 'selenium-webdriver'

class UltimateGuitarScraper
  attr_reader :driver

  def initialize(href)
    options = Selenium::WebDriver::Chrome::Options.new args: ["headless"]
    @driver = Selenium::WebDriver.for :chrome, options: options

    driver.get(href)
  end

  def tab_content
    elem = driver.find_element(css: 'code > pre')
    elem.text
  end
end
