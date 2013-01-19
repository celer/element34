import org.openqa.selenium.Capabilities;
import org.openqa.selenium.Platform;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.SeleneseCommandExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverBackedSelenium;
import org.openqa.selenium.chrome.ChromeDriver;
import com.opera.core.systems.OperaDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.android.AndroidDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.Command;
import org.openqa.selenium.remote.DesiredCapabilities;

import com.thoughtworks.selenium.Selenium;

abstract class BrowserWrapper {
  protected WebDriver driver;
  protected Selenium selenium;
  protected DesiredCapabilities desiredCapabilities = new DesiredCapabilities();

  public BrowserWrapper setProxy(String uri) {
    Proxy proxy = new Proxy();
    proxy.setSslProxy(uri);
    proxy.setHttpProxy(uri);
    proxy.setFtpProxy(uri);
    desiredCapabilities.setCapability(CapabilityType.PROXY, proxy);
    return this;
  }

	public void setProperty(String name,String value){
		System.setProperty(name,value);
	}

  public abstract Selenium openBrowser(String url);
}

